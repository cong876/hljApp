/**
 * including order and address
 * maintain the data from back end
 */

angular.module('hljApp')
  .service('buyerService', ['$rootScope', '$location', 'yeyeFn', 'hlj_url', '$timeout', '$interval', 'modalService',
    function($rootScope, $location, yeyeFn, hlj_url, $timeout, $interval, modalService) {

      function ListData(url, state, state_name) {                         //the last two params are used to orders
        this.url = url;
        this.list = null;
        this.state = state;
        this.state_name = state_name;
        this.changed = false;
        this.pendding = false;
      }

      ListData.prototype.refresh = function(callback, isProcess) {        //require callback
        var that = this;
        if (this.pendding) {
          $rootScope.showLoading = true;
          var checkDone = $interval(function(){
            if (!this.pending) {
              callback(that);
              $interval.cancel(checkDone);
            }
          }, 100);
          return false;
        } else {
          this.pendding = true;
        }
        yeyeFn.yeyeReq(!isProcess, false, 'GET', that.url)
          .then(function(res) {
            console.log(res);
            that.list = res.data;
            that.updateAt = new Date();
            that.changed = false;
            that.pendding = false;
            callback(that);
          });
      };


      var that = this;

      var YeOrders = {
        waitOffer: new ListData(hlj_url.orders + "?state=waitOffer", 0, "待报价"),
        waitPay: new ListData(hlj_url.orders + "?state=waitPay", 201, "待付款"),
        waitDelivery: new ListData(hlj_url.orders + "?state=waitDelivery", 501, "待发货"),     //backend order states:501,521,541
        delivered: new ListData(hlj_url.orders + "?state=delivered", 601, "已发货"),
        completed: new ListData(hlj_url.orders + "?state=completed", 301, "已完成")
      };


      var YeAddresses = new ListData(hlj_url.getAddresses);
      var noSelected = {code: 0, name: "--请选择--", postcode: ""};



      this.data = {
        orders: YeOrders,
        orderDetail: {},
        addresses: YeAddresses
      };

      this.refreshData = function(data) {                                         //set data state to need refresh(not refresh immediate), next use refresh
        var dataRefresh = that.data[data] || that.data.orders[data] || that.data.orderDetail[data];
        if (dataRefresh.changed === false) {
          dataRefresh.changed = true;
        } else if (dataRefresh.changed === undefined) {
          var key;
          for (key in dataRefresh) {
            if (dataRefresh[key].changed === false) {
              dataRefresh[key].changed = true;
            }
          }
        }
      };

      /**
       * @param  {function}   callback
       * @param  {string}     dataUse such as orders, order, addresses
       * @param  {string}     dep if dataUse is orders, types for orders
       **/
      this.useData = function(callback, dataUse, dep) {
        var dataShow = dep ? that.data[dataUse][dep] : that.data[dataUse];
        if (dataShow.list && !dataShow.changed) {
          callback(dataShow);
        } else {
          dataShow.refresh(function() {
            $rootScope.showLoading = false;
            callback(dataShow);
          })
        }
      };

      this.getAreaList = function(id) {
        return {
          provinces: [
            noSelected,
            {code: 101, name: "北京市"},
            {code: 102, name: "黑龙江省"},
            {code: 103, name: "吉林省"},
            {code: 104, name: "辽宁省"}
          ],
          cities: id > -1 ? [noSelected, that.data.addresses.list[id].city] : [noSelected],
          counties: id > -1 ?[noSelected, that.data.addresses.list[id].city] : [noSelected]
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
        if (id > -1) angular.extend(addressIndex, that.data.addresses.list[id]);
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
              angular.forEach(that.data.addresses.list, function(index) {
                if (index.is_default == 1) index.is_default = 0;
              })
            } else if (id > -1 && that.data.addresses.list[id].is_default == 1) {       //must have a default address
              address.is_default = 1;
            }

            if (id > -1) {
              that.data.addresses.list[id] = address;
            } else {
              address.receiving_addresses_id = res.receiving_addresses_id;
              that.data.addresses.list.push(address);
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
                that.data.addresses.list[0].is_default = 1;
              }
              that.data.addresses.list.splice(id, 1);
            } else {
              alert(res.message);
            }
            console.log(res);
          })
      };

      this.chose = {};                                                                  //用于选中地址等操作

      this.setDefaultAddressChose = function() {
        angular.forEach(that.data.addresses.list, function(address) {
          if (address.is_default == 1) {
            that.chose.address = address;
            return that.chose;
          }
        });
        return that.chose;
      };

      this.toChooseAddress = function() {
        if (!that.data.addresses.list || that.data.addresses.list.length === 0) {
          $location.path('/buyer/addressDetail/-1');
        } else {
          $location.path('/buyer/addressChoose');
        }
      };

      this.chooseAddress = function(index) {
        history.back();
        that.chose.address = that.data.addresses.list[index == -1 ? that.data.addresses.list.length-1 : index];
      };


      this.checkOrder = function(id, callback) {
        if (that.data.orderDetail[id]) {
          if ($location.path().match("waitPay")) {                                      //待付款列表下商品详情每一次都要重新加载
            that.refreshData(id);
          }
          that.useData(callback, 'orderDetail', id);
        } else {
          that.data.orderDetail[id] = new ListData(hlj_url.orderDetail + '?order_number=' + id);
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
                angular.forEach(that.data.orders[orderState].list, function(index, i) {
                  if (index.order_number == order_number) {
                    that.data.orders[orderState].list.splice(i, 1);
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
                that.refreshData(order_number);
                angular.forEach(that.data.orders[orderState].list, function(index, i) {
                  if (index.order_number == order_number) {
                    that.data.orders[orderState].list.splice(i, 1);
                    that.refreshData('completed');                                              //完成后刷新已完成列表
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
