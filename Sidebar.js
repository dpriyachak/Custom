import { useState } from "react";

const Sidebar = ({ filters, setFilters, onApply, onClear }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleApply = () => {
    setFilters(localFilters);
    onApply();
  };

  const handleClear = () => {
    const cleared = {
      jobId: "",
      reviewer: "",
      status: "",
      tags: "",
      startTime: "",
      stopTime: ""
    };
    setLocalFilters(cleared);
    setFilters(cleared);
    onClear();
  };

  return (
    <div className="sidebar">
      <h3>Search Filters</h3>

      <div className="filter-section">
        <label className="filter-label">Job ID</label>
        <input
          className="filter-input"
          name="jobId"
          value={localFilters.jobId}
          onChange={handleChange}
          placeholder="Enter Job ID"
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Reviewer</label>
        <input
          className="filter-input"
          name="reviewer"
          value={localFilters.reviewer}
          onChange={handleChange}
          placeholder="Enter Reviewer"
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Status</label>
        <select
          className="filter-select"
          name="status"
          value={localFilters.status}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="running">Running</option>
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">Tags</label>
        <input
          className="filter-input"
          name="tags"
          value={localFilters.tags}
          onChange={handleChange}
          placeholder="Enter Tag (e.g. invoice)"
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Start Time</label>
        <input
          className="filter-input"
          name="startTime"
          value={localFilters.startTime}
          onChange={handleChange}
          placeholder="YYYY-MM-DD HH:mm"
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Stop Time</label>
        <input
          className="filter-input"
          name="stopTime"
          value={localFilters.stopTime}
          onChange={handleChange}
          placeholder="YYYY-MM-DD HH:mm"
        />
      </div>

      <button className="filter-button" onClick={handleApply}>
        Apply Filters
      </button>
      <button className="filter-button" onClick={handleClear} style={{ marginTop: "10px" }}>
        Clear Filters
      </button>
    </div>
  );
};

export default Sidebar;
