import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "name is require"],
    } ,
    email : {
        type:String,
        required:[true, "email is require"],
        unique:true 
    },
    password:{
        type:String,
        required:[true, "password is require"],
        select:false // It won't be fetched if you don't use .select("password") or select("+password")
                    // .select("password") will not give you the password
                    // .select("+password") will give you the password along with the entities which are not select :false
    },
    createdAt:{
        type:Date,
        default:Date.now // these two things can be go in any database
    },
    isAdmin: {
        type: Boolean,
        default: false,
      },
      isDoctor: {
        type: Boolean,
        default: false,
      },
      notifcation: {
        type: Array,
        default: [],
      },
      seennotification: {
        type: Array,
        default: [],
      },
})
export const mdl = mongoose.model("User",schema);

