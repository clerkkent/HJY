HJY.controller("v20", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}])
HJY.controller("shake", ["$scope", "$state", "login_logic", "$timeout", "$ionicBackdrop", "v20", "$rootScope", function($scope, $state, login_logic, $timeout, $ionicBackdrop, v20, $rootScope) {
    $scope.test = "dasdad";
    $scope.PrizeList = null;
    $scope.allPrizeList = null;
    $scope.shakePrize = null;
    $scope.personPrizeList = null;
    $scope.user_id = 707;
    $scope.token = "ol3vqn3s8tnq4jkaqd8avmu8i7";
    var myShakeEvent = new Shake({
        threshold: 15,
        timeout: 2000
    });
    myShakeEvent.start();
    $scope.getPrizeList = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "PrizeList",
            "params": [{
                "type": 1,
                "user_id": $scope.user_id
            }],
            "id": 1
        }
        v20.get($rootScope.url_global + '/passport/service.php?c=prize', list, $scope.token).then(
            function(data) {
                if (data["result"] != undefined) {
                    console.log(data)
                    $scope.PrizeList = data["result"]["list"]
                }
            }
        )
    }
    $scope.getPrizeList();
    $scope.getAllPrizeList = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "GetDrawList",
            "params": [{
                "type": 1,
                "user_id": $scope.user_id
            }],
            "id": 1
        }
        v20.get($rootScope.url_global + '/passport/service.php?c=prize', list, $scope.token).then(
            function(data) {
                if (data["result"] != undefined) {
                    $scope.allPrizeList = data["result"]
                }
            }
        )
    }
    $scope.getAllPrizeList()
    $scope.getPersonalList = function() {
        var list = {
            "jsonrpc": "2.0",
            "method": "UserDrawList",
            "params": [{
                "type": 1,
                "user_id": $scope.user_id
            }],
            "id": 1
        }
        v20.get($rootScope.url_global + '/passport/service.php?c=prize', list, $scope.token).then(
            function(data) {
                $scope.personPrizeList = data["result"]
            }
        )
    }
    $scope.getPersonalList()
    $scope.showPrizeList = function() {
        $(".myprize").show()
    }
    $scope.hidePrizeList = function() {
        $(".myprize").hide()
    }

    function remove() {
        $(".hand").removeClass("shake");
        $scope.shakeResult();
    }
    $scope.shakeResult = function() {
        var shakelist = {
            "jsonrpc": "2.0",
            "method": "Draw",
            "params": [{
                "type": 1,
                "user_id": $scope.user_id
            }],
            "id": 1
        }
        v20.get($rootScope.url_global + '/passport/service.php?c=prize', shakelist, $scope.token).then(function(data) {

            if (data["result"] != undefined) {
                $scope.getPrizeList();
                $scope.getPersonalList();
                $scope.shakePrize = data["result"]["lottery_name"];

                $(".shake_win").show()
                $ionicBackdrop.retain()
                $(".shake_win .close").click(function() {
                    $(".shake_win").hide()
                    $ionicBackdrop.release()
                })
            } else {
                $(".shake_win").show()
                $ionicBackdrop.retain()
                $(".shake_win .close").click(function() {
                    $(".shake_win").hide()
                    $ionicBackdrop.release()
                })
            }

        })
    }



    function test() {
        $("#audio")[0].play();
        $(".hand").addClass("shake");
        $timeout(remove, 1000);

    }

    window.addEventListener('shake', test, false);
}])
HJY.controller("schoolmate", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}])