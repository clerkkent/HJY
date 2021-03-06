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
    $stateProvider.state("v20", {
            url: "/v20",
            controller: "v20",
            templateUrl: "html/v20/v20.html" + v,
            // resolve: {
            //     loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
            //         return $ocLazyLoad.load([
            //             './js/other/v20/controller/v20c.js' + v,
            //             './js/other/v20/directive/v20d.js' + v,
            //             './js/other/v20/filter/v20f.js' + v,
            //             './js/other/v20/service/v20s.js' + v,
            //             './css/v20/v20.css' + v,
            //             './js/plugins/underscore.js' + v,
            //             './js/plugins/md5.js' + v,
            //             './js/plugins/moment.min.js' + v,
            //             './js/plugins/shake.js' + v
            //         ]); // 按需加载目标 js file
            //     }]
            // }
            resolve: resovleDep({
                files: [
                    './js/other/v20/controller/v20c.js' + v,
                    './js/other/v20/directive/v20d.js' + v,
                    './js/other/v20/filter/v20f.js' + v,
                    './js/other/v20/service/v20s.js' + v,
                    './css/v20/v20.css' + v,
                    './js/plugins/underscore.js' + v,
                    './js/plugins/md5.js' + v,
                    './js/plugins/moment.min.js' + v,
                    './js/plugins/shake.js' + v
                ]
            })
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
            templateUrl: "html/v20/vipcard/vipcard.html" + v
        })
        .state("v20.getvip", {
            url: "/getvip",
            controller: "getvip",
            templateUrl: "html/v20/vipcard/getvip.html" + v
        })
}]);