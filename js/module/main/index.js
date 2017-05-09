;
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; //Underscore must already be loaded on the page
});
var HJY = angular.module("HJY", ["ionic", "ui.router", "ngVerify", "oc.lazyLoad", "underscore"]);
HJY.controller("MainCtrl", ["$scope", "$state", "$ionicSideMenuDelegate", "$timeout", "$ionicLoading", "$ionicNavBarDelegate", function($scope, $state, $ionicSideMenuDelegate, $timeout, $ionicLoading, $ionicNavBarDelegate) {
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        template: '<ion-spinner icon="ripple" class="spinner-calm"></ion-spinner>',
        showBackdrop: true,
        maxWidth: 800,
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