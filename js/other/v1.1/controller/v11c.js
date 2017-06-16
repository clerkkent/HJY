HJY.controller("v11", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}])
HJY.controller("sign", ["$scope", "$state", "login_logic", "v11", "$rootScope", "_", function($scope, $state, login_logic, v11, $rootScope, _) {
    $scope.test = "dasdad";
    var list = {
        "jsonrpc": "2.0",
        "method": "newCheckIn",
        "params": [],
        "id": 1
    }
    $scope.signx = [];
    v11.get($rootScope.url_global + '/passport/service.php?c=account', list, "plbheqqf1j6rb8cv3n1gtjjg27").then(function(data) {
        if (data["result"] != undefined) {
            $scope.data = v11.date(data["result"]["year"], data["result"]["month"] - 1, data["result"]["day"]);
            $scope.w = $scope.data.w;
            $scope.d = $scope.data.d;
            $scope.t = $scope.data.t;
            for (var i = 0; i < data["result"]["checkin"].length; i++) {
                $scope.signx.push(moment(data["result"]["checkin"][i]["checkin_date"]).date())
            }
            $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                for (var i = 0; i < $(".sign_v11 .days li").length; i++) {
                    if ($(".sign_v11 .days li"))
                        for (var j = 0; j < $scope.signx.length; j++) {
                            if ($(".sign_v11 .days li").eq(i).html() == $scope.signx[j] && $(".sign_v11 .days li").eq(i).html() != data["result"]["day"]) {
                                $(".sign_v11 .days li").eq(i).addClass("select")
                            } else if ($(".sign_v11 .days li").eq(i).html() == $scope.signx[j] && $(".sign_v11 .days li").eq(i).html() == data["result"]["day"]) {
                                $(".sign_v11 .days li").eq(i).addClass("tselect")
                            }
                        }
                }
            })
        }
    })
}])