'use strict';
/*
 * using weixin api
*/

angular.module('hljApp')
	.service('wxService', function() {

		var syncUpload = function(localIds, item) {
	    var localId = localIds[localIds.length-1];
	    // wx.uploadImage({
      //   localId: localId,
      //   isShowProgressTips: 1,
      //   success: function (res) {
      //   	localIds.pop();
      //     var serverId = res.serverId;
      //     item.pic_urls.push(res.serverId);
      //     if(localIds.length > 0){
      //         syncUpload(localIds, item);
      //     }
      //   }
	    // });
		};

		this.close = function() {
      console.log('close by weixin');
			// wx.closeWindow();
		};

		this.uploadImage = function(item, $scope) {
      console.log('uploadImage by weixin');
			// wx.chooseImage({
			// 	count: 6-item.pic_urls.length,
		  //   sizeType: ['original', 'compressed'],
		  //   sourceType: ['album', 'camera'],
		  //   success: function(res){
		  //   	var localIds = res.localIds;
		  //   	item.localId = item.localId.concat(localIds);
		  //   	$scope.$apply();
		  //   	syncUpload(localIds, item);
		  //   }
			// })
		};

		this.previewImage = function(index, urls) {
      console.log('previewImage by weixin', index, urls);
			// wx.previewImage({
			// 	current: item.localId[index],
			// 	urls: urls
			// })
		}

	});
