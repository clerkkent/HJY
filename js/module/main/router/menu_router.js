;
HJY.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", "$locationProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider, $httpProvider) {
    window.version_glo = "2.3";
    $ionicConfigProvider.views.maxCache(5);
    var v = "?" + window.version_glo;

    function accMul(arg1, arg2) {
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) {}
        try { m += s2.split(".")[1].length } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }
    //给Number类型增加一个mul方法，调用起来更加方便。
    Number.prototype.mul = function(arg) {
        return accMul(arg, this);
    }
    $stateProvider.state("login", {
            url: "/login",
            controller: "loginc",
            templateUrl: "html/login/login_regist.html" + v,
        })
        .state("login.weixinbind", {
            url: "/weixinbind",
            controller: "weixin",
            templateUrl: "html/login/weixin_bind.html" + v,
        })
        .state("error", {
            url: "/error",
            templateUrl: "html/login/error.html" + v,
        })
        .state("help", {
            url: "/help",
            controller: "help",
            templateUrl: "html/help/help.html" + v,
        })
        .state("friend_invi", {
            url: "/friend_invi",
            controller: "friend",
            cache: 'false',
            templateUrl: "html/friend/friendRequest.html" + v,
        })
        .state("friend_request_details", {
            url: "/friend_request_details",
            controller: "friend_request_details",
            templateUrl: "html/friend/friend_request_details.html" + v,
        })
        .state("pay", {
            url: "/pay",
            controller: "pay",
            templateUrl: "html/pay/pay.html" + v
        })
        .state("mycenter", {
            url: "/mycenter",
            controller: "mycenter",
            templateUrl: "html/mycenter/my_center.html" + v
        })
        .state("buy", {
            url: "/buy",
            controller: "buy",
            templateUrl: "html/buy/index01.html" + v,
            resolve: {
                loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('./js/plugins/swiper-3.4.0.min.js' + v); // 按需加载目标 js file
                }]
            }
        })
        .state("game", {
            url: "/game",
            controller: "game",
            cache: "false",
            templateUrl: "html/game/game.html" + v
        })
        .state("game.select", {
            url: "/select",
            controller: "game_select",
            cache: 'false',
            templateUrl: "html/game/select.html" + v
        })
        .state("game.login", {
            url: "/login",
            controller: "game_login",
            cache: "false",
            templateUrl: "html/game/get_login.html" + v,
        })
        .state("game.main", {
            url: "/main",
            controller: "game",
            cache: 'false',
            templateUrl: "html/game/game_main.html" + v
        })
        .state("game_success", {
            url: "/game_success",
            cache: 'false',
            controller: "game_success",
            templateUrl: "html/game/game_success.html" + v
        })
        .state("download", {
            url: "/download",
            cache: 'false',
            controller: "download",
            templateUrl: "html/game/appdown.html" + v
        })
        .state("land", {
            url: "/land",
            controller: "land",
            templateUrl: "html/land/land.html" + v,
            resolve: {
                predata: "land",
                parse: "login_logic",
                get: function(predata, parse) {
                    var mytime = new Date();
                    var t = mytime.getTime();
                    var params = {
                        "time": t
                    }
                    var list = {
                        "jsonrpc": "2.0",
                        "method": "getProductType",
                        "params": [{
                            "time": t,
                            "sign": parse.md(params),
                        }],
                        "id": 1
                    }
                    return predata.get_type(list);
                },
                get_predata: function(predata, parse, get) {
                    var x = parse.parse_url();
                    var channel = "renrenche";
                    var list = null;
                    var all = get["result"];
                    var name = "落地页";
                    var id = null;
                    var a = function(arr) {
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i]["product_name"] == name) {
                                id = arr[i]["id"]
                            }
                        }
                    }
                    a(all);
                    var mytime = new Date();
                    var t = mytime.getTime();
                    var params = {
                        "time": t,
                        "type": id
                    }
                    list = {
                        "jsonrpc": "2.0",
                        "method": "productList",
                        "params": [{
                            // "user_id": "5",
                            "time": t,
                            "type": id,
                            "sign": parse.md(params)
                        }],
                        "id": 1
                    }

                    function judge(obj) {　　
                        for (var i in obj) { //如果不为空，则会执行到这一步，返回true
                            　　　　 return true;　　 }　
                        return false;
                    }
                    if (judge(x)) {
                        if (x["ch"] != undefined) {
                            channel = x["ch"];
                            list = {
                                "jsonrpc": "2.0",
                                "method": "productList",
                                "params": [{
                                    // "user_id": "5",
                                    "time": t,
                                    "type": id,
                                    "sign": parse.md(params),
                                }],
                                "id": 1
                            }
                        }
                    }

                    return predata.submit(list);
                }

            }
        })
        .state("land.pay_success", {
            url: "/pay_success",
            controller: "pay_success",
            templateUrl: "html/land/pay_success.html" + v
                // onEnter: function() { //此处处理父组件的download出现在子组件中的BUG
                //     $(".download").hide()
                // },
                // onExit: function() {
                //     $(".download").show()
                // }
        })
        .state("land.pay_success.pay_fails", {
            url: "/pay_fails",
            controller: "pay_fails",
            templateUrl: "html/land/payfail.html" + v
        })
        .state("register_agreement", {
            url: "/register_agreement",
            controller: "help",
            templateUrl: "html/agreement/register_agreement.html" + v
        })
        .state("user_agreement", {
            url: "/user_agreement",
            controller: "help",
            templateUrl: "html/agreement/user_agreement.html" + v
        })
        // .state("feedback", {
        //     url: "/feedback",
        //     controller: "help",
        //     templateUrl: "html/help/feedback.html",
        // })//信息反馈页面
    $urlRouterProvider.otherwise("error");
    var browser = {
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
    if (!(browser.versions.mobile || browser.versions.android || browser.versions.ios)) {
        location.hash = "/error"
    }
    // $locationProvider.html5Mode(true);
}]);
HJY.run(['$rootScope', function($rootScope) {
    console.log(location.hostname)
    if (location.hostname == "www.ihaomu.com") {
        console.log("统计")
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?fdb9e557f9cc49a60c8ed0c30b13a40e";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    }
    // $rootScope.url_global = "http://192.168.11.179:8888";
    $rootScope.url_global = "http://" + location.hostname; //本地测试

}]);