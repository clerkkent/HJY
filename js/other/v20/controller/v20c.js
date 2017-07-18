HJY.controller("v20", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {

}])
HJY.controller("shake", ["$scope", "$rootScope", "$state", "webappSDK", "$ionicPopup", "login_logic", "$timeout", "webappSDK", "$ionicBackdrop", "v20", "$rootScope", function($scope, $rootScope, $state, webappSDK, $ionicPopup, login_logic, $timeout, webappSDK, $ionicBackdrop, v20, $rootScope) {
    $scope.PrizeList = null;
    $scope.allPrizeList = null;
    $scope.shakePrize = null;
    $scope.personPrizeList = null;
    $scope.prize_number = 0;
    $scope.user_id = "";
    $scope.token = "";
    $("title").html("摇一摇")
    if (location.hostname == "www.ihaomu.com" || location.hostname == "www.ihuijiayou.com") {
        _hmt.push(['_trackPageview', "/schoolmate"]);
    }
    if (login_logic.JudgeSystem()) {
        var axxxx = JSON.parse(hjytest.getUserInfos("js调用了android中的hello方法"));
        $scope.user_id = axxxx.user_id;
        $scope.token = axxxx.OIL_TOKEN;
    } else if (login_logic.JudgeSystemIOS()) {
        webappSDK.getUserInfos(function(res) {
            var info = JSON.parse(res)
            $scope.user_id = info.user_id
            $scope.token = info.OIL_TOKEN //webbriage入口
        })
    } else {
        $scope.user_id = "";
        $scope.token = "";
    }
    $scope.movieUse = function() {
        location.href = "http://t.cn/RoCXpzd"
    }
    $scope.viewOil = function() {
        if (login_logic.JudgeSystem()) {
            hjytest.doTheTask(" ")
        } else {
            webappSDK.doTheTask()
        }
    }
    $scope.dealpic = function(x) {
        return "https://test1.ihuijiayou.com/operate/uploads/" + x
    }
    var myShakeEvent = new Shake({
        threshold: 5,
        timeout: 3000
    });
    myShakeEvent.start();
    $scope.getPrizeList = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "PrizeList",
            "params": [{
                "type": 1,
                "user_id": $scope.user_id
            }],
            "id": 1
        }
        v20.get($rootScope.url_global + '/passport/service.php?c=prize', list, $scope.token).then(
            function(data) {
                if (data["result"] != undefined) {
                    $scope.main_prize = _.filter(data["result"]["list"], function(num) { return num["img"] != ''; });
                    $scope.other_prize = _.filter(data["result"]["list"], function(num) { return num["img"] == ''; });
                    $scope.prize_number = data["result"]["prize_number"]
                    $scope.PrizeList = data["result"]["list"]

                } else {

                }
            }
        )
    }
    $scope.getPrizeList();
    $scope.getAllPrizeList = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "GetDrawList",
            "params": [{
                "type": 1,
                "user_id": $scope.user_id
            }],
            "id": 1
        }
        v20.get($rootScope.url_global + '/passport/service.php?c=prize', list, $scope.token).then(
            function(data) {
                if (data["result"] != undefined) {
                    $scope.allPrizeList = data["result"]
                } else {
                    $ionicPopup.alert({
                        title: '提示',
                        template: data["error"]["message"],
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    });
                }
            }
        )
    }
    $scope.getAllPrizeList()
    $scope.getPersonalList = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "UserDrawList",
            "params": [{
                "type": 1,
                "user_id": $scope.user_id
            }],
            "id": 1
        }
        v20.get($rootScope.url_global + '/passport/service.php?c=prize', list, $scope.token).then(
            function(data) {
                if (data["result"] != undefined) {
                    $scope.personPrizeList = data["result"]
                } else {
                    $ionicPopup.alert({
                        title: '提示',
                        template: data["error"]["message"],
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    });
                }
            }
        )
    }

    $scope.showPrizeList = function() {
        $scope.getPersonalList()
        if ($scope.user_id == "" && $scope.token == "") {
            $ionicPopup.confirm({
                title: '提示',
                template: "请先登录",
                okText: '登录', // String
                okType: 'button-energized',
                cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                cancelType: 'button-energized', // String (默认: 'button-default')。取消按钮的类型。
            }).then(function(res) {
                if (login_logic.JudgeSystem()) {
                    var axxxx = JSON.parse(hjytest.toLogin());
                } else {
                    webappSDK.toLogin(function(res) {

                    })
                }
            });
        } else {
            myShakeEvent.stop();
        }
        $(".myprize").show()
    }
    $scope.hidePrizeList = function() {
        myShakeEvent.start();
        $(".myprize").hide()
    }

    function remove() {
        $(".hand").removeClass("shake");
        // if ($scope.user_id == "" && $scope.token == "") {
        //     // $ionicPopup.alert({
        //     //     title: '提示',
        //     //     template: "您还未登陆,请登陆",
        //     //     okText: '嗯！知道了', // String
        //     //     okType: 'button-energized',
        //     // });

        //     // if (login_logic.JudgeSystem()) {
        //     //     hjytest.toLogin()
        //     // } else {
        //     //     webappSDK.toLogin()
        //     // }
        //     remove_s();
        // } else {
        //     remove_s();
        // }
        $scope.shakeResult();
    }
    $scope.testxxx = 0;
    $scope.shakeResult = function() {
            $scope.testxxx += 1;
            var shakelist = {
                "jsonrpc": "2.0",
                "method": "Draw",
                "params": [{
                    "type": 1,
                    "user_id": $scope.user_id
                }],
                "id": 1
            }
            v20.get($rootScope.url_global + '/passport/service.php?c=prize', shakelist, $scope.token).then(function(data) {
                if (data["result"]["id"] != undefined) {
                    $scope.shakePrize = data["result"]["lottery_name"];
                    $(".shake_win").show()
                    $ionicBackdrop.retain()
                    myShakeEvent.stop();
                    $(document).on('touchmove', function(e) {
                        e.preventDefault()
                    })
                    $(".shake_win .close").click(function() {
                        $scope.getPrizeList();
                        $scope.getPersonalList();
                        myShakeEvent.start();
                        $(".shake_win").hide()
                        $ionicBackdrop.release()
                        $(document).off('touchmove')
                    })
                } else {
                    $(".shake_lose").show()
                    $ionicBackdrop.retain()
                    myShakeEvent.stop();
                    $(document).on('touchmove', function(e) {
                        e.preventDefault()
                    })
                    $(".shake_lose .close").click(function() {
                        $scope.getPrizeList();
                        $scope.getPersonalList();
                        myShakeEvent.start();
                        $(".shake_lose").hide()
                        $ionicBackdrop.release()
                        $(document).off('touchmove')
                    })
                }

            })
        }
        // var remove_s = _.throttle($scope.shakeResult, 3000)
    $scope.shakeResult()

    function test() {
        $timeout(remove, 1000);
        $("#audio")[0].play();
        $(".hand").addClass("shake");
    }
    window.addEventListener('shake', test, false);
}])
HJY.controller("schoolmate", ["$scope", "v20", "$ionicBackdrop", "$rootScope", "$state", "login_logic", "ngVerify", "$interval", "$ionicPopup", function($scope, v20, $ionicBackdrop, $rootScope, $state, login_logic, ngVerify, $interval, $ionicPopup) {
    $scope.test = "dasdad";
    $scope.error = true;
    $scope.timeout = false;
    $scope.notice = ""
    $scope.key = "";
    $scope.second = "获取验证码";
    $scope.text = "绑定会员卡";
    $scope.userid = "";
    $scope.download_text = "";

    $scope.focus = function() {
        $scope.notice = ""
    }
    $scope.info = {
        name: "",
        phone: "",
        scode: "",
        invited_code: ""
    }
    $scope.scode_get = function() {

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
            console.log(data)
            if (data.result != undefined) {
                $scope.key = data["result"]["data"]["key"]
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

            } else { //错误信息弹窗
                $scope.error = true;
                $scope.notice = "手机号码格式错误";
            }

        }, function() {
            console.log("验证码信息获取失败");
        })
    }
    $scope.popumback = "ic_card_p_h.png"
    $scope.download = function() {
        location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.huijiayou.huijiayou"
    }
    $scope.popumclose = function() {
        $(".schoolmate_popum01").hide();
        $ionicBackdrop.release();
        $(document).off('touchmove')
    }

    $scope.get_cardPresent = function() {
        var inviteList = {
            "jsonrpc": "2.0",
            "method": "GetCardBag",
            "params": [{
                "user_id": $scope.userid,
                "invitecode": $scope.info.invited_code,
                "user_name": $scope.info.name
            }],
            "id": 1
        }
        v20.get($rootScope.url_global + '/passport/service.php?c=card', inviteList).then(function(data) {
            if (data.result != undefined) {
                if (data.result["code"] == 0) {
                    $scope.card_message = "成功领取会加油尊享会员卡！"
                    $scope.popumback = "ic_card_p_h.png"
                    $ionicBackdrop.retain();
                    $scope.download_text = "立即体验";
                    $(".schoolmate_popum01").show();
                    $(document).on('touchmove', function(e) {
                        e.preventDefault()
                    })
                    $(".schoolmate_popum01 .close").click = function() {
                        $(".schoolmate_popum01").hide();
                        $ionicBackdrop.release();
                        $(document).off('touchmove')
                    }
                } else {
                    $scope.card_message = "会员卡太火爆，被抢光了！"
                    $scope.popumback = "ic_card_p_n.png"
                    $ionicBackdrop.retain();
                    $scope.download_text = "下载App";
                    $(".schoolmate_popum01").show();
                    $(document).on('touchmove', function(e) {
                        e.preventDefault()
                    })
                    $(".schoolmate_popum01 .close").click = function() {
                        $(".schoolmate_popum01").hide();
                        $ionicBackdrop.release();
                        $(document).off('touchmove')
                    }
                }
            } else { //错误信息弹窗
                $scope.error = true;
                $scope.notice = data["error"]["message"];
            }
        })
    }
    $scope.login_main = function() {
        list_login = {
            "jsonrpc": "2.0",
            "method": "signin",
            "params": [{
                "username": $scope.info.phone, //电话号
                "sms_key": $scope.key, //短信接口收到的key
                "sms_code": $scope.info.scode, //验证码
                "invite_code ": $scope.info.invited_code,
            }],
            "id": 1
        }

        var promise_login = login_logic.submit(list_login);
        promise_login.then(function(data) {
            console.log(2)
            console.log(data)
            if (data.result != undefined) {
                if (data.result["code"] == 0) {
                    $scope.userid = data.result["data"]["id"];
                    $scope.get_cardPresent();
                }
            } else { //错误信息弹窗
                $scope.error = true;
                $scope.notice = data["error"]["message"];
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
        ngVerify.check('landform', function(res) {
            if (res.length != 0) {
                $scope.notice = res[0]["ngVerify"]["OPTS"]["errmsg"];
                $scope.$apply()
            } else {
                var inviteList = {
                    "jsonrpc": "2.0",
                    "method": "inviteCode",
                    "params": [{
                        "inviteCode": $scope.info.invited_code
                    }],
                    "id": 1
                }
                v20.get($rootScope.url_global + '/passport/service.php?c=card', inviteList).then(function(data) {
                    if (data.result != undefined) {
                        if (data.result["code"] == 0) {
                            $scope.login_main()
                        } else {
                            console.log(data)
                            $ionicPopup.alert({
                                title: '提示',
                                template: data.result["message"],
                                okText: '嗯！知道了', // String
                                okType: 'button-energized',
                            });
                        }
                    } else { //错误信息弹窗
                        $scope.error = true;
                        $scope.notice = data["error"]["message"];
                    }
                })
            }
        }, false);

    }
}])