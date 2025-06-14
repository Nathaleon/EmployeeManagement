import React, { useState, useEffect, useCallback } from "react";
import useAxiosInterceptor from "../api/axiosInterceptor";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "./Navbar";

const UserListByUserId = () => {
  const [users, setUsers] = useState([]);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const axiosJWT = useAxiosInterceptor();

  const getUsers = useCallback(async () => {
    if (!auth?.userId) {
      console.log("No userId found in auth state");
      setAuth(null);
      navigate("/login");
      return;
    }

    try {
      console.log("Fetching users for creator ID:", auth.userId);
      const response = await axiosJWT.get(`/users/by-creator/${auth.userId}`);
      console.log("Users data:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setAuth(null);
        navigate("/login");
      }
    }
  }, [axiosJWT, setAuth, navigate, auth?.userId]);

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
    <>
      <Navbar />
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-four-fifths-tablet is-three-quarters-desktop is-full-mobile">
              <div className="mb-5">
                <Link to="/users/add" className="button is-success">
                  <span className="icon is-small">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>Add New Employee</span>
                </Link>
              </div>
              <h1 className="title is-4 mb-4 has-text-centered">Daftar Karyawan Saya</h1>
              <div className="box content">
                <table className="table is-striped is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>NIP</th>
                      <th>Departemen</th>
                      <th>Posisi</th>
                      <th className="has-text-centered">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.length > 0 ? (
                      users.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.nama}</td>
                          <td>{user.nip}</td>
                          <td>{user.department?.name || 'N/A'}</td>
                          <td>{user.position?.name || 'N/A'}</td>
                          <td>
                            <div className="buttons is-centered">
                              <Link to={`/users/edit/${user.id}`} className="button is-small is-info">
                                <span className="icon is-small"><i className="fas fa-edit"></i></span>
                                <span>Edit</span>
                              </Link>
                              <Link to={`/users/detail/${user.id}`} className="button is-small is-link">
                                <span className="icon is-small"><i className="fas fa-eye"></i></span>
                                <span>Detail</span>
                              </Link>
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="button is-small is-danger"
                              >
                                <span className="icon is-small"><i className="fas fa-trash"></i></span>
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="has-text-centered">Tidak ada karyawan untuk ditampilkan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserListByUserId;