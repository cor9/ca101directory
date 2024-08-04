import { defineMigration, at, setIfMissing, unset } from 'sanity/migrate';

const from = 'website';
const to = 'link';

/**
 * 1.Schema and content migrations
 * https://www.sanity.io/docs/schema-and-content-migrations
 * 
 * 2.Content migration cheatsheet
 * https://www.sanity.io/docs/content-migration-cheatsheet
 * Rename a field in a document
 * 
 * 3.How to run the migration? 
 * https://www.sanity.io/docs/schema-and-content-migrations#ea7952b022c2
 * sanity migration list
 * sanity migration run <migration-id>
 * sanity migration run <migration-id> --no-dry-run
 */
export default defineMigration({
  title: 'rename_website_to_link',
  documentTypes: ["item"],

  migrate: {
    document(doc, context) {
      console.log('migrate, doc:', doc);
      console.log('migrate, context:', context);
      return [
        at(to, setIfMissing(doc[from])),
        at(from, unset())
      ]
    }
  }
})
