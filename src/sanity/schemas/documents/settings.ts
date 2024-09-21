import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'settings',
	title: 'Settings',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			type: 'string',
		}),
	],
})
