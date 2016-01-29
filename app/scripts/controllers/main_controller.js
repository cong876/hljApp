'use strict';
/**
 * main logic here;
 */


angular.module('hljApp')
	.controller('mainCtrl', ['$scope', 'yeyeFn', '$location', 'wxService', 'mainService',
		function($scope, yeyeFn, $location, wxService, mainService) {
			var currentHash = location.hash;
			if(location.hash.match(["#/buypal/reward"])){
				wxService.close();
			}
			history.replaceState("", "", "#/bottomState");
			history.pushState("", "", currentHash);
	    yeyeFn.setUser(JSON.parse(document.body.dataset.init));                       //init user info

	    $scope.stop = function(event) {
	      event.preventDefault();
	      event.stopPropagation();
	      event.stopImmediatePropagation();
	    };

	    $scope.changeTab = mainService.changeTab;

			yeyeFn.loaded(0);
		}]);
