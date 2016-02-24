'use strict';
/**
 * main logic here;
 */


angular.module('hljApp')
	.controller('mainCtrl', ['$scope', 'yeyeFn', '$location', 'wxService',
		function($scope, yeyeFn, $location, wxService) {
			var currentHash = location.hash;
			if(location.hash.match(["#/buypal/reward"])){
				wxService.close();
			}
			history.replaceState("", "", "#/bottomState");
			history.pushState("", "", currentHash);
      console.log(JSON.parse(document.body.dataset.init));
	    yeyeFn.setUser(JSON.parse(document.body.dataset.init));                       //init user info
	    $scope.stop = function(event) {
	      event.preventDefault();
	      event.stopPropagation();
	      event.stopImmediatePropagation();
	    };

      $scope.substr = yeyeFn.subStrByByte;

	    $scope.changeTab = function(newUrl) {
        $location.path(newUrl).replace();
      };

			yeyeFn.loaded(0);
		}]);
