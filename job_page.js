<JobTable jobs={currentJobs} totalJobs={jobs.length} />
<Pagination
  jobsPerPage={jobsPerPage}
  totalJobs={filteredJobs.length}
  paginate={paginate}
  currentPage={currentPage}
/>
