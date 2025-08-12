<JobTable 
  jobs={currentPageJobs}  // only the jobs for the current page
  stats={{
    total: filteredJobs.length,
    completed: filteredJobs.filter(j => j.status === "completed").length,
    running: filteredJobs.filter(j => j.status === "running" || j.status === "IN_PROGRESS").length,
    failed: filteredJobs.filter(j => j.status === "failed").length
  }}
/>




const JobTable = ({ jobs, stats }) => {
  if (jobs.length === 0) {
    return <div className="no-results">No jobs match the current filters.</div>;
  }

  return (
    <div className="table-panel">
      <div className="stats-panel">
        <div className="stat-box">
          <h2>{stats.total}</h2>
          <p>Total Jobs</p>
        </div>
        <div className="stat-box">
          <h2>{stats.completed}</h2>
          <p>Completed</p>
        </div>
        <div className="stat-box">
          <h2>{stats.running}</h2>
          <p>Running</p>
        </div>
        <div className="stat-box">
          <h2>{stats.failed}</h2>
          <p>Failed</p>
        </div>
      </div>

      <button className="export-button">Export CSV</button>

      <table>
        {/* ... existing table code ... */}
      </table>
    </div>
  );
};
