import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';

import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './components/Layout';
import ChooseReportType from './pages/ChooseReportType';
import BuildRequest from './pages/BuildRequest';
import ReviewRequest from './pages/ReviewRequest';
import GenerateReport from './pages/GenerateReport';
import ReportSummary from './pages/ReportSummary';

export default function App() {
  const { loadThreads, user } = useAppStore();

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        user ? <Layout /> : <Navigate to="/login" replace />
      }>
        <Route index element={<Navigate to="/new" replace />} />
        <Route path="reports" element={<Home />} />
        <Route path="new" element={<ChooseReportType />} />
        <Route path="new/tech" element={<BuildRequest />} />
        <Route path="new/tech/review" element={<ReviewRequest />} />
        <Route path="report/:id/generating" element={<GenerateReport />} />
        <Route path="report/:id" element={<ReportSummary />} />
      </Route>
    </Routes>
  );
}
