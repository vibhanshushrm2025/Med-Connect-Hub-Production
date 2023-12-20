class errorHandlingClass extends Error{
    constructor(message,statusCode,success){
        super(message);
        this.statusCode=statusCode;
        this.success = success;
    }
}

export const errorHandle=async (err,req,res,next)=>{
    err.message = err.message||"Internal Server error";
    err.statusCode = err.statusCode||500;
    return res.status(err.statusCode).json({
        success:err.success,
        message:err.message
    })
}
export default errorHandlingClass;