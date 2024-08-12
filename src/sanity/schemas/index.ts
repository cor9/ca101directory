import account from './documents/auth/account';
import passwordResetToken from './documents/auth/passwordResetToken';
import session from './documents/auth/session';
import subscription from './documents/auth/subscription';
import user from './documents/auth/user';
import verificationToken from './documents/auth/verificationToken';
import category from './documents/directory/category';
import item from './documents/directory/item';
import tag from './documents/directory/tag';
import settings from './documents/settings';

export const schemaTypes = [
    // documents
    item,
    tag,
    category,
    
    user,
    session,
    account,
    verificationToken,
    passwordResetToken,
    
    // subscription,
    
    settings,

    // objects
]
