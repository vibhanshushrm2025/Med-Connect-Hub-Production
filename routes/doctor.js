import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { doctorAppointmentsController, getDoctorByIdController, getDoctorInfoController, updateProfileController, updateStatusController } from "../controllers/doctor.js";
const router = express.Router();

router.post("/getDoctorInfo", isLoggedIn, getDoctorInfoController);
router.post("/updateProfile", isLoggedIn, updateProfileController);
router.post("/doctor-appointments",isLoggedIn,doctorAppointmentsController);
router.post("/update-status", isLoggedIn, updateStatusController);
router.post("/getDoctorById", isLoggedIn, getDoctorByIdController);


export default router;
