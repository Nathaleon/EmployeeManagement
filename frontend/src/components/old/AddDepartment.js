import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosInterceptor from "../api/axiosInterceptor";

const AddDepartment = () => {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const axiosJWT = useAxiosInterceptor();

  const saveDepartment = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name) {
      setMsg("Nama departemen wajib diisi");
      return;
    }

    try {
      await axiosJWT.post("/departments", { name });
      navigate("/departments");
    } catch (error) {
      setMsg(error.response?.data?.msg || "Gagal menambah departemen.");
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <form onSubmit={saveDepartment}>
          {msg && <p className="has-text-danger mb-4">{msg}</p>}
          <div className="field">
            <label className="label">Nama Departemen</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Departemen"
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

export default AddDepartment;
