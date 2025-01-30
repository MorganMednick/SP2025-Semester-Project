import { useEffect, useState } from 'react';
import { retrieveServerHealth } from './api/functions/health';
import { loginUser, registerUser } from './api/functions/auth';
import { ApiResponse, LoginResponse, RegistrationResponse } from '@shared/api/responses';

function App() {
  const testUser = { email: 'test@test.com', password: 'vurySecure9' };
  const [registeredUser, setRegisteredUser] = useState<RegistrationResponse>();
  const [jwt, setJwt] = useState<LoginResponse>();
  useEffect(() => {
    retrieveServerHealth()
      .then((res) => console.info(res))
      .catch((err) => console.error(err));
  }, []);
  return (
    <>
      <h1>Whats up poeples</h1>
      {!registeredUser && (
        <button
          onClick={async () => {
            const registrationResponse: ApiResponse<RegistrationResponse> = await registerUser(testUser);
            if (registrationResponse && registrationResponse.data) {
              // This is required because of polymorphism :)
              const extractedUser = registrationResponse.data.payload;
              setRegisteredUser(extractedUser);
            } else {
              console.error('Bad registration!', registrationResponse);
            }
          }}
        >
          Test Registration!
        </button>
      )}
      <button
        onClick={async () => {
          const loginResponse: ApiResponse<LoginResponse> = await loginUser(testUser);
          if (loginResponse && loginResponse.data) {
            const jwtJson = loginResponse.data.payload;
            setJwt(jwtJson);
          }
        }}
      >
        Test Login!
      </button>
      <h2>registered User:</h2>
      {registeredUser ? JSON.stringify(registeredUser) : 'No user yet homie'}
      <h2>Logged in JWT token?: </h2>
      {jwt ? (
        <p>
          {JSON.stringify(jwt)}
          <br />
          <br />
          <br />
          Please check and make sre that your application has cookies set in the dev tools! Go to inspect &gt; application &gt; cookies. Make sure that there is a cookie with your generated auth token in there!!!!!
        </p>
      ) : (
        'Not logged in yet homie'
      )}
    </>
  );
}

export default App;
