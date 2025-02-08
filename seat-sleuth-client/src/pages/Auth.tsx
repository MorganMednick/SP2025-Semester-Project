import { useState } from 'react';
import { AuthState } from '../types/clitentAuth';
import AuthForm from '../components/auth/AuthForm';

export default function Auth() {
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOGIN);

  return <AuthForm authState={authState} setAuthState={setAuthState} />;
}
