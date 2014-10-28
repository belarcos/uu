 function JobStore() {
    var Job = function(id, mainUrl) {
        var urls = [];
        this.urlsTodo = [];
        this.urlsProcessing = [];
        this.urlsDone = [];
        this.missing = 0;

        this.addUrl = function(url) {
            if (_.contains(urls,url)) return null;
            urls.push(url);
            this.urlsTodo.push(url);
            return url;
        };

        this.getId = function() {
            return id;
        };

        this.addUrl(mainUrl);

    };

    var jobs=[];
    var counter=-1;
    var allUrls = [];
    var urlMap = {};

    var getJobsWith = function(jobs, fn) {
        return _.reduce(jobs, function(result, job) {
            if (fn(job).length > 0) result=result.concat(job);
            return result;
        }, [])
    };

    this.createJob = function(url) {
        if (_.contains(allUrls, url)) {
            return null;
        } else {
            counter++;
            var job = new Job(counter, url);
            jobs.push(job);
            allUrls.push(url);
            urlMap[url]=job;
            return job;
        }
    };

    this.addUrlToJob = function(job, url) {
        if (_.contains(allUrls, url)) {
            return null;
        } else {
           allUrls.push(url);
           urlMap[url]=job;
           job.addUrl(url);
           return job;
        }
    };

    this.listJobs = function() {
        return _.sortBy(jobs, function(job) {return job.missing;})
    };

    this.getJobsWithUrlsTodo = function() {
        var sortedJobs=this.listJobs();
        return getJobsWith(sortedJobs, function(job) {return job.urlsTodo;});
    };

    this.getCountUrlsProcessing = function() {
        return _.reduce(jobs, function(result, job) {
            result=result+job.urlsProcessing.length;
            return result;
        }, 0)
    };

    this.getFirstTodoUrl = function() {
        var jobsWithUrlsTodo=this.getJobsWithUrlsTodo();
        if (jobsWithUrlsTodo.length <= 0) {
            return null;
        } else {
            var job=jobsWithUrlsTodo[0];
            var url = _.first(job.urlsTodo);
            job.urlsTodo = _.tail(job.urlsTodo);
            job.urlsProcessing.push(url);
            return {job:job, url: url}
        }
    };

    this.moveUrlToDone = function(job,url) {
        if (_.contains(job.urlsProcessing, url)) {
            job.urlsProcessing= _.without(job.urlsProcessing, url);
            job.urlsDone.push(url);
            return {job:job, url: url}
        } else {
            return null;
        }
    };

    this.getJobs =function() {
        return jobs;
    };

    this.getUrlMap =function() {
        return urlMap;
    };

    this.printInfo = function() {

        var jobsInfo=this.listJobs();
        _.each(jobsInfo, function(job) {
            console.log('--- JOB:', job.getId());
            console.log('todo:           ',job.urlsTodo.toString());
            console.log('processing:     ',job.urlsProcessing.toString());
            console.log('done:           ',job.urlsDone.toString());
        });
    };

}

function JobManager() {
    var jobStore = new JobStore();

    this.addUrl = function(url,refUrl) {
        var job,job1,job2;
        job1=jobStore.getUrlMap()[url];
        if (refUrl) job2=jobStore.getUrlMap()[refUrl];

        if (job1) job=job1;
        if (job2) job=job2;

        if (!job) {
            jobStore.createJob(url);
        } else {
            jobStore.addUrlToJob(job,url);
        }
    };

    this.getUrl = function() {
        var f= jobStore.getFirstTodoUrl();
        if (f) return f.url;
    };

    this.moveUrl = function(url) {
        var job=jobStore.getUrlMap()[url];
        if (job) {
            jobStore.moveUrlToDone(job,url);
        }
    };

    this.printInfo = function() {
        jobStore.printInfo();
    };

    this.setMissing = function(count,url) {
        var job=jobStore.getUrlMap()[url];
        if (job) {
            job.missing=count;
        }
    };

    this.getJobStore = function() {
        return jobStore;
    }
}


var storeService=angular.module('storeService',[]);

 storeService.factory('loadService', ['$timeout', 'fetchService', function($timeout, fetchService) {
    var jm= new JobManager();
    var lm=this;

    this.addUrl = function(url,refUrl) {
        console.log('addUrl', url);
        jm.addUrl(url,refUrl);
        lm.loop();
    };

    this.getJobStore = function() {
        return jm.getJobStore();
    };

    this.loop = function() {
        var numProcessing=jm.getJobStore().getCountUrlsProcessing();
        console.log('numProcessing', numProcessing);
        if (numProcessing<1) {
            var url=jm.getUrl();
            if (url) {
                console.log('start', url);
                fetchService.load(url, function (urlDone) {
                    console.log('loaded', urlDone);
                    jm.moveUrl(url);
                    lm.loop();
                })
            }
        }
    };


     return {
     addUrl:this.addUrl, getJobStore:this.getJobStore
     }
 }]);

