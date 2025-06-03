import React, { useState, useEffect, useCallback } from "react";
import useAxiosInterceptor from "../api/axiosInterceptor";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "./Navbar";

const EditUser = () => {
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [foto, setFoto] = useState("");
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const axiosJWT = useAxiosInterceptor();
  const { setAuth } = useAuth();

  const getUserById = useCallback(async () => {
    try {
      const response = await axiosJWT.get(`/users/${id}`);
      const { nama, nip, departmentId, positionId, foto } = response.data;
      setNama(nama);
      setNip(nip);
      setDepartmentId(departmentId);
      setPositionId(positionId);
      setFoto(foto);
    } catch (error) {
      console.error("Error fetching user:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      } else {
        setMsg(error.response?.data?.msg || "Gagal mengambil data karyawan");
      }
    }
  }, [id, axiosJWT, navigate, setAuth]);

  useEffect(() => {
    getUserById();
    
    const fetchDepartments = async () => {
      try {
        const res = await axiosJWT.get("/departments");
        setDepartments(res.data);
      } catch (err) {
        setMsg("Gagal mengambil data departemen");
      }
    };
    
    const fetchPositions = async () => {
      try {
        const res = await axiosJWT.get("/positions");
        setPositions(res.data);
      } catch (err) {
        setMsg("Gagal mengambil data posisi");
      }
    };

    fetchDepartments();
    fetchPositions();
  }, [getUserById, axiosJWT]);

  const updateUser = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!nama || !nip || !departmentId || !positionId) {
      setMsg("Nama, NIP, Departemen, dan Posisi wajib diisi");
      return;
    }

    try {
      await axiosJWT.patch(`/users/${id}`, {
        nama,
        nip,
        departmentId,
        positionId,
        foto,
      });
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      } else {
        setMsg(error.response?.data?.msg || "Gagal memperbarui data karyawan.");
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
                <h1 className="title is-4 has-text-centered">Edit Karyawan</h1>
                <form onSubmit={updateUser}>
                  {msg && <p className="notification is-danger is-light mb-4">{msg}</p>}

                  <div className="field">
                    <label className="label">Nama</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Nama"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">NIP</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        placeholder="Nomor Induk Pegawai"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Departemen</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                          <option value="">Pilih Departemen</option>
                          {departments.map((dep) => (
                            <option key={dep.id} value={dep.id}>{dep.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Posisi</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select value={positionId} onChange={(e) => setPositionId(e.target.value)}>
                          <option value="">Pilih Posisi</option>
                          {positions.map((pos) => (
                            <option key={pos.id} value={pos.id}>{pos.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">URL Foto</label>
                    <div className="control">
                      <input
                        type="url"
                        className="input"
                        value={foto}
                        onChange={(e) => setFoto(e.target.value)}
                        placeholder="Masukkan URL foto (opsional)"
                      />
                    </div>
                    {foto && (
                      <div className="mt-2">
                        <img 
                          src={foto} 
                          alt="Preview" 
                          style={{ 
                            maxWidth: "200px", 
                            maxHeight: "200px", 
                            objectFit: "cover",
                            borderRadius: "4px"
                          }} 
                        />
                      </div>
                    )}
                  </div>

                  <div className="field">
                    <button type="submit" className="button is-success is-fullwidth">
                      Update Karyawan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditUser;
