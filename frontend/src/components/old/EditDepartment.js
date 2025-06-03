import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInterceptor from "../api/axiosInterceptor";
import { useAuth } from "../auth/useAuth";
import Navbar from "./Navbar";

const EditDepartment = () => {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const axiosJWT = useAxiosInterceptor();
  const { setAuth } = useAuth();

  useEffect(() => {
    const getDepartmentById = async () => {
      try {
        const response = await axiosJWT.get(`/departments/${id}`);
        setName(response.data.name);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching department:", error);
        setMsg("Gagal mengambil data departemen");
        setLoading(false);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setAuth(null);
          navigate("/login");
        }
      }
    };

    getDepartmentById();
  }, [id, axiosJWT, setAuth, navigate]);

  const updateDepartment = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name.trim()) {
      setMsg("Nama departemen wajib diisi");
      return;
    }

    try {
      await axiosJWT.patch(`/departments/${id}`, { name: name.trim() });
      navigate("/departments");
    } catch (error) {
      console.log("Error updating department:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      } else {
        setMsg(error.response?.data?.msg || "Gagal memperbarui departemen");
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="columns mt-5 is-centered">
          <div className="column is-half">
            <div className="box has-text-centered">
              <p>Memuat data departemen...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <div className="box">
            <h1 className="title is-4">Edit Departemen</h1>
            
            <form onSubmit={updateDepartment}>
              {msg && (
                <div className="notification is-danger">
                  <button 
                    className="delete" 
                    onClick={() => setMsg("")}
                  ></button>
                  {msg}
                </div>
              )}

              <div className="field">
                <label className="label">Nama Departemen</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama departemen"
                  />
                </div>
              </div>

              <div className="field is-grouped">
                <div className="control">
                  <button type="submit" className="button is-success">
                    <span className="icon">
                      <i className="fas fa-save"></i>
                    </span>
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
                <div className="control">
                  <button 
                    type="button" 
                    className="button is-light"
                    onClick={() => navigate("/departments")}
                  >
                    <span className="icon">
                      <i className="fas fa-arrow-left"></i>
                    </span>
                    <span>Kembali</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;