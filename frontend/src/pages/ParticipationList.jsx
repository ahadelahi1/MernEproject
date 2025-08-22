import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../ExpoList.css";

const ShowParticipants = () => {
  const [halls, setHalls] = useState([]);
  const [search, setSearch] = useState("");
  const [hallNumber, setHallNumber] = useState("");

  useEffect(() => {
    fetchHalls();
  }, [search, hallNumber]);

  const fetchHalls = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/halls/get", {
        params: { search, hallNumber },
      });

      // Populate booths with booked exhibitors
      const hallsData = await Promise.all(
        res.data.map(async (hall) => {
          const bookingsRes = await axios.get(
            `http://localhost:4000/api/expos/${hall.expoId._id}/details`
          );

          const hallDetails = bookingsRes.data.halls.find(
            (h) => h._id === hall._id
          );

          return {
            ...hall,
            booths: hallDetails ? hallDetails.booths : [],
          };
        })
      );

      setHalls(hallsData);
    } catch (err) {
      toast.error("Error loading halls");
      console.error(err);
    }
  };

  return (
    <div className="expo-list-wrapper">
      <h2 className="expo-list-heading">Halls & Participants</h2>

      {/* Filters */}
      <div className="filter-row d-flex mb-3">
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search by Expo Title..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i className="bi bi-search search-icon"></i>
        </div>
        <input
          type="number"
          placeholder="Hall Number"
          className="small-input"
          value={hallNumber}
          onChange={(e) => setHallNumber(e.target.value)}
        />
      </div>

      <div className="table-responsive rounded shadow-sm">
        <table className="table table-hover table-bordered align-middle bg-white expo-list-table">
          <thead className="table-dark">
            <tr>
              <th>Hall Number</th>
              <th>Booth Number</th>
              <th>Exhibitor Name</th>
            </tr>
          </thead>
          <tbody>
            {halls.length > 0 ? (
              halls.map((hall) =>
                hall.booths.length > 0 ? (
                  hall.booths.map((booth) => (
                    <tr key={booth._id}>
                      <td>{hall.hallNumber}</td>
                      <td>{booth.boothNumber}</td>
                      <td>{booth.exhibitor?.name || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr key={hall._id}>
                    <td>{hall.hallNumber}</td>
                    <td colSpan="2" className="text-center">
                      No booked booths
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No halls found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowParticipants;
