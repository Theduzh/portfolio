import { useState, useEffect, useContext } from "react";
import http from "../http";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import { LoadingScreen } from "../components";

export const ProtectedRoute = ({ children }) => {
    const [displayedElement, setDisplayedElement] = useState(<></>);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        http.get("/user/profile").then((res) => {
            const fetchedIsAdmin = res.data.accountType === 2;
            if (fetchedIsAdmin) {
                setDisplayedElement(children);
            } else {
                navigate("/404");
            }
            setIsLoading(false); // Set loading state to false once status is determined
        });
    }, [children, navigate]);
    //Only Rerenders if the children/new pages are requested, if not page will loop rerending

    return isLoading ? <LoadingScreen /> : displayedElement;
};
