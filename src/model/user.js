// import mongoose form index.js -> after created the mongoose setup and set the schema and model 
import mongoose from "./index.js";

// validate email 

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };


//create schema 
let userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required']
    }, 
    email:{
        type:String,
        required:[true,'Email is required'],
        validate:{
            validator: (value)=>validateEmail(value)
        }
    },
    password:{
        type:String,
        required:[true,'Password is required'],
    },
    status:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{
    collection:'users', /* In database create default database + 's', so ignore this problem */
    versionKey:false /* In database create default "v" add so ignore this problem */
})

//create model

const userModel= mongoose.model('users',userSchema)

export default userModel