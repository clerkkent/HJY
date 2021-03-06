HJY.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    var v = "?" + window.version_glo;
    $ionicConfigProvider.templates.maxPrefetch(1);

    function resovleDep(param, tpl, module) {
        var resolves = {
            loadMyCtrl: ['$ocLazyLoad', '$templateCache', '$q', function($ocLazyLoad, $templateCache, $q) {
                lazyDeferred = $q.defer();
                return $ocLazyLoad.load({
                    name: module,
                    cache: false,
                    files: param.files
                }).then(function() {
                    lazyDeferred.resolve($templateCache.get(tpl));
                });
            }]
        };
        return resolves;
    };
    $stateProvider.state("funcpage", {
            url: "/funcpage",
            templateUrl: "html/funpage/func.html" + v,
            controller: "funcpage",
            resolve: resovleDep({
                files: [
                    'https://imagecdn.ihuijiayou.com/wechat/js/funcpage/controller/func_c-a_v06.js' + v,
                    'https://imagecdn.ihuijiayou.com/wechat/js/funcpage/directive/func_d-a_v03.js' + v,
                    'https://imagecdn.ihuijiayou.com/wechat/js/funcpage/filter/func_f-a_v03.js' + v,
                    'https://imagecdn.ihuijiayou.com/wechat/js/funcpage/service/func_s-a_v03.js' + v,
                    'https://imagecdn.ihuijiayou.com/wechat/css/funcpage/funcpage.css' + v,
                    'https://imagecdn.ihuijiayou.com/wechat/js/plugins/underscore.js' + v,
                    'https://imagecdn.ihuijiayou.com/wechat/js/plugins/md5.js' + v,
                    'https://imagecdn.ihuijiayou.com/wechat/js/plugins/moment.min.js' + v
                ]
            })
        })
        .state("funcpage.db_festival", {
            url: "/db_festival",
            controller: "db_festival",
            templateUrl: "html/funpage/active/Dragon_Boat_Festival.html" + v
        })
        .state("funcpage.help", {
            url: "/help",
            controller: "func_help",
            templateUrl: "html/help/help.html" + v
        }).state("funcpage.land_main", {
            url: "/land_main",
            controller: "land_main",
            templateUrl: "html/funpage/land_mainx.html" + v,
            resolve: {
                predata: "land",
                parse: "login_logic",
                get: function(predata, parse) {
                    var x = parse.parse_url();

                    function judge(obj) {　　
                        for (var i in obj) { //如果不为空，则会执行到这一步，返回true
                            　　　　 return true;　　 }　
                        return false;
                    }
                    if (judge(x)) {
                        if (x["ch"] != undefined) {
                            var channel = x["ch"];
                            sessionStorage.setItem("ch", channel);
                            localStorage.setItem("ch", channel);
                        }
                    }
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
                get_type: function(predata, parse, get) {
                    var x = parse.parse_url();
                    var channel = "yimao";
                    var mytime = new Date();
                    var all = get["result"];
                    var name = "功能页";
                    var id = null;
                    if (judge(x)) {
                        if (x["test_money_HJY_ts"] != undefined) {
                            name = "其他"
                        }
                    }
                    var a = function(arr) {
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i]["product_name"] == name) {
                                id = arr[i]["id"]
                            }
                        }
                    }
                    a(all);
                    var t = mytime.getTime();
                    var params = {
                        "time": t,
                        "type": id
                    }
                    var list = {
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
                                    "sign": parse.md(params)
                                }],
                                "id": 1
                            }
                        } else if (localStorage.getItem("ch") != null) {
                            channel = localStorage.getItem("ch");
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
                        }
                    } else if (localStorage.getItem("ch") != null) {
                        channel = localStorage.getItem("ch");
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
                    }
                    sessionStorage.setItem("ch", channel);
                    localStorage.setItem("ch", channel);
                    // var type_data = [];
                    return predata.submit(list);
                }
            }
        })
        .state("funcpage.land_main.pay_login", {
            url: "/pay_login",
            views: {
                'header': {
                    templateUrl: "html/funpage/pay_login/header.html" + v,
                    controller: "pay_login_info"
                },
                'body': {
                    templateUrl: "html/funpage/pay_login/body.html" + v,
                    controller: "pay_login",

                }
            }
        })
        .state("funcpage.land_main.login_on", {
            url: "/login_on",
            params: { pro: null },
            views: {
                'header': {
                    templateUrl: "html/funpage/pay_login/header.html" + v,
                    controller: "pay_login_info",
                },
                'body': {
                    templateUrl: "html/funpage/pay_login/login_on.html" + v,
                    controller: "pay_login_on",

                }
            }
        })
        .state("funcpage.pay_success", {
            url: "/pay_success",
            controller: "m_pay_success",
            templateUrl: "html/funpage/pay_state/pay_success.html" + v
        })
        .state("funcpage.pay_success.pay_fails", {
            url: "/pay_fails",
            controller: "m_pay_fails",
            templateUrl: "html/funpage/pay_state/payfail.html" + v
        })
        .state("funcpage.order_list", {
            url: "/order_list",
            controller: "order_list",
            templateUrl: "html/funpage/order_list/order_list.html" + v
        })
        .state("funcpage.order_details", {
            url: "/order_details",
            controller: "order_details",
            params: { id: null },
            templateUrl: "html/funpage/order_list/order_details.html" + v
        })
        .state("funcpage.not_login", {
            url: "/not_login",
            controller: "not_login",
            templateUrl: "html/funpage/order_list/not_login.html" + v
        })
        .state("funcpage.login", {
            url: "/login",
            controller: "land_main_login",
            templateUrl: "html/funpage/login.html" + v
        })
        .state("funcpage.register", {
            url: "/register",
            controller: "register",
            templateUrl: "html/funpage/register.html" + v,
            resolve: {
                parse: "login_logic",
                get: function(parse) {
                    var x = parse.parse_url();

                    function judge(obj) {　　
                        for (var i in obj) { //如果不为空，则会执行到这一步，返回true
                            　　　　 return true;　　 }　
                        return false;
                    }
                    if (judge(x)) {
                        if (x["ch"] != undefined) {
                            var channel = x["ch"];
                            sessionStorage.setItem("ch", channel);
                            localStorage.setItem("ch", channel);
                        }
                    }
                }
            }
        })
        .state("funcpage.register.login", {
            url: "/login",
            controller: "register_login",
            templateUrl: "html/funpage/register_login.html" + v
        })
        .state("funcpage.award", {
            url: "/award",
            controller: "award",
            templateUrl: "html//funpage/active/award_list.html" + v
        })
        .state("funcpage.land_fiend_active", {
            url: "/land_fiend_active",
            controller: "land_fiend_active",
            templateUrl: "html//funpage/active/friend_active.html" + v
        })
}]);