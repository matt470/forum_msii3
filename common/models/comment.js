'use strict';

module.exports = function(Comment) {
    Comment.beforeRemote('create', function(context, account, next) {
        context.args.data.date = Date.now();
        context.args.data.accountId = context.req.accessToken.userId;
        next();
      });
    Comment.afterRemote('create', function(context, account, next) {
       // Comment.app.mqttClient.publish('presence', 'Hello mqtt');
        console.log('J\'ai fini d\'envoyé le message');
        next();
    });    
};


