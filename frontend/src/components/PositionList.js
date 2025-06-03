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
    <>
      <Navbar />
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-two-thirds-tablet is-half-desktop">
              <div className="mb-5">
                <Link to="/positions/add" className="button is-success">
                  <span className="icon is-small"><i className="fas fa-plus"></i></span>
                  <span>Tambah Posisi Baru</span>
                </Link>
              </div>
              <div className="box">
                <h1 className="title is-4 mb-4 has-text-centered">Daftar Posisi</h1>
                {msg && (
                  <div className={`notification ${msg.includes("berhasil") ? "is-success is-light" : "is-danger is-light"}`}>
                    <button className="delete" onClick={() => setMsg("")}></button>
                    {msg}
                  </div>
                )}
                <table className="table is-striped is-hoverable is-fullwidth">
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
                            <div className="buttons is-centered">
                              <Link
                                to={`/positions/edit/${position.id}`}
                                className="button is-small is-info"
                              >
                                <span className="icon is-small"><i className="fas fa-edit"></i></span>
                                <span>Edit</span>
                              </Link>
                              <button
                                onClick={() => deletePosition(position.id)}
                                className="button is-small is-danger"
                              >
                                <span className="icon is-small"><i className="fas fa-trash"></i></span>
                                <span>Delete</span>
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
        </div>
      </section>
    </>
  );
};

export default PositionList;
