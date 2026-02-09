import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    subjectCode: { type: String, required: true, unique: true },

})

const SubjectModel = mongoose.models.subject || mongoose.model("subject", SubjectSchema);

export default SubjectModel;