import React, { useState, useEffect, useCallback } from "react";
import useAxiosInterceptor from "../api/axiosInterceptor";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "./Navbar";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const axiosJWT = useAxiosInterceptor();

  const getUsers = useCallback(async () => {
    try {
      const response = await axiosJWT.get("/users");
      console.log("Users data:", response.data); // Untuk debugging
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      }
    }
  }, [axiosJWT, setAuth, navigate]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const deleteUser = async (id) => {
    try {
      await axiosJWT.delete(`/users/${id}`);
      getUsers();
    } catch (error) {
      console.log("Error deleting user:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="columns mt-5 is-centered">
        <div className="column is-half">
          <div style={{ marginBottom: "1rem" }}>
            <Link to="/users/add" className="button is-success">
              Add New
            </Link>
          </div>
          <h1 className="title is-4 mb-4">Daftar Semua Karyawan</h1>
          <table className="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIP</th>
                <th>Departemen</th>
                <th>Posisi</th>
                <th>Ditambahkan Oleh</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.nama}</td>
                    <td>{user.nip}</td>
                    <td>{user.department?.name || 'Tidak ada departemen'}</td>
                    <td>{user.position?.name || 'Tidak ada posisi'}</td>
                    <td>{user.addedByUser?.username || '-'}</td>
                    <td>
                      <div className="buttons">
                        <Link to={`/users/edit/${user.id}`} className="button is-small is-info">
                          Edit
                        </Link>
                        <Link to={`/users/detail/${user.id}`} className="button is-small is-primary">
                          Detail
                        </Link>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="button is-small is-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="has-text-centered">Tidak ada karyawan untuk ditampilkan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
