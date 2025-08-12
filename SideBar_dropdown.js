import { useState, useEffect } from "react";

const Sidebar = ({ filters, setFilters, onApply, onClear }) => {
  const [dropdownData, setDropdownData] = useState({
    statuses: [],
    reviewers: [],
    tags: []
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const res = await fetch("https://your-api-url/dropdown-data");
        const data = await res.json();
        setDropdownData(data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  return (
    <div className="sidebar">
      {/* Status dropdown */}
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Statuses</option>
        {dropdownData.statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      {/* Reviewer dropdown */}
      <select
        value={filters.reviewer}
        onChange={(e) => setFilters({ ...filters, reviewer: e.target.value })}
      >
        <option value="">All Reviewers</option>
        {dropdownData.reviewers.map((reviewer) => (
          <option key={reviewer} value={reviewer}>
            {reviewer}
          </option>
        ))}
      </select>

      <!-- Tags Filter -->
                <div class="filter-section">
                    <label class="filter-label">Tags</label>
                    <div class="tags-container">
                        <span class="tag" data-tag="urgent">Urgent</span>
                        <span class="tag" data-tag="legal">Legal</span>
                        <span class="tag" data-tag="financial">Financial</span>
                        <span class="tag" data-tag="medical">Medical</span>
                        <span class="tag" data-tag="research">Research</span>
                        <span class="tag" data-tag="contracts">Contracts</span>
                        <span class="tag" data-tag="invoices">Invoices</span>
                        <span class="tag" data-tag="reports">Reports</span>
                    </div>
                </div>

      {/* Buttons */}
      <button onClick={onApply}>Apply Filters</button>
      <button onClick={onClear}>Clear Filters</button>
    </div>
  );
};

export default Sidebar;
