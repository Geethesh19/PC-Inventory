import { useEffect, useState } from "react";

function UserDashboard({ token, onLogout }) {
    const [pcs, setPCs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metadataKeys, setMetadataKeys] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4000/api/user/pcs", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch PCs");
                return res.json();
            })
            .then((data) => {
                setPCs(data);
                // Extract all unique metadata keys
                const keys = new Set();
                data.forEach((pc) => {
                    if (pc.metadata && typeof pc.metadata === "object") {
                        Object.keys(pc.metadata).forEach((key) =>
                            keys.add(key)
                        );
                    }
                });
                setMetadataKeys(Array.from(keys));
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    useEffect(() => {
        const prevBg = document.body.style.background;
        document.body.style.background = null;
        document.body.style.minHeight = "";
        return () => {
            document.body.style.background = prevBg;
            document.body.style.minHeight = "";
        };
    }, []);

    return (
        <div
            className="container"
            style={{
                display: "flex",
                justifyContent: "center",
                minHeight: "80vh",
                marginLeft: "10vh"
            }}
        >
            <div
                className="card shadow-lg border-0"
                style={{
                    width: "90vw",
                    maxWidth: 1200,
                    borderRadius: "18px",
                    background: "#fff",
                    boxShadow: "0 8px 32px rgba(60,72,88,0.12)"
                }}
            >
                <div
                    className="card-header d-flex justify-content-between align-items-center"
                    style={{
                        background: "transparent",
                        borderBottom: "none",
                        padding: "2rem 2rem 1rem 2rem"
                    }}
                >
                    <h2
                        className="mb-0 fw-bold"
                        style={{ letterSpacing: "1px" }}
                    >
                        <span style={{ color: "#1e293b" }}>💻 My PCs</span>
                    </h2>
                    <button
                        onClick={onLogout}
                        className="btn btn-outline-danger btn-lg px-4 py-2"
                        style={{
                            borderRadius: "8px",
                            fontWeight: 500,
                            letterSpacing: "0.5px"
                        }}
                    >
                        Logout
                    </button>
                </div>
                <div className="card-body" style={{ padding: "2rem" }}>
                    {loading && (
                        <div className="text-center my-5">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                                style={{ width: "3rem", height: "3rem" }}
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            Error: {error}
                        </div>
                    )}
                    {!loading && !error && (
                        <div className="table-responsive">
                            <table
                                className="table align-middle"
                                style={{
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    background: "#f9fafb"
                                }}
                            >
                                <thead
                                    className="table-light"
                                    style={{
                                        background: "#f1f5f9",
                                        borderBottom: "2px solid #e2e8f0"
                                    }}
                                >
                                    <tr>
                                        <th style={{ color: "#1e293b" }}>
                                            Asset ID
                                        </th>
                                        <th style={{ color: "#1e293b" }}>
                                            Model
                                        </th>
                                        <th style={{ color: "#1e293b" }}>
                                            Make
                                        </th>
                                        <th style={{ color: "#1e293b" }}>OS</th>
                                        <th style={{ color: "#1e293b" }}>
                                            RAM
                                        </th>
                                        <th style={{ color: "#1e293b" }}>
                                            Hard Disk
                                        </th>
                                        {metadataKeys.map((key) => (
                                            <th
                                                key={key}
                                                style={{ color: "#1e293b" }}
                                            >
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pcs.map((pc) => (
                                        <tr
                                            key={pc.assetId}
                                            style={{
                                                background: "#fff",
                                                transition: "box-shadow 0.2s",
                                                boxShadow:
                                                    "0 1px 4px rgba(0,0,0,0.03)"
                                            }}
                                        >
                                            <td
                                                className="fw-semibold"
                                                style={{ color: "#334155" }}
                                            >
                                                {pc.assetId}
                                            </td>
                                            <td style={{ color: "#475569" }}>
                                                {pc.model}
                                            </td>
                                            <td style={{ color: "#475569" }}>
                                                {pc.make}
                                            </td>
                                            <td style={{ color: "#475569" }}>
                                                {pc.os}
                                            </td>
                                            <td style={{ color: "#475569" }}>
                                                {pc.ram}
                                            </td>
                                            <td style={{ color: "#475569" }}>
                                                {pc.hardDisk}
                                            </td>
                                            {metadataKeys.map((key) => (
                                                <td
                                                    key={key}
                                                    style={{ color: "#475569" }}
                                                >
                                                    {pc.metadata &&
                                                    pc.metadata[key]
                                                        ? typeof pc.metadata[
                                                              key
                                                          ] === "object"
                                                            ? JSON.stringify(
                                                                  pc.metadata[
                                                                      key
                                                                  ]
                                                              )
                                                            : String(
                                                                  pc.metadata[
                                                                      key
                                                                  ]
                                                              )
                                                        : "-"}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {pcs.length === 0 && (
                                <div
                                    className="text-center text-muted py-5"
                                    style={{ fontSize: "1.2em" }}
                                >
                                    No PCs found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;