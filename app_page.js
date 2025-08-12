// inside App component
const [currentPage, setCurrentPage] = useState(1);
const jobsPerPage = 10;

// Calculate indexes for slicing
const indexOfLastJob = currentPage * jobsPerPage;
const indexOfFirstJob = indexOfLastJob - jobsPerPage;
const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

// Change page
const paginate = (pageNumber) => setCurrentPage(pageNumber);
