import React, { useState, useEffect } from "react";
import useAxiosInterceptor from "../api/axiosInterceptor";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "./Navbar"; // Import Navbar

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const { id } = useParams(); // Mengambil ID dari URL
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
          setAuth(null); // Hapus status autentikasi
          navigate("/login"); // Redirect ke halaman login
        }
      }
    };
    getUserDetails();
  }, [id, axiosJWT, setAuth, navigate]);

  return (
    <div>
      <Navbar /> {/* Navbar */}
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          {msg && <p className="has-text-danger">{msg}</p>}

          {user ? (
            <div>
              <h2 className="title is-4">Detail Karyawan</h2>
              <div className="box">
                <div className="content">
                  <p><strong>Nama:</strong> {user.nama}</p>
                  <p><strong>NIP:</strong> {user.nip}</p>
                  <p><strong>Departemen:</strong> {user.department?.name || "Tidak ada departemen"}</p>
                  <p><strong>Posisi:</strong> {user.position?.name || "Tidak ada posisi"}</p>
                  <p><strong>Ditambahkan Oleh:</strong> {user.addedByUser?.username || "-"}</p>

                  {user.foto && (
                    <div>
                      <p><strong>Foto:</strong></p>
                      <figure className="image">
                        <img 
                          src={user.foto} 
                          alt={user.nama} 
                          style={{ 
                            maxWidth: "300px",
                            maxHeight: "300px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginTop: "10px"
                          }} 
                        />
                      </figure>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="has-text-centered">
              <p>Loading user details...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
