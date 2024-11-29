import express, { Request, Response } from "express"
import { body } from "express-validator"
import { BadRequestError, validateRequest } from "@nicole23_package/common"
import { User } from "../models/user-model"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/api/users/signin", [
  body("email")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("You must apply a password")
], validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })

  if (!existingUser) {
    throw new BadRequestError("Invalid credential")
  }

  const comparePassword = await bcrypt.compare(password, existingUser.password)

  if (!comparePassword) {
    throw new BadRequestError("Invalid credential")
  }

  // Generate JWT token
  const token = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.JWT_KEY!)

  // Store token in cookies session
  req.session = {
    jwt: token
  }

  res.status(200).json(existingUser)

})

export { router as signinRoute }
