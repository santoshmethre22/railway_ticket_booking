import mongoose from "mongoose"

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


export  const User=mongoose.model("User",userSchema);