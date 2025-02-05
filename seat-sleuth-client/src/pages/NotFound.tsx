import { useEffect } from 'react';
import { checkLogin, loginUser } from '../api/functions/auth';

export default function NotFound() {
  useEffect(() => {
    checkLogin()
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }, []);
  return <div>NotFound</div>;
}
