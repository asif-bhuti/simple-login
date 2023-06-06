import express from "express";
import { verify } from "../middlewares/middleware.js";
import {
  login,
  refresh,
  logout,
  deleteUser,
} from "../controllers/controller.js";

const router = express.Router();

router.post("/api/login", login);
router.post("/refresh", refresh);
router.post("/logout", verify, logout);
router.delete("/users/:userId", verify, deleteUser);

export default router;
