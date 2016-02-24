/**
 * Controllers for user admin and it's children
 * Including
 */

angular.module('hljApp')
  .controller('buyerCtrl', ['$scope', 'yeyeFn', 'dataService', '$rootScope',
    function($scope, yeyeFn, dataService, $rootScope) {

      $rootScope.user = {};
      angular.extend($rootScope.user, yeyeFn.getUser());

      dataService.refreshData('waitOffer');

      dataService.data.addresses.refresh(function() {}, true);
      dataService.data.orders.waitPay.refresh(function(that) {
        $scope.waitPayNumber = that.list.length;
      }, true);

    }])

  .controller('buyerProfileCtrl', ['$scope', 'buyerService', 'modalService',
    function($scope, buyerService, modalService) {

      $scope.showEdit = function(type, info) {
        modalService.openOther();
        $scope[type] = info;
        $scope[type + 'M'] = true;
      };

      $scope.close = function(type) {
        modalService.closeOther();
        $scope[type] = false;
      };

      $scope.updateMobile = buyerService.updateMobile;
      $scope.updateEmail = buyerService.updateEmail;

    }])

  .controller('addressChooseCtrl', ['$scope', 'buyerService', 'dataService',
    function($scope, buyerService, dataService) {

      $scope.state = "choose";
      $scope.dealer = "管理收货地址";
      $scope.chose = buyerService.chose;

      $scope.checkAddress = buyerService.chooseAddress;
      $scope.dealAddress = buyerService.toManagementAddress;

      dataService.useData(function(dataShow) {
        $scope.addresses = dataShow;                                          //use array in object to ensure two way data binding
      }, "addresses");

    }])

  .controller('addressManagementCtrl', ['$scope', 'buyerService', 'dataService',
    function($scope, buyerService, dataService) {

      $scope.state = "management";
      $scope.dealer = "添加新地址";

      $scope.checkAddress = buyerService.editAddress;
      $scope.dealAddress = buyerService.createAddress;
      $scope.deleteAddress = buyerService.deleteAddress;

      dataService.useData(function(dataShow) {
        $scope.addresses = dataShow;
      }, "addresses");

    }])

  .controller('addressDetailCtrl', ['$scope', 'buyerService', '$stateParams',
    function($scope, buyerService, $stateParams) {

      var noSelected = {code: 0, name: "--请选择--", postcode: ""};
      var isEdit = {cityReady: false, countyReady: false};

      $scope.areaList = buyerService.getAreaList($stateParams.addressId);
      $scope.address = buyerService.getAddress($stateParams.addressId);

      $scope.changeDefault = function() {
        $scope.address.is_default == 0 ? $scope.address.is_default = 1 : $scope.address.is_default = 0;
      };

      $scope.saveAddress = buyerService.saveAddress;

      $scope.$watch('address.province', function(p) {                       //cascading drop-down cities
        if (isEdit.cityReady) {
          $scope.areaList.cities = [noSelected];
          $scope.areaList.counties = [noSelected];
          $scope.address.city = noSelected;
          $scope.address.county = noSelected;
        }
        if (p.code === 0) {
          return false;
        }
        buyerService.getCities(p, function(res) {
          $scope.areaList.cities = [noSelected].concat(res.data);
          if (!isEdit.cityReady) isEdit.cityReady = true;
        })
      });

      $scope.$watch('address.city', function(c) {                           //cascading drop-down counties
        if (isEdit.countyReady) {
          $scope.areaList.counties = [noSelected];
          $scope.county = noSelected;
        }
        if (c.code === 0) {
          return false;
        }
        buyerService.getCounties(c, function(res) {
          $scope.areaList.counties = [noSelected].concat(res.data);
          if (!isEdit.countyReady) isEdit.countyReady = true;
        })
      });

      $scope.$watch('address.county', function(c) {
        $scope.address.postcode = c.postcode;
      })

    }])

  .controller('orderCtrl', ['$scope', 'buyerService',
    function($scope, buyerService) {

      $scope.deleteOrder = buyerService.deleteOrder;
      $scope.callOperator = buyerService.callOperator;
      $scope.sureToComplete = buyerService.sureToComplete;

    }])

  .controller('orderListCtrl', ['$scope', 'buyerService', 'dataService', '$location', '$stateParams',
    function($scope, buyerService, dataService, $location, $stateParams) {

      if ($stateParams.state === 'waitPay') {                                 //每次进入待付款都要取得最新数据
        dataService.refreshData('waitPay');
      }

      dataService.useData(function(dataShow) {
        $scope.orders = dataShow;
      }, "orders", $stateParams.state);

      $scope.payNow = buyerService.payNow;

    }])

  .controller('orderDetailCtrl', ['$scope', '$stateParams', 'buyerService',
    function($scope, $stateParams, buyerService) {

      buyerService.checkOrder($stateParams.orderNumber, function(data) {      //获取订单详情
        $scope.order = data.list;
      });

      $scope.chose = buyerService.chose;                                      //用于付款页地址选择
      $scope.toChooseAddress = buyerService.toChooseAddress;

    }])

  .controller('orderItemDetailCtrl', ['$scope', '$stateParams', 'wxService',
    function($scope, $stateParams, wxService) {

      $scope.index = $stateParams.index;
      $scope.previewImage = wxService.previewImage;

    }])
  .controller('logisticsCtrl', ['$scope',
    function($scope){
      console.log('logistics');
    }]);
