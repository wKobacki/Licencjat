import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './containers/Login/loginPage';
import Register from './containers/Register/registerPage';
import VerifyEmail from './containers/verify-email/VerifyEmail';
import ResetStepOne from './containers/ResetPassNotLoged/ResetStepOne';
import ResetStepTwo from './containers/ResetPassNotLoged/ResetStepTwo';
import ResetStepThree from './containers/ResetPassNotLoged/ResetStepThree';
import MyIdeas from './containers/MyIdeas/Myideas';
import HomePage from './containers/HomePage/HomePage';
import MainLayout from './layout/MainLayout';
import IdeasExchange from './containers/IdeasExchange/IdeasExchange';
import Users from './containers/ManageUsers/Users';
import ForgotPassword from './containers/ForgotPassword/ForgotPassword';
import IdeasManagement from './containers/ManageIdeas/AdminIdeaList';

const App = () => {
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');
  const userBranch = localStorage.getItem('userBranch');

  const handleLogout = () => {
    localStorage.clear();
  };

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetStepOne />} />
        <Route path="/reset-password/step2" element={<ResetStepTwo />} />
        <Route path="/reset-password/step3" element={<ResetStepThree />} />

        {/* PRIVATE ROUTES */}
        <Route element={<MainLayout userRole={userRole} onLogout={handleLogout} />}>
          <Route path="/homePage" element={<HomePage userEmail={userEmail} userRole={userRole} userBranch={userBranch} />} />
          <Route path="/myIdeas" element={<MyIdeas userEmail={userEmail} userRole={userRole} userBranch={userBranch} />} />
          <Route path="/IdeasExchange" element={<IdeasExchange userEmail={userEmail} userRole={userRole} userBranch={userBranch} />} />
          <Route path="/admin/users" element={<Users userEmail={userEmail} userRole={userRole} userBranch={userBranch} />} />
          <Route path="/ForgotPassword" element={<ForgotPassword userEmail={userEmail} userRole={userRole} />} /> 
          <Route path="/admin/ideas-management" element={<IdeasManagement userEmail={userEmail} userRole={userRole} />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
