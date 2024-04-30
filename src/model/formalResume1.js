// Backend schema
import mongoose from "mongoose";

let formalResume1Schema = new mongoose.Schema({

  id:{
    type:String
  },
  resumeid:{
    type:String
  },
    personalDetails: {
            firstname: {
                type: String,
                required: [true, "First name is required"],
              },
              lastname: {
                type: String,
                required: [true, "Last name is required"],
              },
              email: {
                type: String,
                required: [true, "Email is required"],
              },
              mobile: {
                type: Number,
                required: [true, "Mobile is required"],
              },
              address: {
                type: String,
                required: [true, "Address is required"],
              },
              city: {
                type: String,
                required: [true, "City is required"],
              },
              state: {
                type: String,
                required: [true, "State is required"],
              },
              zip: {
                type: Number,
                required: [true, "Zip is required"],
              },
              github: {
                type: String,
              },
              linkedin: {
                type: String,
              },
              portfolio: {
                type: String,
              },
        },
  qualifications: [
    {
      InstituteName: {
        type: String,
      },
      Location: {
        type: String,
      },
      CourseDetails: {
        type: String,
      },
      StartYear: {
        type: Number,
      },
      EndYear: {
        type: Number,
      },
    },
  ],
  jobs: [
    {
      Jobtitle: {
        type: String,
      },
      Employer: {
        type: String,
      },
      Location: {
        type: String,
      },
      StartYear: {
        type: Number,
      },
      EndYear: {
        type: Number,
      },
    },
  ],
  skills: {
    type: Array,
    required: [true, "Skills are required"],
  },
}, {
  collection: "formalresume1",
  versionKey: false,
});

const FormalResume1Model = mongoose.model("FormalResume1", formalResume1Schema);


export default   FormalResume1Model


