import React, { useState, useEffect, useCallback } from "react";
import useAxiosInterceptor from "../api/axiosInterceptor";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "./Navbar";

const PositionList = () => {
  const [positions, setPositions] = useState([]);
  const [msg, setMsg] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const axiosJWT = useAxiosInterceptor();

  const getPositions = useCallback(async () => {
    try {
      const response = await axiosJWT.get("/positions");
      setPositions(response.data);
    } catch (error) {
      console.log("Error fetching positions:", error);
      setMsg("Gagal mengambil data posisi");
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      }
    }
  }, [axiosJWT, setAuth, navigate]);

  useEffect(() => {
    getPositions();
  }, [getPositions]);

  const deletePosition = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus posisi ini?")) {
      try {
        await axiosJWT.delete(`/positions/${id}`);
        setMsg("Posisi berhasil dihapus");
        getPositions(); // Refresh list after deletion
        // Clear success message after 3 seconds
        setTimeout(() => setMsg(""), 3000);
      } catch (error) {
        console.log("Error deleting position:", error);
        setMsg(error.response?.data?.msg || "Gagal menghapus posisi");
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setAuth(null);
          navigate("/login");
        }
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <div style={{ marginBottom: "1rem" }}>
            <Link to="/positions/add" className="button is-success">
              Add New
            </Link>
          </div>
          <h1 className="title is-4 mb-4">Daftar Posisi</h1>
          {msg && (
            <div className={`notification ${msg.includes("berhasil") ? "is-success" : "is-danger"}`}>
              {msg}
            </div>
          )}
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Posisi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {positions && positions.length > 0 ? (
                positions.map((position, index) => (
                  <tr key={position.id}>
                    <td>{index + 1}</td>
                    <td>{position.name}</td>
                    <td>
                      <div className="buttons">
                        <Link
                          to={`/positions/edit/${position.id}`}
                          className="button is-small is-info"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deletePosition(position.id)}
                          className="button is-small is-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="has-text-centered">
                    Tidak ada posisi untuk ditampilkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PositionList;
