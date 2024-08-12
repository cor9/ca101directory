import { type DocumentDefinition } from "sanity";
import { type StructureResolver } from "sanity/structure";
import settings from "./schemas/documents/settings";
import { schemaTypes } from "./schemas";
import item from "./schemas/documents/directory/item";
import category from "./schemas/documents/directory/category";
import user from "./schemas/documents/auth/user";
import account from "./schemas/documents/auth/account";
import session from "./schemas/documents/auth/session";
import verificationToken from "./schemas/documents/auth/verificationToken";
import passwordResetToken from "./schemas/documents/auth/passwordResetToken";
import tag from "./schemas/documents/directory/tag";
import { UsersIcon } from "@sanity/icons";

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

        S.documentTypeListItem(item.name),
        S.documentTypeListItem(category.name),
        S.documentTypeListItem(tag.name),

        S.divider(),

        // group the user management
        S.listItem().title('User management')
          .icon(UsersIcon)
          .child(
            S.list()
              .title('User management')
              .items([
                S.documentTypeListItem(user.name),
                S.documentTypeListItem(account.name),
                S.documentTypeListItem(session.name),
                S.documentTypeListItem(verificationToken.name),
                S.documentTypeListItem(passwordResetToken.name),
              ]),
          ),
        // S.documentTypeListItem(user.name),
        // S.documentTypeListItem(account.name),
        // S.documentTypeListItem(session.name),
        // S.documentTypeListItem(verificationToken.name),
        // S.documentTypeListItem(passwordResetToken.name),

        S.divider(),

        ...singletonItems,

        S.divider(),

        ...otherListItems,
      ]);
  };
};
