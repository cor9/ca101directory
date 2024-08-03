import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { colorInput } from '@sanity/color-input';
import { dashboardTool, projectInfoWidget, projectUsersWidget, sanityTutorialsWidget } from "@sanity/dashboard";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { media } from 'sanity-plugin-media';
import { schemaTypes } from '@/sanity/schemas';
import defaultDocumentNode from '@/sanity/defaultDocumentNode';
import { pageStructure } from '@/sanity/pageStructure';

export default defineConfig({
  name: 'default',
  title: 'NextDir',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,

  schema: {
    types: schemaTypes,
  },

  plugins: [
    // https://www.sanity.io/docs/structure-tool-api
    // The Structure Tool is a top-level view within Sanity Studio 
    // where editors can drill down to specific documents to edit them.
    // structureTool(), 
    structureTool({
      // defaultDocumentNode,
      structure: pageStructure([]),
    }),
    
    // https://www.sanity.io/docs/the-vision-plugin
    // Vision is a plugin that lets you quickly test your GROQ queries right from the Studio.
    visionTool({
      defaultApiVersion: '2024-08-01',
      defaultDataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
    }),

    // presentationTool({
		// 	title: 'Editor',
		// 	previewUrl: {
		// 		draftMode: {
		// 			enable: `${BASE_URL}/api/draft`,
		// 		},
		// 	},
		// 	resolve: { locations },
		// }),

    // https://www.sanity.io/docs/dashboard
    // Dashboard is a Sanity Studio tool that allows you to add widgets that display information 
    // about your content, project details, or anything else you'd want to put there.
    dashboardTool({
      widgets: [
        projectInfoWidget(),
        projectUsersWidget(
          { layout: { width: 'large' } }
        ),
        sanityTutorialsWidget()
      ],
    }),

    // https://www.sanity.io/plugins/sanity-plugin-media
    // A convenient way to browse, manage and select all your Sanity assets.
    media(),
    
    // https://www.sanity.io/plugins/color-input
    // Color input for Sanity that stores selected colors in hex, hsl, hsv and rgb format.
    colorInput(),
    
    // https://www.sanity.io/plugins/code-input
    // Syntax highlighted editor for code.
    codeInput(),
    
    // https://www.sanity.io/plugins/sanity-plugin-asset-source-unsplash
    // Search photos on Unsplash and insert them directly inside of your Sanity Studio.
    unsplashImageAsset(),
  ],
})
