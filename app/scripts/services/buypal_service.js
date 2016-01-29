'use strict';
/*
 *Services for page buypal
 *
*/

angular.module('hljApp')
	.service('buypalService', ['$location', 'yeyeFn', 'hlj_url', 'wxService', 'isFirstIn',
		function($location, yeyeFn, hlj_url, wxService, isFirstIn) {

		var that = this;
		this.requirement = [];
		this.reward = {};																																						//防止购买奖品时从注册页回来会丢失数据
		this.isGetReward = false;

		this.saveItem = function(item,id) {
			id = parseInt(id.itemId);
			id = id < 0 ? that.requirement.push(item) : that.requirement.splice(id, 1, item);					//id为-1时表示添加一个商品
			$location.path('buypal/list').replace();
		};

		this.getItem = function(id) {
			var itemIndex = {title: '', number: 1, pic_urls: [], localId: []};
			if (id > -1) {
				angular.extend(itemIndex, that.requirement[id]);																				//建立一个新对象防止未保存生效
				var copyPic_urls = that.requirement[id].pic_urls.slice();																//复制数组，防止当前数组与原数组指向同一数组
				itemIndex.pic_urls = copyPic_urls;
			}
			return itemIndex;
		};

		this.getRequirement = function(a) {
			return that.requirement
		};

		this.deleteItem = function(id) {
			that.requirement.splice(id, 1);
		};

		this.editItem = function(id) {
			$location.path("/buypal/detail/"+id);
		};

		this.addPicture = function(event, item, $scope) {
			event.stopPropagation();
			wxService.uploadImage(item, $scope);
		};

		this.previewPicture = function(event, index, item) {
			event.stopPropagation();
			wxService.previewImage(index, item);
		};

		this.deletePicture = function(event, index, item) {
			event.stopPropagation();
			item.pic_urls.splice(index, 1);
			item.localId.splice(index, 1);
		};

		this.submitRequirement = function(requirement) {
			if (yeyeFn.getUser().mobile) {
				var requirementFinal = [];
				angular.forEach(requirement, function(item) {
					var itemFinal = {};
					angular.extend(itemFinal, item);
					delete(itemFinal.localId);
					requirementFinal.push(itemFinal);
				});

				var dataFinal = {items: requirementFinal};

				yeyeFn
				.yeyeReq(true, true, 'POST', hlj_url.submitRequirement, dataFinal)
				.then(function(res) {
					$location.path("/buypal/submitted").replace();
          that.requirement = [];
				});
			} else {
				$location.path("/buyerRegister");
			}
		};

		this.initReward = function($scope) {
			if (!isFirstIn.showReward) {																														//第一次进入此页时
				$scope.isGetReward = false;
				isFirstIn.showReward = true;
			} else if (that.isGetReward) {																													//从注册页返回时，已经发过获得奖品的请求
				$scope.isGetReward = true;
				$scope.item = that.reward;
			}
		};

		this.getReward = function($scope) {
			angular.element(document.getElementsByClassName('rewardContainer')[0]).addClass('fadeOut');

			yeyeFn
			.yeyeReq(true, true, 'GET', hlj_url.getRewardItem)
			.then(function(res) {
				that.reward = res.data;
				$scope.item = res.data;
				$scope.isGetReward = true;
				that.isGetReward = true;
			});
		};

		this.buyReward = function(item) {
			if (yeyeFn.getUser().mobile) {
				yeyeFn
				.yeyeReq(true, true, 'POST', hlj_url.buyRewardItem, item)
				.then(function(res) {
					history.replaceState("", "", "#/buypal");
					window.location = "/user/MyOrder#sureToPay" + res.id;
				});
			} else {
				$location.path("/buyerRegister");
			}
		};

	}]);

