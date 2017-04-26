angular.module('HJY').directive("testT", function($timeout) {
    return {
        restrict: "ECMA",
        link: function(scope, element, attr) {

            var belong = sessionStorage.getItem("belong");
            var test;
            if (belong == 1) {
                test = /^100011\d{13}$/;
            } else if (belong == 2) {
                test = /^9\d{15}$/;
            }
        }
    }
})
angular.module('HJY').directive("initT", function($timeout) {
    return {
        restrict: "ECMA",
        link: function(scope, element, attr) {
            if (scope.$last === true) { //判断是否是最后一条数据  
                $timeout(function() {
                    scope.$emit('ngRepeatFinished'); //向父级scope传送ngRepeatFinished命令  
                });
            }
        }
    }
})