import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./components/layout/Sidebar";
import Header  from "./components/layout/Header";
import Login        from "./pages/Login";
import Dashboard    from "./pages/Dashboard";
import Jobs         from "./pages/Jobs";
import JobDetail    from "./pages/JobDetail";
import Candidates   from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import Interviews   from "./pages/Interviews";
import Offers       from "./pages/Offers";
import AITools      from "./pages/AITools";
import Analytics    from "./pages/Analytics";
import NotFound     from "./pages/NotFound";

function ProtectedLayout() {
  const token = useSelector((s) => s.auth.accessToken);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/"              element={<Dashboard />} />
          <Route path="/jobs"          element={<Jobs />} />
          <Route path="/jobs/:id"      element={<JobDetail />} />
          <Route path="/candidates"    element={<Candidates />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/applications"  element={<Applications />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
          <Route path="/interviews"    element={<Interviews />} />
          <Route path="/offers"        element={<Offers />} />
          <Route path="/ai-tools"      element={<AITools />} />
          <Route path="/analytics"     element={<Analytics />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
