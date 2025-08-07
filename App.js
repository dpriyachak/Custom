import { useState } from "react";
import Sidebar from "./components/Sidebar";
import JobTable from "./components/JobTable";
import jobData from "./data";

function App() {
  const [filters, setFilters] = useState({
    jobId: "",
    reviewer: "",
    status: "",
    tags: "",
    startTime: "",
    stopTime: ""
  });

  const [filteredJobs, setFilteredJobs] = useState(jobData);

  const applyFilters = () => {
    const result = jobData.filter((job) => {
      return (
        (filters.jobId === "" || job.jobId.includes(filters.jobId)) &&
        (filters.reviewer === "" || job.reviewer.toLowerCase().includes(filters.reviewer.toLowerCase())) &&
        (filters.status === "" || job.status === filters.status) &&
        (filters.tags === "" || job.tags.join(" ").includes(filters.tags)) &&
        (filters.startTime === "" || job.startTime >= filters.startTime) &&
        (filters.stopTime === "" || job.stopTime <= filters.stopTime)
      );
    });
    setFilteredJobs(result);
  };

  const clearFilters = () => {
    setFilteredJobs(jobData);
  };

  return (
    <>
      <div className="header">
        <h1>Job Dashboard</h1>
        <p>Track and filter document processing jobs</p>
      </div>

      <div className="main-content">
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          onApply={applyFilters}
          onClear={clearFilters}
        />
        <JobTable jobs={filteredJobs} />
      </div>
    </>
  );
}

export default App;
