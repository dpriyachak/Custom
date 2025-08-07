const JobTable = ({ jobs }) => {
  if (jobs.length === 0) {
    return <div className="no-results">No jobs match the current filters.</div>;
  }

  return (
    <div className="table-panel">
      <div className="stats-panel">
        <div className="stat-box">
          <h2>{jobs.length}</h2>
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

      <button className="export-button">Export CSV</button>

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
              <td>{job.status}</td>
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
    </div>
  );
};

export default JobTable;
