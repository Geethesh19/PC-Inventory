import { useState } from "react";

function Login({ onLogin, onSwitchToRegister }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const url =
            role === "admin"
                ? "http://localhost:4000/api/admin/login"
                : "http://localhost:4000/api/user/login";
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", role);
            onLogin(role, data.token);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div
            className="login-bg d-flex align-items-center justify-content-center"
            style={{
                background: "linear-gradient(120deg, #4f8cff 0%, #3358e6 100%)",
                minHeight: "100vh",
                minWidth: "100vw",
                paddingTop: "60px",
                paddingBottom: "60px",
                boxSizing: "border-box"
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="login-card shadow-lg"
                style={{
                    maxWidth: 400,
                    width: "100%",
                    borderRadius: "18px",
                    border: "none",
                    background: "#fff",
                    margin: "auto",
                    padding: "2.5rem 2rem",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                {/* Logo or Brand */}
                <div
                    className="mb-4"
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background:
                            "linear-gradient(135deg, #4f8cff 60%, #3358e6 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "2rem"
                    }}
                >
                    <svg width="36" height="36" fill="#fff" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 14.2a7.2 7.2 0 0 1-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 0 1-6 3.2z" />
                    </svg>
                </div>
                <h2
                    className="mb-2 fw-bold text-center"
                    style={{
                        color: "#3358e6",
                        fontSize: "2rem",
                        letterSpacing: "0.5px"
                    }}
                >
                    Sign in to your account
                </h2>
                <p
                    className="mb-4 text-center text-muted"
                    style={{ fontSize: "1rem" }}
                >
                    Welcome back! Please enter your details.
                </p>
                <div className="mb-3 w-100 d-flex justify-content-center gap-3">
                    <button
                        type="button"
                        className={`btn btn-outline-primary px-4 py-2 rounded-pill ${
                            role === "user" ? "active" : ""
                        }`}
                        style={{
                            background: role === "user" ? "#e0edff" : "#fff",
                            borderColor:
                                role === "user" ? "#3358e6" : "#4f8cff",
                            color: "#3358e6",
                            fontWeight: 500,
                            transition: "all 0.2s",
                            boxShadow:
                                role === "user"
                                    ? "0 2px 8px rgba(79,140,255,0.18)"
                                    : "none",
                            outline:
                                role === "user" ? "2px solid #3358e6" : "none",
                            transform: role === "user" ? "scale(1.04)" : "none",
                            zIndex: role === "user" ? 1 : 0
                        }}
                        onClick={() => setRole("user")}
                    >
                        User
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline-primary px-4 py-2 rounded-pill ${
                            role === "admin" ? "active" : ""
                        }`}
                        style={{
                            background: role === "admin" ? "#e0edff" : "#fff",
                            borderColor:
                                role === "admin" ? "#3358e6" : "#4f8cff",
                            color: "#3358e6",
                            fontWeight: 500,
                            transition: "all 0.2s",
                            boxShadow:
                                role === "admin"
                                    ? "0 2px 8px rgba(79,140,255,0.18)"
                                    : "none",
                            outline:
                                role === "admin" ? "2px solid #3358e6" : "none",
                            transform:
                                role === "admin" ? "scale(1.04)" : "none",
                            zIndex: role === "admin" ? 1 : 0
                        }}
                        onClick={() => setRole("admin")}
                    >
                        Admin
                    </button>
                </div>
                <div className="mb-3 w-100">
                    <input
                        className="form-control form-control-lg rounded-4 border-0 shadow-sm"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            background: "#f5f8ff",
                            fontSize: "1.1rem",
                            padding: "0.9rem 1.1rem"
                        }}
                        autoFocus
                    />
                </div>
                <div className="mb-2 w-100">
                    <input
                        className="form-control form-control-lg rounded-4 border-0 shadow-sm"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            background: "#f5f8ff",
                            fontSize: "1.1rem",
                            padding: "0.9rem 1.1rem"
                        }}
                    />
                </div>
                <div className="mb-4 w-100 d-flex justify-content-end">
                    <a
                        href="#"
                        className="text-decoration-none text-primary"
                        style={{ fontSize: "0.97rem" }}
                        tabIndex={-1}
                        onClick={(e) => e.preventDefault()}
                    >
                        Forgot password?
                    </a>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-4 py-2 fw-semibold"
                    style={{
                        background:
                            "linear-gradient(90deg, #4f8cff 60%, #3358e6 100%)",
                        border: "none",
                        fontSize: "1.15rem",
                        letterSpacing: "0.5px",
                        boxShadow: "0 2px 8px rgba(79,140,255,0.08)"
                    }}
                >
                    Sign In
                </button>
                {error && (
                    <div
                        className="alert alert-danger mt-3 mb-0 py-2 text-center rounded-3 w-100"
                        role="alert"
                        style={{ fontSize: "1rem" }}
                    >
                        {error}
                    </div>
                )}
                {/* Only show register link if not admin */}
                {role !== "admin" ? (
                    <div
                        className="mt-4 text-center w-100 text-muted"
                        style={{ fontSize: "0.98rem" }}
                    >
                        Don't have an account?{" "}
                        <a
                            href="#"
                            className="text-primary text-decoration-none"
                            tabIndex={-1}
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.replace("/register");
                            }}
                        >
                            Register
                        </a>
                    </div>
                ) : (
                    <div
                        className="mt-4 text-center w-100 text-muted"
                        style={{ fontSize: "0.98rem" }}
                    >
                        {/* For admin, show contact admin message */}
                        Contact admin for access.
                    </div>
                )}
            </form>
        </div>
    );
}

export default Login;
