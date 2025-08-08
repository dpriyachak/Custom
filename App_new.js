import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import JobTable from "./components/JobTable";
import { fetchJobs } from "./utils/api"; // Your API call

function App() {
  const [filters, setFilters] = useState({
    jobId: "",
    reviewer: "",
    status: "",
    tags: "",
    startTime: "",
    stopTime: ""
  });

  const [jobs, setJobs] = useState([]);         // All jobs from API
  const [filteredJobs, setFilteredJobs] = useState([]); // Displayed jobs
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadJobs = async (token = null) => {
    setLoading(true);
    const { jobs: newJobs, nextToken: newToken } = await fetchJobs(1000, token);
    setJobs(prev => [...prev, ...newJobs]);
    setFilteredJobs(prev => [...prev, ...newJobs]); // Show all jobs initially
    setNextToken(newToken);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs(); // Load first page on mount
  }, []);

  const applyFilters = () => {
    const result = jobs.filter((job) => {
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
    setFilters({
      jobId: "",
      reviewer: "",
      status: "",
      tags: "",
      startTime: "",
      stopTime: ""
    });
    setFilteredJobs(jobs);
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
        <div>
          <JobTable jobs={filteredJobs} />
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
