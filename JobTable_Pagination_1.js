const JobTable = ({
  jobs,
  totalJobs,
  jobsPerPage,
  currentPage,
  setCurrentPage,
  loading
}) => {
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  if (loading) return <div>Loading jobs...</div>;

  if (!jobs || jobs.length === 0) {
    return <div className="no-results">No jobs match the current filters.</div>;
  }

  return (
    <div className="table-panel">
      <div className="jobs-summary">
        Showing {jobs.length} of {totalJobs} jobs
      </div>

      <table className="job-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Input Folder</th>
            <th>Output Folder</th>
            <th>Start Time</th>
            <th>Stop Time</th>
            <th>Status</th>
            <th>Reviewer</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={index}>
              <td>{job.jobId}</td>
              <td>{job.inputFolder}</td>
              <td>{job.outputFolder}</td>
              <td>{job.startTime}</td>
              <td>{job.stopTime}</td>
              <td>{job.status === "IN_PROGRESS" ? "RUNNING" : job.status}</td>
              <td>{job.reviewer}</td>
              <td>{Array.isArray(job.tags) ? job.tags.join(", ") : ""}</td>
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
