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
HJY.directive("landmainDetails", function() { //购买页，个人中心，订单页下方菜单
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/funpage/popum.html"
    }
})