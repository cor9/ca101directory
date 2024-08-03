import { defineMigration, at, setIfMissing, unset } from 'sanity/migrate';

const from = 'desc';
const to = 'descrtription';

export default defineMigration({
  title: 'rename_desc_to_description',
  // documentTypes: ["item"],

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
