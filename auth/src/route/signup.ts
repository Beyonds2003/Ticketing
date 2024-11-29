import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user-model";
import bcrypt from "bcryptjs"
import { BadRequestError, validateRequest } from "@nicole23_package/common";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("User with this email already exit.");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = User.build({ email, password: hashPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it in cookie-session
    req.session = {
      jwt: token,
    };

    res.status(200).json(user);
  }
);

export { router as signupRoute };
