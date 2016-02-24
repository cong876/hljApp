
angular.module('hljApp')
	.directive('yeyePrevent', yeyePrevent)																									//阻止点击事件的冒泡，防止手机端点击时出现闪的情况
	.directive('yeyeBg', yeyeBg)																														//与square配合实现方图的输出，单独使用的话设置背景图片
	.directive('yeyePrice', yeyePrice)																											//统一将价格精确到小数点后两位
  .directive('yeyeNumber', yeyeNumber)
  //.directive('yeyeCheck', yeyeCheck)																											//检测input元素是否符合ngPattern中的正则表达式，不符合呈现红框
	.directive('yeyeVerify', ['yeyeFn', 'hlj_url', yeyeVerify])															//检验验证码
	.directive('yeyeCountdown', ['yeyeFn', 'hlj_url', 'isCountdown', yeyeCountdown])				//倒计时函数，自动解析倒计时时长和倒计时显示的文字
  .directive('yeyeTemplate', ['yeyeFn', yeyeTemplate]);

function getFieldValue(scope, key, callback) {                                            //获取key所在的scope，并执行回调
  if (scope[key]) {
    return callback(scope.$parent);
  }  else if (scope.$parent) {
    return getFieldValue(scope.$parent, key, callback);
  } else {
    console.log('no this key in all scope');
    return false;
  }
}

function yeyePrevent() {
	return {
    priority: 0,
		link: function($scope, $element, attrs) {
			$element.on('click', function(event) {
				event.preventDefault();
				event.stopImmediatePropagation();
				if (attrs.ngClick) {
					$scope.$apply(attrs.ngClick);
				}
			});
		}
	}
}

function yeyeBg() {
	return {
		compile: function(element, attrs) {
			return function($scope, $element, $attr) {
				var isPicUrl = /\.jpg$|\.png$|\.webp$|\.gif$/;																	//枚举图片url后缀
				if ($attr.yeyeBg.match(isPicUrl)) {
					$element.css({'background-image': 'url(' + $attr.yeyeBg + ')'});							//当值为图片的url时
				} else {
					$scope.$watchCollection($attr.yeyeBg, function(collection){										//监控scope中变量的变化
						$element.css({'background-image': 'url(' + collection + ')'});							//当值为url的变量时
					})
				}
			}
		}
	}
}

function yeyePrice() {
	return {
		template: '￥{{yeyePrice}}',
    compile: function(element, attrs) {
      return function($scope, $element, $attr) {
        $scope.$watchCollection($attr.yeyePrice, function(collection) {
          $scope.yeyePrice = parseFloat(collection).toFixed(2);
        });
      }
    }
	}
}

function yeyeNumber() {
  return {
    priority: 0,
    scope: {
      yeyeNumber: '='
    },
    link: function($scope, $element, attrs) {
      $element.on('click', function(event) {
        var method = attrs.yeyeNumberMethod === "add" ? 1 : -1;
        if ($scope.yeyeNumber + method > 0) {
          $scope.$apply(function(a) {
              a.yeyeNumber += method;
              if (attrs.yeyeTotal) {
                getFieldValue(a, attrs.yeyeTotal, function(t) {
                  t[attrs.yeyeTotal] += method;
                });
              }
          });
        }
      });
    }
  }
}

//function yeyeCheck() {
//	return {
//		link: function($scope, $element, attrs) {
//      console.log('yeye-check');
//			$element.on('blur', function(event) {
//				event.preventDefault();
//				this.value = this.value.trim(this.value);
//				if (!attrs.ngPattern.test(this.value)) {
//					$element.addClass('error');
//				} else {
//					$element.removeClass('error');
//				}
//			});
//			$element.on('focus', function(event) {
//				event.preventDefault();
//				if ($element.hasClass('error')) {
//					$element.removeClass('error');
//				}
//			});
//		}
//	}
//}

