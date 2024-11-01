
const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler).catch((error)=>next(error))
    }
}

export {asyncHandler}