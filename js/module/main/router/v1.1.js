HJY.config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);
    var v = "?" + window.version_glo;
    $stateProvider.state("v11", {
        url: "/v11",
        controller: "v11",
        templateUrl: "html/v1.1/v11.html" + v
    })

}]);
HJY.run(['$rootScope', function($rootScope) {
    if (location.hostname == "192.168.10.52") {
        $rootScope.url_global = "http://192.168.10.52:8888";
    } else {
        $rootScope.url_global = window.location.protocol + "//" + location.hostname; //本地测试
    }
}]);