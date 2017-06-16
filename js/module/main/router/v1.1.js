HJY.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);
    var v = "?" + window.version_glo;
    $stateProvider.state("v11", {
            url: "/v11",
            controller: "v11",
            templateUrl: "html/v1.1/v11.html" + v,
            resolve: {
                loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        './js/other/v1.1/controller/v11c.js' + v,
                        './js/other/v1.1/directive/v11d.js' + v,
                        './js/other/v1.1/filter/v11f.js' + v,
                        './js/other/v1.1/service/v11s.js' + v,
                        './css/v1.1/v1.1.css' + v,
                        './js/plugins/underscore.js' + v,
                        './js/plugins/md5.js' + v,
                        './js/plugins/moment.min.js' + v
                    ]); // 按需加载目标 js file
                }]
            }
        })
        .state("v11.sign", {
            url: "/sign",
            controller: "sign",
            templateUrl: "html/v1.1/sign/sign.html" + v,
        })
}]);