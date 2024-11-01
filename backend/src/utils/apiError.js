class ApiError extends Error{
    constructor(
        statusCode,
        messege="Something went wrong",
        errors=[],
        // stack is error stack
        stack=""
        
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=messege
        this.success=false
       
        this.errors=errors


        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }

}


export {ApiError}