import { useState } from "react";
import Sidebar from "./components/Sidebar";
import JobTable from "./components/JobTable";

function App() {
  const [filters, setFilters] = useState({
    jobId: "",
    reviewer: "",
    status: "",
    tags: "",
    startTime: "",
    stopTime: ""
  });

  const [jobs, setJobs] = useState([]);           // all jobs from API
  const [filteredJobs, setFilteredJobs] = useState([]); // after filtering
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const applyFilters = () => {
    const result = jobs.filter((job) => {
      return (
        (!filters.jobId || job.jobId.includes(filters.jobId)) &&
        (!filters.reviewer || job.reviewer.toLowerCase().includes(filters.reviewer.toLowerCase())) &&
        (!filters.status || job.status === filters.status) &&
        (!filters.tags || job.tags.join(" ").includes(filters.tags)) &&
        (!filters.startTime || job.startTime >= filters.startTime) &&
        (!filters.stopTime || job.stopTime <= filters.stopTime)
      );
    });
    setFilteredJobs(result);
    setCurrentPage(1); // reset to first page when filters change
  };

  const clearFilters = () => {
    setFilteredJobs(jobs);
    setFilters({
      jobId: "",
      reviewer: "",
      status: "",
      tags: "",
      startTime: "",
      stopTime: ""
    });
    setCurrentPage(1);
  };

  // Get current page jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

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
        <JobTable
          jobs={currentJobs}
          totalJobs={filteredJobs.length}
          jobsPerPage={jobsPerPage}
          totalFilteredJobs={filteredJobs.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}

export default App;
