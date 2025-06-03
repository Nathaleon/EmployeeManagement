import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosInterceptor from "../api/axiosInterceptor";
import { useAuth } from "../auth/useAuth";
import Navbar from "./Navbar";

const AddUser = () => {
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [foto, setFoto] = useState("");
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const axiosJWT = useAxiosInterceptor();
  const { setAuth } = useAuth();

  useEffect(() => {
    const fetchDepartmentsAndPositions = async () => {
      try {
        const resDepartments = await axiosJWT.get("/departments");
        setDepartments(resDepartments.data);

        const resPositions = await axiosJWT.get("/positions");
        setPositions(resPositions.data);
      } catch (err) {
        setMsg("Gagal mengambil data departemen dan posisi");
      }
    };
    fetchDepartmentsAndPositions();
  }, [axiosJWT]);

  const saveUser = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!nama || !nip || !departmentId || !positionId) {
      setMsg("Nama, NIP, Departemen, dan Posisi wajib diisi");
      return;
    }

    try {
      const userData = {
        nama,
        nip,
        departmentId,
        positionId,
        foto
      };

      await axiosJWT.post("/users", userData);
      navigate("/users");
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      } else {
        setMsg(error.response?.data?.msg || "Gagal menyimpan data karyawan.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <form onSubmit={saveUser}>
            {msg && <p className="has-text-danger mb-4">{msg}</p>}

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
              <button type="submit" className="button is-success">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
