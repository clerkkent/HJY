angular.module('HJY').controller("funcpage", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}]);
angular.module('HJY').controller("func_help", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    login_logic.deal_help()
        // $scope.feed_return = function() {
        //     $state.go("help")
        // }
    $http.get("mock/help/help.json").then(function(data) {
        $scope.help_information = data.data;
    })
}]);
angular.module('HJY').controller("land_main", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.text = "确认套餐";
    $scope.main_title = "每月充值";
    $scope.pay_title = "充油成功通知手机号";
    $scope.second = "获取验证码";
}]);

angular.module('HJY').controller("order_list", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.phone = "1231111111";
}]);
angular.module('HJY').controller("order_details", ["$scope", "$state", "login_logic", "$http", function($scope, $state, login_logic, $http) {
    $scope.phone = "1231111111";
}]);