import { defineField } from 'sanity';
import { UsersIcon } from '@sanity/icons';
import { format, parseISO } from 'date-fns';

const account = {
  name: 'account',
  title: 'Account',
  type: 'document',
  // icon: UsersIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'User Id',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Account Type',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'provider',
      title: 'Account Provider',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'providerAccountId',
      title: 'Account Provider Id',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'refreshToken',
      title: 'Refresh Token',
      type: 'string',
    }),
    defineField({
      name: 'accessToken',
      title: 'Access Token',
      type: 'string',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'number',
    }),
    defineField({
      name: 'tokenType',
      title: 'Token Type',
      type: 'string',
    }),
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'string',
    }),
    defineField({
      name: 'idToken',
      title: 'Id Token',
      type: 'string',
    }),
    defineField({
      name: 'sessionState',
      title: 'Session State',
      type: 'string',
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
  ],
  
  preview: {
    select: {
      id: 'userId',
      name: "user.name",
      provider: "provider",
      date: "_createdAt",
    },
    prepare({ id, name, provider, date }) {
      const title = `${name} (${provider})`;
      // get simple user id by concating the first 4 and last 4 characters
      const userid = id.substring(5, 9) + '...' + id.substring(id.length - 4);
      const subtitle = `${format(parseISO(date), "yyyy/MM/dd")}-(${userid})`;
      return {
        title,
        subtitle
      };
    },
  },
};

export default account;