'use strict';

module.exports = function(Comment) {
    Comment.beforeRemote('create', function(context, account, next) {
        context.args.data.date = Date.now();
        context.args.data.accountId = context.req.accessToken.userId;
        next();
      });
};
