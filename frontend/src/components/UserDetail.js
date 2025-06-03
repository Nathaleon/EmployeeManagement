import React, { useState, useEffect } from "react";
import useAxiosInterceptor from "../api/axiosInterceptor";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "./Navbar"; // Re-add Navbar import

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const { id } = useParams();
  const axiosJWT = useAxiosInterceptor();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axiosJWT.get(`/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.log("Error fetching user details:", error);
        setMsg("Gagal mengambil data user.");
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setAuth(null);
          navigate("/login");
        }
      }
    };
    getUserDetails();
  }, [id, axiosJWT, setAuth, navigate]);

  return (
    <>
      <Navbar />
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-two-thirds-tablet is-half-desktop">
              {msg && <p className="notification is-danger">{msg}</p>}

              {user ? (
                <div className="box">
                  <h2 className="title is-4 has-text-centered">Detail Karyawan</h2>
                  <div className="content">
                    <table className="table is-fullwidth">
                      <tbody>
                        <tr>
                          <td><strong>Nama</strong></td>
                          <td>{user.nama}</td>
                        </tr>
                        <tr>
                          <td><strong>NIP</strong></td>
                          <td>{user.nip}</td>
                        </tr>
                        <tr>
                          <td><strong>Departemen</strong></td>
                          <td>{user.department?.name || "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Posisi</strong></td>
                          <td>{user.position?.name || "N/A"}</td>
                        </tr>
                        <tr>
                          <td><strong>Ditambahkan Oleh</strong></td>
                          <td>{user.addedByUser?.username || "N/A"}</td>
                        </tr>
                        {user.foto && (
                          <tr>
                            <td><strong>Foto</strong></td>
                            <td>
                              <figure className="image is-128x128">
                                <img 
                                  src={user.foto} 
                                  alt={user.nama} 
                                  style={{ 
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }} 
                                />
                              </figure>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="has-text-centered">
                  <p>Loading user details...</p>
                  {/* Optionally add a Bulma loader */}
                  {/* <button className="button is-loading is-large is-ghost">Loading</button> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserDetail;
