HJY.controller("v11", ["$scope", "$state", "login_logic", function($scope, $state, login_logic) {
    $scope.test = "dasdad";
}])
HJY.controller("sign", ["$timeout", "$ionicBackdrop", "$scope", "$state", "login_logic", "v11", "$rootScope", "_", "$ionicPopup", "$http", function($timeout, $ionicBackdrop, $scope, $state, login_logic, v11, $rootScope, _, $ionicPopup, $http) {
    $scope.test = "dasdad";
    var list = {
        "jsonrpc": "2.0",
        "method": "newCheckIn",
        "params": [],
        "id": 1
    }
    $scope.signx = [];
    v11.get($rootScope.url_global + '/passport/service.php?c=account', list, "tlqouvki6itqplh0g84he2n8q3").then(function(data) {
        console.log(data)
        if (data["result"] != undefined) {
            $scope.data = v11.date(data["result"]["year"], data["result"]["month"] - 1, data["result"]["day"]);
            $scope.w = $scope.data.w;
            $scope.d = $scope.data.d;
            $scope.t = $scope.data.t;
            $scope.c = data["result"]["checkin"].length;
            $scope.toil = data["result"]["tmorrowOil"]
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
                                $scope.oil = data["result"]["checkin"][j]["oildrop_num"]
                                $(".sign_v11 .days li").eq(i).addClass("tselect")
                            }
                        }
                }
            })

        } else {
            $ionicPopup.alert({
                title: '提示',
                template: data["error"]["message"],
                okText: '嗯！知道了', // String
                okType: 'button-energized',
            });
        }
    })
}])
HJY.controller("task", ["$timeout", "$ionicBackdrop", "$scope", "$state", "login_logic", "v11", "$rootScope", "_", "$ionicPopup", "$http", function($timeout, $ionicBackdrop, $scope, $state, login_logic, v11, $rootScope, _, $ionicPopup, $http) {
    var list = {
        "jsonrpc": "2.0",
        "method": "TaskList",
        "params": [{
            "user_id": "707"
        }],
        "id": 1
    }
    $scope.b = ["images/v11/ic_novice_one.png", "images/v11/ic_novice_two.png", "images/v11/ic_novice_three.png", "images/v11/ic_novice_four.png", "images/v11/ic_novice_four.png"]
    v11.get($rootScope.url_global + '/passport/service.php?c=task', list, "tlqouvki6itqplh0g84he2n8q3").then(function(data) {
        if (data["result"] != undefined) {
            console.log(data["result"])
            $scope.task = data["result"];
        } else {
            $ionicPopup.alert({
                title: '提示',
                template: data["error"]["message"],
                okText: '嗯！知道了', // String
                okType: 'button-energized',
            });
        }
    })
}])
HJY.controller("v11_help", ["$timeout", "$ionicBackdrop", "$scope", "$state", "login_logic", "v11", "$rootScope", "_", "$ionicPopup", "$http", function($timeout, $ionicBackdrop, $scope, $state, login_logic, v11, $rootScope, _, $ionicPopup, $http) {
    $http.get('mock/help/help (2).json').success(function(data) {
        $scope.page = _.toArray(_.groupBy(data, function(num, index) { return Math.floor(index / 4); }))
        $scope.help_information = data[1]["con"];
        login_logic.deal_help()
    })
    $scope.se = function(x) {
        $scope.help_information = x;
    }
}])