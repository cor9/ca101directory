import { BillIcon, CheckmarkCircleIcon, ClockIcon, CloseCircleIcon, CloseIcon, CogIcon, DashboardIcon, DocumentsIcon, DocumentTextIcon, StarFilledIcon, TagsIcon, TaskIcon, TiersIcon, TokenIcon, UserIcon, UsersIcon } from "@sanity/icons";
import { type DocumentDefinition } from "sanity";
import { type StructureResolver } from "sanity/structure";
import { schemaTypes } from "./schemas";
import account from "./schemas/documents/auth/account";
import passwordResetToken from "./schemas/documents/auth/password-reset-token";
import user from "./schemas/documents/auth/user";
import verificationToken from "./schemas/documents/auth/verification-token";
import blogCategory from "./schemas/documents/blog/blog-category";
import blogPost from "./schemas/documents/blog/blog-post";
import category from "./schemas/documents/directory/category";
import item from "./schemas/documents/directory/item";
import tag from "./schemas/documents/directory/tag";
import order from "./schemas/documents/order/order";
import page from "./schemas/documents/page/page";
import settings from "./schemas/documents/settings";

const singletonTypes: DocumentDefinition[] = [settings];

// The StructureResolver is how we're changing the DeskTool structure to linking to document (named Singleton)
// demo: https://github.com/javayhu/sanity-press/blob/main/sanity/src/structure.ts#L7
export const structure = (/* typeDefArray: DocumentDefinition[] */): StructureResolver => {
  return (S) => {
    // Goes through all of the singletons and translates them into something the Structure tool can understand
    const singletonItems = singletonTypes.map((singletonType) => {
      return S.listItem()
        .title(singletonType.title!)
        .icon(CogIcon)
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

    // helper function
    const createFilteredListItem = (
      title: string,
      schemaType: string,
      icon: any,
      filter: string
    ) => {
      return S.listItem()
        .title(title)
        .schemaType(schemaType)
        .icon(icon)
        .child(S.documentList()
          .schemaType(schemaType)
          .title(title)
          .filter(filter));
    };

    // submissions in free plan
    const pendingSubmissionsInFreePlan = createFilteredListItem(
      'Pending Submissions In Free Plan',
      item.name,
      ClockIcon,
      '_type == "item" && pricePlan == "free" && freePlanStatus == "pending"'
    );

    const rejectedSubmissionsInFreePlan = createFilteredListItem(
      'Rejected Submissions In Free Plan',
      item.name,
      CloseCircleIcon,
      '_type == "item" && pricePlan == "free" && freePlanStatus == "rejected"'
    );

    const approvedSubmissionsInFreePlan = createFilteredListItem(
      'Approved Submissions In Free Plan',
      item.name,
      CheckmarkCircleIcon,
      '_type == "item" && pricePlan == "free" && freePlanStatus == "approved"'
    );

    // submissions in pro plan
    const pendingSubmissionsInProPlan = createFilteredListItem(
      'Pending Submissions In Pro Plan',
      item.name,
      ClockIcon,
      '_type == "item" && pricePlan == "pro" && proPlanStatus == "pending"'
    );

    const failedSubmissionsInProPlan = createFilteredListItem(
      'Failed Submissions In Pro Plan',
      item.name,
      CloseCircleIcon,
      '_type == "item" && pricePlan == "pro" && proPlanStatus == "failed"'
    );

    const successSubmissionsInProPlan = createFilteredListItem(
      'Success Submissions In Pro Plan',
      item.name,
      CheckmarkCircleIcon,
      '_type == "item" && pricePlan == "pro" && proPlanStatus == "success"'
    );

    // featured items
    const featuredItems = createFilteredListItem(
      'Featured Items',
      item.name,
      StarFilledIcon,
      '_type == "item" && featured == true'
    );

    // published items
    const publishedItems = createFilteredListItem(
      'Published Items',
      item.name,
      TaskIcon,
      '_type == "item" && publishDate != null'
    );

    const itemsInFreePlan = createFilteredListItem(
      'All Items In Free Plan',
      item.name,
      DashboardIcon,
      '_type == "item" && pricePlan == "free"'
    );

    const itemsInProPlan = createFilteredListItem(
      'All Items In Pro Plan',
      item.name,
      DashboardIcon,
      '_type == "item" && pricePlan == "pro"'
    );

    const allItems = S.documentTypeListItem(item.name)
      .title('All Items')
      .icon(DashboardIcon);

    // failed orders
    const failedOrders = createFilteredListItem(
      'Failed Orders',
      order.name,
      CloseCircleIcon,
      '_type == "order" && status == "failed"'
    );

    // success orders
    const successOrders = createFilteredListItem(
      'Success Orders',
      order.name,
      CheckmarkCircleIcon,
      '_type == "order" && status == "success"'
    );

    // all orders
    const allOrders = S.documentTypeListItem(order.name)
      .title('All Orders')
      .icon(BillIcon);

    return S.list()
      .title("Content")
      .items([

        // pendingSubmissionsInFreePlan,
        // S.divider(),

        // group the order management
        // S.documentTypeListItem(order.name)
        //   .icon(BillIcon),
        S.listItem().title('Order management')
          .icon(BillIcon)
          .child(
            S.list()
              .title('Order management')
              .items([
                successOrders,
                failedOrders,
                allOrders,
              ]),
          ),

        S.divider(),

        // S.documentTypeListItem(item.name)
        //   .icon(DashboardIcon),
        // group the item management
        S.listItem().title('Item management')
          .icon(DashboardIcon)
          .child(
            S.list()
              .title('Item management')
              .items([
                pendingSubmissionsInFreePlan,
                approvedSubmissionsInFreePlan,
                rejectedSubmissionsInFreePlan,
                itemsInFreePlan,

                S.divider(),

                pendingSubmissionsInProPlan,
                failedSubmissionsInProPlan,
                successSubmissionsInProPlan,
                itemsInProPlan,

                S.divider(),

                allItems,
                featuredItems,
                publishedItems,
              ]),
          ),

        S.divider(),

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
              ]),
          ),

        S.divider(),

        S.documentTypeListItem(page.name)
          .icon(DocumentTextIcon),

        S.divider(),

        ...singletonItems,

        S.divider(),

        ...otherListItems,
      ]);
  };
};
