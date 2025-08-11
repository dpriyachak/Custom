import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import JobTable from "./components/JobTable";
import { fetchJobs } from "./utils/api"; // API call function

function App() {
  const [filters, setFilters] = useState({
    jobId: "",
    reviewer: "",
    status: "",
    tags: "",
    startTime: "",
    stopTime: ""
  });

  const [jobs, setJobs] = useState([]); // All jobs from API
  const [filteredJobs, setFilteredJobs] = useState([]); // Displayed jobs
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination state (client-side display)
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const loadJobs = async (token = null) => {
    setLoading(true);
    const { jobs: newJobs, nextToken: newToken } = await fetchJobs(1000, token);
    setJobs(prev => [...prev, ...newJobs]);
    setFilteredJobs(prev => [...prev, ...newJobs]); // Default view shows all
    setNextToken(newToken);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs(); // Load first page on mount
  }, []);

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
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      jobId: "",
      reviewer: "",
      status: "",
      tags: "",
      startTime: "",
      stopTime: ""
    });
    setFilteredJobs(jobs);
    setCurrentPage(1);
  };

  // Slice jobs for the current page
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
        <div>
          <JobTable
            jobs={currentJobs}
            totalJobs={jobs.length}
            jobsPerPage={jobsPerPage}
            totalFilteredJobs={filteredJobs.length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          {/* Load more button for API-based pagination */}
          {nextToken && (
            <button onClick={() => loadJobs(nextToken)} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
