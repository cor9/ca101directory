import { defineField } from 'sanity';
import { UserIcon } from "@sanity/icons";
import { format, parseISO } from 'date-fns';

const user = {
  name: 'user',
  title: 'User',
  type: 'document',
  // icon: UserIcon,
  groups: [
    {
      name: 'stripe',
      title: 'Stripe',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'User Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'User Email',
      type: 'string',
    }),
    defineField({
      name: 'emailVerified',
      title: 'Email Verification',
      type: 'datetime',
    }),
    defineField({
      name: 'image',
      title: 'User Image',
      type: 'string',
    }),
    defineField({
      name: 'password',
      title: 'User Password',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      initialValue: 'USER',
      options: {
        list: ['ADMIN', 'USER'],
      },
    }),
    defineField({
      name: 'accounts',
      title: 'Accounts',
      type: 'reference',
      to: [{ type: 'account' }],
    }),
    defineField({
      name: 'stripeCustomerId',
      title: 'Stripe Customer Id',
      type: 'string',
      group: 'stripe',
      // validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stripeSubscriptionId',
      title: 'Stripe Subscription Id',
      type: 'string',
      group: 'stripe',
      // validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stripePriceId',
      title: 'Stripe Price Id',
      type: 'string',
      group: 'stripe',
      // validation: (rule) => rule.required(),
    }),
    defineField({
			name: 'stripeCurrentPeriodEnd',
      title: 'Stripe Current Period End',
			type: 'datetime',
      group: 'stripe',
      // initialValue: () => new Date().toISOString(),
		}),
  ],
  preview: {
    select: {
      id: '_id',
      name: "name",
      date: "_createdAt",
    },
    prepare({ id, name, date }) {
      const title = name;
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

export default user;