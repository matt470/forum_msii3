'use strict';

module.exports = function(Article) {
  Article.beforeRemote('create', function(context, account, next) {
    context.args.data.accountId = context.req.accessToken.userId;
    next();
  });  
};
