const getDateOnly = (dateStr) => {
  if (!dateStr) return null;
  return dateStr.split(" ")[0]; // Take only the date part before the first space
};

const applyFilters = () => {
  const result = jobs.filter((job) => {
    const jobDate = getDateOnly(job.startTime);
    const jobStopDate = getDateOnly(job.stopTime);
    const filterStartDate = filters.startTime
      ? filters.startTime.split("T")[0]
      : null;
    const filterStopDate = filters.stopTime
      ? filters.stopTime.split("T")[0]
      : null;

    return (
      (filters.jobId === "" || job.jobId.includes(filters.jobId)) &&
      (filters.reviewer === "" ||
        job.reviewer.toLowerCase().includes(filters.reviewer.toLowerCase())) &&
      (filters.status === "" || job.status === filters.status) &&
      (filters.tags === "" ||
        (Array.isArray(job.tags)
          ? job.tags.join(" ").includes(filters.tags)
          : false)) &&
      (!filterStartDate || jobDate >= filterStartDate) &&
      (!filterStopDate || jobStopDate <= filterStopDate)
    );
  });

  setFilteredJobs(result);
};
