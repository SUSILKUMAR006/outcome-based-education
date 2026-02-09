import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({});
  const [studentMarks, setStudentMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const url = "http://localhost:4000";

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${url}/reports/get/${id}`);
        console.log("Fetched Report:", response.data);
        setReport(response.data);
        setFormData(response.data.report_data || {});
        setStudentMarks(response.data.report_data?.studentMarks || []);
      } catch (error) {
        console.error("Report fetch error:", error);
        alert("Error fetching report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    
    if (keys.length === 2) {
      // Handle nested objects like coValues.CO1
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleStudentMarkChange = (studentIndex, field, value) => {
    const updatedMarks = [...studentMarks];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedMarks[studentIndex][parent] = {
        ...updatedMarks[studentIndex][parent],
        [child]: value
      };
    } else {
      updatedMarks[studentIndex][field] = value;
    }
    setStudentMarks(updatedMarks);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const updatedData = {
        ...formData,
        studentMarks: studentMarks
      };

      const response = await axios.put(`${url}/reports/update/${id}`, {
        report_data: updatedData
      });
      
      alert("Report updated successfully!");
      navigate("/Report");
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving report: " + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 mt-20 text-lg">Loading...</div>
    );
  }

  if (!report) {
    return (
      <div className="text-center text-red-500 mt-20 text-lg">
        Report not found
      </div>
    );
  }

  const coValues = formData.coValues || {};

  return (
    <div className="bg-blue-100 pb-10 px-3 lg:px-15 pt-2 min-h-screen">
      <Navbar />
      
      <div className="my-10 bg-white px-10 py-5 rounded shadow-lg max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Report</h1>
        
        <form onSubmit={handleSave}>
          {/* Basic Info */}
          <div className="mb-8 border-b pb-6">
            <h2 className="text-2xl font-semibold mb-4">Report Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Batch</label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter batch"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter department"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Semester</label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter semester"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter subject"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Total Students</label>
                <input
                  type="number"
                  name="totalStudents"
                  value={formData.totalStudents || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter total students"
                />
              </div>

              {formData.internalType && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Internal Type</label>
                  <input
                    type="text"
                    name="internalType"
                    value={formData.internalType || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter internal type"
                  />
                </div>
              )}
            </div>
          </div>

          {/* CO Values */}
          <div className="mb-8 border-b pb-6">
            <h2 className="text-2xl font-semibold mb-4">CO Values</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {['CO1', 'CO2', 'CO3', 'CO4', 'CO5', 'CO6'].map(co => (
                <div key={co}>
                  <label className="block text-gray-700 font-semibold mb-2">{co}</label>
                  <input
                    type="text"
                    name={`coValues.${co}`}
                    value={coValues[co] || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder={`Enter ${co} value`}
                  />
                </div>
              ))}
            </div>

            {/* Assignments (if internal type) */}
            {report.report_type === 'internal' && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Assignments</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Assignment 1</label>
                    <input
                      type="text"
                      name="coValues.Assignment1"
                      value={coValues.Assignment1 || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                      placeholder="Enter Assignment 1 value"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Assignment 2</label>
                    <input
                      type="text"
                      name="coValues.Assignment2"
                      value={coValues.Assignment2 || ''}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                      placeholder="Enter Assignment 2 value"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Student Details */}
          {studentMarks.length > 0 && (
            <div className="mb-8 border-b pb-6">
              <h2 className="text-2xl font-semibold mb-4">Student Details</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                      <th className="border px-4 py-2 text-left">Roll Number</th>
                      <th className="border px-4 py-2 text-left">Name</th>
                      <th className="border px-4 py-2 text-center">Mark 1</th>
                      <th className="border px-4 py-2 text-center">Mark 2</th>
                      <th className="border px-4 py-2 text-center">Total</th>
                      {report.report_type === 'internal' && (
                        <>
                          <th className="border px-4 py-2 text-center">Assign 1</th>
                          <th className="border px-4 py-2 text-center">Assign 2</th>
                          <th className="border px-4 py-2 text-center">Assign Total</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {studentMarks.map((student, index) => (
                      <tr key={index} className="hover:bg-blue-50">
                        <td className="border px-4 py-2">{student.rollNumber || 'N/A'}</td>
                        <td className="border px-4 py-2">{student.name || 'N/A'}</td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            value={student.marks?.mark1 || ''}
                            onChange={(e) => handleStudentMarkChange(index, 'marks.mark1', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:border-blue-500"
                            placeholder="Mark 1"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            value={student.marks?.mark2 || ''}
                            onChange={(e) => handleStudentMarkChange(index, 'marks.mark2', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:border-blue-500"
                            placeholder="Mark 2"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <input
                            type="text"
                            value={student.marks?.total || ''}
                            onChange={(e) => handleStudentMarkChange(index, 'marks.total', e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:border-blue-500"
                            placeholder="Total"
                          />
                        </td>
                        {report.report_type === 'internal' && (
                          <>
                            <td className="border px-4 py-2">
                              <input
                                type="text"
                                value={student.assignmentMarks?.assignmentMark1 || ''}
                                onChange={(e) => handleStudentMarkChange(index, 'assignmentMarks.assignmentMark1', e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:border-blue-500"
                                placeholder="Assign 1"
                              />
                            </td>
                            <td className="border px-4 py-2">
                              <input
                                type="text"
                                value={student.assignmentMarks?.assignmentMark2 || ''}
                                onChange={(e) => handleStudentMarkChange(index, 'assignmentMarks.assignmentMark2', e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:border-blue-500"
                                placeholder="Assign 2"
                              />
                            </td>
                            <td className="border px-4 py-2">
                              <input
                                type="text"
                                value={student.assignmentMarks?.assignmentTotal || ''}
                                onChange={(e) => handleStudentMarkChange(index, 'assignmentMarks.assignmentTotal', e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:border-blue-500"
                                placeholder="Assign Total"
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center lg:justify-start">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/Report")}
              className="bg-gray-600 text-white px-8 py-3 rounded hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReport;
