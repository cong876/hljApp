/**
 * including order and address
 * maintain the data from back end
 */

angular.module('hljApp')
  .service('mainService', ['$rootScope', '$location', 'yeyeFn', 'hlj_url', '$timeout', '$interval', function($rootScope, $location, yeyeFn, hlj_url, $timeout, $interval) {

    function ListData(url, state, state_name) {
      this.url = url;
      this.list = null;
      this.state = state;
      this.state_name = state_name;
      this.changed = false;
      this.pendding = false;
    }

    ListData.prototype.refresh = function(callback, isProcess) {
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
          $timeout(function(){
          that.list = res.data;
          that.updateAt = new Date();
          that.changed = false;
          that.pendding = false;
          callback(that);
          }, 1000);
        });
    };

    var that = this;

    var YeOrders = {
      waitOffer: new ListData(hlj_url.ordersWaitOffer, 0, "待报价"),
      waitPay: new ListData(hlj_url.ordersWaitPay, 201, "待付款"),
      waitDelivery: new ListData(hlj_url.ordersWaitDelivery, 501, "待发货"),                                            //后台状态有501,521,541
      delivered: new ListData(hlj_url.ordersDelivered, 601, "已发货"),
      completed: new ListData(hlj_url.ordersCompleted, 301, "已完成")
    };

    var YeAddresses = new ListData("");

    this.data = {
      orders: YeOrders,
      order: {},
      addresses: YeAddresses
    };

    this.refreshData = function(data) {
      var dataRefresh = that.data[data] || that.data.orders[data];
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

    this.changeTab = function(newUrl) {
      $location.path(newUrl).replace();
    };

  }]);
