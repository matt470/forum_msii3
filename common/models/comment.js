'use strict';
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1883')

module.exports = function(Comment) {
    Comment.beforeRemote('create', function(context, account, next) {
        context.args.data.date = Date.now();
        context.args.data.accountId = context.req.accessToken.userId;
        next();
      });

    Comment.afterRemote('create', function(context, comment, next) {
        // console.log('J\'ai fini de sauvegarder le commentaire!');
        client.subscribe('presence', function (err) {
            if (!err) {
              client.publish('presence', 'Il y a un nouveau commentaire à publier sur le front!')
            }
          })
        client.on('published', function (topic, message) {
            // message is Buffer
            console.log(message.toString())
            //client.end()
          })
        next();
    });
   
};


