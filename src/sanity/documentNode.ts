import { Iframe } from 'sanity-plugin-iframe-pane';
import type { DefaultDocumentNodeResolver } from 'sanity/structure';
import { previewUrl } from './lib/api';
import { SanityDocument } from 'next-sanity';

/**
 * The default document node used when editing documents.
 */
const documentNode: DefaultDocumentNodeResolver = (
	S,
	{ schemaType },
) => {
	const editorView = S.view.form();

	switch (schemaType) {
		// support preview ItemPage in Sanity Studio
		case 'item':
			return S.document().views([
				editorView,
				S.view
					.component(Iframe)
					.title('Preview')
					.options({
						url: (
							doc: SanityDocument & {
								slug?: { current: string }
							},
						) => {
							const base = previewUrl;
							const slug = doc?.slug?.current;
							const path = slug === 'index' ? '' : slug;
							const directory = 'item';
							const url = [base, directory, path].filter(Boolean).join('/');
							console.log('preview, url:', url);
							return url;
						},
						reload: {
							button: true,
						},
					}),
			])

		default:
			return S.document().views([editorView])
	}
}

export default documentNode;
