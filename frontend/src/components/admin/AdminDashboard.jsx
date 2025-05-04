import { useEffect, useState } from "react";

function AdminDashboard({ token, onLogout }) {
    const [pcs, setPCs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        assetId: "",
        model: "",
        make: "",
        macAddress: "",
        ipAddress: "",
        os: "",
        ram: "",
        hardDisk: "",
        username: "",
        metadata: ""
    });
    const [message, setMessage] = useState("");
    const [metadataFields, setMetadataFields] = useState([]);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:4000/api/admin/pcs", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch PCs");
                return res.json();
            })
            .then((data) => {
                setPCs(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [token, message]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addMetadataField = () => {
        setMetadataFields([...metadataFields, { key: "", value: "" }]);
    };

    const handleMetadataFieldChange = (index, field, value) => {
        const updated = [...metadataFields];
        updated[index][field] = value;
        setMetadataFields(updated);
    };

    const removeMetadataField = (index) => {
        const updated = [...metadataFields];
        updated.splice(index, 1);
        setMetadataFields(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError(null);

        // Build metadata object from dynamic fields
        let metadataObj = {};
        metadataFields.forEach((f) => {
            if (f.key && f.value) metadataObj[f.key] = f.value;
        });

        // Merge with JSON metadata field if present
        if (form.metadata) {
            try {
                const jsonMeta = JSON.parse(form.metadata);
                metadataObj = { ...metadataObj, ...jsonMeta };
            } catch {
                setError("Metadata must be valid JSON");
                return;
            }
        }

        // If no metadata, set to undefined
        if (Object.keys(metadataObj).length === 0) {
            metadataObj = undefined;
        }

        try {
            const res = await fetch("http://localhost:4000/api/admin/pc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...form,
                    metadata: metadataObj
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create PC");
            setMessage(data.message);
            setForm({
                assetId: "",
                model: "",
                make: "",
                macAddress: "",
                ipAddress: "",
                os: "",
                ram: "",
                hardDisk: "",
                username: "",
                metadata: ""
            });
            setMetadataFields([]);
        } catch (err) {
            setError(err.message);
        }
    };

    // Add this function to get all unique metadata keys
    const getMetadataColumns = () => {
        const keys = new Set();
        pcs.forEach((pc) => {
            if (pc.metadata && typeof pc.metadata === "object") {
                Object.keys(pc.metadata).forEach((key) => keys.add(key));
            }
        });
        return Array.from(keys);
    };

    return (
        <div
            className="min-vh-100 min-vw-100 d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                minWidth: "100vw",
                background: "linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)",
                padding: "40px 0",
                overflowX: "hidden" // Prevent horizontal scrollbar
            }}
        >
            <div className="container" style={{ maxWidth: 1200 }}>
                <div
                    className="card shadow-lg rounded-5 border-0 position-relative"
                    style={{
                        background: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)"
                    }}
                >
                    <button
                        onClick={onLogout}
                        className="btn btn-outline-danger position-absolute top-0 end-0 m-3 px-4 py-2 fw-semibold"
                        style={{
                            borderRadius: "30px",
                            boxShadow: "0 2px 8px rgba(220,53,69,0.08)"
                        }}
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                    </button>
                    <div className="card-body p-5">
                        <h1
                            className="mb-1 text-primary fw-bold"
                            style={{ letterSpacing: "1px" }}
                        >
                            <i className="bi bi-pc-display-horizontal me-2"></i>
                            Admin Dashboard
                        </h1>
                        <h2
                            className="h5 text-secondary mb-4 fw-semibold"
                            style={{ letterSpacing: ".5px" }}
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Create/Assign PC
                        </h2>
                        <form
                            onSubmit={handleSubmit}
                            className="row g-3 mb-5 bg-white bg-opacity-75 p-4 rounded-4 shadow-sm border"
                            style={{
                                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                border: "1px solid #e3e6f0"
                            }}
                        >
                            <div className="col-md-6">
                                <input
                                    name="assetId"
                                    placeholder="Asset ID"
                                    value={form.assetId}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    name="model"
                                    placeholder="Model"
                                    value={form.model}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    name="make"
                                    placeholder="Make"
                                    value={form.make}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    name="macAddress"
                                    placeholder="MAC Address"
                                    value={form.macAddress}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    name="ipAddress"
                                    placeholder="IP Address"
                                    value={form.ipAddress}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    name="os"
                                    placeholder="OS"
                                    value={form.os}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    name="ram"
                                    placeholder="RAM"
                                    value={form.ram}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    name="hardDisk"
                                    placeholder="Hard Disk"
                                    value={form.hardDisk}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <input
                                    name="username"
                                    placeholder="Assign to Username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-12">
                                <div className="mb-2">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-sliders2-vertical me-2"></i>
                                        Additional Fields
                                    </label>
                                    {metadataFields.map((field, idx) => (
                                        <div
                                            className="row g-2 mb-2 align-items-center"
                                            key={idx}
                                        >
                                            <div className="col-5">
                                                <div className="input-group shadow-sm">
                                                    <span
                                                        className="input-group-text"
                                                        style={{
                                                            backgroundColor:
                                                                "#222", // lighter black
                                                            color: "#fff"
                                                        }}
                                                    >
                                                        <i className="bi bi-key"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Key"
                                                        value={field.key}
                                                        onChange={(e) =>
                                                            handleMetadataFieldChange(
                                                                idx,
                                                                "key",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-5">
                                                <div className="input-group shadow-sm">
                                                    <span className="input-group-text bg-secondary text-white">
                                                        <i className="bi bi-input-cursor-text"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Value"
                                                        value={field.value}
                                                        onChange={(e) =>
                                                            handleMetadataFieldChange(
                                                                idx,
                                                                "value",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-2 d-flex justify-content-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger rounded-circle d-flex align-items-center justify-content-center flip-remove-btn"
                                                    style={{
                                                        width: 36,
                                                        height: 36,
                                                        transition:
                                                            "background 0.2s, color 0.2s",
                                                        fontSize: "1.2rem",
                                                        padding: 0
                                                    }}
                                                    onClick={() =>
                                                        removeMetadataField(idx)
                                                    }
                                                    tabIndex={-1}
                                                    title="Remove field"
                                                >
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 16 16"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <circle
                                                            cx="8"
                                                            cy="8"
                                                            r="8"
                                                            fill="none"
                                                        />
                                                        <path
                                                            d="M5 5l6 6M11 5l-6 6"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-pill btn-success mt-2 px-4 d-flex align-items-center gap-2 shadow-sm"
                                        onClick={addMetadataField}
                                        style={{
                                            borderRadius: "50px",
                                            fontWeight: 500,
                                            boxShadow:
                                                "0 2px 8px rgba(25,135,84,0.08)"
                                        }}
                                    >
                                        <i className="bi bi-plus-lg"></i>
                                        Add Fields
                                    </button>
                                </div>
                            </div>
                            <div className="col-12 d-flex justify-content-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary fw-semibold py-2 px-4"
                                    style={{
                                        borderRadius: "20px",
                                        fontSize: "1.15rem",
                                        letterSpacing: ".5px",
                                        minWidth: "90px",
                                        boxShadow:
                                            "0 2px 8px rgba(13,110,253,0.08)",
                                        height: "44px"
                                    }}
                                >
                                    <i className="bi bi-check2-circle me-2"></i>
                                    Create PC
                                </button>
                            </div>
                        </form>
                        {error && (
                            <div className="alert alert-danger mb-3 fw-medium rounded-3 shadow-sm">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="alert alert-success mb-3 fw-medium rounded-3 shadow-sm">
                                <i className="bi bi-check-circle me-2"></i>
                                {message}
                            </div>
                        )}
                        <h2
                            className="h5 text-secondary mb-3 fw-semibold"
                            style={{ letterSpacing: ".5px" }}
                        >
                            <i className="bi bi-list-ul me-2"></i>
                            All PCs
                        </h2>
                        {loading && (
                            <div className="text-secondary">
                                <i className="bi bi-arrow-repeat me-2 spin"></i>
                                Loading...
                            </div>
                        )}
                        {!loading && pcs.length > 0 && (
                            <div
                                className="table-responsive bg-white bg-opacity-75 rounded-4 shadow-sm border"
                                style={{
                                    padding: "20px 32px", // Add left and right padding
                                    marginLeft: "-12px", // Optional: align with card padding if needed
                                    marginRight: "-12px" // Optional: align with card padding if needed
                                }}
                            >
                                <table
                                    className="table table-hover align-middle mb-0"
                                    style={{
                                        width: "100%", // Make table fit container
                                        tableLayout: "auto" // Responsive columns
                                    }}
                                >
                                    <thead className="table-light">
                                        <tr>
                                            <th>Asset ID</th>
                                            <th>Model</th>
                                            <th>Make</th>
                                            <th style={{ minWidth: 160 }}>
                                                Assigned User
                                            </th>
                                            <th>OS</th>
                                            <th>RAM</th>
                                            <th>Hard Disk</th>
                                            {getMetadataColumns().map((key) => (
                                                <th key={key}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pcs.map((pc) => (
                                            <tr
                                                key={pc.assetId}
                                                className="table-row-hover"
                                                style={{
                                                    transition:
                                                        "background 0.2s"
                                                }}
                                            >
                                                <td className="fw-semibold">
                                                    {pc.assetId}
                                                </td>
                                                <td>{pc.model}</td>
                                                <td>{pc.make}</td>
                                                <td>
                                                    <span
                                                        className="badge bg-info bg-opacity-25 text-dark px-3 py-2 rounded-pill"
                                                        style={{
                                                            fontSize: "1em",
                                                            whiteSpace:
                                                                "nowrap",
                                                            overflow: "visible",
                                                            textOverflow:
                                                                "unset",
                                                            minWidth: 100,
                                                            display:
                                                                "inline-block"
                                                        }}
                                                    >
                                                        {pc.user.username ||
                                                            "-"}
                                                    </span>
                                                </td>
                                                <td>{pc.os}</td>
                                                <td>{pc.ram}</td>
                                                <td>{pc.hardDisk}</td>
                                                {getMetadataColumns().map(
                                                    (key) => (
                                                        <td key={key}>
                                                            {pc.metadata &&
                                                            pc.metadata[key]
                                                                ? typeof pc
                                                                      .metadata[
                                                                      key
                                                                  ] === "object"
                                                                    ? JSON.stringify(
                                                                          pc
                                                                              .metadata[
                                                                              key
                                                                          ]
                                                                      )
                                                                    : String(
                                                                          pc
                                                                              .metadata[
                                                                              key
                                                                          ]
                                                                      )
                                                                : "-"}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {!loading && pcs.length === 0 && (
                            <div className="alert alert-info mt-3 rounded-3 shadow-sm">
                                <i className="bi bi-info-circle me-2"></i>
                                No PCs found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>
                {`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .table-row-hover:hover { background: #f1f5ff !important; }
                .flip-remove-btn {
                    color: #dc3545;
                    background: transparent;
                    border-color: #dc3545;
                    transition: background 0.2s, color 0.2s;
                }
                .flip-remove-btn:hover, .flip-remove-btn:focus {
                    background: #dc3545 !important;
                    color: #fff !important;
                    border-color: #dc3545 !important;
                }
                `}
            </style>
        </div>
    );
}

export default AdminDashboard;