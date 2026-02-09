import SurveyModel from "../models/SurveyModel.js";
import ReportModel from "../models/ReportModel.js";

const SubmitSurvey = async ( req, res) =>{
    try {
        const {
            reportId,
            studentData,
            feedback,
            examType,
            submittedAt
        } = req.body;

        // Validate required fields
        if(!reportId || !studentData || !feedback || !examType){
            return res.status(400).json({message:"Missing required fields"});
        }

        if(!studentData.rollNumber || !studentData.studentName){
            return res.status(400).json({message:"Missing student information"});
        }

        // Verify that the report exists
        const report = await ReportModel.findById(reportId);
        if(!report){
            return res.status(404).json({message:"Report not found"});
        }

        // Prepare data to save
        const dataToSave = {
            reportId: reportId,
            studentData: {
                rollNumber: studentData.rollNumber,
                studentName: studentData.studentName,
                comment: studentData.comment || ''
            },
            feedback: feedback,
            examType: examType
        };

        const newSurvey = new SurveyModel(dataToSave);
        await newSurvey.save();
        
        res.status(201).json({
            message:"Survey submitted successfully",
            survey: newSurvey
        });

    } catch (error) {
        console.log("The Survey Not Upload: " + error);
        res.status(500).json({message:"Error submitting survey", error: error.message});
    }
}


const getAllReport = async (req,res) =>{
    try {
        const reports = await SurveyModel.find().populate('reportId');
        res.json(reports);
    } catch (error) {
        console.log("Error fetching reports: " + error);
        res.status(500).json({message:"Error fetching surveys", error: error.message});
    }
}

// Get all survey responses for a specific report
const getSurveysByReportId = async (req, res) => {
    try {
        const { reportId } = req.params;
        const surveys = await SurveyModel.find({ reportId: reportId }).populate('reportId');
        res.json(surveys);
    } catch (error) {
        console.log("Error fetching surveys by reportId: " + error);
        res.status(500).json({message:"Error fetching surveys", error: error.message});
    }
}

// Get all reportIds that have survey responses
const getReportsWithSurveys = async (req, res) => {
    try {
        const surveys = await SurveyModel.find().select('reportId').distinct('reportId');
        res.json(surveys);
    } catch (error) {
        console.log("Error fetching reports with surveys: " + error);
        res.status(500).json({message:"Error fetching reports with surveys", error: error.message});
    }
}

export { getAllReport , SubmitSurvey, getSurveysByReportId, getReportsWithSurveys};