import { useAppSelector } from "../store/hooks";
import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
    adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
    const user = useAppSelector((state) => state.auth.user);

    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

    return <>{children}</>;
};

export default ProtectedRoute;