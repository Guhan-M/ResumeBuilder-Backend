// Backend schema
import mongoose from "mongoose";

let formalResume2Schema = new mongoose.Schema({

  image:{
    type:String
  },
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
  collection: "formalresume2",
  versionKey: false,
});

const FormalResume2Model = mongoose.model("FormalResume2", formalResume2Schema);

export default FormalResume2Model;
