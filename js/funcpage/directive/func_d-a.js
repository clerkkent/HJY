// angular.module('HJY').directive("testT", function($timeout) {
//     return {
//         restrict: "ECMA",
//         link: function(scope, element, attr) {

//             var belong = sessionStorage.getItem("belong");
//             var test;

//         }
//     }
// })
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
HJY.directive("landmainDetails", function() {
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/funpage/popum.html"
    }
})
HJY.directive("registerDownload", function() {
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/funpage/download.html"
    }
})
HJY.directive("activePopum", function() {
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/funpage/active/popum.html"
    }
})
HJY.directive("activeIcon", function() {
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/funpage/active/icon.html"
    }
})