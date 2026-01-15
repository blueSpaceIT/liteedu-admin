/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Login first to attempt this action");
            navigate("/login");
        }
    }, [navigate]);

    const token = localStorage.getItem("accessToken");
    if (!token) return null; 

    return children;
};

export default PrivateRoute;
