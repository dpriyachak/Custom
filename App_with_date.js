import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import JobTable from "./components/JobTable";
import { fetchJobs } from "./utils/api"; // Your API call

function App() {
  const [filters, setFilters] = useState({
    jobId: "",
    reviewer: "",
    status: "",
    tags: "",
    startTime: "", // from datetime-local (e.g. "2025-08-01T10:00")
    stopTime: ""
  });

  const [jobs, setJobs] = useState([]);         // All jobs from API (accumulated pages)
  const [filteredJobs, setFilteredJobs] = useState([]); // Displayed (after filtering)
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load jobs (pagination supported). NOTE: do not set filteredJobs here.
  const loadJobs = async (token = null) => {
    try {
      setLoading(true);
      const { jobs: newJobs = [], nextToken: newToken = null } = await fetchJobs(1000, token);

      // Normalize each job (safe tags array & reviewer fallback)
      const normalized = newJobs.map(j => ({
        ...j,
        tags: Array.isArray(j.tags)
          ? j.tags
          : (typeof j.tags === "string" ? j.tags.split(",").map(t => t.trim()) : []),
        reviewer: typeof j.reviewer === "string"
          ? j.reviewer
          : (j.reviewer && j.reviewer.name ? j.reviewer.name : "")
      }));

      setJobs(prev => [...prev, ...normalized]);
      setNextToken(newToken);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: extract date-only (YYYY-MM-DD) from your timestamp format
  const getDateOnly = (dateStr) => {
    if (!dateStr) return null;
    // dateStr example: "2025-07-29  10:23:10.608864"
    // split by space and pick first non-empty token
    const tokens = dateStr.split(" ").filter(Boolean);
    return tokens.length > 0 ? tokens[0] : null; // "2025-07-29"
  };

  // Run filtering whenever jobs or filters change.
  // This avoids putting setState calls into child components and prevents loops.
  useEffect(() => {
    const result = jobs.filter((job) => {
      // jobDate & jobStopDate - only date part (YYYY-MM-DD)
      const jobDate = getDateOnly(job.startTime);
      const jobStopDate = getDateOnly(job.stopTime);

      // filter dates - convert datetime-local (e.g. "2025-08-01T10:00") to "YYYY-MM-DD"
      const filterStartDate = filters.startTime ? filters.startTime.split("T")[0] : null;
      const filterStopDate = filters.stopTime ? filters.stopTime.split("T")[0] : null;

      const matchesJobId = !filters.jobId || (job.jobId || "").includes(filters.jobId);
      const matchesReviewer = !filters.reviewer || (job.reviewer || "").toLowerCase().includes(filters.reviewer.toLowerCase());
      const matchesStatus = !filters.status || job.status === filters.status;
      const matchesTags = !filters.tags || (Array.isArray(job.tags) && job.tags.join(" ").includes(filters.tags));
      const matchesStartDate = !filterStartDate || (jobDate && jobDate >= filterStartDate);
      const matchesStopDate = !filterStopDate || (jobStopDate && jobStopDate <= filterStopDate);

      return matchesJobId && matchesReviewer && matchesStatus && matchesTags && matchesStartDate && matchesStopDate;
    });

    setFilteredJobs(result);
  }, [jobs, filters]);

  // Pass this to Sidebar if you want an explicit Apply button (optional)
  const applyFilters = () => {
    // no-op here because filtering is automatic via the effect above.
    // kept so Sidebar can call it if you wish; it will simply re-run the effect.
    // Optionally you can keep some analytics or debounce logic here.
    setFilteredJobs(prev => prev); // harmless
  };

  const clearFilters = () => {
    const cleared = {
      jobId: "",
      reviewer: "",
      status: "",
      tags: "",
      startTime: "",
      stopTime: ""
    };
    setFilters(cleared);
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
          <JobTable jobs={filteredJobs} totalJobs={jobs.length} />
          {nextToken && (
            <div style={{ marginTop: 12 }}>
              <button onClick={() => loadJobs(nextToken)} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
