;
var HJY = angular.module("HJY", ["ionic", "ui.router", "ngVerify"]);
HJY.controller("MainCtrl", ["$scope", "$state", "$ionicSideMenuDelegate", "$timeout", "$ionicLoading", "$ionicNavBarDelegate", function($scope, $state, $ionicSideMenuDelegate, $timeout, $ionicLoading, $ionicNavBarDelegate) {
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
    Pace.on("done", function() {
        $ionicLoading.hide();
    });
    $scope.goBack = function() {
        $ionicNavBarDelegate.back();
    };
}]);