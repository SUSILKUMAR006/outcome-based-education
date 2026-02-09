import ReportModel from "../models/ReportModel.js";

const addReport = async( req , res) => {
    try {
        const { report_type, report_html , report_data } = req.body;

        // Validate report_type
        if (!report_type || !["internal", "endsem"].includes(report_type)) {
            return res.status(400).json({ 
                error: "Invalid report_type. Must be 'internal' or 'endsem'" 
            });
        }

        // Validate required fields
        if (!report_html || !report_data) {
            return res.status(400).json({ 
                error: "Missing required fields: report_html and report_data are required" 
            });
        }

        const newReport = new ReportModel({
            report_type,
            report_html,
            report_data
        })

        await newReport.save();
        res.json({ 
            message: "Report saved successfully",
            report: newReport
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error saving report", details: error.message });
    }

}

const getAllReports = async ( req , res) => {
    try {
        const reports = await ReportModel.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching reports", details: error.message });
    }
}


const getReportById = async ( req , res) => {
    try {
        const { id } = req.params;
        const report = await ReportModel.findById(id);
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.json(report);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching report", details: error.message });
    }
}

// Get reports by type (internal or endsem)
const getReportsByType = async (req, res) => {
    try {
        const { type } = req.params;
        
        // Validate report type
        if (!["internal", "endsem"].includes(type)) {
            return res.status(400).json({ 
                error: "Invalid report type. Must be 'internal' or 'endsem'" 
            });
        }

        const reports = await ReportModel.find({ report_type: type }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching reports", details: error.message });
    }
}

// Get internal reports by IAT type (IAT-1, IAT-2, IAT-3)
const getInternalReportsByIAT = async (req, res) => {
    try {
        const { iatType } = req.params;
        
        // Validate IAT type
        if (!["IAT-1", "IAT-2", "IAT-3"].includes(iatType)) {
            return res.status(400).json({ 
                error: "Invalid IAT type. Must be 'IAT-1', 'IAT-2', or 'IAT-3'" 
            });
        }

        const reports = await ReportModel.find({ 
            report_type: "internal",
            "report_data.internalType": iatType 
        }).sort({ createdAt: -1 });
        
        res.json(reports);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching reports", details: error.message });
    }
}

// Update report by ID
const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { report_data, report_html } = req.body;

        if (!report_data) {
            return res.status(400).json({ 
                error: "report_data is required" 
            });
        }

        // Get the existing report to preserve HTML if not provided
        const existingReport = await ReportModel.findById(id);
        if (!existingReport) {
            return res.status(404).json({ error: "Report not found" });
        }

        // If HTML is not provided, regenerate it from the updated data
        let htmlToUpdate = report_html || existingReport.report_html;
        
        // If HTML needs to be regenerated, update it with new data
        if (!report_html) {
            htmlToUpdate = generateUpdatedHtml(existingReport.report_html, report_data);
        }

        const updatedReport = await ReportModel.findByIdAndUpdate(
            id,
            { 
                $set: { 
                    report_data: report_data,
                    report_html: htmlToUpdate
                } 
            },
            { new: true, runValidators: true }
        );

        res.json({ 
            message: "Report updated successfully",
            report: updatedReport 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating report", details: error.message });
    }
};

// Helper function to update HTML with new data
const generateUpdatedHtml = (originalHtml, newData) => {
    let updatedHtml = originalHtml;

    // Update basic info
    if (newData.batch) {
        updatedHtml = updatedHtml.replace(/Batch:<\/strong>\s*([^<]*)/g, `Batch:</strong> ${newData.batch}`);
    }
    if (newData.department) {
        updatedHtml = updatedHtml.replace(/Department:<\/strong>\s*([^<]*)/g, `Department:</strong> ${newData.department}`);
    }
    if (newData.semester) {
        updatedHtml = updatedHtml.replace(/Semester:<\/strong>\s*([^<]*)/g, `Semester:</strong> ${newData.semester}`);
    }
    if (newData.subject) {
        updatedHtml = updatedHtml.replace(/Subject:<\/strong>\s*([^<]*)/g, `Subject:</strong> ${newData.subject}`);
    }
    if (newData.totalStudents) {
        updatedHtml = updatedHtml.replace(/Total Students:<\/strong>\s*([^<]*)/g, `Total Students:</strong> ${newData.totalStudents}`);
    }

    // Update CO values if present
    if (newData.coValues) {
        Object.keys(newData.coValues).forEach(key => {
            const regex = new RegExp(`${key}:<\/strong>\\s*([^<]*)`, 'g');
            updatedHtml = updatedHtml.replace(regex, `${key}:</strong> ${newData.coValues[key]}`);
        });
    }

    return updatedHtml;
};

// Delete report by ID
const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReport = await ReportModel.findByIdAndDelete(id);

        if (!deletedReport) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.json({ 
            message: "Report deleted successfully",
            report: deletedReport 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error deleting report", details: error.message });
    }
};

export { addReport , getAllReports , getReportById, getReportsByType, getInternalReportsByIAT, updateReport, deleteReport };
