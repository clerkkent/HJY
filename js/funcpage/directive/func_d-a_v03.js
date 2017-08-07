// angular.module('HJY').directive("testT", function($timeout) {
//     return {
//         restrict: "ECMA",
//         link: function(scope, element, attr) {

//             var belong = sessionStorage.getItem("belong");
//             var test;

//         }
//     }
// })
angular.module('HJY').directive("initT", ["$timeout", function($timeout) {
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
}])
angular.module('HJY').directive("scrollI", ["$timeout", function($timeout) {
    return {
        restrict: "ECMA",
        link: function(scope, element, attr) {
            $(element).focus(function() {
                $(".funcpage_register").parent().scrollTop(200)
            })
        }
    }
}])
angular.module('HJY').directive("allFolda", [function() {
    return {
        restrict: 'ECMA',
        link: function(scope, element, attr) {

            $(element).parent(".note").click(function() {
                if ($(this).hasClass('selected01')) {
                    $(this).removeClass("selected01")
                } else {
                    $(this).addClass("selected01")
                }

                if ($(this).find(".switch").hasClass('switch_se')) {
                    $(this).find(".switch").removeClass("switch_se")
                } else {
                    $(this).find(".switch").addClass("switch_se")
                }
            })
        }
    }

}])
angular.module('HJY').directive("allFoldb", [function() {
    return {
        restrict: 'ECMA',
        link: function(scope, element, attr) {
            $(element).parent(".note").click(function() {
                if ($(this).hasClass('selected02')) {
                    $(this).removeClass("selected02")
                } else {
                    $(this).addClass("selected02")
                }
                if ($(this).find(".switch").hasClass('switch_se')) {
                    $(this).find(".switch").removeClass("switch_se")
                } else {
                    $(this).find(".switch").addClass("switch_se")
                }
            })
        }
    }

}])

angular.module('HJY').directive("fPopum", ["$ionicBackdrop", function($ionicBackdrop) {
    return {
        restrict: 'ECMA',
        link: function(scope, element, attr) {
            $(element).click(function(e) {

                $("section .popum").show();
                $(".fade").show()
                $(document).on('touchmove', function(e) {
                    e.preventDefault()
                })
            })

        }
    }

}])
angular.module('HJY').directive("cPopum", ["$ionicBackdrop", function($ionicBackdrop) {
    return {
        restrict: 'ECMA',
        link: function(scope, element, attr) {
            $(element).click(function() {

                $("section .popum").hide();
                $(".fade").hide()
                $(document).off('touchmove')
            })
        }
    }

}])
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