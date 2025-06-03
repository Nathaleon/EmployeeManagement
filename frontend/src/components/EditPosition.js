import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosInterceptor from "../api/axiosInterceptor";
import { useAuth } from "../auth/useAuth";
import Navbar from "./Navbar"; // Import Navbar

const EditPosition = () => {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const axiosJWT = useAxiosInterceptor();
  const { setAuth } = useAuth();

  useEffect(() => {
    const getPositionById = async () => {
      try {
        const response = await axiosJWT.get(`/positions/${id}`);
        setName(response.data.name);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching position:", error);
        setMsg("Gagal mengambil data posisi. Mohon coba lagi.");
        setLoading(false);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setAuth(null);
          navigate("/login");
        }
      }
    };

    getPositionById();
  }, [id, axiosJWT, setAuth, navigate]);

  const updatePosition = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name.trim()) {
      setMsg("Nama posisi wajib diisi.");
      return;
    }

    try {
      await axiosJWT.patch(`/positions/${id}`, { name: name.trim() });
      // Add success message or navigate with a success state if desired
      navigate("/positions"); 
    } catch (error) {
      console.log("Error updating position:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      } else {
        setMsg(error.response?.data?.msg || "Gagal memperbarui posisi. Mohon coba lagi.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half-tablet is-one-third-desktop">
              <div className="box">
                <h1 className="title is-4 has-text-centered">Edit Posisi</h1>
                
                {loading ? (
                  <div className="has-text-centered">
                    <p>Memuat data posisi...</p>
                    {/* Optional: Bulma loader */}
                    {/* <button className="button is-loading is-large is-ghost is-centered">Loading</button> */}
                  </div>
                ) : (
                  <form onSubmit={updatePosition}>
                    {msg && (
                      <div className="notification is-danger is-light">
                        <button 
                          className="delete" 
                          onClick={() => setMsg("")}
                          aria-label="close notification"
                        ></button>
                        {msg}
                      </div>
                    )}

                    <div className="field">
                      <label htmlFor="positionName" className="label">Nama Posisi</label>
                      <div className="control">
                        <input
                          id="positionName"
                          type="text"
                          className="input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Masukkan nama posisi"
                        />
                      </div>
                    </div>

                    <div className="field is-grouped is-grouped-centered">
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
                          onClick={() => navigate("/positions")}
                        >
                          <span className="icon">
                            <i className="fas fa-arrow-left"></i>
                          </span>
                          <span>Kembali</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditPosition; 