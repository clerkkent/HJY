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
        var promise_scode = login_logic.submit(list);
        console.log(list)
        promise_scode.then(function(data) {
            if (data.result != undefined) {
                $scope.icode_show = data["result"]["data"]["is_registed"] == 0 ? true : false;
                $scope.key = data["result"]["data"]["key"]
                console.log(data)
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
HJY.controller("help", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.help_information = "";
    $scope.title_content = "帮助"
    login_logic.deal_help()
        // $scope.feed_return = function() {
        //     $state.go("help")
        // }
    $http.get("mock/help/help.json").then(function(data) {
        $scope.help_information = data.data;
    })
}]);
HJY.controller("friend", ["$scope", "$state", "login_logic", "$http", "$ionicPopup", "friend", "webappSDK", "$q", function($scope, $state, login_logic, $http, $ionicPopup, friend, webappSDK, $q) {
    $scope.userid = null; //userid
    $scope.strs = null; //token
    $scope.info = 0; //登录信息主体
    $scope.todayOilNum = 0; //今日获取油滴数
    $scope.allOilNum = 0; //总共获取油滴数
    $scope.allFriendNum = 0; //朋友总数
    $scope.url = location.search; //参数
    $scope.theRequest = new Object();
    friend.popum();
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
HJY.controller("friend_request_details", ["$scope", "$state", "$http", "$ionicPopup", "friend", "webappSDK", function($scope, $state, $http, $ionicPopup, friend, webappSDK) {
    friend.popum();
    $scope.share = function() { //分享原生H5指令交互
        webappSDK.share();
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
HJY.controller("game", ["$scope", "$state", "game_play", "$http", "$timeout", function($scope, $state, game_play, $http, $timeout) {
    $scope.text = "连续点击，赢取油滴"; //按钮内文字
    $scope.state = 0; //按钮点击所触发状态
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
    game_play.start()
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
HJY.controller("game_login", ["$scope", "$state", "game_play", "$http", "$timeout", "ngVerify", "login_logic", "$interval", "$ionicPopup", function($scope, $state, game_play, $http, $timeout, ngVerify, login_logic, $interval, $ionicPopup) {
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
                    $state.go("game_success")
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
}])
HJY.controller("land", ["$scope", "$state", "login_logic", "$http", "land", "$interval", "$ionicPopup", "login_logic", "land", function($scope, $state, login_logic, $http, land, $interval, $ionicPopup, login_logic, land) {
    $scope.info = { card: "", phone: "", scode: "", agree: true };
    $scope.cardinfo = { company: "", name: "" }
    $scope.info_send = { username: "", channel: "renrenche", sms_key: "", sms_code: "", oil_card: "", product_id: "", money: "" }
    $scope.cardt = false;
    $scope.phonet = false;
    $scope.scodet = false;
    $scope.agreet = false; //以上为信息格式验证标识
    $scope.degree_s = 0;
    $scope.degree_a = 0; //提示信息是否出现表示
    $scope.phone_flag = null;
    $scope.card_flag = null; //卡，手机是否红包有效标志
    $scope.price_get = false; //读取价格时禁用按钮
    $scope.product_id = false; //请求卡信息时禁用按钮
    $scope.card_info_get = false; //请求卡信息时禁用按钮
    $scope.text = "立即支付";
    $scope.price = 100; //当前商品原价
    $scope.discount = 1; //当前卡所享折扣
    $scope.product_type = function(callback) {
        var product = {
            "jsonrpc": "2.0",
            "method": "productList",
            "params": [{
                "user_id": "5",
                "channel": "renrenche"
            }],
            "id": 1
        }
        var product_data = land.submit(product);
        $scope.product_id = true
        product_data.then(function(data) {
            if (data.result != undefined) {
                $scope.product_id = false;
                $scope.info_send.product_id = data["result"]["list"][0]["id"];
                $scope.discount = data["result"]["list"][0]["product_discount"]; //折扣
                $scope.belong = data["result"]["list"][0]["belong"]
                if ($scope.belong == 1) {
                    $scope.test = /^100011\d{13}$/g;
                } else if ($scope.belong == 2) {
                    $scope.test = /^9\d{15}$/g;
                }

            } else { //错误信息弹窗
                console.log(data)
            }

        }, function() {
            console.log("验证码信息获取失败");
        });
    }
    $scope.product_type(); //产品类型获取函数
    $scope.card_check = function() { //油卡校验函数
        if ($scope.test.test($scope.info.card.replace(/\s/g, ""))) {
            //请求油卡信息
            $scope.cardt = false;
            console.log($scope.cardt)
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
                console.log(data)
                if (data.result != undefined) {
                    $scope.card_info_get = false;
                    $scope.cardinfo.name = data["result"]["username"];
                    $scope.cardinfo.company = data["result"]["name"];
                    $scope.card_flag = data["result"]["card_isDiscount"];
                    var dc = parseFloat($scope.discount);
                    if ($scope.phone_flag != null && $scope.card_flag != null) {
                        $scope.price_get = false;
                        if ($scope.phone_flag == 1 && $scope.card_flag == 1) {
                            $scope.price = Math.ceil((dc * 100 - 10) * 100) / 100; //乘以100，向上去整，等价于舍去小数点后三位，并进1.
                            $scope.text = "确认支付" + String($scope.price) + "元";
                        } else {
                            $scope.price = Math.ceil((dc * 100) * 100) / 100; //乘以100，向上去整，等价于舍去小数点后三位，并进1.
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
            $scope.notice = "请输入正确的油卡号";
            console.log($scope.cardt)
        }
    }

    $scope.go_r = function() {
        $state.go("register_agreement")
    }
    $scope.go_p = function() {
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
            $scope.notice = "请同意会加油注册及充值协议";
        }
    }
    $scope.check_send = function() { //油卡失去焦点获取卡信息函数
        if ($scope.test != undefined) {
            $scope.card_check($scope.test);
        }
    }
    $scope.isChecked = true;
    $scope.timeout = false; //倒数读秒按钮禁用
    $scope.icode_show = false; //是否为新注册用户//貌似无用
    /*以上为页面操作功能*/
    $scope.second = "获取验证码";

    $scope.scode_get = function() { //获取验证码
        // console.log(/^0?1[0-9][0-9]\d{4}\d{4}$/g.test($scope.info.phone.replace(/\s/g, "")))
        // console.log($scope.info.phone)
        // console.log($scope.info.phone.replace(/\s/g, ""))
        if ($scope.agreet == false) {
            if (/^0?1[0-9][0-9]\d{4}\d{4}$/g.test($scope.info.phone.replace(/\s/g, ""))) {
                $scope.phonet = false;
                //发送验证信息验证是否注册,随后判断错误优先级
                var a = 60;
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
                    console.log(data)
                    if (data.result != undefined) {
                        $scope.phonet = false;
                        $scope.phone_flag = data["result"]["is_discount"];
                        // $scope.info_send = { username: "", channel: "renrenche", sms_key: "", sms_code: "", oil_card: "", product_id: "" }
                        $scope.info_send.sms_key = data["result"]["data"]["key"]; //短信验证key
                        var dc = parseFloat($scope.discount);
                        if ($scope.phone_flag != null && $scope.card_flag != null) {
                            if ($scope.phone_flag == 1 && $scope.card_flag == 1) {
                                $scope.price = Math.ceil((dc * 100 - 10) * 100) / 100; //乘以100，向上去整，等价于舍去小数点后三位，并进1.
                                $scope.text = "确认支付" + String($scope.price) + "元";
                            } else {
                                $scope.price = Math.ceil((dc * 100) * 100) / 100; //乘以100，向上去整，等价于舍去小数点后三位，并进1.
                                $scope.text = "确认支付" + String($scope.price) + "元";
                            }
                            $scope.price_get = false;
                        } else {
                            $scope.price_get = true;
                        }

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
        if ($scope.test) {
            $scope.cardt = false;
            //请求油卡信息判断并显示是否注册，注册则进行下一步判断手机号,未通过则提示请更换未绑定油卡
            if (/^0?1[0-9][0-9]\d{4}\d{4}$/g.test($scope.info.phone.replace(/\s/g, ""))) {
                $scope.phonet = false;
                //手机号码注册判断，已注册提示错误信息未注册进行下步
                if (/\d{6}/g.test($scope.info.scode)) {
                    $scope.scodet = false;
                    $scope.info_send.username = $scope.info.phone.replace(/\s/g, "");
                    $scope.info_send.sms_code = $scope.info.scode;
                    $scope.info_send.oil_card = $scope.info.card.replace(/\s/g, "");
                    $scope.info_send.money = 100;
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
                            console.log(data.result.checkSms)
                            if (data.result != undefined) {
                                //然后if判断后调用land.pay($scope.info_send)，失败则显示验证码错误
                                if (data.result.checkSms) {
                                    $scope.scodet = false;
                                    land.pay($scope.info_send);
                                } else {
                                    $scope.scodet = true;
                                    $scope.notice = "验证码错误";
                                }
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
                $scope.notice = "请输入正确的手机号";
            }
        } else {
            $scope.cardt = true;
            $scope.notice = "请输入正确的油卡号";
        }
    }
}])
HJY.controller("pay_success", ["$scope", "$state", "login_logic", "$http", "land", "$interval", "$ionicPopup", function($scope, $state, login_logic, $http, land, $interval, $ionicPopup) {
    $scope.url_data = login_logic.parse_url();
    $scope.list = null;
    $scope.redpack = false;
    $scope.send = {
        "jsonrpc": "2.0",
        "method": "webBack",
        "params": [$scope.url_data],
        "id": 1
    }
    var getdata = function() {
        var good_list = land.get_good_list($scope.send);
        good_list.then(function(data) {
            if (data["result"] != undefined) {
                $interval.cancel(time);
                if (data["result"]["status"] == 1) {
                    $scope.list = data["result"];
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
    var time = $interval(getdata(), 1000);
}])
HJY.controller("pay_fails", ["$scope", "$state", "login_logic", "$http", "land", "$interval", "$ionicPopup", function($scope, $state, login_logic, $http, land, $interval, $ionicPopup) {
    $scope.repay = function() {
        $state.go("land")
    }
}])