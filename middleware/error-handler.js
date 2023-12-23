const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(`${err.message}`.bgRed.bold);
  let customError = {
    // set default

    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong Try Again Later!",
  };
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((err) => err.message)
      .join(",");
    customError.statusCode = StatusCodes.CONFLICT;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.CONFLICT;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};

module.exports = errorHandlerMiddleware;
