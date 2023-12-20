import {register,login, getAll, getUserDetail, myProfile, logout,applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDocotrsController, bookeAppointmnetController, bookingAvailabilityController, userAppointmentsController} from "../controllers/user.js"
import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/all",getAll)
router.get("/logout",logout)
router.get("/userId/:id",isLoggedIn,getUserDetail)
router.get("/me",isLoggedIn,myProfile)
router.post("/apply-doctor", isLoggedIn, applyDoctorController);
router.post("/get-all-notification",isLoggedIn,getAllNotificationController);
router.post("/delete-all-notification",isLoggedIn,deleteAllNotificationController);
router.get("/getAllDoctors", isLoggedIn, getAllDocotrsController);
router.post("/book-appointment", isLoggedIn, bookeAppointmnetController);
router.post("/booking-availbility",isLoggedIn,bookingAvailabilityController);
router.post("/user-appointments", isLoggedIn, userAppointmentsController);



export default router;
