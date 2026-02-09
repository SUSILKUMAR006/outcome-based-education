import mongoose from "mongoose";

const FinalAttainmentSchema = new mongoose.Schema({
    batch: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    data: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Index for faster lookups, but not unique to allow case-insensitive updates
FinalAttainmentSchema.index({ batch: 1, subject: 1 });

const FinalAttainmentModel = mongoose.models.FinalAttainment || mongoose.model('FinalAttainment', FinalAttainmentSchema);

export default FinalAttainmentModel;

