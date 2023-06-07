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
router.post("/api/refresh", refresh);
router.post("/api/logout", logout);
router.delete("/api/users/:userId", verify, deleteUser);

export default router;
