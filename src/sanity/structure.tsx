import { ArchiveIcon, BillIcon, CogIcon, ComponentIcon, DatabaseIcon, DocumentsIcon, DocumentTextIcon, ProjectsIcon, TagsIcon, TiersIcon, TokenIcon, UserIcon, UsersIcon } from "@sanity/icons";
import { type DocumentDefinition } from "sanity";
import { type StructureResolver } from "sanity/structure";
import { schemaTypes } from "./schemas";
import account from "./schemas/documents/auth/account";
import passwordResetToken from "./schemas/documents/auth/password-reset-token";
import session from "./schemas/documents/auth/session";
import user from "./schemas/documents/auth/user";
import verificationToken from "./schemas/documents/auth/verification-token";
import blogCategory from "./schemas/documents/blog/blog-category";
import blogPost from "./schemas/documents/blog/blog-post";
import category from "./schemas/documents/directory/category";
import item from "./schemas/documents/directory/item";
import tag from "./schemas/documents/directory/tag";
import settings from "./schemas/documents/settings";
import page from "./schemas/documents/page/page";
import order from "./schemas/documents/order/order";

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

        S.documentTypeListItem(item.name)
          .icon(ComponentIcon),
        S.documentTypeListItem(category.name)
          .icon(TiersIcon),
        S.documentTypeListItem(tag.name)
          .icon(TagsIcon),

        S.divider(),

        S.documentTypeListItem(blogPost.name)
          .icon(DocumentsIcon),
        S.documentTypeListItem(blogCategory.name)
          .icon(TiersIcon),

        S.divider(),

        S.documentTypeListItem(order.name)
          .icon(BillIcon),

        S.divider(),

        S.documentTypeListItem(page.name)
          .icon(DocumentTextIcon),

        S.divider(),

        // group the user management
        S.listItem().title('User management')
          .icon(UsersIcon)
          .child(
            S.list()
              .title('User management')
              .items([
                S.documentTypeListItem(user.name)
                  .icon(UserIcon),
                S.documentTypeListItem(account.name)
                  .icon(UsersIcon),
                S.documentTypeListItem(verificationToken.name)
                  .icon(TokenIcon),
                S.documentTypeListItem(passwordResetToken.name)
                  .icon(TokenIcon),
                S.documentTypeListItem(session.name)
                  .icon(ArchiveIcon),
              ]),
          ),

        S.divider(),

        // ...singletonItems,

        S.listItem()
          .title(settings.title!)
          .icon(CogIcon)
          .child(
            S.editor()
              .id(settings.name)
              .schemaType(settings.name)
              .documentId(settings.name),
          ),

        S.divider(),

        ...otherListItems,
      ]);
  };
};
