const JobTable = ({ jobs }) => {
  if (jobs.length === 0) {
    return <div className="no-results">No jobs match the current filters.</div>;
  }

  return (
    <div className="table-container">
      <div className="results-count">{jobs.length} jobs found</div>
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
              <td>{job.reviewer}</td>
              <td>{job.tags.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
