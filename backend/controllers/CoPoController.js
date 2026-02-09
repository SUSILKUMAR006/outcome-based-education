import CoPoModel from '../models/CoPoModel.js';

const createCoPo = async (req, res) => {
  try {
    const { subjectName, subjectCode, batch, createdBy, createdById, mapping } = req.body;

    if (!subjectName || !batch || !mapping) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if mapping for same subject & batch already exists
    const existing = await CoPoModel.findOne({ subjectName, batch });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Mapping already exists', mapping: existing });
    }

    const newMapping = new CoPoModel({ subjectName, subjectCode, batch, createdBy, createdById, mapping });
    const saved = await newMapping.save();

    res.json({ success: true, message: 'CoPo mapping saved', mapping: saved });
  } catch (error) {
    console.log('CoPo Save Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getCoPo = async (req, res) => {
  try {
    const { subject, batch } = req.query;
    if (!subject || !batch) {
      return res.status(400).json({ success: false, message: 'Missing subject or batch' });
    }
    const mapping = await CoPoModel.findOne({ subjectName: subject, batch });
    if (!mapping) {
      return res.json({ success: true, exists: false });
    }
    res.json({ success: true, exists: true, mapping });
  } catch (error) {
    console.log('CoPo Get Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { createCoPo, getCoPo };
