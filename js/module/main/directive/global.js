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
HJY.directive('downLoad', function() { //赋予元素当前可见窗口高度
    return {
        restrict: 'AE',
        link: function(scope, element, attr) {
            var browser = {
                versions: function() {
                    var u = navigator.userAgent,
                        app = navigator.appVersion;
                    return {
                        trident: u.indexOf('Trident') > -1, //IE内核
                        presto: u.indexOf('Presto') > -1, //opera内核
                        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, //是否iPad
                        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                        qq: u.match(/\sQQ/i) == " qq" //是否QQ
                    };
                }(),
                language: (navigator.browserLanguage || navigator.language).toLowerCase()
            }
            element[0].onclick = function() {
                if (browser.versions.android) {
                    window.open("https://pro-app-qn.fir.im/a642805408c44b8f9cf7bd7f16a6c507d2e8d0ad.apk?attname=app-yingyongbao-release.apk_1.0.0.apk&e=1492161405&token=LOvmia8oXF4xnLh0IdH05XMYpH6ENHNpARlmPc-T:uNmsWt3Mtc7XedlLRBtx8Izyyd4=")
                } else if (browser.versions.ios) {
                    window.open("https://itunes.apple.com/us/app/yi-huang-jin-huang-jin-li-cai/id1168865801?mt=8")
                }
            }

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