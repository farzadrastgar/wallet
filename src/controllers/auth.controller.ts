import { Request, Response } from "express";
import User from "../models/auth.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import log from "../utils/logger";

export const signUpHandler = async (req: Request, res: Response) => {
  try {
    let { password, email, username } = req.body;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);
    let user = new User({
      username,
      password: passwordHash,
      email,
      isVerified: false,
    });

    let result = (await user.save()).toObject();
    const { password: pass, ...filteredResult } = result;
    res.status(200).json(filteredResult);
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).json({ error: "username already taken!" });
    } else {
      res.status(500).json({ error: err });
    }
    log.error(err);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    const { JWT_SECRET_KEY } = process.env;
    if (passwordMatch) {
      const token = jwt.sign(
        { username: user.username },
        JWT_SECRET_KEY as string,
        {
          expiresIn: "1h",
        }
      );
      return res.json({ token, userId: user["_id"], email: user.email });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    log.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
