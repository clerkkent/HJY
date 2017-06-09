;
HJY.controller("loginc", ["$scope", "$state", "login_logic", "$interval", "$ionicPopup", function($scope, $state, login_logic, $interval, $ionicPopup) {
    $scope.info = { phone: "", scode: "", icode: "" } //表单验证信息,此处用对象绑定一是因为IONIC的作用域不清，二是方便表单信息处理
    $scope.notice = "手机号码格式不正确,请重新输入";
    $scope.agree = false;
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
                var list = {
                    "jsonrpc": "2.0",
                    "method": "messageAuth",
                    "params": [{
                        "mobile": $scope.info.phone
                    }],
                    "id": 1
                }
            } else { //错误信息弹窗
                console.log(data)
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
                $ionicPopup.alert({
                    title: '提示',
                    template: "登录成功",
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
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
}]);
HJY.controller("weixin", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.back = function() {
        $state.go("^")
    }
}]);
HJY.controller("help", ["$scope", "$state", "login_logic", "$http", "webappSDK", function($scope, $state, login_logic, $http, webappSDK) {
    $scope.help_information = "";
    $scope.title_content = "帮助";
    $scope.ap = false;
    login_logic.deal_help()
        // $scope.feed_return = function() {
        //     $state.go("help")
        // }
    var v = "?" + window.version_glo;
    $scope.call = function() {
        var phone = "4008518686";
        webappSDK.call(phone)
    }
    $http.get("mock/help/help.json" + v).then(function(data) {
        $scope.help_information = data.data;
    })
}]);
HJY.controller("friend", ["$scope", "$state", "login_logic", "$http", "$ionicPopup", "friend", "webappSDK", "$q", "$rootScope", function($scope, $state, login_logic, $http, $ionicPopup, friend, webappSDK, $q, $rootScope) {
    $scope.userid = null; //userid
    $scope.strs = null; //token
    $scope.info = 0; //登录信息主体
    $scope.todayOilNum = 0; //今日获取油滴数
    $scope.allOilNum = 0; //总共获取油滴数
    $scope.allFriendNum = 0; //朋友总数
    $scope.url = location.search; //参数
    $scope.theRequest = new Object();
    friend.popum();
    // webappSDK.GetActiveId(1);
    $scope.share = function() { //分享原生H5指令交互
        var content = {
            title: "必须看！老司机教你8.5折充油卡！",
            content: "注册就送200元加油券，车主必备，老司机快来~",
            imageUrl: $rootScope.url_global + "/wechat/images/share.jpg",
            // url: $rootScope.url_global + "/wechat/?" + "" + "#/game/main",
            url: ""
        }
        webappSDK.share(content);
    }
    webappSDK.getUserInfos(function(res) { //webbriage入口
        var info = JSON.parse(res)
        $scope.userid = info.user_id
        $scope.strs = info.OIL_TOKEN
        if ($scope.userid != null) {
            var list = {
                "jsonrpc": "2.0",
                "method": "myInviteFriendList",
                "params": [{
                    "user_id": $scope.userid //用户的user_id，必须
                }],
                "id": 1
            }
            var promise_scode = login_logic.submit(list, $scope.strs);
            promise_scode.then(function(data) {
                if (data.result != undefined) {
                    $scope.todayOilNum = data["result"]["todayOilNum"]
                    $scope.allOilNum = data["result"]["allOilNum"]
                    $scope.allFriendNum = data["result"]["allFriendNum"]
                    $scope.frienddetails = data["result"]["list"]
                    if ($scope.frienddetails == 0) {
                        friend.friend_none()
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
                console.log("验证码信息获取失败");
            })
        }
    });
    if ($scope.url.indexOf("?") != -1) { //URL入口
        var str = $scope.url.substr(1);
        $scope.strs = str.split("&");
        for (var i = 0; i < $scope.strs.length; i++) {
            $scope.theRequest[$scope.strs[i].split("=")[0]] = $scope.strs[i].split("=")[1]; //提取url中的参数
        }
        $scope.userid = $scope.theRequest.user_id;
        $scope.strs = $scope.theRequest.OIL_TOKEN;
        if ($scope.userid != null) {
            var list = {
                "jsonrpc": "2.0",
                "method": "myInviteFriendList",
                "params": [{
                    "user_id": $scope.userid //用户的user_id，必须
                }],
                "id": 1
            }
            var promise_scode = login_logic.submit(list, $scope.strs);
            promise_scode.then(function(data) {
                if (data.result != undefined) {
                    $scope.todayOilNum = data["result"]["todayOilNum"]
                    $scope.allOilNum = data["result"]["allOilNum"]
                    $scope.allFriendNum = data["result"]["allFriendNum"]
                    $scope.frienddetails = data["result"]["list"]
                    if ($scope.frienddetails == 0) {
                        friend.friend_none()
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
                console.log("验证码信息获取失败");
            })
        }
    }
}]);
HJY.controller("friend_request_details", ["$scope", "$state", "$http", "$ionicPopup", "friend", "webappSDK", "$rootScope", function($scope, $state, $http, $ionicPopup, friend, webappSDK, $rootScope) {
    friend.popum();
    webappSDK.GetActiveId(1);
    $scope.share = function() { //分享原生H5指令交互
        var content = {
            title: "必须看！老司机教你8.5折充油卡！",
            content: "注册就送200元加油券，车主必备，老司机快来~",
            imageUrl: $rootScope.url_global + "/wechat/images/share.jpg",
            // url: $rootScope.url_global + "/wechat/?#/game/main"
            url: ""
        }
        webappSDK.share(content);
    }
}]);
HJY.controller("pay", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.title_content = "确认订单"
}])
HJY.controller("mycenter", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.action = function() {
        login_logic.deal_mycenter()
    }
}]);
HJY.controller("buy", ["$scope", "$state", "buy", "$http", function($scope, $state, buy, $http) {
    new Swiper(".swiper-container", {
        effect: 'coverflow',
        slidesPerView: 1.6,
        centeredSlides: true,
        coverflow: {
            rotate: 0,
            stretch: -20,
            depth: 60,
            modifier: 2,
            slideShadows: true
        }
    })
}]);
HJY.controller("game", ["$scope", "$state", "game_play", "$http", "$timeout", "wxsdk", "$rootScope", "login_logic", function($scope, $state, game_play, $http, $timeout, wxsdk, $rootScope, login_logic) {
    $scope.url = location.search;
    $scope.theRequest = new Object();
    if ($scope.url.indexOf("?") != -1) {
        var str = $scope.url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            $scope.theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1]; //提取url中的参数
        }
        console.log($scope.theRequest.mobile)
    }
    var url = encodeURIComponent(location.href.split("#")[0]);
    console.log(location.href.split("#")[0])
    var mytime = new Date();
    var t = mytime.getTime();
    var params = {
        "time": t,
        "url": url
    }
    var list = {
        "jsonrpc": "2.0",
        "method": "getAll",
        "params": [{
            "time": t,
            "url": url,
            "sign": login_logic.md(params)
        }],
        "id": 1
    }
    wxsdk.post("/operate/index.php?c=wechat", list).then(function(data) {
        $rootScope.share = location.href;
        $scope.data = data.result
        wxsdk.wx($scope.data);
        wxsdk.shareo();
    })

}])
HJY.controller("game_main", ["$scope", "$state", "game_play", "$http", "$timeout", "wxsdk", "$rootScope", "login_logic", function($scope, $state, game_play, $http, $timeout, wxsdk, $rootScope, login_logic) {
    $scope.text = "连续点击，赢取油滴"; //按钮内文字
    $scope.state = 0; //按钮点击所触发状态
    game_play.start();
}])
HJY.controller("game_select", ["$scope", "$state", "game_play", "$http", "$timeout", function($scope, $state, game_play, $http, $timeout) {
    $scope.score = sessionStorage.getItem("score");
    if ($scope.score == null) {
        $state.go("game.main")
    }
    game_play.replay();
    $scope.go_login = function() {
        $state.go("game.login")
    }
}])
HJY.controller("game_login", ["$scope", "$state", "game_play", "$http", "$timeout", "ngVerify", "login_logic", "$interval", "$ionicPopup", "$rootScope", "wxsdk", function($scope, $state, game_play, $http, $timeout, ngVerify, login_logic, $interval, $ionicPopup, $rootScope, wxsdk) {
    $scope.score_login = sessionStorage.getItem("score");
    game_play.deal_icon();
    $scope.state = 0;
    $scope.registed = false;
    $scope.info = { phone: "", scode: "", icode: "" } //表单验证信息,此处用对象绑定一是因为IONIC的作用域不清，二是方便表单信息处理
    $scope.notice = "手机号码错误";
    // $scope.agree = false;//此处无用
    $scope.timeout = false; //倒数读秒按钮禁用
    // $scope.icode_show = false;
    $scope.second = "获取验证码";
    $scope.agree = false;
    $scope.toggleCustom = function() {
        if ($scope.agree == false) {
            $scope.agree = true;
            $(".main_content .get_award .remind .agree").addClass("selected")
        } else {
            $scope.agree = false;
            $(".main_content .get_award .remind .agree").removeClass("selected")
        }
    };
    $scope.go_register_agreement = function() {
        $state.go("register_agreement")
    }
    $scope.state = 0; //0表示显示为手机号码输入阶段，1表示为短信验证码输入阶段。
    $scope.state_sign = true; //true为填写手机号码，false为填写
    // login_logic.deal();//测试解决某些浏览器固定窗口大小，没有resize事件，但存在用户主动关闭键盘的BUG
    $scope.former_phone = $scope.theRequest.mobile;
    $scope.scode_get = function() { //获取验证码
        var a = 60;
        $scope.second = a + "s"
        $scope.timeout = true;
        $scope.icode_show = true;
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
                $scope.icode_show = data["result"]["data"]["key"]
                $scope.key = data["result"]["data"]["key"]
                console.log(data)
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
    $scope.login = function() { //登录注册
        var list_login = null;
        var promise_login = null;
        if ($scope.state == 0) {
            list_login = {
                "jsonrpc": "2.0",
                "method": "isRegisterForBefore",
                "params": [{
                    "phone": $scope.info.phone
                }],
                "id": 1
            }
            promise_login = login_logic.submit(list_login);
            promise_login.then(function(data) {
                if (data.result != undefined) {
                    if (data["result"]["isRegister"] == 0) {
                        $scope.state = 1;
                        $scope.registed = true;
                    } else {
                        $ionicPopup.alert({
                            title: '提示',
                            template: "此帐号已注册，请更换帐号重试！",
                            okText: '嗯！知道了', // String
                            okType: 'button-energized',
                        });
                    }
                }
            }, function() {
                console.log("登录失败");
                $ionicPopup.alert({
                    title: '提示',
                    template: "网络异常",
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
            })
        } else {
            list_login = {
                "jsonrpc": "2.0",
                "method": "signin",
                "params": [{
                    "username": $scope.info.phone, //电话号
                    "sms_key": $scope.key, //短信接口收到的key
                    "sms_code": $scope.info.scode, //验证码
                    "oilNum": $scope.score_login,
                    "invite_code": $scope.theRequest.invite_code

                }],
                "id": 1
            }
            promise_login = login_logic.submit(list_login);
            promise_login.then(function(data) {
                if (data.result != undefined) {
                    $rootScope.share = $rootScope.url_global + "/wechat/?mobile=" + $scope.info.phone + "&" + "invite_code=" + data["result"]["data"]["invite_code"] + "#/game/main";
                    $state.go("game_success");
                    wxsdk.shares();
                } else { //错误信息弹窗
                    $ionicPopup.alert({
                        title: '提示',
                        template: data["error"]["message"],
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    });
                }

            }, function() {
                console.log("登录失败");
                $ionicPopup.alert({
                    title: '提示',
                    template: "网络异常",
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
            })
        }

    }
}])
HJY.controller("game_success", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.score_login = sessionStorage.getItem("score");
    if ($scope.score_login == undefined) {
        $state.go("game.main")
    }
    $scope.download = function() {
        location.href = ""
    }
}])

HJY.controller("land", ["$scope", "$state", "$http", "land", "$interval", "$ionicPopup", "login_logic", "get_predata", function($scope, $state, $http, land, $interval, $ionicPopup, login_logic, get_predata) {
    $scope.info = { card: "", phone: "", scode: "", agree: true };
    $scope.info_send = { username: "", channel: "renrenche", sms_key: "", sms_code: "", oil_card: "", product_id: "", money: "", pay_channel: "ali_pay" }
    $scope.cardt = false;
    $scope.phonet = false;
    $scope.scodet = false;
    $scope.agreet = false; //以上为信息格式验证标识
    $scope.degree_s = 0;
    $scope.degree_a = 0; //提示信息是否出现表示
    $scope.phone_flag = null;
    $scope.card_flag = null; //卡，手机是否红包有效标志
    $scope.price_get = false; //读取价格时禁用按钮
    $scope.card_info_get = false; //请求卡信息时禁用按钮
    $scope.text = "立即支付";
    $scope.price = get_predata["result"]["money"][0].name; //当前商品原价,用于乘以折扣使用
    $scope.pre_price = get_predata["result"]["money"][0].name; //用于传递后台原价，或者进行测试使用
    $scope.discount = 1; //当前卡所享折扣

    if (get_predata["result"] != undefined) {
        $scope.info_send.product_id = get_predata["result"]["list"][0]["id"]; //get_predata为页面加载前返回的商品信息
        $scope.discount = get_predata["result"]["list"][0]["product_discount"]; //折扣
        $scope.belong = get_predata["result"]["list"][0]["belong"];
    }
    $scope.pay_on = false; //支付中，防止用户重复请求
    if ($scope.belong == 1) {
        $scope.test = /^100011\d{13}$/;
    } else if ($scope.belong == 2) {
        $scope.test = /^9\d{15}$/;
    }
    $scope.go_p = function() { //调往充值协议
        $state.go("user_agreement")
    }
    land.format(); //号码格式化显示
    $scope.toggleCustom = function() { //注册协议限制
        if ($scope.agreet == true) {
            $(".main_content .land .remind .agree").removeClass("selected")
            $scope.agreet = false;
        } else {
            $(".main_content .land .remind .agree").addClass("selected")
            $scope.agreet = true;
            $scope.notice = "同意《会加油服务协议》";
        }
    }
    $scope.check_send = function() { //油卡失去焦点获取卡信息函数
        var card = $scope.test.test($scope.info.card.replace(/\s/g, ""));
        if (card) {
            //请求油卡信息
            $('.main_content .land #card').css({ border: "0.00rem solid red" })
            $scope.cardt = false;
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
                if (data.result != undefined) {
                    $scope.card_info_get = false;
                    $scope.cardinfo.name = data["result"]["username"];
                    $scope.cardinfo.company = data["result"]["name"];
                    $scope.card_flag = data["result"]["card_isDiscount"];
                    var dc = parseFloat($scope.discount);
                    if ($scope.phone_flag != null && $scope.card_flag != null) {
                        $scope.price_get = false;
                        $scope.price = $scope.pre_price;
                        if ($scope.phone_flag == 1 && $scope.card_flag == 1) {
                            $scope.price = Math.ceil((dc * $scope.price - 10) * 100) / 100; //乘以100，向上去整，等价于舍去小数点后三位，并进1.
                            $scope.text = "确认支付" + String($scope.price) + "元";
                        } else {
                            $scope.price = Math.ceil((dc * $scope.price) * 100) / 100; //乘以100，向上去整，等价于舍去小数点后三位，并进1.
                            $scope.text = "确认支付" + String($scope.price) + "元";
                        }
                    } else {
                        $scope.price_get = true;
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
        } else {
            $scope.cardt = true;
            $('.main_content .land #card').css({ border: "0.02rem solid red" })
            $scope.notice = "请输入正确的油卡号";
        }
    }
    $scope.isChecked = true;
    $scope.timeout = false; //倒数读秒按钮禁用
    $scope.icode_show = false; //是否为新注册用户//貌似无用
    /*以上为页面操作功能*/
    $scope.second = "获取验证码";
    $scope.scode_get = function() { //获取验证码
        if ($scope.agreet == false) {
            if (/^0?1[0-9][0-9]\d{4}\d{4}$/.test($scope.info.phone.replace(/\s/g, ""))) {
                $scope.phonet = false;
                //发送验证信息验证是否注册,随后判断错误优先级

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
                        var dc = parseFloat($scope.discount);
                        if ($scope.phone_flag != null && $scope.card_flag != null) {
                            $scope.price = $scope.pre_price;
                            if ($scope.phone_flag == 1 && $scope.card_flag == 1) {
                                $scope.price = Math.ceil((dc * $scope.price - 10) * 100) / 100; //乘以100，向上去整，等价于舍去小数点后三位，并进1.
                                $scope.text = "确认支付" + String($scope.price) + "元";
                            } else {
                                $scope.price = Math.ceil((dc * $scope.price) * 100) / 100; //乘以100，向上去整，等价于舍去小数点后三位，并进1.
                                $scope.text = "确认支付" + String($scope.price) + "元";
                            }
                            $scope.price_get = false;
                        } else {
                            $scope.price_get = true;
                        } //价格获取
                        var a = 60; //倒数
                        $scope.second = a + "s"
                        $scope.timeout = true;
                        var timeout = $interval(function() {
                            if (a <= 0) {
                                $scope.second = "重新获取"
                                $scope.timeout = false;
                                a = 60;
                                $interval.cancel(timeout)
                            } else {
                                a--;
                                $scope.second = a + "s"
                            }
                        }, 1000);
                    } else { //验证码多次获取失败
                        $scope.phonet = true;
                        $scope.notice = data["error"]["message"];
                        $ionicPopup.alert({
                            title: '提示',
                            template: data["error"]["message"],
                            okText: '嗯！知道了', // String
                            okType: 'button-energized',
                        });
                    }
                }, function() {

                })
            } else {
                $scope.phonet = true;
                $scope.notice = "请输入正确的手机号";
            }
        } else {
            $scope.notice = "请同意会加油注册及充值协议";
        }

    }

    $scope.login = function() { //登录注册
        var card = $scope.test.test($scope.info.card.replace(/\s/g, ""))
        if (card) {
            $scope.cardt = false;
            //请求油卡信息判断并显示是否注册，注册则进行下一步判断手机号,未通过则提示请更换未绑定油卡
            if (/^0?1[0-9][0-9]\d{4}\d{4}$/.test($scope.info.phone.replace(/\s/g, ""))) {
                $scope.phonet = false;
                //手机号码注册判断，已注册提示错误信息未注册进行下步
                if (/\d{6}/.test($scope.info.scode)) {
                    $scope.info_send.username = $scope.info.phone.replace(/\s/g, "");
                    $scope.info_send.sms_code = $scope.info.scode;
                    $scope.info_send.oil_card = $scope.info.card.replace(/\s/g, "");
                    $scope.info_send.money = $scope.pre_price;
                    var list = {
                        "jsonrpc": "2.0",
                        "method": "checkSmsForChannel",
                        "params": [{
                            "username": $scope.info.phone.replace(/\s/g, ""), //手机
                            "sms_key": $scope.info_send.sms_key, //验证码的key
                            "sms_code": parseInt($scope.info.scode) //验证码
                        }],
                        "id": 1
                    }

                    var login = login_logic.submit(list)
                    login.then(function(data) {
                            if (data.result != undefined) {
                                if (data.result.checkSms) {
                                    $scope.scodet = false;
                                    $scope.pay_on = true;
                                    sessionStorage.setItem("channel", $scope.info_send.channel);
                                    land.pay($scope.info_send);
                                    $scope.text = "正在前往支付页";
                                } else {
                                    $scope.scodet = true;
                                    $scope.notice = "验证码错误";
                                }
                            } else {
                                $ionicPopup.alert({
                                    title: '提示',
                                    template: data["error"]["message"],
                                    okText: '嗯！知道了', // String
                                    okType: 'button-energized',
                                });
                            }
                        }, function() {

                        })
                        // console.log(list)
                        // land.pay($scope.info_send);
                } else {
                    $scope.scodet = true;
                    $scope.notice = "验证码格式错误"
                }
            } else {
                $scope.phonet = true;
                $scope.notice = "请输入正确的手机号"
            }
        } else { //此处正则为何验证慢。。。
            $scope.cardt = true;

            $scope.notice = "请输入正确的油卡号";
        }
    }

    function judge(obj) {　　
        for (var i in obj) { //如果不为空，则会执行到这一步，返回true
            　　　　 return true;　　 }　
        return false;
    }
    $scope.error = login_logic.parse_url();
    $scope.download_show = true;
    $scope.no_download = [];
    if (judge($scope.error)) {
        if ($scope.error["message"] != undefined) {
            $ionicPopup.alert({
                title: '提示',
                template: $scope.error["message"],
                okText: '嗯！知道了', // String
                okType: 'button-energized',
            });
        }
        if ($scope.error["oil_card"] != undefined) {
            $scope.info.card = $scope.error["oil_card"].replace(/(.{4})/g, "$1 ");
        }
        if ($scope.error["username"] != undefined) {
            $scope.info.phone = $scope.error["username"].replace(/(\d{3})(\d{4})/, "$1 $2 ");
        }
        if ($scope.error["ch"] != undefined) {
            $scope.info_send.channel = $scope.error["ch"];
            sessionStorage.setItem("channel", $scope.info_send.channel);
            for (i = 0; i < $scope.no_download.length; i++) {
                if ($scope.info_send.channel == $scope.no_download[i]) {
                    $scope.download_show = false;
                }
            }
        }
        if ($scope.error["test_money_HJY"] != undefined) {
            $scope.pre_price = $scope.error["test_money_HJY"];
        }
    }
}])
HJY.controller("pay_success", ["$scope", "$state", "login_logic", "$http", "land", "$interval", "$ionicPopup", function($scope, $state, login_logic, $http, land, $interval, $ionicPopup) {
    $scope.url_data = login_logic.parse_url();

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
                if (data["result"]["status"] == 1) {
                    $interval.cancel(time);
                    $scope.list = data["result"];
                    if ($scope.list.uuid == "") {
                        $scope.redpack = false;
                    } else {
                        $scope.redpack = true;
                    }
                } else if (data["result"]["status"] == 2) {
                    $interval.cancel(time);
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
        var time = $interval($scope.getdata(list), 1000);
    }
}])
HJY.controller("pay_fails", ["$scope", "$state", "login_logic", "$http", "land", "$interval", "$ionicPopup", function($scope, $state, login_logic, $http, land, $interval, $ionicPopup) {
    $scope.repay = function() {
        var channel = sessionStorage.getItem("channel");
        location.hash = "#/land?ch=" + channel;

    }
}])
HJY.controller("download", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.browser = {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    if ($scope.browser.versions.android) {
        window.location.href = "http://m.gdown.baidu.com/ddac2c0eda8b7182a0134c027a32e991364f48dd3e54ea3caa2901222dc9c5adaf618652e1b84fd77cf052b337d9ab61db35f9d12de358ab699b5bdb5ffe2b6017e990a98c521c5558ed13390c8f7394d12ab0462bde57da29993e27161e85b40a425eb041c47a3f32ebb75d5f257d3572ca1f6c858868688106c26bc5a9fc04c58f29b5df2eeb112f2cc0365081f59100f5bb3aefb3ab146f01b14986fb41852fea1ea1f42771d8118a39b600d6a3ef2fea1ea1f42771d82e559c7e51daa605"
    } else if ($scope.browser.versions.ios) {
        window.location.href = "https://itunes.apple.com/us/app/hui-jia-you-qi-che-zhe-kou-jia-you-di-zhi-8.5-zhe/id1225155226?mt=8"

    }
}])
HJY.controller("guide", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {

}])
HJY.controller("help_guide", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {

}])