import UserModel from '../model/user.js'
import Auth from '../utils/auth.js'
import resumetempModel from '../model/createResume.js'
import FormalResume1Model from '../model/formalResume1.js'
import FormalResume3Model from '../model/formalResume3.js'
import FormalResume2Model from '../model/formalResume2.js'
import multer from 'multer'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'




const signUp = async (req,res)=>{
    try{
        let user= await UserModel.findOne({email:req.body.email})
        if(!user){
            req.body.password = await Auth.hashPassword(req.body.password) /* send the argument to hashpassword */
            await UserModel.create(req.body) /* create the data with schema and model */
            res.status(201).send({
                message:"User signup successfull"
            })
        }
            else{
                res.send(400).send({
                    message:`User with ${req.body.password} already exists`
                })
            }
    }
    catch(error){
        res.send(500).send({
            message:error.message || "Internal Server Error"
        })
    }
}

const login = async (req,res)=>{
    try{
        let user= await UserModel.findOne({email:req.body.email})
        if(user){
            if(await Auth.hashCompare(req.body.password,user.password))
            {
                let token = await Auth.createtoken({
                    name:user.name,
                    email:user.email,
                    id:user._id,
                    role:user.role
                    /*Payload setup for create token*/
                })
                res.status(200).send({
                    message:"Login successfull",
                    name:user.name,
                    id:user._id,
                    role:user.role,
                    token /* Return the token and name,id,role details*/ 
                })
            }
            else{
                res.status(400).send({
                    message:`Incorrect Password`
                })
        }
           
            }
            else{
                res.status(400).send({
                    message:`User with ${req.body.email} does not exists`
                })
            }
        }
    catch(error){
        res.status(500).send({
            message:error.message || "Internal Server Error"
        })
    }
}
    
 const forgetPassword = async(req,res)=>{
    try{
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      let token = await Auth.createtoken({
        name:user.name,
        email:user.email,
        id:user._id,
        role:user.role
        /*Payload setup for create token*/
      })
      
      // Send the token to the user's email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.PASSWORD,
        },
      });
      
      
        // Email configuration
    const mailOptions = {
          from: process.env.EMAIL,
          to: req.body.email,
          subject: "Reset Password",
          html: `<h1>Reset Your Password</h1>
        <p>Click on the following link to reset your password:</p>
        <a href="http://localhost:5173/resetPassword/${token}">http://localhost:8000/resetPassword/${token}</a>
        <p>The link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>`,
        };
      
       // Send the email
       transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        res.status(200).send({ message: "Email sent" });
      });
  
    }
    else{
      return res.status(404).send({ message: "User not found" });
    }
}
catch (err) {
  res.status(500).send({ message: err.message });
}



}

const resetPassword = async(req,res)=>{
  try {
    // // Verify the token sent by the user
    // const decodedToken = Auth.decodeToken(req.params.token)
    const decodedToken = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET
    );
    // If the token is invalid, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }

    // find the user with the id from the token
    const user = await UserModel.findOne({ _id: decodedToken.id });
    if (!user) {
      return res.status(401).send({ message: "no user found" });
    }
     // Hash the new password
     req.body.newPassword = await Auth.hashPassword(req.body.newPassword)
     // Update user's password, clear reset token and expiration time
     user.password = req.body.newPassword;
     await user.save();
 
     // Send success response
     res.status(200).send({ message: "Password updated" });
  } catch (err) {
    // Send error response if any error occurs
    res.status(500).send({ message: err.message });
  }  

}


const getAllUsers = async (req,res)=>{
    try{
        let users = await resumetempModel.find({},{password:0}) // Ignore the password in the return data - use this method password :0
        res.status(200).send({
            message:"Data fetch successfull",
            users
        })
    }
    catch(error){
        res.status(500).send({
            message:error.message || "Internal server error"
        })
    }
}

const getUserById = async (req,res)=>{
    try{
        let user = await resumetempModel.find() // Ignore the password in the return data - use this method password :0
        res.status(200).send({
            message:"Data fetch successfull",
            user
        })
    }
    catch(error){
        res.status(500).send({
            message:error.message || "Internal server error"
        })
    }
}

const createResumeTemplate =async (req,res)=>{
    try{
        let roomid= await resumetempModel.findOne({resumeid:req.body.resumeid})
        if(!roomid){
            let user = await resumetempModel.create(req.body) 
            res.status(200).send({
            message:"Data fetch successfull",
            user
        })
        }
        else{
            res.status(400).send({
                message:`Already exists`
            })
        }
    }
    catch(error){
        res.status(500).send({
            message:error.message || "Internal server error"
        })
    }
}

