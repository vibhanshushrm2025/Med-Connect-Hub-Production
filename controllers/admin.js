import { mdl } from "../models/user.js";
import errorHandlingClass from "../middlewares/error.js";
import {doctorModel} from "../models/doctorModel.js";
export const getAllUsersController = async (req, res) => {
    try {
      const users = await mdl.find({});
      res.status(200).send({
        success: true,
        message: "users data list",
        data: users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "erorr while fetching users",
        error,
      });
    }
  };
  
  export const getAllDoctorsController = async (req, res) => {
    try {
      const doctors = await doctorModel.find({});
      res.status(200).send({
        success: true,
        message: "Doctors Data list",
        data: doctors,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while getting doctors data",
        error,
      });
    }
  };
  
  // doctor account status
  export const changeAccountStatusController = async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
      const user = await mdl.findOne({ _id: doctor.userId });
      const notifcation = user.notifcation;
      notifcation.push({
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request Has ${status} `,
        onClickPath: "/notification",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();
      res.status(201).send({
        success: true,
        message: "Account Status Updated",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  };
  