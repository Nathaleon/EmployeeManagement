import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../auth/useAuth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setErrorMessage("Username tidak boleh kosong.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Password tidak boleh kosong.");
      return;
    }

    try {
      const res = await axiosInstance.post("/login", { username, password });
      setAuth({
        username: res.data.username,
        accessToken: res.data.accessToken,
        userId: res.data.userId
      });
      console.log("Login.js: setAuth dipanggil dengan:", {
        username: res.data.username,
        accessToken: res.data.accessToken,
        userId: res.data.userId
      });
      navigate("/users");
    } catch (err) {
      let errorMsg = "Login gagal. Silakan coba lagi.";
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data.msg) {
          errorMsg = err.response.data.msg;
        } else if (err.response.data.error) {
          errorMsg = err.response.data.error;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setErrorMessage(errorMsg);
      console.error("Login.js: Login gagal karena:", errorMsg, err);
    }
  };

  return (
    <section className="hero is-fullheight is-light-grey">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop is-6-tablet">
              <div className="box">
                <h2 className="title is-3 has-text-centered mb-5">Login</h2>
                <form onSubmit={handleLogin}>
                  {errorMessage && (
                    <div className="notification is-danger is-light mb-4">
                      <button className="delete" onClick={() => setErrorMessage('')}></button>
                      {errorMessage}
                    </div>
                  )}
                  <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="field mt-5">
                    <button
                      type="submit"
                      className="button is-primary is-fullwidth"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <div className="has-text-centered mt-4">
                  <p>
                    Belum punya akun? <Link to="/register">Daftar di sini</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;