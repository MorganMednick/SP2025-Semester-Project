import { useEffect } from 'react';
import { registerUser } from '../api/functions/auth';

export default function NotFound() {
  useEffect(() => {
    registerUser({ email: 'superEmail@gmail.com', password: 'SuperPassword' });
  }, []);
  return <div>NotFound</div>;
}