function yeyeVerify(yeyeFn, hlj_url) {
  return {
    require: 'ngModel',
    scope: {
      mobile: '=yeyeVerify',
      zone: '=yeyeZone',
      code: '=ngModel'
    },
    link: function($scope, $element, attrs, c) {
      $element.on('change', function(event) {
        event.preventDefault();
        c.$setValidity("yeyeVerify", undefined);
        var data = {
          zone: yeyeFn.trim($scope.zone),
          mobile: yeyeFn.trim($scope.mobile),
          verifyCode: yeyeFn.trim($scope.code)
        };
        yeyeFn.yeyeReq(false, false, 'GET', hlj_url.verifyCode, data)
          .then(function(res) {
            if (res.status_code == 200) {
              c.$setValidity("yeyeVerify", true);
            } else {
              c.$setValidity("yeyeVerify", false);
              alert(res.message);
            }
          });
      });
    }
  }
}

function yeyeCountdown(yeyeFn, hlj_url, isCountdown) {
	return {
		scope: {
			isDisabled: '=ngDisabled',
			mobile: '=ngModel',
			zone: '=yeyeZone'
		},
		link: function($scope, $element, attrs) {

      $scope.$on("$destroy", function(event) {
        isCountdown.register = false;
      });

			$element.on('click', function(event) {

				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();

				if (!this.disabled && !isCountdown.register) {
					isCountdown.register = true;

					var that = angular.element(this);
					var container = this;
					var countdown;
					var textOld = that.text();
					var countdownText = attrs.yeyeCountdown;

					var sendFailed = function(mes) {
						alert(mes);
						clearTimeout(resetCountdown);
						isCountdown.register = false;
						that.attr({"disabled": false});
						that.removeAttr("disabled");
					};

					that.attr({"disabled": "disabled"});

					var resetCountdown = setTimeout(function() {
						isCountdown.register = false;
					}, parseInt(countdownText.match(/[0-9]{1,}/)[0]*1000));

					if (attrs.ngModel) {
						var data = {
							mobile: yeyeFn.trim($scope.mobile),
							zone: yeyeFn.trim($scope.zone)
						};
						yeyeFn.yeyeReq(false, false, 'GET', hlj_url.checkMobile, {mobile: data.mobile})
						.then(
							function(res) {
								if (res.status_code == 200) {
									return yeyeFn.yeyeReq(false, false, 'GET', hlj_url.getVerifyCode, data);
								} else {
									sendFailed(res.message);
									return false;
								}
							}
						)
						.then(
							function(res) {
								if(res){
									if (res.status_code == 200) {
										countdownStart(container, that, countdownText, textOld, countdown, $scope);
									} else {
										sendFailed(res.message);
									}
								}
							},function(err) {
								sendFailed(err);
							}
						)
					}
				}
			});
		}
	}
}

function countdownStart(container, element, countdownText, textOld, countdown, $scope) {
	element.attr({"disabled": "disabled"});
	var countdownTime = parseInt(countdownText.match(/[0-9]{1,}/)[0]);

	countdownText = countdownText.split(/[0-9]{1,}/);
	element.css({"width": getComputedStyle(container).width});

	element.text(countdownText[0] + countdownTime + countdownText[1]);
	countdown = setInterval(function() {
		if (countdownTime>0) {
			countdownTime -= 1;
			element.text(countdownText[0] + countdownTime + countdownText[1]);
		} else {
			if (!$scope.isDisabled) {
				element.attr({"disabled": false});
				element.removeAttr("disabled");
			}
			countdownEnd(element, textOld, countdown);
		}
	}, 1000);
}

function countdownEnd(element, textOld, countdown) {
	element.text(textOld);
	clearInterval(countdown);
}

function yeyeTemplate() {
  return {
    scope:{
      template: '=yeyeTemplate'
    },
    link: function($scope, $element, attrs) {
      $element.append($scope.template);
    }
  }
}

