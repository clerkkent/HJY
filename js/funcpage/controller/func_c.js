angular.module('HJY').controller("funcpage", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}]);
angular.module('HJY').controller("func_help", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    login_logic.deal_help();
    $http.get("mock/func/help.json").then(function(data) {
        $scope.help_information = data.data;
    })
}]);
angular.module('HJY').controller("land_main", ["$scope", "$state", "login_logic", "$http", "get_type", "_", "get_predata", "land_main", function($scope, $state, login_logic, $http, get_type, _, get_predata, land_main) {
    $scope.text = "确认套餐";
    $scope.main_title = "每月充值";
    $scope.pay_title = "充油成功通知手机号";
    $scope.second = "获取验证码";
    $scope.price_selected = 0;
    $scope.type_selected = 0;
    $scope.type = get_type[0]["type"];
    $scope.type_info = get_type[0]["type"][0]; //页面预加载前获取套餐信息。
    $scope.unit_price = get_type[0]["price"][0];
    $scope.reduce_price = ($scope.unit_price * (1 - $scope.type_info.disn) * $scope.type_info.t).toFixed(1);
    $scope.final_price = ($scope.unit_price * $scope.type_info.disn * $scope.type_info.t).toFixed(1);
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $(".land_main section li").eq(0).addClass("is_sellect")
        })
        //可以写两个input并根据belong来渲染
    $scope.select_type = function(x, index) {
        $scope.type_info = x; //页面预加载前获取套餐信息。
        $scope.type_selected = index;
        $(".land_main section li").removeClass("is_sellect");
        $(".land_main section li").eq(index).addClass("is_sellect");
        $scope.reduce_price = $scope.reduce();
    }
    $scope.add = function() {
        if ($scope.price_selected < get_type[0]["type"].length - 1) {
            $scope.price_selected = $scope.price_selected + 1;
            $scope.unit_price = get_type[0]["price"][$scope.price_selected];
            $scope.reduce_price = $scope.reduce();
        }
    }
    $scope.sub = function() {
        if ($scope.price_selected > 0) {
            $scope.price_selected = $scope.price_selected - 1;
            $scope.unit_price = get_type[0]["price"][$scope.price_selected];
            $scope.reduce_price = $scope.reduce();
        }
    }
    $scope.price_final = function() {
        var d = $scope.type_info.disn;
        var t = $scope.type_info.t;
        var u = $scope.unit_price;
        return (d * t * u).toFixed(1);
    }
    $scope.reduce = function() {
        var d = $scope.type_info.disn;
        var t = $scope.type_info.t;
        var u = $scope.unit_price;
        return ((1 - d) * t * u).toFixed(1);
    }
    $scope.go_help = function() {
        $state.go("funcpage.help")
    }
    $scope.go_order = function() {
            $state.go("funcpage.order_list")
        }
        //以上为价格套餐选择处理逻辑
        //
        //
        //////////////////////////
    $scope.pro_info = get_predata;
    $scope.belong = 1;
    sessionStorage.setItem("belong", $scope.belong);

    land_main.test();
    $(".land_main #card").attr({ "ng-verify": "pattern:" + $scope.test + ",errmsg:'手机号码格式错误',required: false" })

}]);

angular.module('HJY').controller("order_list", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.phone = "1231111111";
}]);
angular.module('HJY').controller("order_details", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.phone = "1231111111";
}]);
angular.module('HJY').controller("not_login", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.phone = "1231111111";
}]);