import { apiError } from "../utils/apiError.js";

export const validateAuthRequest = (req, res, next) => {
  const { username ,email, fullName , password } = req.body;

  if (!(username || password)) {
    return next(new apiError("Username and password are required", 400));
  }

  next();
};
