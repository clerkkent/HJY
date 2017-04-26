angular.module('HJY').controller("funcpage", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}]);
angular.module('HJY').controller("func_help", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    login_logic.deal_help();
    $http.get("mock/func/help.json").then(function(data) {
        $scope.help_information = data.data;
    })
}]);
angular.module('HJY').controller("land_main", ["$scope", "$state", "login_logic", "$http", "get_type", "_", "land_main", "$ionicPopup", "$interval", "land", function($scope, $state, login_logic, $http, get_type, _, land_main, $ionicPopup, $interval, land) {
    $scope.text = "确认套餐";
    $scope.pay_text = "确认支付"
    $scope.main_title = "每月充值";
    $scope.pay_title = "充油成功通知手机号";
    $scope.price_selected = 0;
    $scope.type_selected = 0;
    $scope.type = get_type["type"];
    $scope.type_info = get_type["type"][0]; //页面预加载前获取套餐信息。
    $scope.unit_price = get_type["price"][0];
    $scope.info_send = { username: "", channel: "renrenche", sms_key: "", sms_code: "", oil_card: "", product_id: "", money: "", pay_channel: "ali_pay" }
    $scope.reduce_price = ($scope.unit_price * (1 - $scope.type_info.disn) * $scope.type_info.t).toFixed(1);
    $scope.normal_price = $scope.unit_price * $scope.type_info["t"];
    $scope.final_price = ($scope.unit_price * $scope.type_info.disn * $scope.type_info.t).toFixed(1);
    $scope.info_send.product_id = $scope.type_info["product_id"];
    $scope.belong = $scope.type_info["belong"];
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $(".land_main section li").eq(0).addClass("is_sellect");
        })
        //可以写两个input并根据belong来渲染
    $scope.select_type = function(x, index) {
        $scope.type_info = x; //页面预加载前获取套餐信息。
        $scope.type_selected = index;
        $(".land_main section li").removeClass("is_sellect");
        $(".land_main section li").eq(index).addClass("is_sellect");
        $scope.reduce_price = $scope.reduce();
        $scope.final_price = $scope.price_final();
        $scope.info_send.product_id = $scope.type_info.product_id;
        $scope.belong = $scope.type_info.belong;
        $scope.normal_price = $scope.price_normal()
    }
    $scope.add = function() {
        if ($scope.price_selected < get_type["price"].length - 1) {
            $scope.price_selected = $scope.price_selected + 1;
            $scope.unit_price = get_type["price"][$scope.price_selected];
            $scope.reduce_price = $scope.reduce();
            $scope.final_price = $scope.price_final();
            $scope.normal_price = $scope.price_normal()
        }
    }
    $scope.sub = function() {
        if ($scope.price_selected > 0) {
            $scope.price_selected = $scope.price_selected - 1;
            $scope.unit_price = get_type["price"][$scope.price_selected];
            $scope.reduce_price = $scope.reduce();
            $scope.final_price = $scope.price_final();
            $scope.normal_price = $scope.price_normal()
        }
    }
    $scope.price_final = function() {
        var d = $scope.type_info.disn;
        var t = $scope.type_info.t;
        var u = $scope.unit_price;
        return (d * t * u).toFixed(1);
    }
    $scope.price_normal = function() {

        var t = $scope.type_info.t;
        var u = $scope.unit_price;
        return t * u;
    }
    $scope.reduce = function() {
        var d = $scope.type_info.disn;
        var t = $scope.type_info.t;
        var u = $scope.unit_price;
        return ((1 - d) * t * u).toFixed(1);
    }
    $scope.go_help = function() {
        $state.go("funcpage.help")
    }
    $scope.go_order = function() {
            $state.go("funcpage.order_list")
        }
        //以上为价格套餐选择处理逻辑
        //
        //
        //////////////////////////
    $scope.pro_info;
    $scope.info = { card: "", phone: "", scode: "", agree: true };

    sessionStorage.setItem("belong", $scope.belong);
    $scope.second = "获取验证码";
    $scope.login_flag = false; //登录状态



    $scope.login_state_confirm = function() { //登录状态确认函数,用户操作前调用
        var list = {
            "jsonrpc": "2.0",
            "method": "loginStatus",
            "params": [],
            "id": 1
        }
        login_logic.submit(list).then(function(data) {
            if (data.result.status == 1) {
                $scope.login_flag = true;
            } else {
                $scope.login_flag = false;
            }
        })
        return $scope.login_flag;
    }
    $scope.check_send = function() {
            if ($scope.belong == 1) {
                $scope.test = /^100011\d{13}$/;
            } else if ($scope.belong == 2) {
                $scope.test = /^9\d{15}$/;
            }
            if ($scope.test.test($scope.info.card.replace(/\s/g, ""))) {
                $scope.card_valid = true;
                $scope.login_state_confirm();
                $scope.cardinfo = { company: "", name: "" }
                var list = {
                    "jsonrpc": "2.0",
                    "method": "getCardInfoByNumber",
                    "params": [{
                        "user_id": "5",
                        "oil_card": $scope.info.card.replace(/\s/g, "")
                    }],
                    "id": 1
                }
                $scope.card_info_get = true;
                var land_data = land.submit(list);
                land_data.then(function(data) {
                    if (data.result != undefined) { //带来第一个页面初始数据
                        $scope.cardinfo.name = data["result"]["username"];
                        $scope.cardinfo.company = data["result"]["name"];
                        $scope.card_flag = data["result"]["card_isDiscount"];
                        console.log(data)
                        $scope.card = $scope.info.card.replace(/\s/g, "");
                        $scope.pay_unit_price = $scope.unit_price; //保留首个页面的初始数据，保证首个页面数据不被初始化
                        $scope.pay_type_info = $scope.type_info.t;
                        $scope.price = $scope.final_price;
                        if ($scope.login_flag) {
                            $state.go("funcpage.land_main.pay_login.login_on");
                            $scope.info = sessionStorage.getItem("phone")
                        } else {
                            $state.go("funcpage.land_main.pay_login");
                        }
                    } else { //错误信息弹窗
                        $ionicPopup.alert({
                            title: '提示',
                            template: data["error"]["message"],
                            okText: '嗯！知道了', // String
                            okType: 'button-energized',
                        });
                    }
                }, function() {
                    $ionicPopup.alert({
                        title: '提示',
                        template: "网络异常",
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    });
                })

            } else if ($scope.info.card == "") {
                $ionicPopup.alert({
                    title: '提示',
                    template: "卡号不能为空",
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: "暂不支持此类型油卡",
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
            }
        }
        ////
        ///////////
        ////////////////登陆部分逻辑
}]);
angular.module('HJY').controller("pay_login_info", ["$scope", "$state", "login_logic", "$http", "get_type", "_", "land_main", "$ionicPopup", "$interval", "land", function($scope, $state, login_logic, $http, get_type, _, land_main, $ionicPopup, $interval, land) {
     $scope.login_pay_on = function() {
                var mytime = new Date();
                var t = mytime.getTime();
                var params = {
                    "oil_card": $scope.info.card.replace(/\s/g, ""),
                    "product_id": $scope.info_send.product_id,
                    "time": t,
                    "money": $scope.normal_price,
                    "uuid": data.result.packetsUuid
                }
                var sign = login_logic.md(params);
                if ($scope.login_state_confirm()) {
                    console.log(dsada)
                }
                var list = {
                    "jsonrpc": "2.0",
                    "method": "order",
                    "params": [{
                        "oil_card": $scope.info.card.replace(/\s/g, ""),
                        "product_id": $scope.info_send.product_id,
                        "time": t,
                        "sign": sign,
                        "money": "200",
                        "uuid": data.result.packetsUuid
                    }],
                    "id": 1
                }
                land.pay(list)
            } 
}])
angular.module('HJY').controller("pay_login", ["$scope", "$state", "login_logic", "$http", "get_type", "_", "land_main", "$ionicPopup", "$interval", "land", function($scope, $state, login_logic, $http, get_type, _, land_main, $ionicPopup, $interval, land) {
    $scope.agreet = false;
    $scope.ch = sessionStorage.getItem("ch");
    $scope.toggleCustom = function() { //注册协议限制
        if ($scope.agreet == true) {
            $(".main_content .land_main .remind .agree").removeClass("selected")
            $scope.agreet = false;
        } else {
            $(".main_content .land_main .remind .agree").addClass("selected")
            $scope.agreet = true;
            $scope.notice = "同意《会加油服务协议》";
        }
    }
    $scope.scode_get = function() { //获取验证码
            var list = {
                "jsonrpc": "2.0",
                "method": "messageAuthForChannel",
                "params": [{
                    "phone": $scope.info.phone.replace(/\s/g, "") //手机号

                }],
                "id": 1
            }
            var promise_scode = login_logic.submit(list);

            promise_scode.then(function(data) {
                if (data.result != undefined) {
                    $scope.phonet = false;
                    $scope.phone_flag = data["result"]["is_discount"];
                    // $scope.info_send = { username: "", channel: "renrenche", sms_key: "", sms_code: "", oil_card: "", product_id: "" }
                    $scope.info_send.sms_key = data["result"]["data"]["key"]; //短信验证key
                    if ($scope.card_flag == 1 && $scope.phone_flag == 1) {
                        $scope.price = ($scope.price - 10).toFixed(1)
                        $scope.pay_text = "支付" + $scope.price + "元";
                    } else {
                        $scope.pay_text = "支付" + $scope.price + "元";
                    }

                    var a = 60;
                    $scope.second = a + "s"
                    $scope.timeout = true;
                    var timeout = $interval(function() {
                        if (a <= 0) {
                            $scope.second = "获取验证码"
                            $scope.timeout = false;
                            a = 60;
                            $interval.cancel(timeout)
                        } else {
                            a--;
                            $scope.second = a + "s"
                        }
                    }, 1000);
                } else { //错误信息弹窗
                    $ionicPopup.alert({
                        title: '提示',
                        template: data["error"]["message"],
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    });
                }

            }, function() {
                $ionicPopup.alert({
                    title: '提示',
                    template: "网络异常",
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
            })
        }
        //////////////以上为发送验证码过程
        ////////////
        ////////////
    $scope.login_pay = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "signinForChannel",
            "params": [{
                "username": $scope.info.phone.replace(/\s/g, ""), //手机
                "channel": $scope.ch, //渠道
                "sms_key": $scope.info_send.sms_key, //验证码的key
                "sms_code": $scope.info.scode, //验证码
                "card_num": $scope.info.card.replace(/\s/g, "")
            }],
            "id": 1
        }
        var login = login_logic.submit(list);
        login.then(function(data) {
            if (data.result != undefined) {
                sessionStorage.setItem("phone", $scope.info.phone.replace(/\s/g, ""));
                var mytime = new Date();
                var t = mytime.getTime();
                var params = {
                    "oil_card": $scope.info.card.replace(/\s/g, ""),
                    "product_id": $scope.info_send.product_id,
                    "time": t,
                    "money": $scope.normal_price,
                    "uuid": data.result.packetsUuid
                }
                var sign = login_logic.md(params);
                if ($scope.login_state_confirm()) {
                    console.log(dsada)
                }
                var list = {
                    "jsonrpc": "2.0",
                    "method": "order",
                    "params": [{
                        "oil_card": $scope.info.card.replace(/\s/g, ""),
                        "product_id": $scope.info_send.product_id,
                        "time": t,
                        "sign": sign,
                        "money": "200",
                        "uuid": data.result.packetsUuid
                    }],
                    "id": 1
                }
                land.pay(list)
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: data["error"]["message"],
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
            }
        }, function() {
            $ionicPopup.alert({
                title: '提示',
                template: "登录异常",
                okText: '嗯！知道了', // String
                okType: 'button-energized',
            });
        })
    }
}])
angular.module('HJY').controller("order_list", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.phone = "1231111111";
}]);
angular.module('HJY').controller("order_details", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.phone = "1231111111";
}]);
angular.module('HJY').controller("not_login", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.phone = "1231111111";
}]);