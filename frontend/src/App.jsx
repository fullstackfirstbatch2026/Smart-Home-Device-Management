
import { useEffect, useState } from "react";
import api from "./Service/api";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [homes, setHomes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [logs, setLogs] = useState([]);
  const [aboveAverageDevices, setAboveAverageDevices] = useState([]);

  const [activeHomeId, setActiveHomeId] = useState("");
  const [activeCount, setActiveCount] = useState(0);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
  });

  const [homeForm, setHomeForm] = useState({
    homeName: "",
    userId: "",
  });

  const [deviceForm, setDeviceForm] = useState({
    deviceName: "",
    deviceType: "",
    homeId: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // --------------------------------------------------
  // LOAD ALL DATA
  // --------------------------------------------------

  const loadData = async () => {
    try {
      setError("");

      const [
        usersResponse,
        homesResponse,
        devicesResponse,
        detailsResponse,
        logsResponse,
        aboveAverageResponse,
      ] = await Promise.all([
        api.get("/users"),
        api.get("/homes"),
        api.get("/devices"),
        api.get("/devices/details"),
        api.get("/device-logs"),
        api.get("/devices/above-average-logs"),
      ]);

      setUsers(usersResponse.data);
      setHomes(homesResponse.data);
      setDevices(devicesResponse.data);
      setDeviceDetails(detailsResponse.data);
      setLogs(logsResponse.data);
      setAboveAverageDevices(aboveAverageResponse.data);
    } catch (error) {
      console.log("BACKEND ERROR:", error);
      setError("Backend error: " + error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // ADD USER
  // --------------------------------------------------

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users", userForm);

      setUserForm({
        name: "",
        email: "",
      });

      setMessage("Resident added successfully.");
      await loadData();
    } catch (error) {
      console.log(error);
      setError("Unable to add resident.");
    }
  };

  // --------------------------------------------------
  // ADD HOME
  // --------------------------------------------------

  const handleHomeSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/homes", {
        homeName: homeForm.homeName,
        user: {
          userId: Number(homeForm.userId),
        },
      });

      setHomeForm({
        homeName: "",
        userId: "",
      });

      setMessage("New space created successfully.");
      await loadData();
    } catch (error) {
      console.log(error);
      setError("Unable to create space.");
    }
  };

  // --------------------------------------------------
  // ADD DEVICE
  // --------------------------------------------------

  const handleDeviceSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/devices", {
        deviceName: deviceForm.deviceName,
        deviceType: deviceForm.deviceType,
        status: "OFF",
        home: {
          homeId: Number(deviceForm.homeId),
        },
      });

      setDeviceForm({
        deviceName: "",
        deviceType: "",
        homeId: "",
      });

      setMessage("Smart device paired successfully.");
      await loadData();
    } catch (error) {
      console.log(error);
      setError("Unable to add smart device.");
    }
  };

  // --------------------------------------------------
  // CHANGE DEVICE STATUS
  // --------------------------------------------------

  const toggleDeviceStatus = async (device) => {
    const newStatus = device.status === "ON" ? "OFF" : "ON";

    try {
      setError("");

      await api.put(`/devices/${device.deviceId}/status`, {
status: newStatus,
});

setMessage(
    `${device.deviceName} is now ${newStatus === "ON" ? "online" : "offline"}.`
);

await loadData();
} catch (error) {
    console.log(error);
    setError("Unable to change device status.");
}
};

// --------------------------------------------------
// ACTIVE DEVICE COUNT
// --------------------------------------------------

const getActiveCount = async () => {
    if (!activeHomeId) {
        setError("Please select a space first.");
        return;
    }

    try {
        const response = await api.get(
            `/homes/${activeHomeId}/active-count`
        );

        setActiveCount(response.data);
        setMessage("Live activity updated.");
    } catch (error) {
        console.log(error);
        setError("Unable to calculate active devices.");
    }
};

// --------------------------------------------------
// CLEAR MESSAGES
// --------------------------------------------------

const clearMessages = () => {
    setMessage("");
    setError("");
};

// --------------------------------------------------
// COUNTS
// --------------------------------------------------

const activeDevices = devices.filter(
    (device) => device.status === "ON"
).length;

const offlineDevices = devices.filter(
    (device) => device.status !== "ON"
).length;

// --------------------------------------------------
// DEVICE ICON
// --------------------------------------------------

const getDeviceIcon = (type) => {
    const normalizedType = type?.toUpperCase();

    if (normalizedType === "LIGHT") return "💡";
    if (normalizedType === "FAN") return "🌀";
    if (normalizedType === "AC") return "❄️";
    if (normalizedType === "TV") return "📺";
    if (normalizedType === "DOOR") return "🚪";
    if (normalizedType === "SENSOR") return "📡";
    if (normalizedType === "CAMERA") return "📷";

    return "⚡";
};

