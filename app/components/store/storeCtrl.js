var storeCtrl=angular.module('storeCtrl',[]);

storeCtrl.controller('storeController', ['$scope','loadService', function($scope, loadService) {
    $scope.jobStore=loadService.getJobStore();

    this.addRandUrl = function(refUrl) {
        if (refUrl == 0) refUrl = Math.ceil(Math.random() * 1000) * 10000;
        var url = refUrl + 1;
        loadService.addUrl(url, refUrl);
    };
}]);
