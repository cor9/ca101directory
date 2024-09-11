import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

export default defineType({
	name: 'settings',
	title: 'Settings',
	type: 'document',
	// icon: CogIcon,
	fields: [
		defineField({
			name: 'title',
			type: 'string',
		}),
		// defineField({
		// 	name: 'ctas',
		// 	title: 'Call-to-actions',
		// 	type: 'array',
		// 	of: [{ type: 'cta' }],
		// }),
		// defineField({
		// 	name: 'headerMenu',
		// 	type: 'reference',
		// 	to: [{ type: 'navigation' }],
		// }),
		// defineField({
		// 	name: 'footerMenu',
		// 	type: 'reference',
		// 	to: [{ type: 'navigation' }],
		// }),
		// defineField({
		// 	name: 'social',
		// 	type: 'reference',
		// 	to: [{ type: 'navigation' }],
		// }),
		// defineField({
		// 	name: 'ogimage',
		// 	title: 'Open Graph Image (global)',
		// 	description: 'Used for social sharing previews',
		// 	type: 'image',
		// }),
	],
})
