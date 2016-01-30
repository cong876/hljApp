/**
 * Controllers for user admin
 * Including
 */

angular.module('hljApp')
  .controller('buyerCtrl', ['$scope', 'yeyeFn', 'mainService', '$rootScope',
    function($scope, yeyeFn, mainService) {
      $scope.user = {};
      angular.extend($scope.user, yeyeFn.getUser());
      mainService.refreshData('waitOffer');
      mainService.data.orders.waitPay.refresh(function(that){
        $scope.waitPayNumber = that.list.length;
      }, true);
    }])

  .controller('buyerProfileCtrl', ['$scope',
    function($scope) {

    }])

  .controller('addressCtrl', ['$scope', '$stateParams',
    function($scope, $stateParams) {
      $scope.state = $stateParams.state;
    }])

  .controller('addressDetailCtrl', ['$scope',
    function($scope) {

    }])

  .controller('orderCtrl', ['$scope',
    function($scope) {

    }])

  .controller('orderListCtrl', ['$scope', 'mainService', '$location', '$stateParams', '$rootScope',
    function($scope, mainService, $location, $stateParams, $rootScope) {

      var ordersShow = mainService.data.orders[$stateParams.state];
      if (ordersShow.list && !ordersShow.changed) {
        $scope.orders = ordersShow;
      } else {
        ordersShow.refresh(function(that) {
          $scope.orders = that;
          $rootScope.showLoading = false;
        })
      }
    }])

  .controller('orderDetailCtrl', ['$scope', '$stateParams',
    function($scope, $stateParams) {
      $scope.item={
        title: '无印良品',
        number: 2
      }
    }])

  .controller('orderItemDetailCtrl', ['$scope',
    function($scope) {
      $scope.pictures = [
        "http://7xnzm2.com2.z0.glb.qiniucdn.com/default.png",
        "http://7xnzm2.com2.z0.glb.qiniucdn.com/default.png",
        "http://7xnzm2.com2.z0.glb.qiniucdn.com/default.png",
        "http://7xnzm2.com2.z0.glb.qiniucdn.com/default.png",
        "http://7xnzm2.com2.z0.glb.qiniucdn.com/default.png",
        "http://7xnzm2.com2.z0.glb.qiniucdn.com/default.png"
      ]
    }]);
