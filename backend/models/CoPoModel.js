import mongoose from 'mongoose';

const PoSchema = new mongoose.Schema({
  poCode: { type: String },
  value: { type: Number },
});

const CoSchema = new mongoose.Schema({
  coCode: { type: String },
  pos: [PoSchema],
  psos: [{ type: Number }],
});

const CoPoSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectCode: { type: String },
  batch: { type: String, required: true },
  createdBy: { type: String },
  createdById: { type: String },
  mapping: [CoSchema],
  createdAt: { type: Date, default: Date.now },
});

const CoPoModel = mongoose.models.copo || mongoose.model('copo', CoPoSchema);
export default CoPoModel;
