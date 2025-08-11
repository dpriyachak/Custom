import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import JobTable from "./components/JobTable";
import { fetchJobs } from "./utils/api"; // API call

function App() {
  const [filters, setFilters] = useState({
    jobId: "",
    reviewer: "",
    status: "",
    tags: "",
    startTime: "",
    stopTime: ""
  });

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [loading, setLoading] = useState(false);

  // Store API-provided nextTokens for each page
  const [pageTokens, setPageTokens] = useState({ 1: null });

  const loadJobs = async (page = 1) => {
    setLoading(true);
    const token = pageTokens[page] || null;
    const { jobs: newJobs, nextToken, totalCount } = await fetchJobs(jobsPerPage, token);
    setJobs(newJobs);
    setTotalJobs(totalCount);
    setLoading(false);

    // Save the nextToken for the following page
    if (nextToken) {
      setPageTokens(prev => ({ ...prev, [page + 1]: nextToken }));
    }
  };

  useEffect(() => {
    loadJobs(1); // Load first page
  }, []);

  const applyFilters = () => {
    // In server-side filtering, filters should be sent to API
    setCurrentPage(1);
    loadJobs(1);
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
    setCurrentPage(1);
    loadJobs(1);
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
        <JobTable
          jobs={jobs}
          totalJobs={totalJobs}
          jobsPerPage={jobsPerPage}
          currentPage={currentPage}
          setCurrentPage={(page) => {
            setCurrentPage(page);
            loadJobs(page);
          }}
          loading={loading}
        />
      </div>
    </>
  );
}

export default App;
