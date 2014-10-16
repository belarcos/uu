/**
 * Created by sandner on 16/10/2014.
 */
var storeCtrl=angular.module('storeCtrl',[]);

storeCtrl.controller('storeController', ['$scope','loadManager', function($scope, loadManager) {
    $scope.jobStore=loadManager.getJobStore();


    this.addRandUrl = function(refUrl) {
        if (refUrl == 0) refUrl = Math.ceil(Math.random() * 1000) * 10000;
        var url = refUrl + 1;
        loadManager.addUrl(url, refUrl);
    };
 /*   }

    this.moveUrl = function(moveUrl) {
        storeManager.moveUrl(moveUrl);
    }


    this.getUrl = function() {
        $scope.furl=storeManager.getUrl();
        loadManager.load($scope.furl, function(url) {console.log('loaded',url);storeManager.moveUrl(url);})
    }*/




}]);
