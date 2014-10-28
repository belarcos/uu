/**
 * Created by sandner on 16/10/2014.
 */

//https://www.google.de/search?q=test&tbm=vid
var fetchServices=angular.module('fetchServices',[]);

fetchServices.factory('fetchService', ['$timeout',function($timeout) {
    this.load = function (url, callback) {
        console.log("loading", url);
        $timeout(function () {
            callback(url)
        }, 2000);
    };
    return {load: this.load}
}]);

fetchServices.factory('testFetchService', ['$http',function($http) {
    this.test = function() {


        $http.get('http://localhost:8899/www.google.de/search?q=test&tbm=vid').
            success(function(data, status, headers, config) {
                console.log(status, headers, config)
            }).
            error(function(data, status, headers, config) {
                console.log(status, headers, config)
            });
    }
    return {test:this.test}
}]);


fetchServices.controller('fetchController', ['$scope','testFetchService', function($scope, testFetchService) {
    //testFetchService.test();
}]);
