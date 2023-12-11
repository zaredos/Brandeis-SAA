const Job = require("../models/job");
module.exports = {
  index: (req, res, next) => {
    Job.find()
      .then((jobs) => {
        res.locals.jobs = jobs;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching jobs: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    //res.render("jobs/index");
    //res.json(res.locals.jobs);
    if (req.query.format === "json") {
      res.json(res.locals.jobs);
    } else {
      res.render("jobs/index");
    }
  },
  new: (req, res) => {
    res.render("jobs/new");
  },
  create: (req, res, next) => {
    let jobParams = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      description: req.body.description,
      requirements: req.body.requirements,
      salary: req.body.salary,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      postDate: req.body.postDate,
      deadlineDate: req.body.deadlineDate,
      isActive: req.body.isActive == "on" ? true : false,
    };
    Job.create(jobParams)
      .then((job) => {
        res.locals.redirect = "/jobs";
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        console.log(`Error saving job: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let jobId = req.params.id;
    Job.findById(jobId)
      .then((job) => {
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("jobs/show");
  },
  edit: (req, res, next) => {
    let jobId = req.params.id;
    Job.findById(jobId)
      .then((job) => {
        res.render("jobs/edit", {
          job: job,
        });
      })
      .catch((error) => {
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let jobId = req.params.id;
    jobParams = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      description: req.body.description,
      requirements: req.body.requirements,
      salary: req.body.salary,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      postDate: req.body.postDate,
      deadlineDate: req.body.deadlineDate,
      isActive: req.body.isActive == "on" ? true : false,
    };
    Job.findByIdAndUpdate(jobId, {
      $set: jobParams,
    })
      .then((job) => {
        res.locals.redirect = `/jobs/${jobId}`;
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        console.log(`Error updating job by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let jobId = req.params.id;
    let isAdmin = req.user.isAdmin;
    if (isAdmin) { // Only can delete if user is admin
      Job.findByIdAndRemove(jobId)
        .then(() => {
          res.locals.redirect = "/jobs";
          next();
        })
        .catch((error) => {
          console.log(`Error deleting job by ID: ${error.message}`);
          next();
        });
    } else {
      res.redirect(`/jobs/${jobId}`);
      console.log("You are not authorized to delete this job.");
    }
  },
};
