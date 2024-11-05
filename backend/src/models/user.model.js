import mongoose from "mongoose"

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema= new mongoose.Schema({

    username:{
        type:String,
        require:true,
        unique:true,
        lowercase:true

    },
    email:{

    },
    mobile:{

    },
    image:{

    },
    date_of_birth:{

    },

    adhar:{

    },

    password:
    {
        type:String,
        required:[true,"please enter the password"]
    }
    

},

{
    timestamps:true
}


)

/// --------------------------------------------->

// complete the code wit the refferece from user and video model of the backend
userSchema.pre("save",async function(next){ /// in this we have passed the function not arrow function 
    // because arrow func cant access the class members --- this.password , so used the function 
  if(!this.isModified("password")) return next();

        this.password=await bcrypt.hash(this.password,10);
        next();
})

userSchema.method.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password);
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export  const User=mongoose.model("User",userSchema);