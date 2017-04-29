angular.module('HJY').controller("funcpage", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}]);
angular.module('HJY').controller("func_help", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    login_logic.deal_help();
    $http.get("mock/func/help.json").then(function(data) {
        $scope.help_information = data.data;
    })
}]);
angular.module('HJY').controller("land_main", ["$scope", "$state", "login_logic", "$http", "get_type", "get_price", "_", "land_main", "$ionicPopup", "$interval", "land", "$rootScope", function($scope, $state, login_logic, $http, get_type, get_price, _, land_main, $ionicPopup, $interval, land, $rootScope) {
    $scope.text = "确认套餐";
    $scope.pay_text = "确认支付"
    $scope.main_title = "每月充值";
    $scope.pay_title = "充油成功通知手机号";
    $scope.price_selected = 0;
    $scope.type_selected = 0;
    $scope.pre_type = [];
    $scope.pre_price = [];
    if (get_type.result != undefined) {
        var type = get_type["result"]["list"];
        for (i = 0; i < type.length; i++) {
            var dis = type[i].product_discount;
            var ty = {
                "discount": (dis * 10).toFixed(2),
                "disn": (dis * 1).toFixed(2),
                "t": type[i].product_time,
                "method": type[i].product_time + "期",
                "text": "/月*" + type[i].product_time + "个月套餐",
                "belong": type[i].belong,
                "product_id": type[i].id
            }
            $scope.pre_type.push(ty)
        }
    }
    if (get_price.result != undefined) {
        var ty = get_price["result"]["list"];
        for (i = 0; i < ty.length; i++) {
            var dis = Number(ty[i].name);
            $scope.pre_price.push(dis);
        }
    }
    $scope.type = $scope.pre_type;
    $scope.type_info = $scope.pre_type[$scope.pre_type.length - 1]; //页面预加载前获取套餐信息。
    $scope.unit_price = $scope.pre_price[0];
    $scope.info_send = { username: "", channel: "renrenche", sms_key: "", sms_code: "", oil_card: "", product_id: "", money: "", pay_channel: "ali_pay" }

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $(".land_main section li").eq(0).addClass("is_sellect");
            if ($scope.type_info != undefined) {
                $scope.reduce_price = ($scope.unit_price * (1 - $scope.type_info["disn"]) * $scope.type_info.t).toFixed(1);
                $scope.normal_price = $scope.unit_price * $scope.type_info["t"];
                $scope.final_price = ($scope.unit_price * $scope.type_info["disn"] * $scope.type_info.t).toFixed(1);
                $scope.info_send.product_id = $scope.type_info["product_id"];
                $scope.belong = $scope.type_info["belong"];
            }
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
        $scope.normal_price = $scope.price_normal();
        $scope.get_card_info = false;
    }
    $scope.add = function() {
        if ($scope.price_selected < $scope.pre_price.length - 1) {
            $scope.price_selected = $scope.price_selected + 1;
            $scope.unit_price = $scope.pre_price[$scope.price_selected];
            $scope.reduce_price = $scope.reduce();
            $scope.final_price = $scope.price_final();
            $scope.normal_price = $scope.price_normal();
            $scope.get_card_info = false;
        }
    }
    $scope.sub = function() {
        if ($scope.price_selected > 0) {
            $scope.price_selected = $scope.price_selected - 1;
            $scope.unit_price = $scope.pre_price[$scope.price_selected];
            $scope.reduce_price = $scope.reduce();
            $scope.final_price = $scope.price_final();
            $scope.normal_price = $scope.price_normal();
            $scope.get_card_info = false;
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
    setInterval($scope.login_state_confirm(), 2000)
    $scope.go_order = function() {
            if ($scope.login_flag) {
                $state.go("funcpage.order_list")
            } else {
                $state.go("funcpage.not_login")
            }
        }
        //以上为价格套餐选择处理逻辑
        //
        //
        //////////////////////////
    $scope.pro_info;
    $scope.info = { card: "", phone: "", scode: "", agree: true };

    sessionStorage.setItem("belong", $scope.belong);
    $scope.second = "获取验证码";



    $scope.cardinfo = { company: "", name: "" }
    $scope.get_card_info = false;
    $scope.check_send = function() {
            $scope.get_card_info = true;
            if ($scope.belong == 1) {
                $scope.test = /^100011\d{13}$/;
            } else if ($scope.belong == 2) {
                $scope.test = /^9\d{15}$/;
            }
            if (($scope.test).test($scope.info.card.replace(/\s/g, ""))) {
                $scope.card_valid = true;
                $scope.login_state_confirm();

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
                        $scope.card = $scope.info.card.replace(/\s/g, "");
                        $scope.pay_unit_price = $scope.unit_price; //保留首个页面的初始数据，保证首个页面数据不被初始化
                        $scope.pay_type_info = $scope.type_info.t;
                        $scope.price = $scope.final_price;
                        if ($scope.login_flag) {
                            localStorage.setItem("card", $scope.info.card.replace(/\s/g, ""));
                            localStorage.setItem("name", $scope.cardinfo.name);
                            localStorage.setItem("company", $scope.cardinfo.company);
                            localStorage.setItem("u_price", $scope.pay_unit_price);
                            localStorage.setItem("t", $scope.pay_type_info);
                            localStorage.setItem("pid", $scope.info_send.product_id);
                            localStorage.setItem("n_price", $scope.normal_price);
                            localStorage.setItem("f_price", $scope.final_price);
                            localStorage.setItem("u_price", $scope.unit_price);
                            $state.go("funcpage.land_main.login_on");
                        } else {
                            localStorage.setItem("card", $scope.info.card.replace(/\s/g, ""));
                            localStorage.setItem("name", $scope.cardinfo.name);
                            localStorage.setItem("company", $scope.cardinfo.company);
                            localStorage.setItem("u_price", $scope.pay_unit_price);
                            localStorage.setItem("t", $scope.pay_type_info);
                            localStorage.setItem("pid", $scope.info_send.product_id);
                            localStorage.setItem("n_price", $scope.normal_price);
                            localStorage.setItem("f_price", $scope.final_price);
                            localStorage.setItem("u_price", $scope.unit_price);
                            $state.go("funcpage.land_main.pay_login");
                            //以上为备用参数
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
    function judge(obj) {　　
        for (var i in obj) { //如果不为空，则会执行到这一步，返回true
            　　　　 return true;　　 }　
        return false;
    }
    $scope.error = login_logic.parse_url();

    if (judge($scope.error)) {
        if ($scope.error["message"] != undefined) {
            $ionicPopup.alert({
                title: '提示',
                template: $scope.error["message"],
                okText: '嗯！知道了', // String
                okType: 'button-energized',
            });
        }

    }
}]);
angular.module('HJY').controller("pay_login_info", ["$scope", "$state", "login_logic", "$http", "get_type", "_", "land_main", "$ionicPopup", "$interval", "land", "$stateParams", function($scope, $state, login_logic, $http, get_type, _, land_main, $ionicPopup, $interval, land, $stateParams) {
    $scope.phone_on = localStorage.getItem("phone");
    $scope.card_s = localStorage.getItem("card");
    $scope.name_s = localStorage.getItem("name");

    $scope.company_s = localStorage.getItem("company");
    $scope.price_n = localStorage.getItem("n_price");
    $scope.price_f = localStorage.getItem("f_price");
    $scope.t_s = localStorage.getItem("t");
    $scope.pid_s = localStorage.getItem("pid");
    $scope.uid_s = localStorage.getItem("uuid");
    $scope.u_price = localStorage.getItem("u_price");
    if ($stateParams.pro != null) {
        $scope.u_price = $stateParams.pro.unit_price;
        $scope.t_s = $stateParams.pro.total_time;
        $scope.card_s = $stateParams.pro.card_number;
        localStorage.setItem("u_price", $scope.u_price);
        localStorage.setItem("t", $scope.t_s);
        localStorage.setItem("pid", $scope.card_s);
        var list = {
            "jsonrpc": "2.0",
            "method": "getCardInfoByNumber",
            "params": [{
                "user_id": "5",
                "oil_card": $scope.card_s
            }],
            "id": 1
        }
        $scope.card_info_get = true;
        var land_data = land.submit(list);
        land_data.then(function(data) {
            if (data["result"] != undefined) {
                $scope.name_s = data["result"]["username"];
                $scope.company_s = data["result"]["name"];
                localStorage.setItem("name", $scope.name_s);
                localStorage.setItem("conmpany", $scope.company_s);
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
}])
angular.module('HJY').controller("pay_login", ["$scope", "$state", "login_logic", "$http", "get_type", "_", "land_main", "$ionicPopup", "$interval", "land", "$stateParams", function($scope, $state, login_logic, $http, get_type, _, land_main, $ionicPopup, $interval, land, $stateParams) {

    $scope.phone_on = localStorage.getItem("phone");
    $scope.card_s = localStorage.getItem("card");
    $scope.name_s = localStorage.getItem("name");

    $scope.company_s = localStorage.getItem("conmpany");
    $scope.price_n = localStorage.getItem("n_price");
    $scope.price_f = localStorage.getItem("f_price");
    $scope.t_s = localStorage.getItem("t");
    $scope.pid_s = localStorage.getItem("pid");
    $scope.uid_s = localStorage.getItem("uuid");
    $scope.u_price = localStorage.getItem("u_price");

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
                $state.go("funcpage.land_main.login_on");
            } else {
                $scope.login_flag = false;
            }
        })
    }

    $scope.login_state_confirm();
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
                    $scope.phone_flag = data["result"]["is_discount"];
                    // $scope.info_send = { username: "", channel: "renrenche", sms_key: "", sms_code: "", oil_card: "", product_id: "" }
                    $scope.info_send.sms_key = data["result"]["data"]["key"]; //短信验证key
                    $scope.pay_text = "支付" + $scope.price_f + "元";


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
                "card_num": $scope.card_s
            }],
            "id": 1
        }
        var login = login_logic.submit(list);
        login.then(function(data) {
            if (data.result != undefined) {
                localStorage.setItem("phone", $scope.info.phone.replace(/\s/g, ""));
                localStorage.setItem("uuid", data.result.packetsUuid);
                var mytime = new Date();
                var t = mytime.getTime();
                var params = {
                    "oil_card": $scope.card_s,
                    "product_id": $scope.pid_s,
                    "time": t,
                    "money": $scope.u_price,
                    // "uuid": data.result.packetsUuid
                }
                var sign = login_logic.md(params);
                var list = {
                    "oil_card": $scope.card_s,
                    "product_id": $scope.pid_s,
                    "time": t,
                    "sign": sign,
                    "money": $scope.u_price,
                    // "uuid": data.result.packetsUuid
                }
                console.log(list)
                land_main.pay(list)
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
angular.module('HJY').controller("pay_login_on", ["$scope", "$state", "login_logic", "$http", "get_type", "_", "land_main", "$ionicPopup", "$interval", "land", "$stateParams", function($scope, $state, login_logic, $http, get_type, _, land_main, $ionicPopup, $interval, land, $stateParams) {
    $scope.phone_on = localStorage.getItem("phone");
    $scope.card_s = localStorage.getItem("card");
    $scope.name_s = localStorage.getItem("name");
    $scope.company_s = localStorage.getItem("company");
    $scope.price_n = localStorage.getItem("n_price");
    $scope.price_f = localStorage.getItem("f_price");
    $scope.t_s = localStorage.getItem("t");
    $scope.pid_s = localStorage.getItem("pid");
    $scope.uid_s = localStorage.getItem("uuid");
    $scope.u_price = localStorage.getItem("u_price");
    $scope.list_flag = null;
    if ($stateParams.pro != null) {
        //以上为备用参数
        $scope.pay_text = "支付" + $stateParams.pro.discount_after_amount + "元";
        var mytime = new Date();
        var t = mytime.getTime();
        var params = {
            "oil_card": $stateParams.pro.card_number,
            "product_id": $stateParams.pro.id,
            "time": t,
            "money": $stateParams.pro.unit_price

        }
        var sign = login_logic.md(params);
        localStorage.setItem("card", $stateParams.pro.card_number);
        localStorage.setItem("pid", $stateParams.pro.id);
        localStorage.setItem("u_price", $stateParams.pro.unit_price);
        $scope.list_flag = {
            "oil_card": $stateParams.pro.card_number,
            "product_id": $stateParams.pro.id,
            "time": t,
            "sign": sign,
            "money": $stateParams.pro.unit_price


        }
    } else if ($scope.u_price != undefined && $scope.pid_s != undefined && $scope.card_s != undefined) {
        $scope.pay_text = "支付" + $scope.price_f + "元";
        var mytime = new Date();
        var t = mytime.getTime();
        var params = {
            "oil_card": $scope.card_s,
            "product_id": $scope.pid_s,
            "time": t,
            "money": $scope.u_price

        }
        var sign = login_logic.md(params);
        $scope.list_flag = {
            "oil_card": $scope.card_s,
            "product_id": $scope.pid_s,
            "time": t,
            "sign": sign,
            "money": $scope.u_price
        }
    }

    $scope.login_pay_on = function() {
        land_main.pay($scope.list_flag)
    }
}])
HJY.controller("m_pay_success", ["$scope", "$state", "login_logic", "$http", "land", "$interval", "$ionicPopup", function($scope, $state, login_logic, $http, land, $interval, $ionicPopup) {
    $scope.url_data = login_logic.parse_url();
    $scope.go_order_list = function() {
        $state.go("funcpage.order_list")
    }

    function judge(obj) {　　
        for (var i in obj) { //如果不为空，则会执行到这一步，返回true
            　　　　 return true;　　 }　
        return false;
    }
    $scope.list = null;
    $scope.redpack = false;
    $scope.getdata = function(send) {
        var good_list = land.get_good_list(send);
        good_list.then(function(data) {
            if (data["result"] != undefined) {
                clearInterval(time);
                if (data["result"]["status"] == 1) {
                    $scope.list = data["result"];
                    console.log($scope.list)
                    if ($scope.list.uuid == "") {
                        $scope.redpack = false;
                    } else {
                        $scope.redpack = true;
                    }
                } else if (data["result"]["status"] == 2) {
                    $state.go("land.pay_success.pay_fails")
                }
            }
        }, function() {

        })
    }
    var list = {
        "jsonrpc": "2.0",
        "method": "webBack",
        "params": [$scope.url_data],
        "id": 1
    }
    if (judge($scope.url_data)) {
        var time = setInterval($scope.getdata(list), 1000);
    }
}])
HJY.controller("m_pay_fails", ["$scope", "$state", "login_logic", "$http", "land", "$interval", "$ionicPopup", function($scope, $state, login_logic, $http, land, $interval, $ionicPopup) {
    $scope.repay = function() {
        var channel = sessionStorage.getItem("ch");
        location.hash = "#/funcpage/land_main?ch=" + channel;
    }
}])
angular.module('HJY').controller("order_list", ["$scope", "$state", "login_logic", "$http", "land_main", "$ionicPopup", function($scope, $state, login_logic, $http, land_main, $ionicPopup) {

    $scope.send_list = function(n) {
        var mytime = new Date();
        var t = mytime.getTime();
        var params = {
            "time": t,
            "pages": n
        }

        var sign = login_logic.md(params);
        var list = {
            "jsonrpc": "2.0",
            "method": "getOrderList",
            "params": [{
                "time": t,
                "sign": sign,
                "pages": n
            }],
            "id": 1
        }
        return list
    }
    $scope.page = 0;
    $scope.order_list = [];
    $scope.bottom = true;
    $scope.esc = function() {
        var l = {
            "jsonrpc": "2.0",
            "method": "signout",
            "params": [],
            "id": 1
        }
        console.log(8)
        login_logic.submit(l).then(function(data) {
            console.log(data)
            if (data.result["code"] == 0) {
                $state.go("funcpage.login")
            }
        })
    }
    $scope.shop = function() {
        var channel = sessionStorage.getItem("ch");
        location.hash = "#/funcpage/land_main?ch=" + channel;
    }
    $scope.loadMore = function() {
        $scope.page = $scope.page + 1;
        land_main.get_order_list($scope.send_list($scope.page)).then(function(data) {
            if (data["result"] != undefined) {
                $scope.order_list.push.apply($scope.order_list, data["result"]["list"]);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if (data["result"]["list"].length < 10 && data["result"]["list"].length > 0 && $scope.page == 1) {
                    $scope.bottom = false;
                } else {
                    if (data["result"]["list"].length == 0 && $scope.page > 1) {
                        $ionicPopup.alert({
                            title: '提示',
                            template: "没有更多啦~~",
                            okText: '确定', // String
                            okType: 'button-energized',
                        });
                        $scope.bottom = false;
                    } else if (data["result"]["list"].length == 0 && $scope.page == 1) {

                        $ionicPopup.confirm({
                            title: '提示',
                            template: "您当前还没有订单",
                            okText: '去下单', // String
                            okType: 'button-energized',
                            cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                            cancelType: 'button-energized', // String (默认: 'button-default')。取消按钮的类型。
                        }).then(function(res) {
                            if (res) {
                                var channel = sessionStorage.getItem("ch");
                                location.hash = "#/funcpage/land_main?ch=" + channel;
                            }

                        });

                        $scope.bottom = false;
                    }
                }

            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: data["error"]["message"],
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
            }

        })
    };

    $scope.go_details = function(p_id) {
        $state.go("funcpage.order_details", { id: p_id })
    }
}]);
angular.module('HJY').controller("order_details", ["$scope", "$state", "login_logic", "$http", "$stateParams", "land_main", "$ionicPopup", function($scope, $state, login_logic, $http, $stateParams, land_main, $ionicPopup) {
    $scope.go_pay = function(x) {
        $state.go("funcpage.land_main.login_on", { pro: x })
    }
    $scope.send_details = function(n) {
        var mytime = new Date();
        var t = mytime.getTime();
        if ($stateParams.id != null) {
            localStorage.setItem("detail_p", $stateParams.id)
            var params = {
                "time": t,
                "order_id": $stateParams.id
            }
            var sign = login_logic.md(params);
            var list = {
                "jsonrpc": "2.0",
                "method": "getOrderInfo",
                "params": [{
                    "time": t,
                    "sign": sign,
                    "order_id": $stateParams.id
                }],
                "id": 1
            }
        } else {
            var params = {
                "time": t,
                "order_id": localStorage.getItem("detail_p")
            }
            var sign = login_logic.md(params);
            var list = {
                "jsonrpc": "2.0",
                "method": "getOrderInfo",
                "params": [{
                    "time": t,
                    "sign": sign,
                    "order_id": localStorage.getItem("detail_p")
                }],
                "id": 1
            }
        }



        console.log(list)
        return list;
    }
    land_main.get_order_list($scope.send_details()).then(function(data) {
        if (data["result"] != undefined) {
            $scope.order_details = data["result"];
            $scope.length = $scope.order_details.oil_info.length;
        } else {
            $ionicPopup.alert({
                title: '提示',
                template: data["error"]["message"],
                okText: '嗯！知道了', // String
                okType: 'button-energized',
            });
        }

    })
}]);
angular.module('HJY').controller("not_login", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.go_login = function() {
        var channel = sessionStorage.getItem("ch");
        location.hash = "#/funcpage/login?ch=" + channel;
    }
}]);
HJY.controller("land_main_login", ["$scope", "$state", "login_logic", "$interval", "$ionicPopup", function($scope, $state, login_logic, $interval, $ionicPopup) {
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
                $state.go("funcpage.order_list");
            } else {
                $scope.login_flag = false;
            }
        })
    }
    $scope.login_state_confirm();
    $scope.info = { phone: "", scode: "", icode: "" } //表单验证信息,此处用对象绑定一是因为IONIC的作用域不清，二是方便表单信息处理
    $scope.notice = "手机号码格式不正确,请重新输入";
    $scope.agree = false;
    $scope.send_scode_flag = false;
    $scope.timeout = false; //倒数读秒按钮禁用
    $scope.icode_show = false; //是否为新注册用户
    login_logic.deal(); //输入框下划线等辅助性功能逻
    /*以上为页面操作功能*/
    $scope.weixin_bind = function() { //跳往微信绑定子路由
        //$state.go(".weixinbind")
        login_logic.weixin_bind();
    }
    $scope.toggleCustom = function() {
        $scope.agree = $scope.agree === false ? true : false;
    };

    $scope.second = "获取验证码";
    $scope.scode_get = function() { //获取验证码
        var list = {
            "jsonrpc": "2.0",
            "method": "messageAuth",
            "params": [{
                "mobile": $scope.info.phone
            }],
            "id": 1
        }
        var promise_scode = login_logic.submit(list);
        promise_scode.then(function(data) {
            if (data.result != undefined) {

                $scope.icode_show = data["result"]["data"]["is_registed"] == 0 ? true : false;
                $scope.key = data["result"]["data"]["key"]
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
            console.log("验证码信息获取失败");
        })
    }

    $scope.login = function() { //登录注册
        var list_login = null;
        if ($scope.info.icode != "") { //判断是否存在验证码
            list_login = {
                "jsonrpc": "2.0",
                "method": "signin",
                "params": [{
                    "username": $scope.info.phone, //电话号
                    "sms_key": $scope.key, //短信接口收到的key
                    "sms_code": $scope.info.scode, //验证码
                    "invite_code ": $scope.info.icode
                }],
                "id": 1
            }
        } else {
            list_login = {
                "jsonrpc": "2.0",
                "method": "signin",
                "params": [{
                    "username": $scope.info.phone, //电话号
                    "sms_key": $scope.key, //短信接口收到的key
                    "sms_code": $scope.info.scode, //验证码
                }],
                "id": 1
            }
        }

        var promise_login = login_logic.submit(list_login);
        promise_login.then(function(data) {
            if (data.result != undefined) {
                $scope.send_scode_flag = true;
                $state.go("funcpage.order_list");
            } else { //错误信息弹窗
                $scope.send_scode_flag = false;
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
}]);