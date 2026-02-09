import mongoose from "mongoose";

const ReportSchema  = new mongoose.Schema({
    report_type:{type:String , enum :["internal" , "endsem"], required:true},
    report_html:{ type: String, required: true},
    report_data:{ type: Object, required: true},
    createdAt: { type: Date, default: Date.now }
});


const ReportModel = mongoose.models.Report || mongoose.model('Report', ReportSchema);

export default ReportModel;