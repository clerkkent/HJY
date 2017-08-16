HJY.controller("v20", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {

}])
HJY.controller("shake", ["$scope", "$rootScope", "$state", "webappSDK", "$ionicPopup", "login_logic", "$timeout", "$ionicBackdrop", "v20", function($scope, $rootScope, $state, webappSDK, $ionicPopup, login_logic, $timeout, $ionicBackdrop, v20) {
    $scope.PrizeList = null;
    $scope.allPrizeList = null;
    $scope.shakePrize = null;
    $scope.personPrizeList = null;
    $scope.user_id = "";
    $scope.token = "";
    $scope.activity_status = 1;
    $("title").html("摇一摇");

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
                    $scope.startTime = moment.unix(data["result"]["state_time"] * 1).format('YYYY年MM月DD日');
                    $scope.endTime = moment.unix(data["result"]["end_time"] * 1).format('YYYY年MM月DD日');
                    $scope.main_prize = _.filter(data["result"]["list"], function(num) { return num["img"] != ''; });
                    $scope.other_prize = _.filter(data["result"]["list"], function(num) { return num["img"] == ''; });
                    $scope.prize_number = data["result"]["prize_number"]
                    $scope.PrizeList = data["result"]["list"]
                    $scope.activity_status = data["result"]["activity_status"];
                    if ($scope.activity_status == 2) {
                        $(".left_chance").text("活动已结束")
                    }
                }
            }
        )
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
    if (login_logic.JudgeSystem()) {
        $scope.copyright = false;
    } else {
        $scope.copyright = true;
    }

    $scope.dealpic = function(x) { //上线前修改
        return $rootScope.url_global + "/operate/uploads/" + x
    }
    var myShakeEvent = new Shake({
        threshold: 10,
        timeout: 3000
    });
    myShakeEvent.start();


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
                    if (res) {
                        var axxxx = JSON.parse(hjytest.toLogin(" "));
                    }
                } else {
                    if (res) {
                        webappSDK.toLogin()
                    }
                }
            });
        } else {
            $scope.getPersonalList();
            myShakeEvent.stop();
            $(".fade").on("touchmove", function(event) {
                event.preventDefault;
            }, false)
            $(".myprize").show();
            $(".fade").show();

        }

    }
    $scope.hidePrizeList = function() {
        myShakeEvent.start();
        $(".fade").off("touchmove");
        $(".myprize").hide()
        $(".fade").hide()
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
            if (data["result"] != undefined) {
                if (data["result"]["id"] != undefined) {
                    $scope.shakePrize = data["result"]["lottery_name"];
                    $(".shake_win").show()
                    $(".fade").show()
                    myShakeEvent.stop();
                    $("body").on("touchmove", function(event) {
                        event.preventDefault;
                    }, false)
                    $(".shake_win .close").click(function() {
                        console.log(data)
                        $scope.getPrizeList();
                        $scope.getPersonalList();
                        myShakeEvent.start();
                        $(".shake_win").hide()
                        $(".fade").hide()
                        $("body").off("touchmove");
                    })
                } else {
                    $(".shake_lose").show()
                    $(".fade").show()
                    myShakeEvent.stop();
                    $("body").on("touchmove", function(event) {
                        event.preventDefault;
                    }, false)
                    $(".shake_lose .close").click(function() {
                        console.log(data)
                        $scope.getPrizeList();
                        $scope.getPersonalList();
                        myShakeEvent.start();
                        $(".shake_lose").hide()
                        $(".fade").hide()
                        $("body").off("touchmove");
                    })
                }
            } else {
                $ionicPopup.alert({
                    title: "提示",
                    template: data["error"]["message"],
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
            }


        })
    }
    var shake_result = _.throttle($scope.shakeResult, 3000)

    function remove() {
        $(".hand").removeClass("shake");
        if ($scope.user_id == "" && $scope.token == "") {
            $ionicPopup.alert({
                title: '提示',
                template: "您还未登录,请先登录",
                okText: '嗯！知道了', // String
                okType: 'button-energized',
            });
        } else {
            if ($scope.activity_status == 1) {
                shake_result();
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: "活动已结束",
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
            }
        }

    }

    $scope.test = function() {
        $timeout(remove, 1000);
        $("#audio")[0].play();
        $(".hand").addClass("shake");
    }
    window.addEventListener('shake', $scope.test, false);
    var shareList = {
        title: "摇一摇",
        content: "充油摇一摇，抽iPhone 7、电影票，100%中奖!",
        imageUrl: $rootScope.url_global + "/wechat/images/share.jpg",
        url: $rootScope.url_global + "/wechat/#/funcpage/register",
    }
    if (login_logic.JudgeSystem()) {
        var axxxx = JSON.parse(hjytest.getUserInfos("js调用了android中的hello方法"));
        if (navigator.appVersion.split("hjyAndroidAPP")[1] == "2.0.2") {
            hjytest.getShareDetail(JSON.stringify(shareList))
        }
        $scope.user_id = axxxx.user_id;
        $scope.token = axxxx.OIL_TOKEN;
        $scope.getPrizeList();
        $scope.getAllPrizeList();
    } else {
        if (navigator.appVersion.split("hjyiOSAPP")[1].split(" ")[0] == "2.0.2") {
            webappSDK.getShareDetail(shareList)
        }
        webappSDK.getUserInfos(function(res) {
            var info = JSON.parse(res)
            $scope.user_id = info.user_id
            $scope.token = info.OIL_TOKEN //webbriage入口
            $scope.getPrizeList();
            $scope.getAllPrizeList();
        })
    }
}])
HJY.controller("schoolmate", ["$scope", "v20", "$ionicBackdrop", "$rootScope", "$state", "login_logic", "ngVerify", "$interval", "$ionicPopup", function($scope, v20, $ionicBackdrop, $rootScope, $state, login_logic, ngVerify, $interval, $ionicPopup) {
    $scope.test = "dasdad";
    $scope.error = true;
    $scope.timeout = false;
    $scope.notice = ""
    $scope.key = "";
    $scope.second = "获取验证码";
    $scope.text = "绑定会员卡";
    $scope.download_text = "";
    $scope.success = false;
    $("title").html("会员卡绑定");
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
                $scope.notice = "";
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
                $scope.notice = data["error"]["message"];
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
        $(".fade").hide()
        $(document).off('touchmove')
    }

    $scope.get_cardPresent = function(user_id) {
        var inviteList = {
            "jsonrpc": "2.0",
            "method": "UserCodeGetCardbag",
            "params": [{
                "type": 1,
                "user_id": user_id,
                "ExCode": $scope.info.invited_code,
                "user_name": $scope.info.name
            }],
            "id": 1
        }

        v20.get($rootScope.url_global + '/passport/service.php?c=card', inviteList).then(function(data) {
            if (data.result != undefined) {
                if (data.result["code"] == 0) {
                    $scope.notice = ""
                    $scope.card_message = "成功领取会加油尊享会员卡！"
                    $scope.popumback = "ic_card_p_h.png"
                    $scope.success = false;
                    $scope.download_text = "立即体验";
                    $(".fade").show();
                    $(".schoolmate .schoolmate_popum01").show();
                    $(document).on('touchmove', function(e) {
                        e.preventDefault()
                    })
                    $(".schoolmate_popum01 .close").click = function() {
                        $(".schoolmate_popum01").hide();
                        $(".fade").hide()
                        $(document).off('touchmove')
                    }
                } else {
                    $scope.error = true;
                    $scope.notice = data["result"]["message"];
                    $scope.card_message = "会员卡太火爆，被抢光了！"
                    $scope.popumback = "ic_card_p_n.png"
                    $scope.download_text = "下载App";
                    $scope.success = true;
                    $(".fade").show();
                    $(".schoolmate .schoolmate_popum01").show();
                    $(document).on('touchmove', function(e) {
                        e.preventDefault()
                    })
                    $(".schoolmate_popum01 .close").click = function() {
                        $(".schoolmate_popum01").hide();
                        $(".fade").hide()
                        $(document).off('touchmove')
                    }
                }
            } else { //错误信息弹窗
                $scope.error = true;
                $scope.notice = data["error"]["message"];
            }
        })
    }
    $scope.login_main = function(signxx) {
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

        var promise_login = login_logic.submit(list_login);
        promise_login.then(function(data) {
            if (data.result != undefined) {
                if (data.result["code"] == 0) {
                    $scope.userid = data.result["data"]["id"];
                    if (signxx) {
                        $scope.get_cardPresent(data.result["data"]["id"]);
                    } else {
                        $scope.notice = ""
                        $scope.error = true;
                        $scope.card_message = "注册成功！"
                        $scope.download_text = "下载App";
                        $scope.success = 3;
                        $(".fade").show();
                        $(".schoolmate .schoolmate_popum01").show();
                        $(document).on('touchmove', function(e) {
                            e.preventDefault()
                        })
                        $(".schoolmate_popum01 .close").click = function() {
                            $(".schoolmate_popum01").hide();
                            $(".fade").hide()
                            $(document).off('touchmove')
                        }
                    }
                } else {
                    $ionicPopup.confirm({
                        title: '提示',
                        template: "注册失败",
                        okText: '确认', // String
                        okType: 'button-energized',
                        cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                        cancelType: 'button-energized', // String (默认: 'button-default')。取消按钮的类型。
                    }).then(function(res) {
                        if (res) {
                            location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.huijiayou.huijiayou"
                        } else {
                            location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.huijiayou.huijiayou"
                        }
                    });
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
    $scope.registed = null;
    $scope.loginc = function() { //登录注册
        var list_login = null;
        var promise_login = null;
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
                    $scope.registed = true;
                    $scope.login_main()
                } else {
                    $ionicPopup.alert({
                        title: '提示',
                        template: "您已注册！",
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    });
                    location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.huijiayou.huijiayou"
                }
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
                console.log(res)
                $scope.$apply();
            } else {
                if ($scope.info.invited_code != "" && $scope.info.invited_code.length == 6) {
                    var inviteList = {
                        "jsonrpc": "2.0",
                        "method": "inviteCode",
                        "params": [{
                            "type": 1,
                            "inviteCode": $scope.info.invited_code
                        }],
                        "id": 1
                    }
                    v20.get($rootScope.url_global + '/passport/service.php?c=card', inviteList).then(function(data) {
                        if (data.result != undefined) {
                            if (data.result["code"] == 0) {
                                $scope.login_main(true)
                            } else {
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
                } else if ($scope.info.invited_code != "" && $scope.info.invited_code.length != 6) {
                    $scope.error = true;
                    $scope.notice = "兑换码格式错误";
                } else if ($scope.info.invited_code == "") {
                    $scope.loginc(false);
                }
            }
        }, false);

    }
}])
HJY.controller("vipcard", ["$scope", "v20", "$rootScope", "$ionicBackdrop", "$rootScope", "$state", "webappSDK", "login_logic", "ngVerify", "$interval", "$ionicPopup", function($scope, v20, $rootScope, $ionicBackdrop, $rootScope, $state, webappSDK, login_logic, ngVerify, $interval, $ionicPopup) {
    $scope.banner = null;
    $scope.transfrom = function(x) {
        return x.toString().replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 ");
    }
    $("title").html("会员卡");
    $scope.getCard = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "UserCard",
            "params": [{
                "user_id": $scope.user_id
            }],
            "id": 1
        }

        v20.get($rootScope.url_global + '/passport/service.php?c=card', list, $scope.token).then(function(data) {
            console.log(data)
            if (data["result"] != undefined) {
                if (data["result"].length != 0) {
                    $scope.card = data["result"]
                } else {
                    // location.replace($rootScope.url_global + "/wechat/#/v20/getvip")
                }
                if (data["result"][0]["privilege"] instanceof Array) {
                    $scope.selectcard = data["result"][0]["privilege"]
                    $scope.selectcardCheck = data["result"][0]["privilege"][0]
                } else {
                    $scope.selectcard = [];
                }

            }
        })
    }

    if (login_logic.JudgeSystem()) {
        var axxxx = JSON.parse(hjytest.getUserInfos("js调用了android中的hello方法"));
        $scope.user_id = axxxx.user_id;
        $scope.token = axxxx.OIL_TOKEN;
        var listx = {
            "jsonrpc": "2.0",
            "method": "GetCordUserState",
            "params": [{
                "user_id": $scope.user_id
            }],
            "id": 1
        }

        v20.get($rootScope.url_global + '/passport/service.php?c=card', listx, $scope.token).then(function(data) {
            if (data["result"] != undefined) {
                if (data["result"] == 1) {

                } else {
                    location.replace($rootScope.url_global + "/wechat/#/v20/getvip")
                }
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: data["error"]["message"],
                    okText: '嗯！知道了', // String
                    okType: 'button-calm',
                });
            }
        })
        var list = {
            "jsonrpc": "2.0",
            "method": "UserCard",
            "params": [{
                "user_id": $scope.user_id
            }],
            "id": 1
        }

        v20.get($rootScope.url_global + '/passport/service.php?c=card', list, $scope.token).then(function(data) {
            if (data["result"] != undefined) {
                if (data["result"].length != 0) {
                    $scope.card = data["result"]
                } else {
                    // location.replace($rootScope.url_global + "/wechat/#/v20/getvip")
                }
                if (data["result"][0]["privilege"] instanceof Array) {
                    $scope.selectcard = data["result"][0]["privilege"]
                    $scope.selectcardCheck = data["result"][0]["privilege"][0]
                } else {
                    $scope.selectcard = [];
                }

            }
        })
    } else {
        webappSDK.getUserInfos(function(res) {
            var info = JSON.parse(res)
            $scope.user_id = info.user_id
            $scope.token = info.OIL_TOKEN //webbriage入口
            var listx = {
                "jsonrpc": "2.0",
                "method": "GetCordUserState",
                "params": [{
                    "user_id": $scope.user_id
                }],
                "id": 1
            }

            v20.get($rootScope.url_global + '/passport/service.php?c=card', listx, $scope.token).then(function(data) {

                if (data["result"] != undefined) {
                    if (data["result"] == 1) {

                    } else {
                        location.replace($rootScope.url_global + "/wechat/#/v20/getvip")
                    }
                } else {
                    $ionicPopup.alert({
                        title: '提示',
                        template: data["error"]["message"],
                        okText: '嗯！知道了', // String
                        okType: 'button-calm',
                    });
                }
            })
            var list = {
                "jsonrpc": "2.0",
                "method": "UserCard",
                "params": [{
                    "user_id": $scope.user_id
                }],
                "id": 1
            }

            v20.get($rootScope.url_global + '/passport/service.php?c=card', list, $scope.token).then(function(data) {
                if (data["result"] != undefined) {
                    if (data["result"].length != 0) {
                        $scope.card = data["result"]
                    } else {
                        // location.replace($rootScope.url_global + "/wechat/#/v20/getvip")
                    }
                    if (data["result"][0]["privilege"] instanceof Array) {
                        $scope.selectcard = data["result"][0]["privilege"]
                        $scope.selectcardCheck = data["result"][0]["privilege"][0]
                    } else {
                        $scope.selectcard = [];
                    }

                }
            })
        })
    }

    $scope.dealpic = function(x) { //上线前修改
        return $rootScope.url_global + "/operate/uploads/" + x
    }
    $scope.getStatus = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "userGetCardPrivilege",
            "params": [{
                "user_id": $scope.user_id,
                "id": $scope.selectcardCheck.id,
                "card_id": $scope.selectcardCheck.card_id,
                "get_type_time": $scope.selectcardCheck.get_type_time,
                "packet_id": $scope.selectcardCheck.packet_id
            }],
            "id": 1
        }

        v20.get($rootScope.url_global + '/passport/service.php?c=card', list, $scope.token).then(function(data) {
            if (data["result"] != undefined) {
                if (data["result"]["code"] == 0) {
                    $ionicPopup.alert({
                        title: '提示',
                        template: "领取成功",
                        okText: '嗯！知道了', // String
                        okType: 'button-calm',
                    });
                    $scope.getCard();
                } else {
                    $ionicPopup.alert({
                        title: '提示',
                        template: data["result"]["message"],
                        okText: '嗯！知道了', // String
                        okType: 'button-calm',
                    });
                    $scope.getCard();
                }
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: data["error"]["message"],
                    okText: '嗯！知道了', // String
                    okType: 'button-calm',
                });
                $scope.getCard();
            }

        })
    }

}])
HJY.controller("getvip", ["$scope", "v20", "$ionicBackdrop", "$rootScope", "$state", "webappSDK", "login_logic", "ngVerify", "$interval", "$ionicPopup", function($scope, v20, $ionicBackdrop, $rootScope, $state, webappSDK, login_logic, ngVerify, $interval, $ionicPopup) {
    $scope.excode = null;

    if (login_logic.JudgeSystem()) {
        var axxxx = JSON.parse(hjytest.getUserInfos("js调用了android中的hello方法"));
        $scope.user_id = axxxx.user_id;
        $scope.token = axxxx.OIL_TOKEN;
    } else {
        webappSDK.getUserInfos(function(res) {
            var info = JSON.parse(res)
            $scope.user_id = info.user_id
            $scope.token = info.OIL_TOKEN //webbriage入口
        })
    }

    $scope.getVip = function() {
        $(".vipcard_popum01").show();
        $(".vipcard_popum01 .close").click(function() {
            $(".vipcard_popum01").hide();
        })
    }
    $scope.cdkey = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "UserCodeGetCardbag",
            "params": [{
                "type": 1,
                "user_id": $scope.user_id,
                "ExCode": $scope.excode
            }],
            "id": 1
        }

        v20.get($rootScope.url_global + '/passport/service.php?c=card', list, $scope.token).then(function(data) {
            if (data["result"] != undefined) {
                if (data["result"]["code"] == 0) {
                    $ionicPopup.alert({
                        title: '提示',
                        template: "兑换成功",
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    })
                    $state.go("v20.vipcard", {}, { reload: true })
                } else {
                    $ionicPopup.alert({
                        title: '提示',
                        template: data["result"]["message"],
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    });
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
    }
}])