const formalresume1create = async (req, res) => {
    try {
// Check if all required fields are present in the request body
      const requiredFields = ['personalDetails', 'qualifications', 'skills'];
      const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));
      if (missingFields.length > 0) {
        return res.status(400).send({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }
  
      // Validate the jobs field separately if it exists
      if (req.body.hasOwnProperty("jobs") && !Array.isArray(req.body.jobs)) {
        return res.status(400).send({
          message: `Invalid format for the 'jobs' field. It should be an array.`,
        });
      }
  
      // Create a new instance of the formalresume1Model with the request body
      let user = await FormalResume1Model.create(req.body);
  
      // Send a success response with the created user data
      res.status(201).send({
        message: "Data fetch successful",
        user,
      });   
    } catch (error) {
      // Handle any errors that occur during the creation process
      res.status(500).send({
        message: error.message || "Internal server error",
      });
    }
  };

const getresumedata =async (req,res)=>{
    try{
            let users = await FormalResume1Model.find() 
             res.status(200).send({
            message:"Data fetch successfull",
            users
        })
        } 
    catch(error){
        res.status(500).send({
            message:error.message || "Internal server error"
        })
    }
}

const viewresumedata =async (req,res)=>{
    try{
            let users = await FormalResume1Model.find() 
             res.status(200).send({
            message:"Data fetch successfull",
            users
        })
        } 
    catch(error){
        res.status(500).send({
            message:error.message || "Internal server error"
        })
    }
}


// get filename from the multer request
let uploadedFilename = '';
// check the image is upload or not if upload next move to the formal resume2create 
let checkimage;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/images");
  },
  filename: function (req, file, cb) {
   const  filenames=`${Date.now()}_${file.originalname}`;
   uploadedFilename = filenames;
    cb(null,filenames);
  }  
});

const upload = multer({ storage: storage }).single("image");


