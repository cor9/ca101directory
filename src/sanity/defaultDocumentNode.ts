import { type SanityDocument } from 'sanity';
import { Iframe } from 'sanity-plugin-iframe-pane';
import type { DefaultDocumentNodeResolver } from 'sanity/structure';

const previewUrl = process.env.NEXT_PUBLIC_APP_URL;

const defaultDocumentNode: DefaultDocumentNodeResolver = (
	S,
	{ schemaType },
) => {
	const editorView = S.view.form();

	switch (schemaType) {
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

							console.log('preview, url', [base, directory, path].filter(Boolean).join('/'));
							return [base, directory, path].filter(Boolean).join('/');
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

export default defaultDocumentNode
