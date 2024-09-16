import { defineField } from 'sanity';
import { DatabaseIcon } from '@sanity/icons';

const stripeCustomer = {
  name: 'stripeCustomer',
  title: 'Stripe Customer',
  type: 'document',
  // icon: DatabaseIcon,
  fields: [
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'stripeCustomerId',
      title: 'Stripe Customer Id',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  // TODO(javayhu): add preview
};

export default stripeCustomer;