import { createContext, useContext, useEffect, useState } from "react";
import api from "../apiIntercepter";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    async function fetchUser() {
        setLoading(true);
        try {
            const { data } = await api.get("/api/v1/me");
            setUser(data.user);
            setIsAuth(true);
        } catch (error) {
            console.log("User not authenticated");
            setIsAuth(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AppContext.Provider value={{ user, setUser, isAuth, setIsAuth, loading }}>
            {children}
        </AppContext.Provider>
    );
};

export const AppData = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("AppContext must be used within AppProvider");
    }

    return context;
};