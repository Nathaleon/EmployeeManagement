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
    <div>
      <Navbar />
      
      <div className="columns mt-5 is-centered">
        <div className="column is-three-quarters">
          <div className="box">
            <h1 className="title is-4">Daftar Departemen</h1>
            
            {msg && (
              <div className={`notification ${msg.includes("berhasil") ? "is-success" : "is-danger"}`}>
                <button 
                  className="delete" 
                  onClick={() => setMsg("")}
                ></button>
                {msg}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <Link to="/departments/add" className="button is-success">
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Tambah Departemen</span>
              </Link>
            </div>

            <div className="table-container">
              <table className="table is-striped is-fullwidth is-hoverable">
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
                          <div className="buttons">
                            <Link 
                              to={`/departments/edit/${department.id}`} 
                              className="button is-small is-info"
                            >
                              <span className="icon">
                                <i className="fas fa-edit"></i>
                              </span>
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => deleteDepartment(department.id)}
                              className="button is-small is-danger"
                            >
                              <span className="icon">
                                <i className="fas fa-trash"></i>
                              </span>
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
  );
};

export default DepartmentList;