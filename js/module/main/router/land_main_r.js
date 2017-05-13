HJY.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);
    window.version_glo = "2.3";
    var v = "?" + window.version_glo;
    $stateProvider.state("funcpage", {
            url: "/funcpage",
            controller: "funcpage",
            templateUrl: "html/funpage/func.html" + v,
            resolve: {
                loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        './js/funcpage/controller/func_c-a.js' + v,
                        './js/funcpage/directive/func_d-a.js' + v,
                        './js/funcpage/filter/func_f-a.js' + v,
                        './js/funcpage/service/func_s-a.js' + v,
                        './css/funcpage/funcpage.css' + v,
                        './js/plugins/underscore.js' + v,
                        './js/plugins/md5.js' + v,
                        './js/plugins/moment.js' + v
                    ]); // 按需加载目标 js file
                }]
            }
        })
        .state("funcpage.help", {
            url: "/help",
            controller: "func_help",
            templateUrl: "html/help/help.html" + v
        }).state("funcpage.land_main", {
            url: "/land_main",
            controller: "land_main",
            templateUrl: "html/funpage/land_main.html" + v,
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
                get: function(predata, parse) {
                    console.log(1)
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
                // onEnter: function() { //此处处理父组件的download出现在子组件中的BUG
                //     $(".download").hide()
                // },
                // onExit: function() {
                //     $(".download").show()
                // }
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
        // .state("feedback", {
        //     url: "/feedback",
        //     controller: "help",
        //     templateUrl: "html/help/feedback.html",
        // })//信息反馈页面

}]);
HJY.run(['$rootScope', function($rootScope) {
    $rootScope.url_global = "http://www.ihaomu.com"; //本地测试
}]);