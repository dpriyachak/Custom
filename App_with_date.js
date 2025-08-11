const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  // Replace double spaces with 'T', remove microseconds if present
  const cleaned = dateStr
    .replace(/\s{2,}/g, "T")
    .replace(/\.\d+$/, "");
  return new Date(cleaned);
};

const applyFilters = () => {
  const result = jobs.filter((job) => {
    const jobStart = normalizeDate(job.startTime);
    const jobStop = normalizeDate(job.stopTime);
    const filterStart = normalizeDate(filters.startTime);
    const filterStop = normalizeDate(filters.stopTime);

    return (
      (filters.jobId === "" || job.jobId.includes(filters.jobId)) &&
      (filters.reviewer === "" ||
        job.reviewer.toLowerCase().includes(filters.reviewer.toLowerCase())) &&
      (filters.status === "" || job.status === filters.status) &&
      (filters.tags === "" ||
        (Array.isArray(job.tags)
          ? job.tags.join(" ").includes(filters.tags)
          : false)) &&
      (!filterStart || (jobStart && jobStart >= filterStart)) &&
      (!filterStop || (jobStop && jobStop <= filterStop))
    );
  });
  setFilteredJobs(result);
};
