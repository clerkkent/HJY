;
HJY.directive('scrollHeight', function() { //赋予元素当前可见窗口高度
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
            element[0].style.height = document.body.clientHeight + 'px';
            var x = document.body.clientHeight / window.screen.height;
            // var w = $(element[0]).find(".wrap").css("height")
            //     // var h = $(element[0]).find("header").css("height")
            //     // var s = $(element[0]).find("section").css("height")
            //     // var f = $(element[0]).find("footer").css("height")
            //     // $(element[0]).find("header").css({ transform: "scale(" + x + ")", height: x * h });
            //     // $(element[0]).find("section").css({ transform: "scale(" + x + ")", height: x * s });
            //     // $(element[0]).find("footer").css({ transform: "scale(" + x + ")", height: x * f });
            // $(element[0]).find(".wrap").css({ transform: "scale(" + x + ")", height: x * w });

        }
    }
});
HJY.directive('friendzeroOil', function() { //赋予元素当前可见窗口高度
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
            alert(element[0].innerHTML)
        }
    }
});
HJY.directive("commonbackHeader", function() { //购买页，个人中心，订单页下方菜单
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/common/header.html"
    }
})
HJY.directive("menuListadd", function() { //购买页，个人中心，订单页下方菜单
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/common/menu.html"
    }
})
HJY.directive("oildropAdd", function() { //个人中心探弹窗
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/common/oil_drop_add.html"
    }
})
HJY.directive("friendRules", function() { //个人中心探弹窗
    return {
        restrict: "ECMA",
        replace: true,
        templateUrl: "html/common/friend_request_rules.html"
    }
})