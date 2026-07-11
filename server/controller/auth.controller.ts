import type { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.ts";
import bcrypt from "bcrypt";

import type { UserI } from "../model/user.model.ts";

const JWT_Secret = process.env.JWT_SECRET as string;

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(401).json({ msg: "invalid data entered" });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ msg: "user not found" });
    }

    const pass: boolean = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(401).json({ msg: "invalid password" });
    }
    if (password.length < 8) {
      return res.status(422).json({ msg: "Password must be at least 8 characters long" });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
      JWT_Secret,
      {
        expiresIn: "7d",
      },
    );

    const isProduction = process.env.NODE_ENV === "production" || (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes("localhost"));
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: !!isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    return res.status(200).json({
      msg: "login Successfull",
      username: user.username,
    });
  } catch (e) {
    return res.status(400).json({ msg: e });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(422).json({ msg: "invalid data entered" });
    }
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
    if (!usernameRegex.test(username)) {
      return res.status(422).json({ msg: "Username can Only Contain Letters, Number and _" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ msg: "Invalid Email Address" });
    }

    if (password.length < 8) {
      return res.status(422).json({ msg: "Password must be at least 8 characters long" });
    }
    const checkUser = await User.findOne({ $or: [{ username }, { email }] });

    if (checkUser) {
      return res.status(409).json({ msg: "user already exist" });
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, email, password: hashPassword });

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
      JWT_Secret,
      {
        expiresIn: "7d",
      },
    );

    const isProduction = process.env.NODE_ENV === "production" || (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes("localhost"));
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: !!isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(201).json({
      msg: "user created successfully",
      username: user.username,
    });
  } catch (e) {
    return res.status(400).json({ msg: e });
  }
};

export const logout = (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production" || (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes("localhost"));
  res.clearCookie("token", {
    httpOnly: true,
    secure: !!isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  return res.status(200).json({ msg: "Logged out successfully" });
};
