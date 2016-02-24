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

  getCities: '/getCities',
  getCounties: '/getCounties',
  getAddresses: '/getAddresses',

  createAddress: '/createAddress',
  updateAddress: '/updateAddress',
  deleteAddress: '/pass',
  updateMobile: '/pass',
  updateEmail: '/pass',

  orders: '/orders',
  ordersWaitOffer: '/noOrder',
  ordersWaitPay: '/orders',
  ordersWaitDelivery: '/ordersWaitDelivery',
  ordersDelivered: '/orders',
  ordersCompleted: '/orders',

  orderDetail: '/orderDetail',
  deleteOrder: '/pass',
  sureToComplete: '/pass'
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
      $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

	    function locationChangeStart(event, newUrl, currentUrl) {
	    	var newPath = newUrl.split("#")[1];
	    	var currentPath = currentUrl.split("#")[1];
				var isEmptyRequirement = buypalService.getRequirement().length === 0;

        /**
         * 判断从需求列表页回退时,有商品时,是否要清空
         */
    		if (newPath === '/buypal' && currentPath === '/buypal/list' && !isEmptyRequirement && !$rootScope.hljModal.showModal) {
    			event.preventDefault();
    			modalService.open("<p>已添加的商品将被删除，</p><p>确认返回？</p>", function() {
    				buypalService.requirement = [];
    				history.back();
    			});
    			return false;
    		}

        /**
         * 判断当用户从帮我代购退出浏览器时,是否展示福袋,以及当从非主tab回退时,返回上一级
         */
	    	if (newUrl.match("bottomState")) {
	    		event.preventDefault();
          var getCurrentPath = currentPath.split("/");
          if (currentUrl.match('buypal') && yeyeFn.getUser().isNewbuyer && !isFirstIn.showReward) {
            $location.path('/buypal/reward').replace();
            return false;
          }

          if (getCurrentPath.length > 2) {
            var guidePath = getCurrentPath.slice(0, getCurrentPath.length-2).join('/');             //退到当前的上一级
            $location.path(guidePath);
            return false;
          }
	    		closeWindow();
	    	}
	    }

      function locationChangeSuccess(event, newUrl, currentUrl) {
        var newPath = newUrl.split("#")[1];
        var currentPath = currentUrl.split("#")[1];

        if ($rootScope.hljModal.showModal) {
          $rootScope.hljModal.showModal = false
        }

        if (newPath === '/buypal' && currentPath === '/buypal/list') {              //回退成功时清空报价
          buypalService.requirement = [];
        }
      }

	    function closeWindow() {
	    	wxService.close();                                                          //调用微信接口关闭窗口
	    }

		}]);


	// wx.ready(function(){
		angular.element(document).ready(function(){
			angular.bootstrap(document, ['hljApp']);
		});
	// });
