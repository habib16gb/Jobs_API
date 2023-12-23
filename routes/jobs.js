const jobs = require("../controllers/jobs");
const express = require("express");

const router = express.Router();

router.route("/").get(jobs.getAllJobs).post(jobs.createJob);
router
  .route("/:id")
  .get(jobs.getOneJob)
  .patch(jobs.updateOneJob)
  .delete(jobs.deleteOneJob);

module.exports = router;
