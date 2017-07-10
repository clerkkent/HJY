HJY.controller("v20", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}])
HJY.controller("shake", ["$scope", "$state", "login_logic", "$timeout", function($scope, $state, login_logic, $timeout) {
    $scope.test = "dasdad";
    var myShakeEvent = new Shake({
        threshold: 15,
        timeout: 2000
    });
    myShakeEvent.start();

    function remove() {
        $(".hand").removeClass("shake")
    }

    function test() {
        $(".hand").addClass("shake");
        $timeout(remove, 1000)
    }


    window.addEventListener('shake', test, false);


}])