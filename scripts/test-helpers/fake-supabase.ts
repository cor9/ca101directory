/**
 * A minimal, in-memory stand-in for the subset of the Supabase JS client
 * this codebase's server actions and webhook actually use:
 * `.from(table).select(cols).eq(col, val).single()/.maybeSingle()`,
 * `.update(payload).eq(col, val).select().single()`, and
 * `.insert(payload).select().single()`.
 *
 * This exists so the actual authorization/allowlist/idempotency logic in
 * actions/listings.ts, actions/claim-listing.ts, and
 * app/api/webhook/route.ts can be exercised end-to-end (auth guard →
 * ownership check → field filtering → the real write call) without a
 * live Supabase project, a mocking framework, or any new dependency —
 * see scripts/test-vendor-authorization.ts and
 * scripts/test-webhook-lifecycle.ts for the tests built on it.
 *
 * It is deliberately NOT a faithful PostgREST/RLS simulator: no real SQL,
 * no real row-level security, no real unique-constraint enforcement
 * beyond what `uniqueColumns` below opts a table into. It exists to let
 * tests assert two things precisely: which rows a write actually
 * touched, and what payload it actually sent — the same two questions
 * an independent security review asks of a live system.
 */

export type FakeRow = Record<string, unknown>;

export interface FakeTableOptions {
  /** Column(s) that must be unique within this table; a second insert/
   * update that would collide raises a Postgres-style `23505` error,
   * mirroring a real unique constraint (e.g. rep_commissions.stripe_event_id). */
  uniqueColumns?: string[];
  /** Simulate a column that doesn't exist yet (pre-migration state): any
   * select/update/insert referencing it fails with a PostgREST-shaped
   * "column not found" error instead of touching the row. */
  missingColumns?: string[];
}

export interface WriteLogEntry {
  table: string;
  op: "update" | "insert" | "delete";
  payload: FakeRow | undefined;
  filters: Array<[string, unknown]>;
  matchedRowCount: number;
}

interface PgError {
  code?: string;
  message: string;
}

function missingColumnError(table: string, column: string): PgError {
  return {
    code: "PGRST204",
    message: `Could not find the '${column}' column of '${table}' in the schema cache`,
  };
}

class FakeQueryBuilder {
  private filters: Array<[string, unknown]> = [];
  private pendingOp: "select" | "update" | "insert" | "delete" = "select";
  private pendingPayload: FakeRow | undefined;
  private wantSingle = false;
  private wantMaybeSingle = false;

  constructor(
    private readonly tableName: string,
    private readonly rows: FakeRow[],
    private readonly options: FakeTableOptions,
    private readonly writeLog: WriteLogEntry[],
  ) {}

  select(_cols?: string) {
    return this;
  }

  eq(col: string, val: unknown) {
    this.filters.push([col, val]);
    return this;
  }

  update(payload: FakeRow) {
    this.pendingOp = "update";
    this.pendingPayload = payload;
    return this;
  }

  insert(payload: FakeRow | FakeRow[]) {
    this.pendingOp = "insert";
    this.pendingPayload = Array.isArray(payload) ? payload[0] : payload;
    return this;
  }

  delete() {
    this.pendingOp = "delete";
    return this;
  }

  single() {
    this.wantSingle = true;
    return this.execute();
  }

  maybeSingle() {
    this.wantMaybeSingle = true;
    return this.execute();
  }

