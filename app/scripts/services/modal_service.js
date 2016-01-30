'use strict';
/*
 * Modal services
*/

angular.module('hljApp')
	.service('modalService', ['$rootScope', function($rootScope) {

		function forbidden(e) {																							//禁止手机用户滚动页面
			e.preventDefault();
			e.stopPropagation();
		}

		function forbidHandleScroll() {																			//禁止手机用户滚动页面
			document.addEventListener("touchmove",forbidden,false);
		}

		function allowHandleScroll() {																			//解除禁止
			document.removeEventListener("touchmove",forbidden,false);
		}

		$rootScope.hljModal = {
			showModal: false,
			close: function() {
				this.showModal = false;
				allowHandleScroll();
			},
			content: []
		};

		this.open = function(content, acceptCallback) {
			forbidHandleScroll();
			$rootScope.hljModal.showModal = true;
			$rootScope.hljModal.content = content;
			$rootScope.hljModal.accept = acceptCallback;
		}

	}]);

