import mongoose from "mongoose";

const trainSchema=new mongoose.Schema(  {



    
}
,{
    timestamps:true
}
)

export const train=mongoose.model("Train",trainSchema)