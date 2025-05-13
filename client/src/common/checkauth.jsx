import { Navigate, useLocation } from "react-router-dom";

export function Checkauth({ isAuthenticated, user, children }) {  // ✅ Add `{ children }`
    const location = useLocation();
    
    console.log("User Role:", user?.role);
    console.log("Current Path:", location.pathname);

    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location }} />;
    }

    // Redirect users based on their roles when they visit "/"
    if (location.pathname === '/') {
        if (user?.role === "admin") {
            return <Navigate to="/admin" />;
        } else if (user?.role === "creators") {
            return <Navigate to="/creator" />;
        } else {
            return <Navigate to="/student" />;
        }
    }
    if (isAuthenticated && location.pathname.includes('/signin') ) {
        if (user.role === "student") {
            return <Navigate to="/student" />;
        } else if (user.role === "admin") {
            return <Navigate to="/admin" />;
        } else {
            return <Navigate to="/creator" />;
        }
    }


    // Prevent role-based unauthorized access
    if (
        (user?.role === "student" && (location.pathname.includes("/admin") || location.pathname.includes("/creator"))) ||
        (user?.role === "creators" && location.pathname.includes("/admin")) ||
        (user?.role === "admin" && (location.pathname.includes("/student") || location.pathname.includes("/creator")))
    ) {
        return <Navigate to="/unauth" />;
    }

    return <>{children}</>;  // ✅ Ensure it renders children
}
