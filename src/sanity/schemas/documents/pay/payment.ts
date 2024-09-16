import { defineField } from 'sanity';
import { DatabaseIcon } from '@sanity/icons';

const payment = {
  name: 'payment',
  title: 'Payment',
  type: 'document',
  // icon: DatabaseIcon,
  fields: [
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'item',
      title: 'Item',
      type: 'reference',
      to: [{ type: 'item' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['success', 'fail'],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
  ],
  // TODO(javayhu): add preview
};

export default payment;