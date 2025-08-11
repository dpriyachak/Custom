import React from "react";

const Sidebar = ({ filters, setFilters, onApply, onClear }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
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
    setFilters(cleared);
    if (onClear) onClear();
  };

  return (
    <div className="sidebar">
      <h3>Search Filters</h3>

      <div className="filter-section">
        <label className="filter-label">Job ID</label>
        <input
          className="filter-input"
          name="jobId"
          value={filters.jobId || ""}
          onChange={handleChange}
          placeholder="Enter Job ID"
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Reviewer</label>
        <input
          className="filter-input"
          name="reviewer"
          value={filters.reviewer || ""}
          onChange={handleChange}
          placeholder="Enter Reviewer"
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Status</label>
        <select
          className="filter-select"
          name="status"
          value={filters.status || ""}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="running">Running</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">Tags</label>
        <input
          className="filter-input"
          name="tags"
          value={filters.tags || ""}
          onChange={handleChange}
          placeholder="Enter Tag (e.g. invoice)"
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Start Date</label>
        <input
          className="date-input"
          type="date"
          name="startTime"
          value={filters.startTime ? filters.startTime.split("T")[0] : ""}
          onChange={(e) => {
            // keep parent filters in same datetime-local-ish format if you want T
            const val = e.target.value ? `${e.target.value}T00:00` : "";
            setFilters(prev => ({ ...prev, startTime: val }));
          }}
        />
      </div>

      <div className="filter-section">
        <label className="filter-label">Stop Date</label>
        <input
          className="date-input"
          type="date"
          name="stopTime"
          value={filters.stopTime ? filters.stopTime.split("T")[0] : ""}
          onChange={(e) => {
            const val = e.target.value ? `${e.target.value}T23:59` : "";
            setFilters(prev => ({ ...prev, stopTime: val }));
          }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="refresh-btn" onClick={onApply}>🔄 Apply Filters</button>
        <button className="clear-filters-btn" onClick={handleClear} style={{ marginLeft: 8 }}>Clear All</button>
      </div>
    </div>
  );
};

export default Sidebar;
