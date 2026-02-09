import FinalAttainmentModel from "../models/FinalAttainmentModel.js";

// Save or update final attainment (upsert by batch + subject)
export const saveFinalAttainment = async (req, res) => {
    try {
        console.log("📥 Received save request:", { batch: req.body.batch, subject: req.body.subject });
        
        const { batch, subject, data } = req.body;

        if (!batch || !subject || !data) {
            console.log("❌ Missing required fields:", { batch, subject, hasData: !!data });
            return res.status(400).json({ success: false, message: "batch, subject and data are required" });
        }

        const batchKey = batch.trim();
        const subjectKey = subject.trim();

        console.log("🔍 Searching for existing record with:", { batch: batchKey, subject: subjectKey });

        const saved = await FinalAttainmentModel.findOneAndUpdate(
            { batch: batchKey, subject: subjectKey },
            {
                batch: batchKey,
                subject: subjectKey,
                data,
                updatedAt: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log("✅ Final attainment saved successfully:", saved._id);
        return res.json({ success: true, record: saved, message: "Final attainment saved successfully" });
    } catch (err) {
        console.error("❌ saveFinalAttainment error:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error saving final attainment", 
            error: err.message 
        });
    }
};

// Get by batch + subject
export const getFinalAttainment = async (req, res) => {
    try {
        const { batch, subject } = req.query;
        if (!batch || !subject) {
            return res.status(400).json({ success: false, message: "batch and subject are required" });
        }

        const record = await FinalAttainmentModel.findOne({
            batch: batch.trim(),
            subject: subject.trim()
        });

        if (!record) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        return res.json({ success: true, record });
    } catch (err) {
        console.error("getFinalAttainment error", err);
        return res.status(500).json({ success: false, message: "Server error fetching final attainment" });
    }
};

// Get all
export const getAllFinalAttainment = async (_req, res) => {
    try {
        const records = await FinalAttainmentModel.find().sort({ updatedAt: -1 });
        return res.json({ success: true, records });
    } catch (err) {
        console.error("getAllFinalAttainment error", err);
        return res.status(500).json({ success: false, message: "Server error fetching final attainment" });
    }
};

