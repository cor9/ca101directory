import user from './documents/user';
import session from './documents/session';
import account from './documents/account';
import verificationToken from './documents/verificationToken';
import passwordResetToken from './documents/passwordResetToken';
import category from './documents/category';
import item from './documents/item';
import tag from './documents/tag';
import localizedString from './objects/localizedString';

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

    // objects
    localizedString,
]
