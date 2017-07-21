HJY.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.templates.maxPrefetch(0);
    var v = "?" + window.version_glo;
    $stateProvider.state("v20", {
            url: "/v20",
            controller: "v20",
            templateUrl: "html/v20/v20.html" + v,
            resolve: {
                loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        './js/other/v20/controller/v20c.js' + v,
                        './js/other/v20/directive/v20d.js' + v,
                        './js/other/v20/filter/v20f.js' + v,
                        './js/other/v20/service/v20s.js' + v,
                        './css/v20/v20.css' + v,
                        './js/plugins/underscore.js' + v,
                        './js/plugins/md5.js' + v,
                        './js/plugins/moment.min.js' + v,
                        './js/plugins/shake.js' + v
                    ]); // 按需加载目标 js file
                }]
            }
        })
        .state("v20.shake", {
            url: "/shake",
            controller: "shake",
            templateUrl: "html/v20/shake/shake.html" + v,
        })
        .state("v20.schoolmate", {
            url: "/schoolmate",
            controller: "schoolmate",
            templateUrl: "html/v20/schoolmate/schoolmate.html" + v
        })
        .state("v20.vipcard", {
            url: "/vipcard",
            controller: "vipcard",
            cache: 'false',
            templateUrl: "html/v20/vipcard/vipcard.html" + v,
            // resolve: {
            //     JudgeSystems: "webappSDK",
            //     JudgeSystem: "login_logic",
            //     popum: "$ionicPopup",
            //     rooturl: "$rootScope",
            //     judgement: function(JudgeSystems, JudgeSystem, popum, rooturl) {
            //         var user_id = ""
            //         var token = ""
            //         if (JudgeSystem.JudgeSystem()) {
            //             var axxxx = JSON.parse(hjytest.getUserInfos("js调用了android中的hello方法"));
            //             user_id = axxxx.user_id;
            //             token = axxxx.OIL_TOKEN;
            //             var list = {
            //                 "jsonrpc": "2.0",
            //                 "method": "GetCordUserState",
            //                 "params": [{
            //                     "user_id": user_id
            //                 }],
            //                 "id": 1
            //             }

            //             JudgeSystem.get('/passport/service.php?c=card', list, token).then(function(data) {
            //                 if (data["result"] != undefined) {
            //                     if (data["result"] == 1) {

            //                     } else {
            //                         location.replace(rooturl.url_global + "/wechat/#/v20/getvip")
            //                     }
            //                 } else {
            //                     popum.alert({
            //                         title: '提示',
            //                         template: data["error"]["message"],
            //                         okText: '嗯！知道了', // String
            //                         okType: 'button-calm',
            //                     });
            //                 }
            //             })
            //         } else {
            //             JudgeSystems.getUserInfos(function(res) {
            //                 popum.alert({
            //                     title: '提示',
            //                     template: 1231,
            //                     okText: '嗯！知道了', // String
            //                     okType: 'button-calm',
            //                 });
            //                 var info = JSON.parse(res)
            //                 user_id = axxxx.user_id;
            //                 token = axxxx.OIL_TOKEN;
            //                 popum.alert({
            //                     title: '提示',
            //                     template: 11,
            //                     okText: '嗯！知道了', // String
            //                     okType: 'button-calm',
            //                 });
            //                 var list = {
            //                     "jsonrpc": "2.0",
            //                     "method": "GetCordUserState",
            //                     "params": [{
            //                         "user_id": user_id
            //                     }],
            //                     "id": 1
            //                 }
            //                 JudgeSystem.get('/passport/service.php?c=card', list, token).then(function(data) {
            //                     if (data["result"] != undefined) {
            //                         if (data["result"] == 1) {

            //                         } else {
            //                             location.replace(rooturl.url_global + "/wechat/#/v20/getvip")
            //                         }
            //                     } else {
            //                         popum.alert({
            //                             title: '提示',
            //                             template: data["error"]["message"],
            //                             okText: '嗯！知道了', // String
            //                             okType: 'button-calm',
            //                         });
            //                     }
            //                 })
            //             })
            //         }
            //     }
            // }

        })
        .state("v20.getvip", {
            url: "/getvip",
            controller: "getvip",
            templateUrl: "html/v20/vipcard/getvip.html" + v
        })
}]);