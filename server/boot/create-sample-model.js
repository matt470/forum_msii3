var async = require('async');
module.exports = function(app) {
  //data sources
  var mongoDs = app.dataSources.mongoDs; // 'name' of your mongo connector, you can find it in datasource.json
  var mysqlDs = app.dataSources.mysqlDs;
  //create all models
  async.parallel({
    accounts: async.apply(createAccounts),
    articles: async.apply(createArticles),
  }, function(err, results) {
    if (err) throw err;
    createComments(results.accounts, results.articles, function(err) {
      console.log('> models created sucessfully');
    });
  });
  //create reviewers
  function createAccounts(cb) {
    mongoDs.automigrate('Account', function(err) {
      if (err) return cb(err);
      var Account = app.models.Account;
      Account.create([{
        email: 'foo@bar.com',
        password: 'foobar'
      }, {
        email: 'john@doe.com',
        password: 'johndoe'
      }, {
        email: 'jane@doe.com',
        password: 'janedoe'
      }], cb);
    });
  }
  //create coffee shops
  function createArticles(cb) {
    mysqlDs.automigrate('Article', function(err) {
      if (err) return cb(err);
      var Article = app.models.Article;
      Article.create([{
        title: 'Bel Cafe',
      }, {
        title: 'Three Bees Coffee House',
      }, {
        title: 'Caffe Artigiano',
      }, ], cb);
    });
  }
  //create reviews
  function createComments(accounts, articles, cb) {
    mongoDs.automigrate('Comment', function(err) {
      if (err) return cb(err);
      var Comment = app.models.Comment;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Comment.create([{
        date: Date.now() - (DAY_IN_MILLISECONDS * 4),
        rating: 5,
        text: 'A very good coffee shop.',
        accountId: accounts[0].id,
        articleId: articles[0].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 3),
        rating: 5,
        text: 'Quite pleasant.',
        accountId: accounts[1].id,
        articleId: articles[0].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS * 2),
        rating: 4,
        text: 'It was ok.',
        accountId: accounts[1].id,
        articleId: articles[1].id,
      }, {
        date: Date.now() - (DAY_IN_MILLISECONDS),
        rating: 4,
        text: 'I go here everyday.',
        accountId: accounts[2].id,
        articleId: articles[2].id,
      }], cb);
    });
  }
};