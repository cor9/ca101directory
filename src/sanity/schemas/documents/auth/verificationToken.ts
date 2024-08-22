import { defineField } from 'sanity';
import { TokenIcon } from '@sanity/icons';

const verificationToken = {
  name: 'verificationToken',
  title: 'Verification Token',
  type: 'document',
  icon: TokenIcon,
  fields: [
    defineField({
      name: 'identifier',
      title: 'Identifier',
      type: 'string',
    }),
    defineField({
      name: 'token',
      title: 'Token',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'expires',
      title: 'Token Expiry',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'token',
    },
  },
};

export default verificationToken;