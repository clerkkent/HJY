;
HJY.directive('scrollHeight', function() { //赋予元素当前可见窗口高度
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
            element[0].style.height = document.body.clientHeight + 'px';
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