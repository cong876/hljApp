'use strict';
/*
 * Ctrollers for page register
*/

angular.module('hljApp')

	.controller('buyerRegisterCtrl', ['$scope', 'yeyeFn', function($scope, yeyeFn) {
		$scope.user = {};

		angular.extend($scope.user, yeyeFn.getUser());

		$scope.getVerifyCode = yeyeFn.getVerifyCode;
		$scope.register = yeyeFn.register;
	}]);