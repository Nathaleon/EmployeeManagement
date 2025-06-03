import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosInterceptor from "../api/axiosInterceptor";

const AddPosition = () => {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const axiosJWT = useAxiosInterceptor();

  const savePosition = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name) {
      setMsg("Nama posisi wajib diisi");
      return;
    }

    try {
      await axiosJWT.post("/positions", { name });
      navigate("/positions");
    } catch (error) {
      setMsg(error.response?.data?.msg || "Gagal menambah posisi.");
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <form onSubmit={savePosition}>
          {msg && <p className="has-text-danger mb-4">{msg}</p>}
          <div className="field">
            <label className="label">Nama Posisi</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Posisi"
              />
            </div>
          </div>
          <div className="field">
            <button type="submit" className="button is-success">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPosition;
