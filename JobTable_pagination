const JobTable = ({
  jobs,
  totalJobs,
  jobsPerPage,
  totalFilteredJobs,
  currentPage,
  setCurrentPage
}) => {
  if (jobs.length === 0) {
    return <div className="no-results">No jobs match the current filters.</div>;
  }

  const totalPages = Math.ceil(totalFilteredJobs / jobsPerPage);

  return (
    <div className="table-panel">
      {/* Stats Panel */}
      <div className="stats-panel">
        <div className="stat-box">
          <h2>{totalFilteredJobs}</h2>
          <p>Total Jobs</p>
        </div>
        <div className="stat-box">
          <h2>{jobs.filter((j) => j.status === "completed").length}</h2>
          <p>Completed</p>
        </div>
        <div className="stat-box">
          <h2>{jobs.filter((j) => j.status === "running").length}</h2>
          <p>Running</p>
        </div>
        <div className="stat-box">
          <h2>{jobs.filter((j) => j.status === "failed").length}</h2>
          <p>Failed</p>
        </div>
      </div>

      {/* Export Button */}
      <button className="export-button">Export CSV</button>

      {/* Job Table */}
      <table>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Input</th>
            <th>Output</th>
            <th>Start</th>
            <th>Stop</th>
            <th>Status</th>
            <th>Reviewer</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.jobId}>
              <td>{job.jobId}</td>
              <td>{job.inputFolder}</td>
              <td>{job.outputFolder}</td>
              <td>{job.startTime}</td>
              <td>{job.stopTime}</td>
              <td>{job.status === "IN_PROGRESS" ? "RUNNING" : job.status}</td>
              <td>
                <div className="reviewer-cell">
                  <div className="reviewer-avatar">
                    {job.reviewer ? job.reviewer.charAt(0).toUpperCase() : "?"}
                  </div>
                  <span>{job.reviewer}</span>
                </div>
              </td>
              <td>
                {job.tags.map((tag, idx) => (
                  <span className="tag-badge" key={idx}>
                    {tag}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobTable;
