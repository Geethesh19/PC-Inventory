import React, { useState } from "react";

const Register = ({ onSwitchToLogin, role = "user" }) => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        division: "",
        designation: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const response = await fetch("http://localhost:4000/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess("Registration successful! You can now sign in.");
                setFormData({
                    name: "",
                    username: "",
                    email: "",
                    password: "",
                    division: "",
                    designation: ""
                });
            } else {
                const data = await response.json();
                setError(data.message || "Registration failed");
            }
        } catch (error) {
            setError("Error: " + error.message);
        }
    };

    return (
        <div
            className="register-bg d-flex align-items-center justify-content-center"
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
                className="register-card shadow-lg"
                style={{
                    maxWidth: 420,
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
                    Create your account
                </h2>
                <p
                    className="mb-4 text-center text-muted"
                    style={{ fontSize: "1rem" }}
                >
                    Please fill in your details to register.
                </p>
                <div className="mb-3 w-100">
                    <input
                        className="form-control form-control-lg rounded-4 border-0 shadow-sm"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                            background: "#f5f8ff",
                            fontSize: "1.1rem",
                            padding: "0.9rem 1.1rem"
                        }}
                    />
                </div>
                <div className="mb-3 w-100">
                    <input
                        className="form-control form-control-lg rounded-4 border-0 shadow-sm"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{
                            background: "#f5f8ff",
                            fontSize: "1.1rem",
                            padding: "0.9rem 1.1rem"
                        }}
                    />
                </div>
                <div className="mb-3 w-100">
                    <input
                        className="form-control form-control-lg rounded-4 border-0 shadow-sm"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                            background: "#f5f8ff",
                            fontSize: "1.1rem",
                            padding: "0.9rem 1.1rem"
                        }}
                    />
                </div>
                <div className="mb-3 w-100">
                    <input
                        className="form-control form-control-lg rounded-4 border-0 shadow-sm"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            background: "#f5f8ff",
                            fontSize: "1.1rem",
                            padding: "0.9rem 1.1rem"
                        }}
                    />
                </div>
                <div className="mb-3 w-100">
                    <input
                        className="form-control form-control-lg rounded-4 border-0 shadow-sm"
                        type="text"
                        name="division"
                        placeholder="Division"
                        value={formData.division}
                        onChange={handleChange}
                        required
                        style={{
                            background: "#f5f8ff",
                            fontSize: "1.1rem",
                            padding: "0.9rem 1.1rem"
                        }}
                    />
                </div>
                <div className="mb-4 w-100">
                    <input
                        className="form-control form-control-lg rounded-4 border-0 shadow-sm"
                        type="text"
                        name="designation"
                        placeholder="Designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                        style={{
                            background: "#f5f8ff",
                            fontSize: "1.1rem",
                            padding: "0.9rem 1.1rem"
                        }}
                    />
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
                    Register
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
                {success && (
                    <div
                        className="alert alert-success mt-3 mb-0 py-2 text-center rounded-3 w-100"
                        role="alert"
                        style={{ fontSize: "1rem" }}
                    >
                        {success}
                    </div>
                )}
                {/* Only show register link if not admin */}
                {role !== "admin" && (
                    <div
                        className="mt-4 text-center w-100 text-muted"
                        style={{ fontSize: "0.98rem" }}
                    >
                        Already have an account?{" "}
                        <a
                            href="#"
                            className="text-primary text-decoration-none"
                            tabIndex={-1}
                            onClick={(e) => {
                                e.preventDefault();
                                if (onSwitchToLogin) onSwitchToLogin();
                            }}
                        >
                            Sign in
                        </a>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Register;
