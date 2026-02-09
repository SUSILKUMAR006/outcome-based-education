import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Internal from './component/InternalExam/Internal.jsx'
import Report from './component/Report.jsx'
import ReportView from './component/ReportView.jsx'
import EndSemester from './component/EndSemesterExam/EndSemester.jsx'
import TakeSurvey from './component/Survey/TakeSurvey.jsx'
import StudentSurvey from './component/Survey/StudentSurvey.jsx'
import ViewSurvey from './component/Survey/ViewSurvey.jsx'
import FinalAttainment from './component/FinalAttainmnet/FinalAttainment.jsx'
import ASheet from './component/FinalAttainmnet/Asheet.jsx'
import Login from './component/Login/Login.jsx'
import PrivateRoute from './component/PrivateRoute.jsx'
import AddAdmin from './component/Login/AddAdmin.jsx'
import AddStudent from './component/Login/AddStudent.jsx'
import AddDepartment from './component/Login/AddDepartment.jsx'
import AddSubject from './component/Login/AddSubject.jsx'
import CoPoMapping from './component/CO-PO_Mapping/CoPoMapping.jsx'
import CoPoSheet from './component/CO-PO_Mapping/CoPoSheet.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
          
          } />
        <Route path='/Internal' element={
          <PrivateRoute>
            <Internal/>
          </PrivateRoute>
          } />
        <Route path='/Report' element={
          <PrivateRoute>
            <Report/>
          </PrivateRoute>
          }/>
        <Route path="/report/:id" element={
          <PrivateRoute>
            <ReportView />
          </PrivateRoute>
          }/>
        <Route path='/end-semester' element={
          <PrivateRoute>
            <EndSemester/>
          </PrivateRoute>
          }/>
        <Route path='/survey' element={
          <PrivateRoute>
            <TakeSurvey/>
          </PrivateRoute>
          }/>
        <Route path="/survey/:reportId" element={
          <PrivateRoute>
            <StudentSurvey />
          </PrivateRoute>
          } />
        <Route path='/survey-responses/:reportId' element={
          <PrivateRoute>
            <ViewSurvey/>
          </PrivateRoute>
          }/>
        <Route path='/Final-Attainment' element={
          <PrivateRoute>
            <FinalAttainment/>
          </PrivateRoute>
          }/>
        <Route path='/a-sheet' element={
          <PrivateRoute>
            <ASheet/>
          </PrivateRoute>
          }/>

          <Route path='/Add-Admin' element ={
            <PrivateRoute>
              <AddAdmin/>
            </PrivateRoute>
          }/>

          <Route path='/Add-Student' element ={
            <PrivateRoute>
              <AddStudent/>
            </PrivateRoute>
          }/>


          <Route path='/Add-department' element ={
            <PrivateRoute>
              <AddDepartment/>
            </PrivateRoute>
          }/>

          <Route path='/Add-Subject' element ={
            <PrivateRoute>
              <AddSubject/>
            </PrivateRoute>
          }/>


          <Route path='/Co-Po-Mapping' element ={
            <PrivateRoute>
              <CoPoMapping/>
            </PrivateRoute>
          }/>


          <Route path='/Co-Po-Sheet' element ={
            <PrivateRoute>
              <CoPoSheet/>
            </PrivateRoute>
          }/>

        <Route path='/login'  element ={<Login/>}/>


      </Routes>
    </BrowserRouter>
  </StrictMode>
)
