import React, { useState, useEffect, useCallback } from "react";
import useAxiosInterceptor from "../api/axiosInterceptor";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "./Navbar";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [msg, setMsg] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const axiosJWT = useAxiosInterceptor();

  const getDepartments = useCallback(async () => {
    try {
      const response = await axiosJWT.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.log("Error fetching departments:", error);
      setMsg("Gagal mengambil data departemen");
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      }
    }
  }, [axiosJWT, setAuth, navigate]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  const deleteDepartment = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus departemen ini?")) {
      try {
        await axiosJWT.delete(`/departments/${id}`);
        setMsg("Departemen berhasil dihapus");
        getDepartments(); // Refresh list after deletion
        // Clear success message after 3 seconds
        setTimeout(() => setMsg(""), 3000);
      } catch (error) {
        console.log("Error deleting department:", error);
        setMsg(error.response?.data?.msg || "Gagal menghapus departemen");
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
                <Link to="/departments/add" className="button is-success">
                  <span className="icon is-small"><i className="fas fa-plus"></i></span>
                  <span>Tambah Departemen Baru</span>
                </Link>
              </div>
              <div className="box">
                <h1 className="title is-4 mb-4 has-text-centered">Daftar Departemen</h1>
                {msg && (
                  <div className={`notification ${msg.includes("berhasil") ? "is-success is-light" : "is-danger is-light"}`}>
                    <button className="delete" onClick={() => setMsg("")}></button>
                    {msg}
                  </div>
                )}
                <div className="table-container">
                  <table className="table is-striped is-hoverable is-fullwidth">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Departemen</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.length > 0 ? (
                        departments.map((department, index) => (
                          <tr key={department.id}>
                            <td>{index + 1}</td>
                            <td>{department.name}</td>
                            <td>
                              <div className="buttons is-centered">
                                <Link 
                                  to={`/departments/edit/${department.id}`} 
                                  className="button is-small is-info"
                                >
                                  <span className="icon is-small"><i className="fas fa-edit"></i></span>
                                  <span>Edit</span>
                                </Link>
                                <button
                                  onClick={() => deleteDepartment(department.id)}
                                  className="button is-small is-danger"
                                >
                                  <span className="icon is-small"><i className="fas fa-trash"></i></span>
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="has-text-centered">
                            Tidak ada departemen untuk ditampilkan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DepartmentList;