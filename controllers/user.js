import { mdl } from "../models/user.js";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/features.js";
import errorHandlingClass from "../middlewares/error.js";
import {doctorModel} from "../models/doctorModel.js";
import moment from "moment";
import { appointment } from "../models/appointment.js";
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await mdl.findOne({ email: email }); 
    if (user) {
      return next(new errorHandlingClass("user already exits", 201, false));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const uss = await mdl.create({
      name,
      email,
      password: hashedPassword,
    });
    setCookie(uss, 201, "Registered Successfully", true, res); 
  } catch (error) {
    
    next(error);
  }
};
export const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Docots Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro WHile Fetching DOcotr",
    });
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await mdl.findOne({ email: email }).select("+password"); // finding does user exists on mongodb . And this select will
    // give you only selected fields and this plus will let you access the
    // the fields along with the one whose select is true
    if (!user)
      return next(new errorHandlingClass("user doesn't exist", 201, false));
    const tof = await bcrypt.compare(password, user.password); 
    if (tof) {
      setCookie(user, 201, "LoggedIn successfully", true, res);
    } else {
      return next(
        new errorHandlingClass("Password didn't matched", 201, false)
      );
    }
  } catch (error) {
    next(error);
  }
};
export const getAll = async (req, res, next) => {
  try {
    const user = await mdl.find({});
    res.send(user);
  } catch (error) {
    next(error);
  }
};
export const getUserDetail =  (req, res, next) => {
  const id = req.params.id;
  res.send({ id: id });
};
export const myProfile =  (req, res, next) => {
    res.send({
      success:"true",
      user:req.user
    });
};
export const logout =  (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite:process.env.NODE_ENV==="development"?"lax":"none",
    secure :process.env.NODE_ENV==="development"?false:true 
  });
  res.send({
    success: true,
    message: "LoggedOut successfully",
  });
};

export const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel.create({ ...req.body, status: "pending" });
    const adminUser = await mdl.findOne({ isAdmin: true });
    const notifcation = adminUser.notifcation;
    notifcation.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/docotrs",
      },
    });
    await mdl.findByIdAndUpdate(adminUser._id, { notifcation });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied SUccessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Doctotr",
    });
  }
};


export const getAllNotificationController = async (req, res) => {
  try {
    const user = await mdl.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notifcation = user.notifcation;
    seennotification.push(...notifcation);
    user.notifcation = [];
    user.seennotification = notifcation;
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

export const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await mdl.findOne({ _id: req.body.userId });
    user.notifcation = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};


export const bookeAppointmnetController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointment(req.body);
    await newAppointment.save();
    const user = await mdl.findOne({ _id: req.body.doctorInfo.userId });
    user.notifcation.push({
      type: "New-appointment-request",
      message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

export const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointment.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

export const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointment.find({
      userId: req.body.userId,
    });
    const newAppointments = await Promise.all(appointments.map(async(appoint,index)=>{
        const doctor = await doctorModel.findById(appoint.doctorId);
        const obj = {...appoint._doc,firstName:doctor.firstName,lastName:doctor.lastName};
        return obj;
    }));
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: newAppointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};