var HJY = angular.module("HJY", ["ionic", "ui.router", "ngVerify", "oc.lazyLoad", "underscore"]);
HJY.controller("MainCtrl", ["$scope", "$state", "$ionicBackdrop", "$ionicSideMenuDelegate", "$timeout", "$ionicLoading", "$ionicNavBarDelegate", function($scope, $state, $ionicBackdrop, $ionicSideMenuDelegate, $timeout, $ionicLoading, $ionicNavBarDelegate) {
    $(".hjy-loading").show()
    $ionicBackdrop.retain();
    Pace.on("done", function() {
        $(".hjy-loading").hide()
        $ionicBackdrop.release();
    });
    $scope.goBack = function() {
        $ionicNavBarDelegate.back();
    };
}]);
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; //Underscore must already be loaded on the page
});