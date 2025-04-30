import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/common/Login";
import UserDashboard from "./components/user/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import Register from "./components/user/Register";

const ProtectedRoute = ({ children, isAllowed }) => {
    if (!isAllowed) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [token, setToken] = useState(localStorage.getItem("token"));

    const handleLogin = (role, token) => {
        setRole(role);
        setToken(token);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setRole(null);
        setToken(null);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        token ? (
                            <Navigate to="/" replace />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/register"
                    element={
                        token ? (
                            <Navigate to="/" replace />
                        ) : (
                            <Register
                                onSwitchToLogin={() =>
                                    window.location.replace("/login")
                                }
                            />
                        )
                    }
                />
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute isAllowed={token && role === "admin"}>
                            <AdminDashboard
                                token={token}
                                onLogout={handleLogout}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/*"
                    element={
                        <ProtectedRoute isAllowed={token && role === "user"}>
                            <UserDashboard
                                token={token}
                                onLogout={handleLogout}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={
                                !token
                                    ? "/login"
                                    : role === "admin"
                                    ? "/admin"
                                    : "/user"
                            }
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
