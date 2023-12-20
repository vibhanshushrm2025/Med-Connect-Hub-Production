import jwt from "jsonwebtoken";
export const setCookie=(uss,statusCode,message,result,res)=>{
    const token = jwt.sign({ _id: uss._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
    sameSite:process.env.NODE_ENV==="development"?"lax":"none",
    secure :process.env.NODE_ENV==="development"?false:true // Above two properties has to be different on deploying , so .dotenv is used 
  });
  res.status(statusCode).json({
    success:result,
    message:message
});
}