  // Makes the builder itself awaitable (`await supabase.from(t).select(...).eq(...)`
  // with no terminal .single()/.maybeSingle() call), matching how the real
  // supabase-js client behaves and how this codebase sometimes uses it
  // (e.g. the webhook's listings-by-subscription-id lookup). Generic
  // signature matches lib.es5's PromiseLike<T> exactly (not just "close
  // enough") so this satisfies SupabaseFilterBuilder's `extends
  // PromiseLike<SupabaseResult>` in update-listing-core.ts.
  // biome-ignore lint/suspicious/noThenProperty: deliberately thenable, to mirror supabase-js's own PostgrestFilterBuilder.
  then<TResult1 = { data: unknown; error: PgError | null }, TResult2 = never>(
    onfulfilled?:
      | ((value: { data: unknown; error: PgError | null }) =>
          | TResult1
          | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(
      onfulfilled ?? undefined,
      onrejected ?? undefined,
    );
  }

  private matches(row: FakeRow) {
    return this.filters.every(([col, val]) => row[col] === val);
  }

  private checkMissingColumns(payload: FakeRow | undefined) {
    const missing = this.options.missingColumns ?? [];
    if (missing.length === 0) return null;
    const keys = payload
      ? Object.keys(payload)
      : this.filters.map(([col]) => col);
    for (const key of keys) {
      if (missing.includes(key)) {
        return missingColumnError(this.tableName, key);
      }
    }
    return null;
  }

  private checkUniqueViolation(payload: FakeRow) {
    for (const col of this.options.uniqueColumns ?? []) {
      if (!(col in payload)) continue;
      const collision = this.rows.some((r) => r[col] === payload[col]);
      if (collision) {
        return {
          code: "23505",
          message: `duplicate key value violates unique constraint on ${this.tableName}.${col}`,
        } satisfies PgError;
      }
    }
    return null;
  }

  private async execute(): Promise<{ data: unknown; error: PgError | null }> {
    const colError = this.checkMissingColumns(this.pendingPayload);
    if (colError) return { data: null, error: colError };

    if (this.pendingOp === "update") {
      const matched = this.rows.filter((r) => this.matches(r));
      this.writeLog.push({
        table: this.tableName,
        op: "update",
        payload: this.pendingPayload,
        filters: [...this.filters],
        matchedRowCount: matched.length,
      });
      if (matched.length === 0) {
        return {
          data: this.wantSingle ? null : [],
          error: this.wantSingle
            ? { code: "PGRST116", message: "no rows found" }
            : null,
        };
      }
      for (const row of matched) Object.assign(row, this.pendingPayload);
      return { data: this.wantSingle ? matched[0] : matched, error: null };
    }

    if (this.pendingOp === "insert") {
      const payload = this.pendingPayload ?? {};
      const uniqueError = this.checkUniqueViolation(payload);
      if (uniqueError) return { data: null, error: uniqueError };
      const newRow: FakeRow = {
        id: payload.id ?? `generated-${this.tableName}-${this.rows.length + 1}`,
        ...payload,
      };
      this.rows.push(newRow);
      this.writeLog.push({
        table: this.tableName,
        op: "insert",
        payload,
        filters: [],
        matchedRowCount: 1,
      });
      return { data: newRow, error: null };
    }

    if (this.pendingOp === "delete") {
      const matched = this.rows.filter((r) => this.matches(r));
      this.writeLog.push({
        table: this.tableName,
        op: "delete",
        payload: undefined,
        filters: [...this.filters],
        matchedRowCount: matched.length,
      });
      for (const row of matched) {
        const idx = this.rows.indexOf(row);
        if (idx >= 0) this.rows.splice(idx, 1);
      }
      return { data: null, error: null };
    }

    // select
    const matched = this.rows.filter((r) => this.matches(r));
    if (this.wantSingle) {
      if (matched.length === 0) {
        return {
          data: null,
          error: { code: "PGRST116", message: "no rows found" },
        };
      }
      if (matched.length > 1) {
        return {
          data: null,
          error: { message: "multiple rows matched .single()" },
        };
      }
      return { data: matched[0], error: null };
    }
    if (this.wantMaybeSingle) {
      return { data: matched[0] ?? null, error: null };
    }
    return { data: matched, error: null };
  }
}

export class FakeSupabase {
  private tables = new Map<string, FakeRow[]>();
  private tableOptions = new Map<string, FakeTableOptions>();
  readonly writeLog: WriteLogEntry[] = [];

  seed(table: string, rows: FakeRow[], options: FakeTableOptions = {}) {
    // Store rows by reference so later lookups via from() see live mutations.
    this.tables.set(table, rows);
    this.tableOptions.set(table, options);
    return this;
  }

  from(table: string) {
    if (!this.tables.has(table)) this.tables.set(table, []);
    return new FakeQueryBuilder(
      table,
      this.tables.get(table) as FakeRow[],
      this.tableOptions.get(table) ?? {},
      this.writeLog,
    );
  }

  /** Current contents of a seeded table, for post-write assertions. */
  rows(table: string): FakeRow[] {
    return this.tables.get(table) ?? [];
  }

  /** Writes recorded against one table, in call order. */
  writesTo(table: string): WriteLogEntry[] {
    return this.writeLog.filter((w) => w.table === table);
  }
}

export function createFakeSupabase() {
  return new FakeSupabase();
}
