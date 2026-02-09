import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import { assets } from '../../assets/assets';

const CoPoSheet = () => {
    const url = 'http://localhost:4000';
    const [isFilled, setIsFilled] = useState(false);
    const [mappingInfo, setMappingInfo] = useState(null);
    const [searchParams] = useSearchParams();
    const subjectName = searchParams.get('subject') || '';
    const batch = searchParams.get('batch') || '';
    const [attainmentData1, setAttainmentData1] = useState([]);


    // State for Mapping Table (6 COs x 15 Columns)
    // Structure: { rowIndex: { colIndex: value } }
    const [mappingData, setMappingData] = useState({});

    // State for Attainment Table (6 COs x 15 Columns)
    const [attainmentData, setAttainmentData] = useState({});

    // State for Live Attainment Data (From Asheet)
    const [iat1Report, setIat1Report] = useState(null);
    const [iat2Report, setIat2Report] = useState(null);
    const [iat3Report, setIat3Report] = useState(null);
    const [endSemReport, setEndSemReport] = useState(null);
    const [iat1Surveys, setIat1Surveys] = useState([]);
    const [iat2Surveys, setIat2Surveys] = useState([]);
    const [iat3Surveys, setIat3Surveys] = useState([]);
    const [endSemSurveys, setEndSemSurveys] = useState([]);

    // Extract report data
    const iat1Data = iat1Report?.report_data;
    const iat2Data = iat2Report?.report_data;
    const iat3Data = iat3Report?.report_data;
    const endExamData = endSemReport?.report_data;
    const endSurvey = endSemReport?.report_data?.surveyFeedback;
    const coValues = Object.values(endSurvey?.coAverages || {});

    // Helper functions from Asheet
    const calculateSurveyAverage = (surveys, coName) => {
        if (!surveys || surveys.length === 0) return 0;
        const coKey = coName.toLowerCase();
        const values = surveys
            .map((s) => s.feedback?.[coKey])
            .filter((v) => v !== undefined && v !== null && v !== "");
        if (values.length === 0) return 0;
        const sum = values.reduce((a, b) => Number(a) + Number(b), 0);
        return (sum / values.length).toFixed(2);
    };

    // Constants for table structure
    const COs = ['C103.1', 'C103.2', 'C103.3', 'C103.4', 'C103.5', 'C103.6', 'Overall'];
    const POs = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PS1', 'PS2', 'PS3'];

    const getCellValue = (data, row, col) => {
        return data[`${row}-${col}`] || "";
    };

    const handleCellChange = (setData, row, col, value) => {
        setData(prev => {
            const updated = { ...prev, [`${row}-${col}`]: value };

            // Calculate Overall Average for this column
            // Rows 0 to 5 are inputs. Row 6 is Overall.
            let sum = 0;
            let count = 0;
            for (let r = 0; r < 6; r++) { // Iterate through CO1 to CO6
                const val = parseFloat(updated[`${r}-${col}`]);
                if (!isNaN(val) && val !== 0) {
                    sum += val;
                    count++;
                }
            }
            const average = count > 0 ? (sum / count).toFixed(2) : "";
            updated[`${COs.length - 1}-${col}`] = average; // Set Overall row value

            return updated;
        });
    };

    useEffect(() => {
        const fetchExisting = async () => {
            if (!subjectName || !batch) {
                setIsFilled(false);
                setMappingInfo(null);
                setMappingData({});
                setAttainmentData({});
                return;
            }
            try {
                const response = await axios.get(`${url}/copo?subject=${encodeURIComponent(subjectName)}&batch=${encodeURIComponent(batch)}`);
                if (response.data?.exists) {
                    setIsFilled(true);
                    setMappingInfo(response.data.mapping);
                    populateState(response.data.mapping);
                } else {
                    setIsFilled(false);
                    setMappingInfo(null);
                    setMappingData({});
                    setAttainmentData({});
                }
            } catch (err) {
                console.error(err);
                setIsFilled(false);
                setMappingInfo(null);
            }
        };

        const fetchLiveAttainmentData = async () => {
            if (!batch || !subjectName) return;

            try {
                // Fetch all reports
                const reportsResponse = await axios.get(`${url}/report/getAll`);
                const allReports = reportsResponse.data;

                // Filter reports by batch and subject
                const filteredReports = allReports.filter((report) => {
                    const reportBatch = report.report_data?.batch?.trim().toLowerCase() || "";
                    const reportSubject = report.report_data?.subject?.trim().toLowerCase() || "";
                    return (
                        reportBatch === batch.toLowerCase() &&
                        reportSubject === subjectName.toLowerCase()
                    );
                });

                // Get 3 internal exam reports (IAT-1, IAT-2, IAT-3)
                const iat1 = filteredReports.find(
                    (r) =>
                        r.report_type === "internal" &&
                        r.report_data?.internalType === "IAT-1"
                );
                const iat2 = filteredReports.find(
                    (r) =>
                        r.report_type === "internal" &&
                        r.report_data?.internalType === "IAT-2"
                );
                const iat3 = filteredReports.find(
                    (r) =>
                        r.report_type === "internal" &&
                        r.report_data?.internalType === "IAT-3"
                );

                // Get 1 end semester exam report
                const endSem = filteredReports.find(
                    (r) => r.report_type === "endsem"
                );

                // Store reports
                setIat1Report(iat1);
                setIat2Report(iat2);
                setIat3Report(iat3);
                setEndSemReport(endSem);

                // Fetch surveys for each report
                const [iat1SurveyData, iat2SurveyData, iat3SurveyData, endSemSurveyData] =
                    await Promise.all([
                        iat1
                            ? axios.get(`${url}/Survey/by-report/${iat1._id}`).catch(() => ({ data: [] }))
                            : Promise.resolve({ data: [] }),
                        iat2
                            ? axios.get(`${url}/Survey/by-report/${iat2._id}`).catch(() => ({ data: [] }))
                            : Promise.resolve({ data: [] }),
                        iat3
                            ? axios.get(`${url}/Survey/by-report/${iat3._id}`).catch(() => ({ data: [] }))
                            : Promise.resolve({ data: [] }),
                        endSem
                            ? axios.get(`${url}/Survey/by-report/${endSem._id}`).catch(() => ({ data: [] }))
                            : Promise.resolve({ data: [] }),
                    ]);

                // Store surveys
                setIat1Surveys(iat1SurveyData.data);
                setIat2Surveys(iat2SurveyData.data);
                setIat3Surveys(iat3SurveyData.data);
                setEndSemSurveys(endSemSurveyData.data);

            } catch (error) {
                console.error("Error fetching live attainment data", error);
            }
        };


        fetchExisting();
        fetchLiveAttainmentData();
    }, [batch, subjectName]);

    const filteredAttainment = attainmentData1.filter(item =>
        !batch || item.batch === batch
    );

    const populateState = (map) => {
        // Populate Mapping
        const newMappingData = {};
        if (map.mapping && Array.isArray(map.mapping)) {
            map.mapping.forEach((row, rIndex) => {
                if (rIndex >= COs.length) return;

                // POs (First 12)
                if (row.pos && Array.isArray(row.pos)) {
                    row.pos.forEach((po, cIndex) => {
                        newMappingData[`${rIndex}-${cIndex}`] = po.value ? String(po.value) : "";
                    });
                }
                // PSOs (Next 3)
                if (row.psos && Array.isArray(row.psos)) {
                    row.psos.forEach((val, cIndex) => {
                        newMappingData[`${rIndex}-${12 + cIndex}`] = val ? String(val) : "";
                    });
                }
            });
        }
        setMappingData(newMappingData);

        // Populate Attainment
        const newAttainmentData = {};
        if (map.attainment && Array.isArray(map.attainment)) {
            map.attainment.forEach((row, rIndex) => {
                if (rIndex >= COs.length) return;

                // POs
                if (row.pos && Array.isArray(row.pos)) {
                    row.pos.forEach((po, cIndex) => {
                        newAttainmentData[`${rIndex}-${cIndex}`] = po.value ? String(po.value) : "";
                    });
                }
                // PSOs
                if (row.psos && Array.isArray(row.psos)) {
                    row.psos.forEach((val, cIndex) => {
                        newAttainmentData[`${rIndex}-${12 + cIndex}`] = val ? String(val) : "";
                    });
                }
            });
        }
        setAttainmentData(newAttainmentData);
    };

    const handleSave = async () => {
        if (!subjectName || !batch) return alert('Select subject and batch before saving');
        if (isFilled) return alert('This mapping is already saved and cannot be modified');

        try {
            // Construct Payload for Mapping
            const mappingPayload = COs.map((co, rIndex) => {
                const pos = [];
                for (let i = 0; i < 12; i++) {
                    const val = mappingData[`${rIndex}-${i}`];
                    pos.push({ poCode: `PO${i + 1}`, value: val ? Number(val) : 0 });
                }
                const psos = [];
                for (let i = 0; i < 3; i++) {
                    const val = mappingData[`${rIndex}-${12 + i}`];
                    psos.push(val ? Number(val) : 0);
                }
                return { coCode: co, pos, psos };
            });

            // Construct Payload for Attainment
            const attainmentPayload = COs.map((co, rIndex) => {
                const pos = [];
                for (let i = 0; i < 12; i++) {
                    const val = attainmentData[`${rIndex}-${i}`];
                    pos.push({ poCode: `PO${i + 1}`, value: val ? Number(val) : 0 });
                }
                const psos = [];
                for (let i = 0; i < 3; i++) {
                    const val = attainmentData[`${rIndex}-${12 + i}`];
                    psos.push(val ? Number(val) : 0);
                }
                return { coCode: co, pos, psos };
            });

            const createdBy = localStorage.getItem('user') || 'Staff';
            const token = localStorage.getItem('token') || '';
            const createdById = token || '';

            const payload = {
                subjectName,
                subjectCode: '',
                batch,
                createdBy,
                createdById,
                mapping: mappingPayload,
                attainment: attainmentPayload
            };

            const response = await axios.post(`${url}/copo/create`, payload);
            if (response.data?.success) {
                alert('Mapping and Attainment Saved Successfully');
                setIsFilled(true);
                setMappingInfo(response.data.mapping || response.data);
            } else {
                alert(response.data.message || 'Unable to save');
            }
        } catch (err) {
            if (err?.response?.status === 409) {
                alert('Mapping already exists for this subject and batch');
                setIsFilled(true);
                setMappingInfo(err?.response?.data?.mapping || null);
                return;
            }
            console.error(err);
            alert('Error saving mapping. Please try again.');
        }
    };

    // --- DATA PREPARATION: Mapping Rows as Arrays ---
    // Extracting each row of the mapping table into a separate array as requested.
    // Each array contains 15 values: 12 POs + 3 PSOs.

    const getRowData = (rowIndex) => {
        const row = [];
        for (let i = 0; i < 15; i++) {
            // Convert to number, default to 0
            const val = Number(mappingData[`${rowIndex}-${i}`]) || 0;
            row.push(val);
        }
        return row;
    };

    const row1 = getRowData(0); // C103.1
    const row2 = getRowData(1); // C103.2
    const row3 = getRowData(2); // C103.3
    const row4 = getRowData(3); // C103.4
    const row5 = getRowData(4); // C103.5
    const row6 = getRowData(5); // C103.6
    const overallRow = getRowData(6); // Overall

    // --- END DATA PREPARATION ---

    const renderTable = (data, setData, title) => (
        <div className='mt-10 mx-5 lg:mx-20 overflow-x-auto'>
            <h2 className='text-lg font-semibold mb-2'>{title}</h2>
            <table className='w-full border border-collapse min-w-max'>
                <thead>
                    <tr className='bg-gray-100'>
                        <th className='border px-2 py-2 sticky left-0 bg-gray-100 z-10'>CO / PO</th>
                        {POs.map((po, i) => (
                            <th key={i} className='border px-2 py-2'>{po}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {COs.map((co, rIndex) => (
                        <tr key={rIndex} className={co === 'Overall' ? 'bg-yellow-50 font-bold' : ''}>
                            <td className='border px-2 py-2 font-medium sticky left-0 bg-white z-10'>{co}</td>
                            {POs.map((po, cIndex) => {
                                const isOverall = co === 'Overall';
                                const cellValue = getCellValue(data, rIndex, cIndex);

                                return (
                                    <td key={cIndex} className='border px-0 py-0'>
                                        {isOverall ? (
                                            <div className="w-full h-full px-2 py-3 flex items-center justify-center bg-gray-50 text-gray-700">
                                                {cellValue}
                                            </div>
                                        ) : (
                                            <select
                                                className='w-full h-full px-2 py-3 outline-none bg-transparent'
                                                value={cellValue}
                                                onChange={(e) => handleCellChange(setData, rIndex, cIndex, e.target.value)}
                                                disabled={isFilled}
                                            >
                                                <option value=""></option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className='bg-blue-100 min-h-screen pb-10 px-4 lg:px-15 pt-2'>
            <Navbar />
            <div className='bg-white rounded shadow-lg p-6 mt-5'>

                <div className='flex justify-center'>
                    <img src={assets.college_logo} className='object-contain h-18' alt="College Logo" />
                </div>

                <div className='mt-5 text-center'>
                    <h1 className='text-xl font-semibold uppercase'>
                        CO, PO, PSO MAPPING & ATTAINMENT
                    </h1>
                    {subjectName && (
                        <div className='text-sm mt-1 text-gray-600 space-x-3'>
                            <span>Subject: <b>{subjectName}</b></span>
                            <span>Batch: <b>{batch}</b></span>
                        </div>
                    )}
                    {isFilled && mappingInfo && (
                        <div className='text-sm text-green-600 mt-2 bg-green-50 inline-block px-3 py-1 rounded border border-green-200'>
                            ✓ Saved by <b>{mappingInfo.createdBy || 'Staff'}</b> on {new Date(mappingInfo.createdAt).toLocaleString()}
                        </div>
                    )}
                </div>

                {renderTable(mappingData, setMappingData, "Mapping")}


                <div className='mt-10 mx-5 lg:mx-20 overflow-x-auto'>
                    <h2 className=' mt-10  text-lg font-semibold'>Attaimnet</h2>
                    <h2 className='text-lg font-semibold mb-2'></h2>
                    <table className='w-full border border-collapse min-w-max text-center'>
                        <thead>
                            <tr className='bg-gray-100'>
                                <th className='border px-2 py-2 sticky left-0 bg-gray-100 z-10'>CO / PO</th>
                                {POs.map((po, i) => (
                                    <th key={i} className='border px-2 py-2'>{po}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='border px-2 py-2 sticky left-0 z-10'>C103.1</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[0] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[0]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[1] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[1]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[2] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[2]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[3] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[3]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[4] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[4]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[5] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[5]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[6] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[6]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[7] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[7]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[8] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[8]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[9] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[9]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[10] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[10]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[11] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[11]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[12] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[12]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[13] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[13]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row1[14] != 0 ? (((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row1[14]).toFixed(2) : 0}</td>
                            </tr>
                            <tr>
                                <td className='border px-2 py-2 sticky left-0 z-10'>C103.2</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[0] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[0]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[1] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[1]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[2] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[2]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[3] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[3]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[4] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[4]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[5] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[5]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[6] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[6]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[7] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[7]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[8] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[8]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[9] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[9]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[10] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[10]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[11] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[11]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[12] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[12]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[13] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[13]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row2[14] != 0 ? (((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row2[14]).toFixed(2) : 0}</td>
                            </tr>
                            <tr>
                                <td className='border px-2 py-2 sticky left-0 z-10'>C103.3</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[0] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[0]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[1] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[1]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[2] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[2]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[3] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[3]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[4] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[4]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[5] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[5]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[6] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[6]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[7] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[7]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[8] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[8]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[9] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[9]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[10] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[10]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[11] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[11]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[12] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[12]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[13] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[13]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row3[14] != 0 ? (((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row3[14]).toFixed(2) : 0}</td>
                            </tr>
                            <tr>
                                <td className='border px-2 py-2 sticky left-0 z-10'>C103.4</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[0] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[0]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[1] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[1]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[2] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[2]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[3] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[3]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[4] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[4]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[5] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[5]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[6] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[6]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[7] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[7]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[8] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[8]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[9] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[9]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[10] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[10]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[11] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[11]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[12] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[12]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[13] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[13]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row4[14] != 0 ? (((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row4[14]).toFixed(2) : 0}</td>
                            </tr>
                            <tr>
                                <td className='border px-2 py-2 sticky left-0 z-10'>C103.5</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[0] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[0]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[1] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[1]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[2] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[2]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[3] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[3]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[4] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[4]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[5] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[5]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[6] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[6]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[7] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[7]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[8] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[8]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[9] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[9]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[10] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[10]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[11] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[11]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[12] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[12]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[13] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[13]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row5[14] != 0 ? (((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) / 3) * row5[14]).toFixed(2) : 0}</td>
                            </tr>
                            <tr>
                                <td className='border px-2 py-2 sticky left-0 z-10'>C103.5</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[0] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[0]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[1] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[1]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[2] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[2]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[3] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[3]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[4] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[4]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[5] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[5]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[6] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[6]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[7] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[7]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[8] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[8]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[9] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[9]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[10] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[10]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[11] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[11]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[12] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[12]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[13] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[13]).toFixed(2) : 0}</td>
                                <td className='border px-2 py-2 sticky left-0 z-10'>{row6[14] != 0 ? (((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) / 3) * row6[14]).toFixed(2) : 0}</td>
                            </tr>
                            <tr className='bg-green-50 font-bold'>
                                <td className='border px-2 py-2 sticky left-0 bg-green-50 z-10'>PO Attainment</td>
                                {POs.map((_, colIndex) => {
                                    // Calculate Column Average based on User's Manual Logic
                                    let sum = 0;
                                    let count = 0;

                                    // Define the specific CO Attainment factors used for each row 1-6
                                    // Note: These match the formulas user manually typed in the cells above
                                    const coFactors = [
                                        (Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2), // For Row 1
                                        (Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2), // For Row 2
                                        (Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2), // For Row 3
                                        (Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2), // For Row 4
                                        (Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2), // For Row 5
                                        (Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2)  // For Row 6
                                    ];

                                    const rows = [row1, row2, row3, row4, row5, row6];

                                    rows.forEach((row, rowIndex) => {
                                        const mappingValue = row[colIndex];
                                        if (mappingValue > 0) {
                                            // Formula: ( (CO_Factor / 3) * MappingValue )
                                            const val = ((coFactors[rowIndex] / 3) * mappingValue);
                                            sum += val;
                                            count++;
                                        }
                                    });

                                    // Average = Sum / Count (of mapped COs)
                                    const avg = count > 0 ? (sum / count) : 0;

                                    return (
                                        <td key={colIndex} className='border px-2 py-2 text-green-700'>
                                            {avg ? avg.toFixed(2) : '0'}
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className='mt-10 flex justify-center'>
                    <button
                        onClick={handleSave}
                        disabled={isFilled}
                        className={`px-8 py-3 rounded text-white font-semibold shadow-md transition-all 
                        ${isFilled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
                    >
                        {isFilled ? 'Saved' : 'Save Mapping'}
                    </button>
                </div>




                {/* <div className='mt-12 lg:mx-10 overflow-x-auto'>
                    <h1 className="text-xl font-semibold mb-4">Calculated Attainment Details</h1>
                    <table className="border-collapse w-full min-w-max">
                        <thead className="bg-amber-400">
                            <tr>
                                <th className="px-4 py-2 border">Internal</th>
                                <th className="px-4 py-2 border">Assignment</th>
                                <th className="px-4 py-2 border">University</th>
                                <th className="px-4 py-2 border">Total attainment</th>
                                <th className="px-4 py-2 border">Direct 80 %</th>
                                <th className="px-4 py-2 border">Indirect 20 %</th>
                                <th className="px-4 py-2 border">Overall CO attainment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-4 py-2 border text-center">{(Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(iat1Data?.attainment?.levels?.assignment1 || 0) * 0.1).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co1 || 0) * 0.7).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co1 || 0) * 0.7)).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co1 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(coValues[0] * 0.2 || 0).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co1 || 0) * 0.7)) * 0.8) + (coValues[0] * 0.2 || 0)).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border text-center">{(Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(iat1Data?.attainment?.levels?.assignment2 || 0) * 0.1).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co2 || 0) * 0.7).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co2 || 0) * 0.7)).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co2 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(coValues[1] * 0.2 || 0).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co2 || 0) * 0.7)) * 0.8) + (coValues[1] * 0.2 || 0)).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border text-center">{(Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(iat2Data?.attainment?.levels?.assignment1 || 0) * 0.1).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co3 || 0) * 0.7).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat2Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co3 || 0) * 0.7)).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co3 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(coValues[2] * 0.2 || 0).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat2Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co3 || 0) * 0.7)) * 0.8) + (coValues[2] * 0.2 || 0)).toFixed(2)}</td>
                            </tr>

                            <tr>
                                <td className="px-4 py-2 border text-center">{(Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(iat2Data?.attainment?.levels?.assignment2 || 0) * 0.1).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co4 || 0) * 0.7).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat2Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co4 || 0) * 0.7)).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co4 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(coValues[3] * 0.2 || 0).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat2Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co4 || 0) * 0.7)) * 0.8) + (coValues[3] * 0.2 || 0)).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border text-center">{(Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(iat3Data?.attainment?.levels?.assignment1 || 0) * 0.1).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co5 || 0) * 0.7).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co5 || 0) * 0.7)).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co5 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(coValues[4] * 0.2 || 0).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co5 || 0) * 0.7)) * 0.8) + (coValues[4] * 0.2 || 0)).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border text-center">{(Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(iat3Data?.attainment?.levels?.assignment2 || 0) * 0.1).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co6 || 0) * 0.7).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co6 || 0) * 0.7)).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co6 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{(coValues[5] * 0.2 || 0).toFixed(2)}</td>
                                <td className="px-4 py-2 border text-center">{((((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co6 || 0) * 0.7)) * 0.8) + (coValues[5] * 0.2 || 0)).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}
            </div>
        </div>
    );
}

export default CoPoSheet;