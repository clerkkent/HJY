HJY.controller("v20", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}])
HJY.controller("shake", ["$scope", "$state", "$ionicPopup", "login_logic", "$timeout", "webappSDK", "$ionicBackdrop", "v20", "$rootScope", function($scope, $state, $ionicPopup, login_logic, $timeout, webappSDK, $ionicBackdrop, v20, $rootScope) {
    $scope.test = "dasdad";
    $scope.PrizeList = null;
    $scope.allPrizeList = null;
    $scope.shakePrize = null;
    $scope.personPrizeList = null;
    $scope.user_id = 707;
    $scope.movieUse = function() {
        location.href = "http://t.cn/RoCXpzd"
    }
    $scope.viewOil = function() {

    }
    $scope.dealpic = function(x) {
        return "https://test1.ihuijiayou.com/operate/uploads/" + x
    }
    $scope.token = "ol3vqn3s8tnq4jkaqd8avmu8i7";
    var myShakeEvent = new Shake({
        threshold: 5,
        timeout: 2000
    });
    myShakeEvent.start();
    $scope.getPrizeList = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "PrizeList",
            "params": [{
                "type": 1,
                "user_id": "$scope.user_id"
            }],
            "id": 1
        }
        v20.get($rootScope.url_global + '/passport/service.php?c=prize', list, $scope.token).then(
            function(data) {
                if (data["result"] != undefined) {
                    $scope.main_prize = _.filter(data["result"]["list"], function(num) { return num["img"] != ''; });
                    $scope.other_prize = _.filter(data["result"]["list"], function(num) { return num["img"] == ''; });

                    $scope.PrizeList = data["result"]["list"]
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
    $scope.getPersonalList()
    $scope.showPrizeList = function() {
        myShakeEvent.stop();
        $(".myprize").show()
    }
    $scope.hidePrizeList = function() {
        myShakeEvent.start();
        $(".myprize").hide()
    }

    function remove() {
        $(".hand").removeClass("shake");
        if ($scope.user_id == "" && $scope.token == "") {
            $ionicPopup.alert({
                title: '提示',
                template: "您还未登陆,请登陆",
                okText: '嗯！知道了', // String
                okType: 'button-energized',
            });
            webappSDK.doTheTask()
        } else {
            $scope.shakeResult();
        }

    }
    $scope.shakeResult = function() {
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
                console.log(data)
                $scope.getPrizeList();
                $scope.getPersonalList();
                $scope.shakePrize = data["result"]["lottery_name"];
                $(".shake_win").show()
                $ionicBackdrop.retain()
                myShakeEvent.stop();
                $(".shake_win .close").click(function() {
                    myShakeEvent.start();
                    $(".shake_win").hide()
                    $ionicBackdrop.release()
                })
            } else {
                $ionicPopup.alert({
                    title: '提示',
                    template: data["result"]["message"],
                    okText: '嗯！知道了', // String
                    okType: 'button-energized',
                });
            }

        })
    }


    function test() {
        $("#audio")[0].play();
        $(".hand").addClass("shake");
        $timeout(remove, 1000);

    }

    window.addEventListener('shake', test, false);
}])
HJY.controller("schoolmate", ["$scope", "$state", "login_logic", "ngVerify", "$interval", "$ionicPopup", function($scope, $state, login_logic, ngVerify, $interval, $ionicPopup) {
    $scope.test = "dasdad";
    $scope.error = true;
    $scope.timeout = false;
    $scope.notice = ""
    $scope.key = "";
    $scope.second = "获取验证码";
    $scope.text = "绑定会员卡";
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
    $scope.login = function() { //登录注册
        ngVerify.check('landform', function(res) {
            if (res.length != 0) {
                $scope.notice = res[0]["ngVerify"]["OPTS"]["errmsg"];
                $scope.$apply()
            } else {
                if ($scope.info.invited_code != "") { //判断是否存在邀请码
                    list_login = {
                        "jsonrpc": "2.0",
                        "method": "signin",
                        "params": [{
                            "username": $scope.info.phone, //电话号
                            "sms_key": $scope.key, //短信接口收到的key
                            "sms_code": $scope.info.scode, //验证码
                            "invite_code ": $scope.info.icode,
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
                        console.log(data)
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
        }, false);

    }
}])