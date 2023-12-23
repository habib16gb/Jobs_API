const { use } = require("express/lib/router");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // if (!email || !name || !password)
  //   throw new BadRequestError("All inputs Required");

  const newUser = await User.create({
    ...req.body,
  });
  const token = newUser.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: newUser.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("please provide email and password");

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  const isPasswordMath = await user.comparePasssword(password);

  if (!isPasswordMath)
    throw new UnauthenticatedError("email or password invalid");

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
