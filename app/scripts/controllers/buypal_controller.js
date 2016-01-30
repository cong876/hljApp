'use strict';
/**
 * Controllers for buypal
 * Including the main controller buypalCtrl and child controller itemDetailCtrl,preventCloseCtrl,rewardCtrl,submittedCtrl
 */


angular.module('hljApp')
  .controller('buypalCtrl', ['$scope', 'buypalService', function($scope, buypalService) {
      $scope.requirement = buypalService.getRequirement();
  }])
  .controller('itemListCtrl', ['$scope', 'buypalService', '$location', 'yeyeFn', '$timeout',
    function($scope, buypalService, $location, yeyeFn, $timeout) {

      function calculateTotal() {
        $scope.totalNumber = $scope.requirement.length>0 ? $scope.requirement.map(function(x) {
          return x.number;
        }).reduce(function(a,b) {
          return a+b;
        }) : 0;
      }

      $scope.requirement = buypalService.getRequirement();

      calculateTotal();

      $scope.substr = yeyeFn.subStrByByte;

      $scope.deleteItem = function(id) {
        buypalService.deleteItem(id);
        calculateTotal();
      };
      $scope.editItem = buypalService.editItem;
      $scope.submitRequirement = buypalService.submitRequirement;

      $timeout(function() {
        window.scrollTo(0, document.body.clientHeight);																						//滑到页面底部使添加按钮显示出来
      },0);

    }])

	.controller('itemDetailCtrl', ['$scope', '$stateParams', 'buypalService', 'isFirstIn',
		function($scope, $stateParams, buypalService, isFirstIn) {

		$scope.item = buypalService.getItem($stateParams.itemId);

		$scope.addPicture = function(event, item){
			buypalService.addPicture(event, item, $scope);
		};
		$scope.previewPicture = buypalService.previewPicture;
		$scope.deletePicture = buypalService.deletePicture;
		$scope.saveItem = buypalService.saveItem;

	}])

	.controller('preventCloseCtrl', ['$scope', 'buypalService', 'publicService',
		function($scope, buypalService, publicService) {

		$scope.requirement = buypalService.getRequirement();
		$scope.showModal = true;

		$scope.closeWindow = publicService.closeWindow;

	}])

	.controller('rewardCtrl', ['$scope', 'buypalService', 'isFirstIn',
		function($scope, buypalService, isFirstIn) {

		buypalService.initReward($scope);

		$scope.getReward = function() {
			buypalService.getReward($scope);
		};
		$scope.buyReward = buypalService.buyReward;

	}])

	.controller('submittedCtrl', ['$scope', 'buypalService', 'yeyeFn',
		function($scope, buypalService, yeyeFn) {

		//buypalService.getActivityItems($scope);
		//$scope.goActivity = buypalService.goActivity;

	}]);
