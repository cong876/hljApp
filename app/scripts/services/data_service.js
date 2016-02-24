/**
 * store the data from back end, reduce the unnecessary request
 */

angular.module('hljApp')
  .service('dataService', ['$rootScope', '$interval', 'yeyeFn', 'hlj_url',
    function($rootScope, $interval, yeyeFn, hlj_url) {

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
        if (this.pendding) {                                              //如果这个数据在加载中,就不发请求
          $rootScope.showLoading = true;
          var requestTimes = 0;
          var checkDone = $interval(function(){                           //0.1s每次检测数据是否加载完成
            requestTimes++;
            if (!this.pending || requestTimes>10) {
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


      var YeOrders = {
        waitOffer: new ListData(hlj_url.orders + "?state=waitOffer", 0, "待报价"),
        waitPay: new ListData(hlj_url.orders + "?state=waitPay", 201, "待付款"),
        waitDelivery: new ListData(hlj_url.orders + "?state=waitDelivery", 501, "待发货"),     //backend order states:501,521,541
        delivered: new ListData(hlj_url.orders + "?state=delivered", 601, "已发货"),
        completed: new ListData(hlj_url.orders + "?state=completed", 301, "已完成")
      };
      var YeAddresses = new ListData(hlj_url.getAddresses);


      this.data = {
        orders: YeOrders,
        orderDetail: {},
        addresses: YeAddresses
      };

      var that = this;

      this.refreshData = function(data) {                                         //set data state to need refresh(not refresh immediate), next use refresh
        var dataRefresh = that.data[data] || that.data.orders[data] || that.data.orderDetail[data];
        if (dataRefresh.changed === false) {
          dataRefresh.changed = true;
        } else if (dataRefresh.changed === undefined) {                           //while data is orderDetail, refresh all orders in orderDetail
          var key;
          for (key in dataRefresh) {
            if (dataRefresh[key].changed === false) {
              dataRefresh[key].changed = true;
            }
          }
        }
      };

      this.newData = function(url, state, state_name) {
        return new ListData(url, state, state_name)
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

    }]);
