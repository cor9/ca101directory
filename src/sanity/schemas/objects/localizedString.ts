import { defineField, defineType } from 'sanity';

import { i18n } from '../../languages';

/**
 * https://www.sanity.io/docs/localization
 */
export default defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  // Fieldsets can be used to group object fields.
  // Here we omit a fieldset for the "default language",
  // making it stand out as the main field.
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: { collapsible: true, collapsed: false },
    },
  ],
  // Dynamically define one field per language
  fields: i18n.languages.map((lang) =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: 'string',
      fieldset: lang.isDefault ? undefined : 'translations',
    })
  ),
})
