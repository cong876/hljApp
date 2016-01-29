'use strict';

/**
 * @ngdoc overview
 * @name hljApp
 * @description
 * # hljApp
 *
 * Main module of the application.
 */

var TEST_URL = {
	defaultItemPic: 'http://7xnzm2.com2.z0.glb.qiniucdn.com/default.png',
	noItemBg: 'http://7xnzm2.com2.z0.glb.qiniucdn.com/noItemBg.jpg',
	reward: 'http://7xnzm2.com2.z0.glb.qiniucdn.com/reward.jpg',
	operator: 'http://7xnzm2.com2.z0.glb.qiniucdn.com/operator.png',

	checkMobile: '/pass',
	getVerifyCode: '/pass',
	verifyCode: '/verifyCode',
	buyerRegister: '/pass',
	submitRequirement: '/pass',
	getActivityItems: '/buyPal/getGroupItems',
	getRewardItem: '/buyPal/getLuckyBagItem',
	buyRewardItem: '/pass',

  ordersWaitOffer: '/noOrder',
  ordersWaitPay: '/orders',
  ordersWaitDelivery: '/ordersWaitDelivery',
  ordersDelivered: '/orders',
  ordersCompleted: '/orders'
};

var GLOBAL_URL = {
	defaultItemPic: 'http://7xnzm2.com2.z0.glb.qiniucdn.com/default.png',
	noItemBg: 'http://7xnzm2.com2.z0.glb.qiniucdn.com/noItemBg.jpg',
	reward: 'http://7xnzm2.com2.z0.glb.qiniucdn.com/reward.jpg',
	operator: 'http://7xnzm2.com2.z0.glb.qiniucdn.com/operator.png',

	checkMobile: 'api/buyerRegister/checkMobile',
	getVerifyCode: 'api/getVerificationCode',
	verifyCode: 'api/verifySMSCode',
	buyerRegister: 'api/buyerRegister/updateAccount',
	submitRequirement: 'api/buyPal/commitRequirement',
	getActivityItems: 'api/buyPal/getGroupItems',
	getRewardItem: 'api/buyPal/getLuckyBagItem',
	buyRewardItem: 'api/buyPal/commitReward'
};
var GLOBAL_PATT = {
	mobile: /^[0-9]{11}$/,
	email: /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
};

angular
  .module('hljApp', [
   	'ui.router',
    'ngTouch',
    'yeyeFn'
  ])

	.constant({
		hlj_url: TEST_URL,
		hlj_patt: GLOBAL_PATT
	})

	.value({
		isFirstIn: {
			showReward: false
		},
		isCountdown: {
			register: false
		}
	})


	.run(['$rootScope', '$state', '$stateParams', '$location', 'yeyeFn', 'modalService', 'buypalService', 'wxService', 'isFirstIn', 'isCountdown', 'hlj_url', 'hlj_patt',
		function($rootScope, $state, $stateParams, $location, yeyeFn, modalService, buypalService, wxService, isFirstIn, isCountdown, hlj_url, hlj_patt) {
			$rootScope.showLoading = true;

			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;

			$rootScope.isCountdown = isCountdown;
			$rootScope.hlj_patt = hlj_patt;
			$rootScope.hlj_url = hlj_url;

	    $rootScope.$on('$locationChangeStart', locationChangeStart);

	    function locationChangeStart(event, newUrl, currentUrl) {
	    	var newPath = newUrl.split("#")[1];
	    	var currentPath = currentUrl.split("#")[1];
				var isEmptyRequire = buypalService.getRequirement().length === 0;

    		if (newPath === '/buypal' && currentPath === '/buypal/list' && !isEmptyRequire && !$rootScope.hljModal.showModal) {
    			event.preventDefault();
    			modalService.open(['已添加的商品将被删除，', '确认返回？'], function() {
    				buypalService.requirement = [];
    				history.back();
    			});
    			return false;
    		}
	    	if (newUrl.match("bottomState") && (currentUrl.match('buypal') || currentUrl.match('dailyActivity') || currentUrl.match('buyer'))) {
	    		event.preventDefault();
	    		closeWindow();
	    	}
	    }

	    function closeWindow() {
	    	buypalService.requirement = [];
	    	if (yeyeFn.getUser().isNewbuyer && !isFirstIn.showReward) {
	    		$location.path('/buypal/reward').replace();
	    		return false;
	    	}
	    	wxService.close();
	    }

		}]);


	// wx.ready(function(){
		angular.element(document).ready(function(){
			angular.bootstrap(document, ['hljApp']);
		});
	// });
