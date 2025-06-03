import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserList from "./components/UserList";
import UserListByUserId from "./components/UserListByUserId";
import DepartmentList from "./components/DepartmentList";
import PositionList from "./components/PositionList";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";
import UserDetail from "./components/UserDetail"; // Import halaman detail
import AddDepartment from "./components/AddDepartment";
import AddPosition from "./components/AddPosition";
import EditDepartment from "./components/EditDepartment";
import EditPosition from "./components/EditPosition";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
  
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/users"
          element={<ProtectedRoute><UserList /></ProtectedRoute>}
        />
        <Route
          path="/users/by-creator"
          element={<ProtectedRoute><UserListByUserId /></ProtectedRoute>}
        />
        <Route
          path="/departments"
          element={<ProtectedRoute><DepartmentList /></ProtectedRoute>}
        />
        <Route
          path="/positions"
          element={<ProtectedRoute><PositionList /></ProtectedRoute>}
        />
        <Route
          path="/users/add"
          element={<ProtectedRoute><AddUser /></ProtectedRoute>}
        />
        <Route
          path="/users/edit/:id"
          element={<ProtectedRoute><EditUser /></ProtectedRoute>}
        />
        <Route
          path="/users/detail/:id"
          element={<ProtectedRoute><UserDetail /></ProtectedRoute>}
        />
        <Route
          path="/departments/add"
          element={<ProtectedRoute><AddDepartment /></ProtectedRoute>}
        />
        <Route
          path="/departments/edit/:id"
          element={<ProtectedRoute><EditDepartment /></ProtectedRoute>}
        />
        <Route
          path="/positions/add"
          element={<ProtectedRoute><AddPosition /></ProtectedRoute>}
        />
        <Route
          path="/positions/edit/:id"
          element={<ProtectedRoute><EditPosition /></ProtectedRoute>}
        />

        <Route path="/" element={<Login />} /> 
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
