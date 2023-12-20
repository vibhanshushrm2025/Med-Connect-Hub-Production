import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { changeAccountStatusController, getAllDoctorsController, getAllUsersController } from "../controllers/admin.js";
const router = express.Router();

router.get("/getAllUsers", isLoggedIn, getAllUsersController);
router.get("/getAllDoctors", isLoggedIn, getAllDoctorsController);
router.post("/changeAccountStatus",isLoggedIn,changeAccountStatusController);


export default router;
