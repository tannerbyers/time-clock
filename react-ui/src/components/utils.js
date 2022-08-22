import { useToken } from "./hooks";
import { Navigate } from "react-router-dom";
function RequireAuth({ children }) {
  const { token } = useToken();
  return token ? children : <Navigate to="/" replace />;
}

export { RequireAuth };
