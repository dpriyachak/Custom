const Sidebar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="sidebar">
      <h3>Search Filters</h3>

      <div className="filter-section">
        <label>Job ID</label>
        <input
          name="jobId"
          value={filters.jobId}
          onChange={handleChange}
          placeholder="Enter Job ID"
        />
      </div>

      <div className="filter-section">
        <label>User</label>
        <select name="reviewer" value={filters.reviewer} onChange={handleChange}>
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="analyst">Analyst</option>
        </select>
      </div>

      <div className="filter-section">
        <label>Status</label>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="running">Running</option>
        </select>
      </div>
    </div>
  );
};

export default Sidebar;
