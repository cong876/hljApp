/**
 * template here;
 */

angular.module('hljApp')
  .directive('overView', overView)
  .directive('activityPreview', ['yeyeFn', activityPreview]);

function overView() {
  return {
    replace: true,
    restrict: 'E',
    template: '<section class="box overView"><div><div>' +
                '<div class="squareImage" yeye-bg="image"></div></div></div>' +
                '<div><p ng-bind="title"></p><p><span>&times;</span><span ng-bind="number"></span>' +
                '<b ng-if="price" class="right" yeye-price="price"></b></p></div>' +
              '</section>',
    scope: {
      image: '@image',
      title: '@title',
      number: '@number',
      price: '@price'
    }
  }
}

function activityPreview(yeyeFn) {
  return {
    replace: true,
    restrict: 'E',
    template: '<div><div class="splitArea">' +
                '<div><hr></div><div>逛一逛</div><div><hr></div>' +
              '</div>' +
              '<div class="activityItemArea">' +
                '<span ng-repeat="item in items">' +
                  ' <div class="itemContainer" ng-click="goActivity(item.id)">' +
                    '<div class="itemPictureContainerA"><div class="squareImage" yeye-bg="item.pic_url"></div></div>' +
                    '<p class="itemTitle" ng-bind="item.title"></p>' +
                    '<p><span class="itemPrice" yeye-price="item.price"></span><span class="marketPrice" yeye-price="item.marketPrice"></span></p>' +
                  '</div> ' +
                '</span>' +
                '<div class="itemContainer left_fix"></div>' +
                '<div class="splitArea" ng-click="goActivity()"><div><hr></div><div>点击查看更多</div><div><hr></div></div>' +
              '</div></div>',
    scope: {
      url: '='
    },
    link: function($scope) {
      yeyeFn
        .yeyeReq(false, false, 'GET', $scope.url)
        .then(function(res) {
          $scope.items = res.data;
        });
      $scope.goActivity = function(itemId) {
        history.replaceState("", "", "#/buypal");
        window.location = "/getPeriodActivity#item" + itemId;
      }
    }
  }
}
