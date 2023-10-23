import { Request, Response } from "express";
import UserModel from "../models/auth.model";
import bcrypt from "bcrypt";
import log from "../utils/logger";

export const signUpHandler = async (req: Request, res: Response) => {
  try {
    let { password, email, username } = req.body;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);
    let user = new UserModel({
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
      res.status(400).json({ error: err });
    }
    log.error(err);
  }
};

export const loginHandler = (req: Request, res: Response) => {
  res.status(200).json({});
};
