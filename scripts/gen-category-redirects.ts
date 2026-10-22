import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { legacyRedirectTable } from "../src/lib/category-taxonomy";

const out = join(__dirname, "../src/lib/category-redirects.generated.json");
writeFileSync(out, `${JSON.stringify(legacyRedirectTable(), null, 2)}\n`);
console.log(`wrote ${out}`);
