import { DocumentsIcon, UsersIcon } from "@sanity/icons";
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
import payment from "./schemas/documents/pay/payment";
import stripeCustomer from "./schemas/documents/pay/stripe-customer";

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

        // group the blog management
        // S.listItem().title('Blog management')
        //   .icon(DocumentsIcon)
        //   .child(
        //     S.list()
        //       .title('Blog management')
        //       .items([
        //         S.documentTypeListItem(blogPost.name),
        //         S.documentTypeListItem(blogCategory.name),
        //       ]),
        //   ),

        S.documentTypeListItem(blogPost.name),
        S.documentTypeListItem(blogCategory.name),

        S.divider(),

        S.documentTypeListItem(page.name),

        S.divider(),

        S.documentTypeListItem(payment.name),
        S.documentTypeListItem(stripeCustomer.name),

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
