import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css";

const VisitorList = () => {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [sort, setSort] = useState("");

  const fetchVisitors = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/users/visitors", {
        params: { search, gender, sort }
      });
      setVisitors(res.data);
    } catch (err) {
      toast.error("Failed to load visitors");
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [search, gender, sort]);

  return (
    <div className="expo-list-wrapper">
      <h2 className="expo-list-heading">Visitor List</h2>

      {/* 🔍 Filters */}
      <div className="filters mb-3 d-flex gap-3">
        <input
          type="text"
          placeholder="Search by name..."
          className="form-control"
          style={{ maxWidth: "250px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: "150px" }}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          className="form-select"
          style={{ maxWidth: "150px" }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort by Age</option>
          <option value="asc">Age ↑</option>
          <option value="desc">Age ↓</option>
        </select>
      </div>

      <div className="table-responsive rounded shadow-sm">
        <table className="table table-hover table-bordered align-middle bg-white expo-list-table">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Address</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v._id}>
                <td className="fw-semibold">{v.name}</td>
                <td>{v.email}</td>
                <td>{v.age ?? "-"}</td>
                <td>{v.address ?? "-"}</td>
                <td>{v.gender ?? "-"}</td>
              </tr>
            ))}
            {visitors.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No visitors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorList;
