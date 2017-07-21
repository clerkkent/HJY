angular.module('HJY').factory("v20", ["$http", "$q", "$rootScope", function($http, $q, $rootScope) {
    var factory = {}
    factory.get = function(url, data_send, authToken) {
        var defer = $q.defer();
        var head = null
        if (authToken != undefined) { //此处的登录状态cookie设置还需要更改
            head = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            // function clearCookie() {
            //     var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            //     if (keys) {
            //         for (var i = keys.length; i--;)
            //             document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
            //     }
            // }
            window.document.cookie = "OIL_TOKEN=" + authToken + ";path=/;";
        } else {
            head = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        $http({
            method: 'POST',
            url: url,
            headers: head,
            data: data_send
        }).success(function(data, header, config, status) {
            defer.resolve(data); //声明执行成功
        }).error(function(data, header, config, status) {
            defer.reject(); //声明执行失败
        });
        return defer.promise
    }
    return factory
}])