return (
    <div className="app-container" onClick={clearMessages}>
        {/* ==================================================
          HEADER
      ================================================== */}

        <header className="header">
            <div className="header-content">
                <div className="brand-row">
                    <div className="brand-mark">N</div>

                    <div>
                        <div className="brand-name">NESTORA</div>
                        <div className="brand-subtitle">SMART HOME CONTROL</div>
                    </div>
                </div>

                <span className="system-status">
            <span className="status-dot"></span>
            SYSTEM ONLINE
          </span>

                <h1>Your Home. Connected. Intelligent.</h1>

                <p>
                    A simple command center for managing your residents,
                    spaces and connected devices from one place.
                </p>

                <button
                    className="refresh-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        loadData();
                    }}
                >
                    ↻ Refresh System
                </button>
            </div>
        </header>

        {/* ==================================================
          MESSAGES
      ================================================== */}

        {error && (
            <div
                className="message error-message"
                onClick={(e) => e.stopPropagation()}
            >
                ⚠ {error}
            </div>
        )}

        {message && (
            <div
                className="message success-message"
                onClick={(e) => e.stopPropagation()}
            >
                ✓ {message}
            </div>
        )}

        {/* ==================================================
          OVERVIEW
      ================================================== */}

        <section className="overview-grid">
            <div className="overview-card residents-card">
                <div className="overview-icon">👤</div>

                <div>
                    <span>RESIDENTS</span>
                    <strong>{users.length}</strong>
                    <small>Registered users</small>
                </div>
            </div>

            <div className="overview-card spaces-card">
                <div className="overview-icon">⌂</div>

                <div>
                    <span>MY SPACES</span>
                    <strong>{homes.length}</strong>
                    <small>Connected homes</small>
                </div>
            </div>

            <div className="overview-card live-card">
                <div className="overview-icon">⚡</div>

                <div>
                    <span>LIVE PULSE</span>
                    <strong>{activeDevices}</strong>
                    <small>Devices currently ON</small>
                </div>
            </div>

            <div className="overview-card offline-card">
                <div className="overview-icon">○</div>

                <div>
                    <span>STANDBY</span>
                    <strong>{offlineDevices}</strong>
                    <small>Devices currently OFF</small>
                </div>
            </div>
        </section>

        {/* ==================================================
          RESIDENTS
      ================================================== */}

        <section className="section">
            <div className="section-title">
                <div>
                    <span className="section-number">01</span>

                    <div>
                        <h2>Residents</h2>
                        <p>People connected to the smart home system</p>
                    </div>
                </div>

                <span className="count">{users.length}</span>
            </div>

            <form className="form-grid" onSubmit={handleUserSubmit}>
                <input
                    type="text"
                    placeholder="Resident name"
                    value={userForm.name}
                    onChange={(e) =>
                        setUserForm({
                            ...userForm,
                            name: e.target.value,
                        })
                    }
                    required
                />

                <input
                    type="email"
                    placeholder="Email address"
                    value={userForm.email}
                    onChange={(e) =>
                        setUserForm({
                            ...userForm,
                            email: e.target.value,
                        })
                    }
                    required
                />

                <button type="submit">+ Register Resident</button>
            </form>

            {users.length === 0 ? (
                <p className="empty">No residents registered yet.</p>
            ) : (
                <div className="card-grid">
                    {users.map((user) => (
                        <div className="card user-card" key={user.userId}>
                            <div className="card-top">
                                <div className="card-icon">👤</div>
                                <span className="mini-status">MEMBER</span>
                            </div>

                            <h3>{user.name}</h3>

                            <p>{user.email}</p>

                            <span className="small-label">
                  Resident ID #{user.userId}
                </span>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* ==================================================
          MY SPACES
      ================================================== */}

        <section className="section">
            <div className="section-title">
                <div>
                    <span className="section-number">02</span>

                    <div>
                        <h2>My Spaces</h2>
                        <p>Homes managed by your residents</p>
                    </div>
                </div>

                <span className="count">{homes.length}</span>
            </div>

            <form className="form-grid" onSubmit={handleHomeSubmit}>
                <input
                    type="text"
                    placeholder="Space name"
                    value={homeForm.homeName}
                    onChange={(e) =>
                        setHomeForm({
                            ...homeForm,
                            homeName: e.target.value,
                        })
                    }
                    required
                />

                <select
                    value={homeForm.userId}
                    onChange={(e) =>
                        setHomeForm({
                            ...homeForm,
                            userId: e.target.value,
                        })
                    }
                    required
                >
                    <option value="">Assign resident</option>

                    {users.map((user) => (
                        <option key={user.userId} value={user.userId}>
                            {user.name}
                        </option>
                    ))}
                </select>

                <button type="submit">+ Create Space</button>
            </form>

            {homes.length === 0 ? (
                <p className="empty">No spaces created yet.</p>
            ) : (
                <div className="card-grid">
                    {homes.map((home) => (
                        <div className="card home-card" key={home.homeId}>
                            <div className="card-top">
                                <div className="card-icon">⌂</div>
                                <span className="mini-status green">CONNECTED</span>
                            </div>

                            <h3>{home.homeName}</h3>

                            <p>
                                Owner:{" "}
                                {home.user?.name
                                    ? home.user.name
                                    : `User #${home.user?.userId || "N/A"}`}
                            </p>

                            <span className="small-label">
                  Space ID #{home.homeId}
                </span>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* ==================================================
          SMART ARSENAL
      ================================================== */}

        <section className="section devices-section">
            <div className="section-title">
                <div>
                    <span className="section-number">03</span>

                    <div>
                        <h2>Smart Arsenal</h2>
                        <p>Every connected device in your spaces</p>
                    </div>
                </div>

                <span className="count">{devices.length}</span>
            </div>

            <form className="form-grid" onSubmit={handleDeviceSubmit}>
                <input
                    type="text"
                    placeholder="Device name"
                    value={deviceForm.deviceName}
                    onChange={(e) =>
                        setDeviceForm({
                            ...deviceForm,
                            deviceName: e.target.value,
                        })
                    }
                    required
                />

                <select
                    value={deviceForm.deviceType}
                    onChange={(e) =>
                        setDeviceForm({
                            ...deviceForm,
                            deviceType: e.target.value,
                        })
                    }
                    required
                >
                    <option value="">Device type</option>
                    <option value="LIGHT">Light</option>
                    <option value="FAN">Fan</option>
                    <option value="AC">Air Conditioner</option>
                    <option value="TV">Television</option>
                    <option value="DOOR">Door</option>
                    <option value="SENSOR">Sensor</option>
                    <option value="CAMERA">Camera</option>
                    <option value="OTHER">Other</option>
                </select>

                <select
                    value={deviceForm.homeId}
                    onChange={(e) =>
                        setDeviceForm({
                            ...deviceForm,
                            homeId: e.target.value,
                        })
                    }
                    required
                >
                    <option value="">Assign space</option>

                    {homes.map((home) => (
                        <option key={home.homeId} value={home.homeId}>
                            {home.homeName}
                        </option>
                    ))}
                </select>

                <button type="submit">+ Pair Device</button>
            </form>

            {devices.length === 0 ? (
                <p className="empty">No smart devices connected yet.</p>
            ) : (
                <div className="device-grid">
                    {devices.map((device) => (
                        <div
                            className={`device-card ${
                                device.status === "ON" ? "device-active" : ""
                            }`}
                            key={device.deviceId}
                        >
                            <div className="device-card-header">
                                <div className="device-icon">
                                    {getDeviceIcon(device.deviceType)}
                                </div>

                                <span
                                    className={`status ${
                                        device.status === "ON"
                                            ? "status-on"
                                            : "status-off"
                                    }`}
                                >
                    <span className="status-dot"></span>
                                    {device.status === "ON" ? "ONLINE" : "OFFLINE"}
                  </span>
                            </div>

                            <div className="device-info">
                  <span className="device-type">
                    {device.deviceType}
                  </span>

                                <h3>{device.deviceName}</h3>

                                <p>
                                    Space ID #{device.home?.homeId || "N/A"}
                                </p>
                            </div>

                            <div className="device-control">
                                <button
                                    className={
                                        device.status === "ON"
                                            ? "power-button power-off"
                                            : "power-button power-on"
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDeviceStatus(device);
                                    }}
                                >
                                    {device.status === "ON"
                                        ? "⏻  POWER OFF"
                                        : "⏻  POWER ON"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* ==================================================
          LIVE PULSE
      ================================================== */}

        <section className="section pulse-section">
            <div className="section-title">
                <div>
                    <span className="section-number">04</span>

                    <div>
                        <h2>Live Pulse</h2>
                        <p>Check the active devices inside a selected space</p>
                    </div>
                </div>

                <span className="pulse-icon">⚡</span>
            </div>

            <div className="action-row">
                <select
                    value={activeHomeId}
                    onChange={(e) => setActiveHomeId(e.target.value)}
                >
                    <option value="">Select a space</option>

                    {homes.map((home) => (
                        <option key={home.homeId} value={home.homeId}>
                            {home.homeName}
                        </option>
                    ))}
                </select>

                <button onClick={getActiveCount}>
                    Check Live Pulse
                </button>
            </div>

            <div className="count-box">
                <div>
                    <span>ACTIVE DEVICES</span>
                    <strong>{activeCount}</strong>
                </div>

                <div className="pulse-wave">
                    ● ● ●
                </div>
            </div>
        </section>

        {/* ==================================================
          CONNECTED SPACES / JOIN
      ================================================== */}

        <section className="section">
            <div className="section-title">
                <div>
                    <span className="section-number">05</span>

                    <div>
                        <h2>Connected Spaces</h2>
                        <p>Device, home and resident information combined</p>
                    </div>
                </div>

                <span className="section-badge">JOIN</span>
            </div>

            {deviceDetails.length === 0 ? (
                <p className="empty">
                    No connected-space information available.
                </p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>DEVICE</th>
                            <th>TYPE</th>
                            <th>STATUS</th>
                            <th>SPACE</th>
                            <th>RESIDENT</th>
                            <th>EMAIL</th>
                        </tr>
                        </thead>

                        <tbody>
                        {deviceDetails.map((device) => (
                            <tr key={device.deviceId}>
                                <td>
                                    <strong>{device.deviceName}</strong>
                                </td>

                                <td>{device.deviceType}</td>

                                <td>
                      <span
                          className={`table-status ${
                              device.status === "ON"
                                  ? "table-on"
                                  : "table-off"
                          }`}
                      >
                        {device.status}
                      </span>
                                </td>

                                <td>
                                    {device.home?.homeName || "N/A"}
                                </td>

                                <td>
                                    {device.home?.user?.name || "N/A"}
                                </td>

                                <td>
                                    {device.home?.user?.email || "N/A"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>

        {/* ==================================================
          ACTIVITY INSIGHTS
      ================================================== */}

        <section className="section">
            <div className="section-title">
                <div>
                    <span className="section-number">06</span>

                    <div>
                        <h2>Activity Insights</h2>
                        <p>Devices generating more logs than the average</p>
                    </div>
                </div>

                <span className="section-badge purple">SUBQUERY</span>
            </div>

            {aboveAverageDevices.length === 0 ? (
                <div className="empty-insight">
                    <div>📊</div>
                    <p>
                        No devices are currently above the average activity
                        level.
                    </p>
                </div>
            ) : (
                <div className="card-grid">
                    {aboveAverageDevices.map((device) => (
                        <div
                            className="card insight-card"
                            key={device.deviceId}
                        >
                            <div className="card-icon">📈</div>

                            <span className="small-label">
                  ABOVE AVERAGE ACTIVITY
                </span>

                            <h3>{device.deviceName}</h3>

                            <p>{device.deviceType}</p>

                            <div className="insight-line">
                                <span>Device ID</span>
                                <strong>#{device.deviceId}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* ==================================================
          DEVICE TIMELINE
      ================================================== */}

        <section className="section">
            <div className="section-title">
                <div>
                    <span className="section-number">07</span>

                    <div>
                        <h2>Device Timeline</h2>
                        <p>Automatic history of every status change</p>
                    </div>
                </div>

                <span className="section-badge orange">TRIGGER</span>
            </div>

            {logs.length === 0 ? (
                <p className="empty">
                    No device activity has been recorded yet.
                </p>
            ) : (
                <div className="timeline">
                    {logs
                        .slice()
                        .reverse()
                        .map((log) => (
                            <div className="timeline-item" key={log.logId}>
                                <div className="timeline-marker">●</div>

                                <div className="timeline-content">
                                    <div className="timeline-top">
                                        <strong>
                                            {log.device?.deviceName ||
                                                `Device #${log.device?.deviceId || "N/A"}`}
                                        </strong>

                                        <span>
                        {log.changedAt
                            ? new Date(
                                log.changedAt
                            ).toLocaleString()
                            : "Time unavailable"}
                      </span>
                                    </div>

                                    <p>
                                        Status changed from{" "}
                                        <b>{log.oldStatus}</b> to{" "}
                                        <b>{log.newStatus}</b>
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </section>

        {/* ==================================================
          FOOTER
      ================================================== */}

        <footer className="footer">
            <div>
                <strong>NESTORA</strong>
                <span> Smart Home Control Center</span>
            </div>

            <div>
                Java 21 · Spring Boot · React · MySQL
            </div>
        </footer>
    </div>
);
}

export default App;

