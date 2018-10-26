// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-getting-started-intermediate
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('app')
  .controller('AllReviewsController', ['$scope', 'Comment', function($scope,
      Comment) {
    $scope.comments = Comment.find({
      filter: {
        include: [
          'article',
          'account'
        ]
      }
    });
  }])
  .controller('AddReviewController', ['$scope', 'Article', 'Comment',
      '$state', function($scope, Article, Comment, $state) {
    $scope.action = 'Add';
    $scope.articles = [];
    $scope.selectedShop;
    $scope.comment = {};
    $scope.isDisabled = false;

    Article
      .find()
      .$promise
      .then(function(articles) {
        $scope.articles = articles;
        $scope.selectedShop = $scope.selectedShop || articles[0];
      });

    $scope.submitForm = function() {
      Comment
        .create({
          rating: $scope.comment.rating,
          text: $scope.comment.text,
          articleId: $scope.selectedShop.id,
        })
        .$promise
        .then(function() {
          $state.go('all-reviews');
        });
    };
  }])
  // Add Article controller
  .controller('AddArticleController', ['$scope', 'Article',
      '$state', function($scope, Article, $state) {
    $scope.action = 'Add';
    $scope.article = {};
    $scope.isDisabled = false;

    $scope.submitForm = function() {
      Article
        .create({
          title: $scope.article.title,
        })
        .$promise
        .then(function() {
          $state.go('all-reviews');
        });
    };
  }])
  .controller('DeleteReviewController', ['$scope', 'Comment', '$state',
      '$stateParams', function($scope, Comment, $state, $stateParams) {
    Comment
      .deleteById({ id: $stateParams.id })
      .$promise
      .then(function() {
        $state.go('my-reviews');
      });
  }])
  .controller('EditReviewController', ['$scope', '$q', 'Article', 'Comment',
      '$stateParams', '$state', function($scope, $q, Article, Comment,
      $stateParams, $state) {
    $scope.action = 'Edit';
    $scope.articles = [];
    $scope.selectedShop;
    $scope.comment = {};
    $scope.isDisabled = true;

    $q
      .all([
        Article.find().$promise,
        Comment.findById({ id: $stateParams.id }).$promise
      ])
      .then(function(data) {
        var articles = $scope.articles = data[0];
        $scope.comment = data[1];
        $scope.selectedShop;

        var selectedShopIndex = articles
          .map(function(article) {
            return article.id;
          })
          .indexOf($scope.comment.articleId);
        $scope.selectedShop = articles[selectedShopIndex];
      });

    $scope.submitForm = function() {
      $scope.comment.articleId = $scope.selectedShop.id;
      $scope.comment
        .$save()
        .then(function(comment) {
          $state.go('all-reviews');
        });
    };
  }])
  .controller('MyReviewsController', ['$scope', 'Comment',
      function($scope, Comment) {
        // after a refresh, the currenUser is not immediately on the scope
        // So, we're watching it on the scope and load my reviews only then.
        $scope.$watch('currentUser.id', function(value) {
          if (!value) {
            return;
          }
          $scope.comments = Comment.find({
            filter: {
              where: {
                accountId: $scope.currentUser.id
              },
              include: [
                'article',
                'account'
              ]
            }
          });
        });
  }]);
