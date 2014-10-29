/**
 * Created by sandner on 28/10/2014.
 */
var dataServices=angular.module('dataServices',['angular-data.DSCacheFactory','angular-data.DS']);

dataServices.factory('dataService', ['DSCacheFactory','DS',function(DSCacheFactory,DS) {
   // DSCacheFactoryProvider.setCacheDefaults({storageMode:'localStorage'})
    // This cache will sync itself with localStorage if it exists, otherwise it won't. Every time the
    // browser loads this app, this cache will attempt to initialize itself with any data it had
    // already saved to localStorage (or sessionStorage if you used that).
    var myAwesomeCache = DSCacheFactory('myAwesomeCache', {
        maxAge: 900000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 3600000, // This cache will clear itself every hour.
        deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
        storageMode: 'localStorage' // This cache will sync itself with `localStorage`.
    });

    var Document = DS.defineResource({
        name: 'document',
        maxAge: 900000,
        defaultAdapter: 'DSLocalStorageAdapter',
        storageMode:'localStorage'
    });

    this.inNew = function() {
        var pot=8;
        var id=Math.ceil(Math.random()*pot*pot*pot);
        var val1=Math.ceil(Math.random()*pot*pot*pot);
        var val2=Math.ceil(Math.random()*pot*pot*pot);
        var val3=Math.ceil(Math.random()*pot*pot*pot);
        console.log('ab',id)
        Document.create({
            id: id,
        val1:val1,
        val2:val2,
        val3:val3}, {
            adapter: 'DSLocalStorageAdapter'
        }).then(function (document) {
            Document.save(document.id).then(function (document2) {

                console.log('ac',DS.filter('document'));
                document2; // A reference to the document that's been persisted via an adapter
            })

            console.log('aa',DS.filter('document'));
            document; // A reference to the document that's been persisted via an adapter
        });

    }
    this.addEntry = function() {
        console.log(1);
        this.inNew();
    }


    return {addEntry: this.addEntry, inNew:this.inNew}
}]);

dataServices.controller('dataController', ['$scope','dataService', function($scope, dataService) {
    //testFetchService.test();

    this.addEntry = function() {
        console.log("add");
        dataService.inNew();
    }
}]);