'use strict';

module.exports = function(Account) {
    Account.beforeRemote('create', function(context, account, next) {
        context.args.data.accountId = context.req.accessToken.userId;
        next();
      });
};
