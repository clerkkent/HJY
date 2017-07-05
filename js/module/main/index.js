;
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; //Underscore must already be loaded on the page
});
var HJY = angular.module("HJY", ["ionic", "ui.router", "ngVerify", "oc.lazyLoad", "underscore"]);
HJY.controller("MainCtrl", ["$scope", "$state", "$ionicBackdrop", "$ionicSideMenuDelegate", "$timeout", "$ionicLoading", "$ionicNavBarDelegate", function($scope, $state, $ionicBackdrop, $ionicSideMenuDelegate, $timeout, $ionicLoading, $ionicNavBarDelegate) {
    // $ionicLoading.show({
    //     content: 'Loading',
    //     animation: 'fade-in',
    //     template: '<div></div><>',
    //     showBackdrop: true,
    //     maxWidth: 800,
    //     showDelay: 0
    // });
    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
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