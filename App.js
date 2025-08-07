import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import JobTable from "./components/JobTable";
import jobData from "./data";

function App() {
  const [filters, setFilters] = useState({
    jobId: "",
    reviewer: "",
    status: ""
  });

  const filteredJobs = jobData.filter((job) => {
    return (
      (filters.jobId === "" || job.jobId.includes(filters.jobId)) &&
      (filters.reviewer === "" || job.reviewer === filters.reviewer) &&
      (filters.status === "" || job.status === filters.status)
    );
  });

  return (
    <>
      <div className="header">
        <h1>Job Dashboard</h1>
        <p>Track and filter document processing jobs</p>
      </div>

      <div className="main-content">
        <Sidebar filters={filters} setFilters={setFilters} />
        <JobTable jobs={filteredJobs} />
      </div>
    </>
  );
}

export default App;
