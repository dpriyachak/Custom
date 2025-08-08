import React, { useEffect, useState } from "react";
import { fetchJobs } from "./utils/api";
import JobTable from "./components/JobTable";
import "./index.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadJobs = async (token = null) => {
    setLoading(true);
    const { jobs: newJobs, nextToken: newToken } = await fetchJobs(1000, token);
    setJobs((prevJobs) => [...prevJobs, ...newJobs]);
    setNextToken(newToken);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="App">
      <h1>Job Dashboard</h1>
      <JobTable jobs={jobs} />
      {nextToken && (
        <button onClick={() => loadJobs(nextToken)} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}

export default App;
