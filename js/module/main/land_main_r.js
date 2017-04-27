HJY.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);
    $stateProvider.state("funcpage", {
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
        }).state("funcpage.land_main", {
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
                    var list = {
                        "jsonrpc": "2.0",
                        "method": "productList",
                        "params": [{
                            "user_id": "5",
                            "channel": channel
                        }],
                        "id": 1
                    };

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
                    controller: "pay_login",

                }
            }
        })
        .state("funcpage.land_main.login_on", {
            url: "/login_on",
            params: { pro: null },
            views: {
                'header': {
                    templateUrl: "html/funpage/pay_login/header.html",
                    controller: "pay_login_info",
                },
                'body': {
                    templateUrl: "html/funpage/pay_login/login_on.html",
                    controller: "pay_login_on",

                }
            }
        })
        .state("funcpage.pay_success", {
            url: "/pay_success",
            controller: "m_pay_success",
            templateUrl: "html/funpage/pay_state/pay_success.html"
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
            templateUrl: "html/funpage/pay_state/payfail.html"
        })
        .state("funcpage.order_list", {
            url: "/order_list",
            controller: "order_list",
            templateUrl: "html/funpage/order_list/order_list.html"
        })
        .state("funcpage.order_details", {
            url: "/order_details",
            controller: "order_details",
            params: { id: null },
            templateUrl: "html/funpage/order_list/order_details.html"
        })
        .state("funcpage.not_login", {
            url: "/not_login",
            controller: "not_login",
            templateUrl: "html/funpage/order_list/not_login.html"
        })
        .state("funcpage.login", {
            url: "/login",
            controller: "land_main_login",
            templateUrl: "html/funpage/login.html"
        })
        // .state("feedback", {
        //     url: "/feedback",
        //     controller: "help",
        //     templateUrl: "html/help/feedback.html",
        // })//信息反馈页面

}]);