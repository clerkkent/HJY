;
HJY.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);
    $stateProvider.state("login", {
            url: "/login",
            controller: "loginc",
            templateUrl: "html/login/login_regist.html",
        })
        .state("login.weixinbind", {
            url: "/weixinbind",
            controller: "weixin",
            templateUrl: "html/login/weixin_bind.html",
        })
        .state("error", {
            url: "/error",
            templateUrl: "html/login/error.html",
        })
        .state("help", {
            url: "/help",
            controller: "help",
            templateUrl: "html/help/help.html",
        })
        .state("friend_invi", {
            url: "/friend_invi",
            controller: "friend",
            cache: 'false',
            templateUrl: "html/friend/friendRequest.html",
        })
        .state("friend_request_details", {
            url: "/friend_request_details",
            controller: "friend_request_details",
            templateUrl: "html/friend/friend_request_details.html",
        })
        .state("pay", {
            url: "/pay",
            controller: "pay",
            templateUrl: "html/pay/pay.html"
        })
        .state("mycenter", {
            url: "/mycenter",
            controller: "mycenter",
            templateUrl: "html/mycenter/my_center.html"
        })
        .state("buy", {
            url: "/buy",
            controller: "buy",
            templateUrl: "html/buy/index01.html",
            resolve: {
                loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('./js/plugins/swiper-3.4.0.min.js'); // 按需加载目标 js file
                }]
            }
        })
        .state("game", {
            url: "/game",
            controller: "game",
            cache: "false",
            templateUrl: "html/game/game.html"
        })
        .state("game.select", {
            url: "/select",
            controller: "game_select",
            cache: 'false',
            templateUrl: "html/game/select.html"
        })
        .state("game.login", {
            url: "/login",
            controller: "game_login",
            cache: "false",
            templateUrl: "html/game/get_login.html",
        })
        .state("game.main", {
            url: "/main",
            controller: "game",
            cache: 'false',
            templateUrl: "html/game/game_main.html"
        })
        .state("game_success", {
            url: "/game_success",
            cache: 'false',
            controller: "game_success",
            templateUrl: "html/game/game_success.html"
        })
        .state("download", {
            url: "/download",
            cache: 'false',
            controller: "download",
            templateUrl: "html/game/appdown.html"
        })
        .state("land", {
            url: "/land",
            controller: "land",
            templateUrl: "html/land/land.html",
            resolve: {
                predata: "land",
                parse: "login_logic",
                get_predata: function(predata, parse) {
                    var x = parse.parse_url();
                    var channel = "renrenche";
                    var list = null;

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
                                    "user_id": "5",
                                    "channel": channel
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
            templateUrl: "html/land/pay_success.html"
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
            templateUrl: "html/land/payfail.html"
        })
        .state("register_agreement", {
            url: "/register_agreement",
            controller: "help",
            templateUrl: "html/agreement/register_agreement.html"
        })
        .state("user_agreement", {
            url: "/user_agreement",
            controller: "help",
            templateUrl: "html/agreement/user_agreement.html"
        })
        .state("funcpage", {
            url: "/funcpage",
            controller: "funcpage",
            templateUrl: "html/funpage/func.html",
            resolve: {
                loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        './js/funcpage/controller/func_c.js',
                        './js/funcpage/directive/func_d.js',
                        './js/funcpage/filter/func_f.js',
                        './js/funcpage/service/func_s.js',
                        './css/funcpage/funcpage.css',
                        './js/plugins/underscore.js',
                        './js/plugins/md5.js',
                    ]); // 按需加载目标 js file
                }]
            }
        })
        .state("funcpage.help", {
            url: "/help",
            controller: "func_help",
            templateUrl: "html/help/help.html"
        })
        .state("funcpage.land_main", {
            url: "/land_main",
            controller: "land_main",
            templateUrl: "html/funpage/land_main.html",
            resolve: {
                // get_type: function($http, $q) {
                //     var defer = $q.defer();
                //     console.log($(".land_main section li"))
                //     $http.get("mock/func/price_degree.json").success(function(data) {
                //         defer.resolve(data);
                //     }).error(function() {
                //         defer.reject(); //声明执行失败
                //     })
                //     return defer.promise;
                // },
                predata: "land",
                parse: "login_logic",
                get_type: function(predata, parse) {
                    var x = parse.parse_url();
                    var channel = "renrenche";
                    var list = null;

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
                                    "user_id": "5",
                                    "channel": channel
                                }],
                                "id": 1
                            }
                        }
                    } else {
                        list = {
                            "jsonrpc": "2.0",
                            "method": "productList",
                            "params": [{
                                "user_id": "5",
                                "channel": channel
                            }],
                            "id": 1
                        }
                    }
                    sessionStorage.setItem("ch", channel);
                    var type_data = [];
                    predata.submit(list).then(function(data) {
                        if (data.result != undefined) {
                            var type = data["result"]["list"];
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
                                type_data.push(ty)
                            }
                            console.log(type_data)
                                // console.log(type_data)
                        }
                    });

                    var mytime = new Date();
                    var t = mytime.getTime();
                    var params = {
                            "time": t,
                            "channel": channel,
                        }
                        // console.log(parse.md(params))
                    var pricelist = {
                        "jsonrpc": "2.0",
                        "method": "getMoneyByChannel",
                        "params": [{
                            "time": t,
                            "sign": parse.md(params),
                            "channel": channel
                        }],
                        "id": 1
                    }
                    var price_data = [];
                    var final_list = null;
                    predata.submit(pricelist).then(function(data) {
                        if (data.result != undefined) {
                            var ty = data["result"]["list"];
                            for (i = 0; i < ty.length; i++) {
                                var dis = Number(ty[i].name);
                                price_data.push(dis);
                            }
                        }
                    })
                    final_list = {
                        "price": price_data,
                        "type": type_data
                    }

                    return final_list;

                }
            }
        })
        .state("funcpage.land_main.pay_login", {
            url: "/pay_login",
            views: {
                'header': {
                    templateUrl: "html/funpage/pay_login/header.html",
                    controller: "pay_login_info"
                },
                'body': {
                    templateUrl: "html/funpage/pay_login/body.html",
                    controller: "pay_login"
                }
            }
        })
        .state("funcpage.land_main.login_on", {
            url: "/login_on",
            views: {
                'header': {
                    templateUrl: "html/funpage/pay_login/header.html",
                    controller: "pay_login_info"
                },
                'body': {
                    templateUrl: "html/funpage/pay_login/login_on.html",
                    controller: "pay_login_on"
                }
            }
        })
        .state("funcpage.order_list", {
            url: "/order_list",
            controller: "order_list",
            templateUrl: "html/funpage/order_list/order_list.html"
        })
        .state("funcpage.order_details", {
            url: "/order_details",
            controller: "order_details",
            templateUrl: "html/funpage/order_list/order_details.html"
        })
        .state("funcpage.not_login", {
            url: "/not_login",
            controller: "not_login",
            templateUrl: "html/funpage/order_list/not_login.html"
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
}]);