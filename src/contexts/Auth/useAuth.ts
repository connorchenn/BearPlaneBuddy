import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error(`Auth Context unavailable`);
  return context;
};

export default useAuth;
