# Quick Start Guide - Unified Report System

## ✅ Yes, It's Already Working!

Your system **already supports** both Internal Exam Reports and End Semester Reports using the **same API** and **same MongoDB collection**.

---

## 🎯 Key Points

1. **Same Collection**: Both report types are stored in the `reports` collection
2. **Same API Endpoint**: Both use `POST /report/addReport`
3. **Differentiation**: The `report_type` field distinguishes between types:
   - `"internal"` - For IAT-1, IAT-2, IAT-3 reports
   - `"endsem"` - For End Semester Exam reports

---

## 📤 How to Send Data

### From Internal.jsx (Already Correct ✅)
```javascript
const hybridReport = {
  report_type: "internal",  // ✅ Already set correctly
  report_html: reportHtml,
  report_data: reportData,
};

await axios.post(`${url}/report/addReport`, hybridReport);
```

### From EndSemester.jsx (Already Correct ✅)
```javascript
const hybridReport = {
  report_type: "endsem",  // ✅ Already set correctly
  report_html: reportHtml,
  report_data: reportData,
};

await axios.post(`${url}/report/addReport`, hybridReport);
```

---

## 📥 How to Fetch Reports

### Get All Reports
```javascript
const response = await axios.get(`${url}/report/getAll`);
```

### Get Only Internal Reports
```javascript
const response = await axios.get(`${url}/report/getByType/internal`);
```

### Get Only End Semester Reports
```javascript
const response = await axios.get(`${url}/report/getByType/endsem`);
```

### Get Internal Reports by IAT Type
```javascript
// Get IAT-1 reports
const response = await axios.get(`${url}/report/internal/getByIAT/IAT-1`);

// Get IAT-2 reports
const response = await axios.get(`${url}/report/internal/getByIAT/IAT-2`);

// Get IAT-3 reports
const response = await axios.get(`${url}/report/internal/getByIAT/IAT-3`);
```

---

## 📊 Database Schema

```javascript
{
  _id: ObjectId,
  report_type: "internal" | "endsem",  // Required - distinguishes report types
  report_html: String,                  // HTML representation
  report_data: Object,                  // Flexible JSON structure
  createdAt: Date                       // Auto-generated
}
```

---

## 🔑 Important Fields

### Internal Report (`report_type: "internal"`)
- `report_data.internalType`: "IAT-1" | "IAT-2" | "IAT-3"
- `report_data.coValues`: Contains CO1/CO2, CO3/CO4, or CO5/CO6 depending on IAT
- `report_data.assignmentMarks`: Assignment marks for students

### End Semester Report (`report_type: "endsem"`)
- `report_data.coValues`: Contains all 6 COs (CO1 through CO6)
- `report_data.studentMarks`: Contains marks for all 6 COs

---

## ✅ Your Current Implementation Status

- ✅ Backend model supports both types
- ✅ Backend API accepts both types
- ✅ Frontend Internal.jsx sends `report_type: "internal"`
- ✅ Frontend EndSemester.jsx sends `report_type: "endsem"`
- ✅ Both use the same endpoint: `/report/addReport`
- ✅ Both are stored in the same collection: `reports`

**Everything is working correctly!** 🎉

---

## 📚 For More Details

See `REPORT_SYSTEM_GUIDE.md` for complete documentation, examples, and best practices.

