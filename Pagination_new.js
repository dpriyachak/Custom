const Pagination = ({ jobsPerPage, totalJobs, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalJobs / jobsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <a
              onClick={() => paginate(number)}
              style={{ cursor: "pointer" }}
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
