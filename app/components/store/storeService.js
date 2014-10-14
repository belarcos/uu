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
        return jobStore.getFirstTodoUrl().url;
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

    }
}

var jm= new JobManager();
/*
jm.addUrl("a");
jm.addUrl("a");
jm.addUrl("b");
jm.addUrl("c","a");
jm.addUrl("c","a");
jm.addUrl("c","b");
jm.addUrl("c","b");
jm.addUrl("d","c");
jm.addUrl("e","b");

jm.addUrl("d");
jm.addUrl("f","g");
jm.setMissing(2,"a")
jm.setMissing(-1,"e")
jm.getUrl();
jm.printInfo();
jm.getUrl();
jm.getUrl();
jm.getUrl();
jm.getUrl();
jm.getUrl();
jm.moveUrl("a");
jm.moveUrl("a");
jm.addUrl("a");
 */

/*
var l1 = function(jobStore) {

    var jobs=jobStore.listJobs();
    _.each(jobs, function(job) {
        console.log('--- JOB:', job.getId());
        console.log('todo:           ',job.urlsTodo.toString());
        console.log('processing:     ',job.urlsProcessing.toString());
        console.log('done:           ',job.urlsDone.toString());
     });
};

var l2 = function(jobStore) {
    console.log("---+++");
    var jobsWithUrlsTodo=jobStore.getJobsWithUrlsTodo();
    _.each(jobsWithUrlsTodo, function(job) {
        console.log(job.listUrls());
    });
};

js1= new JobStore();
j1 = js1.createJob("test1");
j2 = js1.createJob("test2");
js1.addUrlToJob(j2,"test3");
j2.missing=+2;
l1(js1);
todo=js1.getFirstTodoUrl();
console.log("TODO1",todo.url, todo.job);
l1(js1);
js1.moveUrlToDone(todo.job, todo.url);
l1(js1);
todo=js1.getFirstTodoUrl();
console.log("TODO2",todo.url, todo.job);
l1(js1);
js1.moveUrlToDone(todo.job, todo.url);
l1(js1);
todo=js1.getFirstTodoUrl();
console.log("TODO3",todo.url, todo.job);
l1(js1);
js1.moveUrlToDone(todo.job, todo.url);
l1(js1);
console.log(4);
l1(js1);

console.log(js1.getJobs())
console.log(js1.getJobs()[0].addUrl("b"))
console.log(js1.getJobs()[0].urlsDone)
console.log(js1)
console.log(js1.getUrlMap())
console.log(JSON.stringify(js1.getUrlMap()))
*/
