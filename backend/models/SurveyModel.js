import mongoose from "mongoose";

const SurveySchema = new mongoose.Schema({
    reportId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Report',
        required:true
    },


    studentData:{
        rollNumber :{type:String , required:true},
        studentName:{type:String , required:true },
        comment:{type:String}
    },

    examType:{
        type:String,
        required:true
    },

    feedback:{
        type:Object,
        required:true
    }
},{timestamps:true});

const SurveyModel = mongoose.models.SurveyResponse || mongoose.model("SurveyResponce", SurveySchema);

export default SurveyModel;