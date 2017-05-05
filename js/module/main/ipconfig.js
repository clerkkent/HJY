HJY.run(['$rootScope', '$window', '$location', '$log', '$templateCache', function($rootScope, $window, $location, $log, $templateCache) {
    var stateChangeSuccess = $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
    // $rootScope.url_global = "http://192.168.10.197:8888"; //本地测试
    $rootScope.url_global = "http://test.1huangjin.cn"; //线上测试
    // $rootScope.url_global = "http://www.ihaomu.com"; //线上

    function stateChangeSuccess($rootScope) {
        $templateCache.removeAll();
    }

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
}]);