HJY.controller("v11", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}])
HJY.controller("sign", ["$timeout", "webappSDK", "$ionicBackdrop", "$scope", "$state", "login_logic", "v11", "$rootScope", "_", "$ionicPopup", "$http", function($timeout, webappSDK, $ionicBackdrop, $scope, $state, login_logic, v11, $rootScope, _, $ionicPopup, $http) {
    $scope.url = location.search; //参数
    $scope.theRequest = new Object();
    $("title").html("签到")
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var date = date.getDate();
    $scope.data = v11.date(year, month, date);
    $scope.w = $scope.data.w;
    $scope.d = $scope.data.d;
    $scope.t = $scope.data.t;
    $scope.main_sign = function(res) {
            $scope.test = "dasdad";
            var list = {
                "jsonrpc": "2.0",
                "method": "newCheckIn",
                "params": [],
                "id": 1
            }
            $scope.signx = [];
            v11.get($rootScope.url_global + '/passport/service.php?c=account', list, res).then(function(data) {
                if (data["result"] != undefined) {

                    if (data["result"]["message"] == "您今天已经签到，请明天再来") {
                        // $ionicBackdrop.retain();
                        // $(".sign_v11 .sign_popum").show();
                        // $("body").click(function() {
                        //     $(".sign_v11 .sign_popum").hide()
                        //     $ionicBackdrop.release();
                        // })
                    } else {
                        $ionicBackdrop.retain();
                        $(".sign_v11 .sign_popum").show();
                        $("body").click(function() {
                            $(".sign_v11 .sign_popum").hide()
                            $ionicBackdrop.release();
                        })
                    }

                    $scope.data = v11.date(data["result"]["year"], data["result"]["month"] - 1, data["result"]["day"]);
                    $scope.w = $scope.data.w;
                    $scope.d = $scope.data.d;
                    $scope.t = $scope.data.t;
                    $scope.c = data["result"]["checkin"][0]["checkin_num"];
                    $scope.oil = data["result"]["checkin"][0]["oildrop_num"];
                    $scope.toil = data["result"]["tmorrowOil"]
                    for (var i = 0; i < data["result"]["checkin"].length; i++) {
                        $scope.signx.push(moment(data["result"]["checkin"][i]["checkin_date"]).date())
                    }

                    for (var i = 0; i < $(".sign_v11 .days li").length; i++) {
                        if ($(".sign_v11 .days li"))
                            for (var j = 0; j < $scope.signx.length; j++) {
                                if ((data["result"]["month"] / 1 - 1) == moment(data["result"]["checkin"][j]["checkin_date"]).month()) {
                                    if ($(".sign_v11 .days li").eq(i).html() == $scope.signx[j] && $(".sign_v11 .days li").eq(i).html() != (data["result"]["day"] / 1)) {
                                        $(".sign_v11 .days li").eq(i).addClass("select")
                                    } else if ($(".sign_v11 .days li").eq(i).html() == $scope.signx[j] && $(".sign_v11 .days li").eq(i).html() == (data["result"]["day"] / 1)) {

                                        $scope.oil = data["result"]["checkin"][j]["oildrop_num"]
                                        $(".sign_v11 .days li").eq(i).addClass("tselect")
                                    }
                                }
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
        }
        // if ($scope.url.indexOf("?") != -1) {
        //     var str = $scope.url.substr(1);
        //     $scope.strs = str.split("&");
        //     for (var i = 0; i < $scope.strs.length; i++) {
        //         $scope.theRequest[$scope.strs[i].split("=")[0]] = $scope.strs[i].split("=")[1]; //提取url中的参数
        //     }
        //     $scope.userid = $scope.theRequest.user_id;
        //     $scope.strs = $scope.theRequest.OIL_TOKEN;
        //     if ($scope.userid == "" && $scope.strs == "") {
        //         if (login_logic.JudgeSystem()) {
        //             $ionicPopup.alert({
        //                 title: '提示',
        //                 template: "请先登录",
        //                 okText: '嗯！知道了', // String
        //                 okType: 'button-energized',
        //             });
        //             var axxxx = JSON.parse(hjytest.toLogin());
        //         } else {
        //             $ionicPopup.alert({
        //                 title: '提示',
        //                 template: "请先登录",
        //                 okText: '嗯！知道了', // String
        //                 okType: 'button-energized',
        //             });
        //             webappSDK.toLogin(function(res) {

    //             })
    //         }
    //     }
    //     $scope.main_sign()
    // } else {

    // }
    // $scope.main_sign();
    var shareList = {
        title: "签到",
        content: "每日签到领油滴，充油抵现等你来!",
        imageUrl: $rootScope.url_global + "/wechat/images/share.jpg",
        url: $rootScope.url_global + "/wechat/#/funcpage/register",
    }
    if (login_logic.JudgeSystem()) {
        // var axxxx = JSON.parse(hjytest.getUserInfos("js调用了android中的hello方法"));
        if (navigator.appVersion.split("hjyAndroidAPP")[1] == "2.0.2") {
            hjytest.getShareDetail(JSON.stringify(shareList))
        }

        function aa(x) {
            $scope.userid = x.user_id;
            $scope.strs = x.OIL_TOKEN;
            if ($scope.userid == "" && $scope.strs == "") {
                $ionicPopup.confirm({
                    title: '提示',
                    template: "请先登录",
                    okText: '登录', // String
                    okType: 'button-energized',
                    cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                    cancelType: 'button-energized', // String (默认: 'button-default')。取消按钮的类型。
                }).then(function(res) {
                    if (res) {
                        var axxxx = JSON.parse(hjytest.toLogin(" "));
                    } else {
                        hjytest.callBack(" ")
                    }
                });
            } else {
                $scope.main_sign($scope.strs)
            }
        }
        aa(JSON.parse(hjytest.getUserInfos("js调用了android中的hello方法")))


    } else {
        if (navigator.appVersion.split("hjyiOSAPP")[1].split(" ")[0] == "2.0.2") {
            webappSDK.getShareDetail(shareList)
        }
        webappSDK.getUserInfos(function(res) {
            var info = JSON.parse(res)
            $scope.userid = info.user_id
            $scope.strs = info.OIL_TOKEN //webbriage入口
            if ($scope.userid == "" && $scope.strs == "") {
                $ionicPopup.confirm({
                    title: '提示',
                    template: "请先登录",
                    okText: '登录', // String
                    okType: 'button-energized',
                    cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
                    cancelType: 'button-energized', // String (默认: 'button-default')。取消按钮的类型。
                }).then(function(res) {
                    if (res) {
                        webappSDK.toLogin()
                    } else {
                        webappSDK.callBack()
                    }

                });
            } else {
                $scope.main_sign($scope.strs)
            }

        })
    }
}])
HJY.controller("task", ["$timeout", "$ionicBackdrop", "$scope", "$state", "login_logic", "v11", "$rootScope", "_", "$ionicPopup", "$http", "webappSDK", function($timeout, $ionicBackdrop, $scope, $state, login_logic, v11, $rootScope, _, $ionicPopup, $http, webappSDK) {
    $("title").html("奖励计划")
    $scope.userid = "";
    $scope.strs = "";
    $scope.main_task = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "TaskList",
            "params": [{
                "user_id": $scope.userid
            }],
            "id": 1
        }
        $scope.b = ["images/v11/ic_novice_one.png", "images/v11/ic_novice_two.png", "images/v11/ic_novice_three.png", "images/v11/ic_novice_four.png", "images/v11/ic_novice_four.png"]
        $scope.date = function() {
            v11.get($rootScope.url_global + '/passport/service.php?c=task', list, $scope.strs).then(function(data) {
                $scope.startTime = moment.unix(data["result"][0]["s_time"] * 1).format('YYYY年MM月DD日');
                $scope.endTime = moment.unix(data["result"][0]["e_time"] * 1).format('YYYY年MM月DD日');
                if (data["result"] != undefined) {
                    console.log(data["result"])
                    $scope.task = data["result"];
                } else {
                    console.log(data)
                    $ionicPopup.alert({
                        title: '提示',
                        template: data["error"]["message"],
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    });
                }
            })
        }
        $scope.date();
        $scope.goget = function(x) {
            if (location.hostname == "www.ihaomu.com" || location.hostname == "www.ihuijiayou.com") {
                _hmt.push(['_trackPageview', "/getprize"]);
            }
            var signlist = {
                "jsonrpc": "2.0",
                "method": "TaskUserGet",
                "params": [{
                    "user_id": $scope.userid,
                    "id": x.id,
                    "order_id": x.order_id

                }],
                "id": 1
            }
            v11.get($rootScope.url_global + '/passport/service.php?c=task', signlist).then(function(data) {
                if (data["result"].code == 0) {
                    $scope.date();
                    $(".task_popum").show()
                    $ionicBackdrop.retain();
                    $timeout(function() {
                        $(".task_popum").hide()
                        $ionicBackdrop.release();
                    }, 2000);
                } else {
                    $ionicPopup.alert({
                        title: '提示',
                        template: "领取失败，请稍后重试",
                        okText: '嗯！知道了', // String
                        okType: 'button-energized',
                    });
                }

            })
        }
    }
    $scope.gobuy = function() {
            if (location.hostname == "www.ihaomu.com" || location.hostname == "www.ihuijiayou.com") {
                _hmt.push(['_trackPageview', "/gobuy"]);
            }
            if (login_logic.JudgeSystem()) {
                hjytest.doTheTask(" ")
            } else {
                webappSDK.doTheTask()
            }
        }
        // $scope.theRequest = new Object();
        // $scope.url = location.search; //参数
        // if ($scope.url.indexOf("?") != -1) {
        //     var str = $scope.url.substr(1);
        //     $scope.strs = str.split("&");
        //     for (var i = 0; i < $scope.strs.length; i++) {
        //         $scope.theRequest[$scope.strs[i].split("=")[0]] = $scope.strs[i].split("=")[1]; //提取url中的参数
        //     }
        //     $scope.userid = $scope.theRequest.user_id;
        //     $scope.strs = $scope.theRequest.OIL_TOKEN;
        //     $scope.main_task()
        // } else {
    var shareList = {
        title: "奖励计划",
        content: "完成充油任务，领取多重大奖!",
        imageUrl: $rootScope.url_global + "/wechat/images/share.jpg",
        url: $rootScope.url_global + "/wechat/#/funcpage/register",
    }
    if (login_logic.JudgeSystem()) {
        if (navigator.appVersion.split("hjyAndroidAPP")[1] == "2.0.2") {
            hjytest.getShareDetail(JSON.stringify(shareList))
        }
        var axxxx = JSON.parse(hjytest.getUserInfos("js调用了android中的hello方法"));
        $scope.userid = axxxx.user_id;
        $scope.strs = axxxx.OIL_TOKEN;
        // $ionicPopup.alert({
        //     title: '提示',
        //     template: $scope.userid,
        //     okText: '嗯！知道了', // String
        //     okType: 'button-energized',
        // });
        // $ionicPopup.alert({
        //     title: '提示',
        //     template: $scope.strs,
        //     okText: '嗯！知道了', // String
        //     okType: 'button-energized',
        // });
        $scope.main_task()
    } else {
        if (navigator.appVersion.split("hjyiOSAPP")[1].split(" ")[0] == "2.0.2") {
            webappSDK.getShareDetail(shareList)
        }
        webappSDK.getUserInfos(function(res) {
            var info = JSON.parse(res)
            $scope.userid = info.user_id
            $scope.strs = info.OIL_TOKEN //webbriage入口
            $scope.main_task()
        })
    }
    // }
}])
HJY.controller("v11_help", ["$sce", "webappSDK", "$timeout", "$ionicBackdrop", "$scope", "$state", "login_logic", "v11", "$rootScope", "_", "$ionicPopup", "$http", function($sce, webappSDK, $timeout, $ionicBackdrop, $scope, $state, login_logic, v11, $rootScope, _, $ionicPopup, $http) {
    $("title").html("帮助")
    $scope.img = ["images/v11/ic_help_directions@3x.png", "images/v11/ic_help_Red@3x.png", "images/v11/ic_help_Package@3x.png", "images/v11/ic_help_account@3x.png", "images/v11/ic_help_invoice@3x.png", "images/v11/ic_help_refunds@3x.png"]
    var list = {
        "jsonrpc": "2.0",
        "method": "helperList",
        "params": [],
        "id": 1
    }
    v11.get($rootScope.url_global + '/operate/index.php?c=helper', list, $scope.strs).then(function(data) {
        $scope.page = _.toArray(_.groupBy(data["result"], function(num, index) { return Math.floor(index / 4); }))
        $scope.help_information = data["result"][0]["con"];
        $scope.title = data["result"][0]["type"];
        login_logic.deal_help()
    })
    $scope.se = function(x, y) {
        $scope.title = y;
        $scope.help_information = x;
    }
    $scope.gonote = function() {
        if (location.hostname == "www.ihaomu.com" || location.hostname == "www.ihuijiayou.com") {
            _hmt.push(['_trackPageview', "/addition"]);
        }
        $state.go("help_guide")
    }
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $(".pagenicon_v11").eq(0).css({ width: ".34133304rem" });
        $(".slider-slide ul li").eq(0).find("span").addClass("select")
        $(".slider-slide ul li").click(function() {
            $(".slider-slide ul li").find("span").removeClass("select")
            $(this).find("span").addClass("select")
        })
    })
    $scope.slideHasChanged = function(x) {
        $(".pagenicon_v11").css({ width: ".14133304rem" })
        $(".pagenicon_v11").eq(x).css({ width: ".34133304rem" })
    }
    $scope.trans = function(str) {
        var a = [str];
        var xx = [];

        return a;

    }
    $scope.console = function() {
        if (login_logic.JudgeSystem()) {
            hjytest.CustomerService(" ")
        } else {
            if (navigator.appVersion.split("hjyiOSAPP")[1].split(" ")[0].replace(/\./g, "") * 1 >= 200) {
                webappSDK.CustomerService()
            } else {
                location.href = "http://a1.7x24cc.com/phone_webChat.html?accountId=N000000010362&chatId=yykj-c5867180-39d1-11e7-bd22-61f4856f24a8"
            }
        }
    }
    $scope.call = function(phone) {
        if (login_logic.JudgeSystem()) {
            hjytest.call(phone)
        } else {
            webappSDK.call(phone)
        }
    }
}])
HJY.controller("v11_article", ["$scope", "webappSDK", "$rootScope", "$state", "login_logic", function($scope, webappSDK, $rootScope, $state, login_logic) {
    $("title").html("会加油新闻");
    var shareList = {
        title: "联合中国石油，会加油建立车主新生态",
        content: "日前，创新的车主综合服务平台“会加油”，携手中国石油旗下成品油销售版块、非油品销售版块、昆仑润滑油版块以及汽车后市场系统等企业共同亮相",
        imageUrl: $rootScope.url_global + "/wechat/images/share.jpg",
        url: location.href,
    }
    if (login_logic.JudgeSystem()) {
        if (navigator.appVersion.split("hjyAndroidAPP")[1] == "2.0.2") {
            hjytest.getShareDetail(JSON.stringify(shareList))
        }
    } else {
        if (navigator.appVersion.split("hjyiOSAPP")[1].split(" ")[0] == "2.0.2") {
            webappSDK.getShareDetail(shareList)
        }
    }
}])