import express from "express";
import { currentUser, requireAuth } from "@nicole23_package/common";

const router = express.Router();

router.get("/api/users/currentUser", currentUser, requireAuth, (req, res) => {
  res.status(200).json({ currentUser: req.currentUser });
});

export { router as currentUserRoute };
