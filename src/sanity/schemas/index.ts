import account from './documents/auth/account';
import passwordResetToken from './documents/auth/passwordResetToken';
import session from './documents/auth/session';
import subscription from './documents/auth/subscription';
import user from './documents/auth/user';
import verificationToken from './documents/auth/verificationToken';
import blockContent from './documents/blog/blockContent';
import blogCategory from './documents/blog/blogCategory';
import blogPost from './documents/blog/blogPost';
import category from './documents/directory/category';
import item from './documents/directory/item';
import tag from './documents/directory/tag';
import settings from './documents/settings';

export const schemaTypes = [
    // directory
    item,
    tag,
    category,

    // blog
    blogPost,
    blogCategory,
    blockContent,

    // auth
    user,
    session,
    account,
    verificationToken,
    passwordResetToken,
    
    // subscription,
    
    settings,

    // objects
]
