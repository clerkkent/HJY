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
angular.module('HJY').directive("scrollShow", ["$timeout", function($timeout) {
    return {
        restrict: "A",
        link: function(scope, element, attr) {
            var speed = 1;
            var i = 1;
            console.log($(element).height())

            function scroll() {
                if (speed * i < $(element).height()) {
                    i++;
                    var deal = "translateY(" + (-speed * i) + "px)";
                    $(element).css({ transform: deal })
                } else {
                    i = 0;
                }

            }
            var action = setInterval(scroll, 50);
            $(element).on("touchstart", function() {
                clearInterval(action)
            })
            $(element).on("touchend", function() {
                action = setInterval(scroll, 50);
            })
        }
    }
}])
HJY.directive("v20Popum1", function() {
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/v20/shake/popum01.html"
    }
})
HJY.directive("v20Popum2", function() {
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/v20/shake/popum02.html"
    }
})