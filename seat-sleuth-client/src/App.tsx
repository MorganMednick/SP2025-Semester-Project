import { useEffect, useState } from "react";
import { retrieveServerHealth } from "./api/functions/health";
import { loginUser, registerUser } from "./api/functions/auth";
import {
  ApiResponse,
  LoginResponse,
  RegistrationResponse,
} from "@shared/api/responses";

// Thank you GPT for this cringey demo
function App() {
  // Test user credentials
  const testUser = { email: "test@test2345.com", password: "vurySecure9" };

  // State for registered user and JWT token
  const [registeredUser, setRegisteredUser] =
    useState<RegistrationResponse | null>(null);
  const [jwt, setJwt] = useState<LoginResponse | null>(null);

  // Fetch server health status on page load
  useEffect(() => {
    retrieveServerHealth()
      .then((res) => console.info("✅ Server Health Check:", res))
      .catch((err) => console.error("❌ Server Health Check Failed:", err));
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>🚀 API Demo: Authentication & Health Check</h1>

      {/* Register a new user */}
      {!registeredUser && (
        <button
          style={buttonStyle}
          onClick={async () => {
            console.info("🟡 Registering user...");
            const registrationResponse: ApiResponse<RegistrationResponse> =
              await registerUser(testUser);

            if (registrationResponse?.data) {
              console.info("✅ Registration Successful!", registrationResponse);
              setRegisteredUser(registrationResponse.data.payload);
            } else {
              console.error("❌ Registration Failed!", registrationResponse);
            }
          }}
        >
          📝 Register User
        </button>
      )}

      {/* Login the user */}
      <button
        style={buttonStyle}
        onClick={async () => {
          console.info("🟡 Logging in...");
          const loginResponse: ApiResponse<LoginResponse> =
            await loginUser(testUser);

          if (loginResponse?.data) {
            console.info("✅ Login Successful!", loginResponse);
            setJwt(loginResponse.data.payload);
          } else {
            console.error("❌ Login Failed!", loginResponse);
          }
        }}
      >
        🔑 Login User
      </button>

      {/* Display registered user data */}
      <h2>🧑 Registered User:</h2>
      <pre style={outputStyle}>
        {registeredUser
          ? JSON.stringify(registeredUser, null, 2)
          : "No user registered yet"}
      </pre>

      {/* Display JWT token */}
      <h2>🔐 Logged in JWT Token:</h2>
      <pre style={outputStyle}>
        {jwt ? (
          <>
            {JSON.stringify(jwt, null, 2)}
            <br />
            <br />
            <strong>🔍 Check your authentication cookies:</strong>
            <br />
            Open <code>DevTools → Application → Cookies</code> and verify that
            your **auth token** is stored!
          </>
        ) : (
          "Not logged in yet"
        )}
      </pre>
    </div>
  );
}

// Button styling for better UI
const buttonStyle = {
  backgroundColor: "#007BFF",
  color: "#FFF",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  margin: "10px 5px",
  fontSize: "16px",
};

// Styling for output text
const outputStyle = {
  backgroundColor: "#F4F4F4",
  padding: "10px",
  borderRadius: "5px",
  whiteSpace: "pre-wrap",
  fontFamily: "monospace",
};

export default App;
