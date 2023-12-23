const JobModel = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  // const jobs = await JobModel.find({}).sort("createdAt");
  const jobs = await JobModel.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getOneJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await JobModel.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) throw new NotFoundError(`No job with id: ${jobId}`);

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const newJob = await JobModel.create(req.body);

  res.status(StatusCodes.CREATED).json({ newJob });
};

const updateOneJob = async (req, res) => {
  const newJob = req.body;
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;

  if (!company || !position)
    throw new BadRequestError("company or position fields cannot be empty");

  const job = await JobModel.findByIdAndUpdate({ _id: jobId }, newJob, {
    new: true,
    runValidators: true,
  });

  if (!job) throw NotFoundError(`No Job With id: ${jobId}`);

  res.status(StatusCodes.OK).json(newJob);
};

const deleteOneJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await JobModel.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  if (!job) throw new NotFoundError(`No Job With id: ${jobId}`);

  res
    .status(StatusCodes.OK)
    .json({ message: `Job with id: ${jobId} deleted success` });
};

module.exports = {
  getAllJobs,
  getOneJob,
  createJob,
  updateOneJob,
  deleteOneJob,
};
