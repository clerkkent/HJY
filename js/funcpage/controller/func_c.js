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

}]);