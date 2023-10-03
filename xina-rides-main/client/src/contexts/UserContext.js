import React from "react";

const UserContext = React.createContext({
    user: null,
    setUser: null,
    isAdmin: false,
    twoFAEnabled: false,
    setTwoFAEnabled: null,
    isAdminDashbord: false,
    setIsAdminDashbord: () => { }
});

export default UserContext;
