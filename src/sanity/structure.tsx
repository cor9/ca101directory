import { type DocumentDefinition } from "sanity";
import { type StructureResolver } from "sanity/structure";
import settings from "./schemas/documents/settings";
import { schemaTypes } from "./schemas";

const singletonTypes: DocumentDefinition[] = [settings];

// The StructureResolver is how we're changing the DeskTool structure to linking to document (named Singleton)
// demo: https://github.com/javayhu/sanity-press/blob/main/sanity/src/structure.ts#L7
export const structure = (/* typeDefArray: DocumentDefinition[] */): StructureResolver => {
  return (S) => {
    // Goes through all of the singletons and translates them into something the Structure tool can understand
    const singletonItems = singletonTypes.map((singletonType) => {
      return S.listItem()
        .title(singletonType.title!)
        .icon(singletonType.icon)
        .child(
          S.editor()
            .id(singletonType.name)
            .schemaType(singletonType.name)
            .documentId(singletonType.name),
        );
    });

    // other list items (like MediaTag)
    const otherListItems = S.documentTypeListItems().filter(
      (listItem) =>
        !schemaTypes.find((type) => type.name === listItem.getId()),
    );

    return S.list()
      .title("Content")
      .items([
        S.divider(),
        
        S.documentTypeListItem('item'),
        S.documentTypeListItem('category'),
        S.documentTypeListItem('tag'),
        
        S.divider(),

        S.documentTypeListItem('user'),
        S.documentTypeListItem('account'),
        S.documentTypeListItem('session'),
        S.documentTypeListItem('verificationToken'),
        S.documentTypeListItem('passwordResetToken'),
        
        S.divider(),
        
        ...singletonItems,
        
        S.divider(),
        
        ...otherListItems,
      ]);
  };
};
