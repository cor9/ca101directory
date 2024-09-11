import { defineField } from 'sanity';
import { DatabaseIcon } from '@sanity/icons';

const subscription = {
  name: 'subscription',
  title: 'Subscription',
  type: 'document',
  // icon: DatabaseIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'User Id',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stripeCustomerId',
      title: 'Stripe Customer Id',
      type: 'string',
      // validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stripeSubscriptionId',
      title: 'Stripe Subscription Id',
      type: 'string',
      // validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stripePriceId',
      title: 'Stripe Price Id',
      type: 'string',
      // validation: (rule) => rule.required(),
    }),
    defineField({
			name: 'stripeCurrentPeriodEnd',
      title: 'Stripe Current Period End',
			type: 'datetime',
      // initialValue: () => new Date().toISOString(),
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
      title: 'userId',
    },
  },
};

export default subscription;