/**
 * including order and address
 * maintain the data from back end
 */

angular.module('hljApp')
  .service('buyerService', ['$rootScope', '$location', 'yeyeFn', 'hlj_url', 'dataService', 'modalService',
    function($rootScope, $location, yeyeFn, hlj_url, dataService, modalService) {

      var that = this;
      var noSelected = {code: 0, name: "--请选择--", postcode: ""};

      this.getAreaList = function(id) {
         return {
          provinces: [
            noSelected,
            {code: 101, name: "北京市"},
            {code: 102, name: "黑龙江省"},
            {code: 103, name: "吉林省"},
            {code: 104, name: "辽宁省"}
          ],
          cities: id > -1 ? [noSelected, dataService.data.addresses.list[id].city] : [noSelected],
          counties: id > -1 ?[noSelected, dataService.data.addresses.list[id].city] : [noSelected]
        }
      };

      this.getAddress = function(id) {
        var addressIndex = {
          receiving_addresses_id: "",
          receiver_name: "",
          receiver_mobile: "",
          province: noSelected,
          city: noSelected,
          county: noSelected,
          street_address: "",
          postcode: "",
          is_default: 1
        };
        if (id > -1) angular.extend(addressIndex, dataService.data.addresses.list[id]);
        return addressIndex;
      };

      this.getCities = function(province, callback) {
        var data = {province: province.code};
        yeyeFn.yeyeReq(false, false, "GET", hlj_url.getCities, data)
          .then(function(res) {
            callback(res);
          })
      };

      this.getCounties = function(city, callback) {
        var data = {city: city.code};
        yeyeFn.yeyeReq(false, false, "GET", hlj_url.getCounties, data)
          .then(function(res) {
            callback(res);
          })
      };

      this.toManagementAddress = function() {
        $location.url('/buyer/addressManagement?fromChoose=true').replace();
      };

      this.createAddress = function() {
        $location.path('/buyer/addressDetail/-1');
      };

      this.editAddress = function(index) {
        $location.path('/buyer/addressDetail/' + index);
      };

      this.saveAddress = function(address, id) {
        var url = id > -1 ? hlj_url.updateAddress : hlj_url.createAddress;

        yeyeFn.yeyeReq(true, true, 'POST', url, address)
          .then(function(res) {
            console.log(res, address);                                                  //res 返回receiving_addresses_id
            if (address.is_default == 1) {
              angular.forEach(dataService.data.addresses.list, function(index) {
                if (index.is_default == 1) index.is_default = 0;
              })
            } else if (id > -1 && dataService.data.addresses.list[id].is_default == 1) {       //must have a default address
              address.is_default = 1;
            }

            if (id > -1) {
              dataService.data.addresses.list[id] = address;
            } else {
              address.receiving_addresses_id = res.receiving_addresses_id;
              dataService.data.addresses.list.push(address);
            }

            if ($location.search().fromChoose) {
              that.chooseAddress(id);
            }

            history.back();
            });
      };

      this.deleteAddress = function(address, id) {
        yeyeFn.yeyeReq(true, true, 'GET', hlj_url.deleteAddress, {receiving_addresses_id: address.receiving_addresses_id})
          .then(function(res) {
            if (res.status_code == 200) {
              if (address.is_default == 1) {
                dataService.data.addresses.list[0].is_default = 1;
              }
              dataService.data.addresses.list.splice(id, 1);
            } else {
              alert(res.message);
            }
            console.log(res);
          })
      };

      this.chose = {};                                                                  //用于选中地址等操作

      this.setDefaultAddressChose = function() {
        angular.forEach(dataService.data.addresses.list, function(address) {
          if (address.is_default == 1) {
            that.chose.address = address;
            return that.chose;
          }
        });
        return that.chose;
      };

      this.toChooseAddress = function() {
        if (!dataService.data.addresses.list || dataService.data.addresses.list.length === 0) {
          $location.path('/buyer/addressDetail/-1');
        } else {
          $location.path('/buyer/addressChoose');
        }
      };

      this.chooseAddress = function(index) {
        history.back();
        that.chose.address = dataService.data.addresses.list[index == -1 ? dataService.data.addresses.list.length-1 : index];
      };


      this.checkOrder = function(id, callback) {
        if (dataService.data.orderDetail[id]) {
          if ($location.path().match("waitPay")) {                                      //待付款列表下商品详情每一次都要重新加载
            dataService.refreshData(id);
          }
          dataService.useData(callback, 'orderDetail', id);
        } else {
          dataService.data.orderDetail[id] = dataService.newData(hlj_url.orderDetail + '?order_number=' + id);
          that.checkOrder(id, callback);
        }
      };

      function removeOrderNeedBack() {
        if ($location.path().split("/").length>4) {
          history.back();
        }
      }

      this.payNow = function(order_number) {
        console.log(order_number);
        that.setDefaultAddressChose();
        $location.path('/buyer/orders/waitPay/pay/' + order_number);
      };

      this.deleteOrder = function(order_number) {
        modalService.open("<p>是否取消该订单?</p>", function(){
          yeyeFn.yeyeReq(true, true, 'GET', hlj_url.deleteOrder, {order_number: order_number})
            .then(function(res) {
              var orderState = $location.path().split('/')[3];                                  //从url中获得订单状态
              if (res.status_code == 200) {
                modalService.close();
                angular.forEach(dataService.data.orders[orderState].list, function(index, i) {
                  if (index.order_number == order_number) {
                    dataService.data.orders[orderState].list.splice(i, 1);
                    return false;
                  }
                });
                removeOrderNeedBack();
              } else {
                alert(res.message);
              }
            });
        });
      };

      this.callOperator = function(operatorMobile) {
        console.log(operatorMobile);
        modalService.open("<p>拨打客服电话" + operatorMobile +  "</p><p>(客服工作时间:9:00-18:00)</p>", function() {
          window.location.href = "tel:" + operatorMobile;
        })
      };

      this.sureToComplete = function(order_number) {
        modalService.open("<p>确认已收货?</p>", function() {
          yeyeFn.yeyeReq(true, true, 'GET', hlj_url.sureToComplete, {order_number: order_number})
            .then(function(res) {
              var orderState = $location.path().split('/')[3];                                  //从url中获得订单状态
              if (res.status_code == 200) {
                modalService.close();
                dataService.refreshData(order_number);
                angular.forEach(dataService.data.orders[orderState].list, function(index, i) {
                  if (index.order_number == order_number) {
                    dataService.data.orders[orderState].list.splice(i, 1);
                    dataService.refreshData('completed');                                              //完成后刷新已完成列表
                    return false;
                  }
                });
                removeOrderNeedBack();
              } else {
                alert(res.message);
              }
            });
        })
      };

      this.updateMobile = function(mobile, callback) {
        yeyeFn.yeyeReq(true, true, 'POST', hlj_url.updateMobile, {mobile: mobile})
          .then(function(res) {
            yeyeFn.updateUser({mobile: mobile});
            $rootScope.user.mobile = mobile;
            callback('mobileEditM');
          })
      };

      this.updateEmail = function(email, callback) {
        if (email != $rootScope.user.email) {                                           //未修改地址时,不用发请求
          yeyeFn.yeyeReq(true, true, 'POST', hlj_url.updateEmail, {email: email})
            .then(function(res) {
              yeyeFn.updateUser({email: email});
              $rootScope.user.email = email;
              callback('emailEditM');
            })
        } else {
          callback('emailEditM');
        }
      }

  }]);
