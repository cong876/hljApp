'use strict';
/**
 *routers config
 *router states management
 */


angular.module('hljApp')

	.config(["$stateProvider", "$urlRouterProvider",
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.otherwise("/buypal");

			$stateProvider
				.state("bottom", {
					url: "/bottomState"
				})
				.state("buyerRegister", {
					url: "/buyerRegister",
					templateUrl: 'views/wx-app/buyer_register.html?' + + new Date(),
					controller: 'buyerRegisterCtrl'
				})

				.state('buypal', {																							            //page buypal
					url: '/buypal',
          templateUrl: 'views/wx-app/buypal/buypal.html?' + + new Date(),
          controller: 'buypalCtrl'
				})
        .state('buypal.itemList', {
          url: '/list',
          templateUrl: 'views/wx-app/buypal/item_list.html?' + + new Date(),
          controller: 'itemListCtrl'
        })
        .state('buypal.itemDetail', {
          url: '/detail/:itemId',
          templateUrl: 'views/wx-app/buypal/item_detail.html?' + + new Date(),
          controller: 'itemDetailCtrl'
        })
				.state('buypal.reward', {
					url: '/reward',
					templateUrl: 'views/wx-app/buypal/reward.html?' + + new Date(),
					controller: 'rewardCtrl'
				})
				.state('buypal.preventClose', {
					url: '/preventClose',
					templateUrl: 'views/wx-app/buypal/item_list.html?' + + new Date(),
					controller: 'preventCloseCtrl'
				})
				.state('buypal.submitted', {
					url: '/submitted',
					templateUrl: 'views/wx-app/buypal/submitted.html?' + + new Date(),
					controller: 'submittedCtrl'
				})

        .state('buyerAdmin', {                                                         //page buyer admin
          url: '/buyer',
          templateUrl: 'views/wx-app/buyer/buyer_admin.html?' + + new Date(),
          controller: 'buyerCtrl'
        })
        .state('buyerAdmin.profile', {
          url: '/profile',
          templateUrl: 'views/wx-app/buyer/buyer_profile.html?' + + new Date(),
          controller: 'buyerProfileCtrl'
        })

        .state('buyerAdmin.address', {
        	url: '/address/{state: /|list|management|/}',
        	templateUrl: 'views/wx-app/buyer/address_list.html?' + + new Date(),
        	controller: 'addressCtrl'
        })
        .state('buyerAdmin.addressDetail', {
          url: '/addressDetail',
          templateUrl: 'views/wx-app/buyer/address_detail.html?' + + new Date(),
          controller: 'addressDetailCtrl'
        })

        .state('buyerAdmin.orders', {
          url: '/orders',
          templateUrl: 'views/wx-app/buyer/order.html?' + + new Date(),
          controller: 'orderCtrl'
        })
        .state('buyerAdmin.orders.list', {
          url: '/{state: /|waitOffer|waitPay|waitDelivery|delivered|completed|/}',
          templateUrl: 'views/wx-app/buyer/order_list.html?' + + new Date(),
          controller: 'orderListCtrl'
        })
        .state('buyerAdmin.orders.list.pay', {
          url: '/pay/:orderNumber',
          templateUrl: 'views/wx-app/buyer/order_pay_detail.html?' + + new Date(),
          controller: 'orderDetailCtrl'
        })
        .state('buyerAdmin.orders.list.detail', {
          url: '/detail/:orderNumber',
          templateUrl: 'views/wx-app/buyer/order_detail.html?' + + new Date(),
          controller: 'orderDetailCtrl'
        })
        .state('buyerAdmin.orders.list.detail.item', {
          url: '/item',
          templateUrl: 'views/wx-app/buyer/order_item_detail.html?' + + new Date(),
          controller: 'orderItemDetailCtrl'
        });

	}]);
