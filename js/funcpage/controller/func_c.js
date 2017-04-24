angular.module('HJY').controller("funcpage", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}]);
angular.module('HJY').controller("func_help", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    login_logic.deal_help();
    $http.get("mock/func/help.json").then(function(data) {
        $scope.help_information = data.data;
    })
}]);
angular.module('HJY').controller("land_main", ["$scope", "$state", "login_logic", "$http", "get_type", function($scope, $state, login_logic, $http, get_type) {
    $scope.text = "确认套餐";
    $scope.main_title = "每月充值";
    $scope.pay_title = "充油成功通知手机号";
    $scope.second = "获取验证码";
    $scope.selected = 0;
    $scope.type_info = get_type[0]; //页面预加载前获取套餐信息。
    $scope.unit_price = get_type[0]["price"][0];
    console.log($scope.type_info)
        // get_type.then(function(data) {
        //     console.log(data)
        // })
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