const formalresume2create = async (req, res) => {
  try {
    // Check if a resume with the same resumeid exists
      // Check if all required fields are present in the request body
      const requiredFields = ['personalDetails', 'qualifications', 'skills'];
      const missingFields = requiredFields.filter(
        (field) => !req.body.hasOwnProperty(field)
      );
      if (missingFields.length > 0) {
        return res.status(400).send({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Validate the jobs field separately if it exists
      if (req.body.hasOwnProperty("jobs") && !Array.isArray(req.body.jobs)) {
        return res.status(400).send({
          message: `Invalid format for the 'jobs' field. It should be an array.`,
        });
      }

      
  try {
      if(checkimage==true){
        let image= await {image:uploadedFilename }
        const totalarray = {
       ...req.body,
     ...image // Assuming filename contains the file data
     };
     if(totalarray){
      let user = await FormalResume2Model.create(totalarray);
      // filenamearray.splice(0,1)
    // Send a success response with the created user data
      res.status(201).send({
      message: "Data fetch successful",
      user, 
    });
    }
  }
  // Create a new instance of the formalresume1Model with the request body
  else{
    res.status(400).send({ message: 'Imgae upload....' });
  }   
    
  }
    catch (error) {
          res.status(500).send({
            message: error.message || "Error occurred while creating formal resume",
          });
        }
  } catch (error) {
    // Handle any errors that occur during the creation process
    res.status(500).send({
      message: error.message || "Internal server error",
    });
  }
}

const uploadimageresume2 = async (req, res) => {
  try {
    
      upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).send({ message: 'Multer error occurred' });
      } else if (err) {
        return res.status(500).send({ message: 'Unknown error occurred' });
      }

      if(req.file?.filename){
        const filenamein = req.file.filename;
         if(filenamein){
          checkimage=true
          res.status(201).send({ message: 'File uploaded successfully', filenamein });
         }
      // Process the uploaded file as needed
      // You can access the file information using req.file

      // console.log(filenamein)
      }
      else{
        res.status(400).send({ message: 'Imgae upload....' });
      }
   
      // File uploaded successfully
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

const viewresumedata2 =async (req,res)=>{
  try{
          let users = await FormalResume2Model.find() 
          //  console.log(users[0].image)
          res.status(200).send({
          message:"Data fetch successfull",
          users
          }) 
    }
  catch(error){
      res.status(500).send({
          message:error.message || "Internal server error"
      })
  }
  
// console.log(imagenamefile)
}

const deleteresume = async (req, res) => {
  try {
    // Find documents from FormalResume1Model
    const doc1 = await FormalResume1Model.findOne({ _id: req.body.id, resumeid: req.body.resumeid });

    // Find documents from FormalResume2Model
    const doc2 = await FormalResume2Model.findOne({ _id: req.body.id, resumeid: req.body.resumeid });

    const doc3 = await FormalResume3Model.findOne({ _id: req.body.id, resumeid: req.body.resumeid });

    // Check if documents were found and delete them
    if (doc1) {
      const deletionResult1 = await FormalResume1Model.deleteOne({ _id: doc1._id });
      if (deletionResult1.deletedCount > 0) {
        return res.status(200).send({ message: "Document from FormalResume1Model deleted successfully" });
      } else {
        return res.status(404).send({ message: "No matching record found for deletion in FormalResume1Model" });
      }
    } else if (doc2) {
      const deletionResult2 = await FormalResume2Model.deleteOne({ _id: doc2._id });
      if (deletionResult2.deletedCount > 0) {
        return res.status(200).send({ message: "Document from FormalResume2Model deleted successfully" });
      } else {
        return res.status(404).send({ message: "No matching record found for deletion in FormalResume2Model" });
      }
    }
    else if (doc2) {
      const deletionResult2 = await FormalResume3Model.deleteOne({ _id: doc3._id });
      if (deletionResult2.deletedCount > 0) {
        return res.status(200).send({ message: "Document from FormalResume2Model deleted successfully" });
      } else {
        return res.status(404).send({ message: "No matching record found for deletion in FormalResume2Model" });
      }
    } 
    else {
      return res.status(404).send({ message: "No matching record found for deletion" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const getresumedataid = async(req,res)=>{
  console.log(req.params)
  try {
    // Find documents from FormalResume1Model
    const doc1 = await FormalResume1Model.findOne({ _id: req.params.id });

    // Find documents from FormalResume2Model
    const doc2 = await FormalResume2Model.findOne({ _id: req.params.id });

    const doc3 = await FormalResume3Model.findOne({ _id: req.params.id });

    // Check if documents were found and delete them
    if (doc1) {
      const dataResult1 = await FormalResume1Model.findOne({ _id: doc1._id });
      if (dataResult1) {
        return res.status(200).send({
           message: "Document  successfully",
           data:dataResult1
           });
      } else {
        return res.status(404).send({ message: "No matching record found " });
      }
    } else if (doc2) {
      const dataResult2 = await FormalResume2Model.findOne({ _id: doc2._id });
      if (dataResult2) {
        return res.status(200).send({
          message: "Document  successfully",
          data:dataResult2
          });
      } else {
        return res.status(404).send({ message:"No matching record found "});
      }
    }
    else if (doc3) {
      const dataResult3 = await FormalResume3Model.findOne({ _id: doc3._id });
      if (dataResult3) {
        return res.status(200).send({
          message: "Document  successfully",
          data:dataResult3
          });
      } else {
        return res.status(404).send({ message:"No matching record found "});
      }
    } else {
      return res.status(404).send({ message: "No matching record" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message || "Internal server error" });
  }
}

const formalresume3create = async (req, res) => {
  try {
// Check if all required fields are present in the request body
    const requiredFields = ['personalDetails', 'qualifications', 'skills'];
    const missingFields = requiredFields.filter(field => !req.body.hasOwnProperty(field));
    if (missingFields.length > 0) {
      return res.status(400).send({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate the jobs field separately if it exists
    if (req.body.hasOwnProperty("jobs") && !Array.isArray(req.body.jobs)) {
      return res.status(400).send({
        message: `Invalid format for the 'jobs' field. It should be an array.`,
      });
    }

    // Create a new instance of the formalresume1Model with the request body
    let user = await FormalResume3Model.create(req.body);

    // Send a success response with the created user data
    res.status(201).send({
      message: "Data fetch successful",
      user,
    });   
  } catch (error) {
    // Handle any errors that occur during the creation process
    res.status(500).send({
      message: error.message || "Internal server error",
    });
  }
};

const viewresumedata3 =async (req,res)=>{
  try{
          let users = await FormalResume3Model.find() 
           res.status(200).send({
          message:"Data fetch successfull",
          users
      })
      } 
  catch(error){
      res.status(500).send({
          message:error.message || "Internal server error"
      })
  }
}

export default {
    signUp,
    login,
    getAllUsers,
    getUserById,
    createResumeTemplate,
    formalresume1create,
    getresumedata,
    viewresumedata,
    formalresume2create,
    uploadimageresume2,
    viewresumedata2,
    deleteresume,
    resetPassword,
    forgetPassword,
    getresumedataid,
    formalresume3create,
    viewresumedata3
}