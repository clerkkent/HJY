angular.module('HJY').directive("repeatF", ["$timeout", function($timeout) {
    return {
        restrict: "A",
        link: function(scope, element, attr) {
            if (scope.$last === true) { //判断是否是最后一条数据  
                $timeout(function() {
                    scope.$emit('ngRepeatFinished'); //向父级scope传送ngRepeatFinished命令  
                });
            }
        }
    }
}])
angular.module('HJY').directive('v11Popum', ["$timeout", "$ionicBackdrop", function($timeout, $ionicBackdrop) { //赋予元素当前可见窗口高度
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
            console.log(scope.data)
            $ionicBackdrop.retain();
            $(element).show()
            $timeout(function() {
                $(element).hide()
                $ionicBackdrop.release();
            }, 2000);
        }
    }
}]);
angular.module('HJY').directive('initPage', ["$timeout", "$ionicBackdrop", function($timeout, $ionicBackdrop) { //赋予元素当前可见窗口高度
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {


        }
    }
}]);