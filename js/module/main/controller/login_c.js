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
        console.log($scope.agree)
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
    $scope.info = null; //登录信息主体
    $scope.todayOilNum = 0; //今日获取油滴数
    $scope.allOilNum = 0; //总共获取油滴数
    $scope.allFriendNum = 0; //朋友总数
    $scope.url = location.search; //参数
    $scope.theRequest = new Object();
    friend.popum();
    webappSDK.getUserInfos(function(res) {
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

    // if ($scope.url.indexOf("?") != -1) { //重复代码较多，应写成服务。
    //     var str = $scope.url.substr(1);
    //     $scope.strs = str.split("&");
    //     for (var i = 0; i < $scope.strs.length; i++) {
    //         $scope.theRequest[$scope.strs[i].split("=")[0]] = $scope.strs[i].split("=")[1]; //提取url中的参数
    //     }
    //     $scope.userid = $scope.theRequest.user_id
    // }
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
        console.log(list)
        promise_scode.then(function(data) {
            if (data.result != undefined) {
                $scope.icode_show = data["result"]["data"]["key"]
                $scope.key = data["result"]["data"]["key"]
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
                console.log(data["result"])
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
                    "oilNum ": $scope.score_login,
                    "invite_code": $scope.theRequest.invite_code

                }],
                "id": 1
            }
            console.log($scope.info.scode)
            promise_login = login_logic.submit(list_login);
            promise_login.then(function(data) {
                if (data.result != undefined) {
                    $ionicPopup.alert({
                        title: '提示',
                        template: "注册成功",
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    });
                    console.log(data);
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
}])