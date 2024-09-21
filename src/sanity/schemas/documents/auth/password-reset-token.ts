import { defineField } from 'sanity';

const passwordResetToken = {
  name: 'passwordResetToken',
  title: 'PasswordReset Token',
  type: 'document',
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

export default passwordResetToken;