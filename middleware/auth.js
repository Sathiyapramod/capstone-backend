import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");

    // eslint-disable-next-line no-undef
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

export default auth;
