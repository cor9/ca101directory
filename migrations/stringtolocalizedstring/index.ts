import { defineMigration, at, set } from 'sanity/migrate';

const oldType = 'old';
const newType = 'new';

export default defineMigration({
  title: 'string_to_localizedstring',
  // documentTypes: ["item", "category", "tag"],
  documentTypes: ["user"],

  migrate: {
    document(doc, context) {
      // this will be called for every document of the matching type
      console.log('migrate, doc:', doc);
      console.log('migrate, context:', context);
    },
    object(object, path, context) {
      console.log('migrate, object:', object);
      console.log('migrate, path:', path);
      console.log('migrate, context:', context);
      // if (object._type === oldType) {
      //   return at('_type', set(newType))
      // }
    }
  }
})
