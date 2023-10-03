import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import {
    Bikes,
    AdminDashboard,
    Orders,
    EditOrder,
    Rewards,
    AddRewards,
    Users,
    AddBike,
    EditBikes,
    AddPromotion,
    AdminPromotions,
    EditPromotion,
    DeletePromotion,
    EditRewards,
    FaultReport,
} from "./pages/admin";
import {
    NotFound,
    UserDashboard,
    Rent,
    RentalHistory,
    RewardsUser,
    LandingPage,
    AccSecurity,
    Membership,
    Promotions,
    Login,
    Register,
    Profile,
    EditProfile,
    SpecificRentalHistory,
    PaymentMethods,
    Notifications,
    BillingHistory,
    RedemptionHistory,
    OrderReview,
    FaultReports,
} from "./pages/customer";
import { ThemeProvider, createTheme } from "@mui/material";
import UserContext from "./contexts/UserContext";
import { useEffect, useState, useRef } from "react";
import http from "./http.js";
import { ProtectedRoute } from "./auth/ProtectedRoute";

function App() {
    const theme = createTheme({
        typography: {
            fontFamily: "Poppins",
        },
    });

    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        phoneNo: "",
        dateOfBirth: "",
        country: "",
        aboutMe: "",
        profilePic: "",
        twoFAEnabled: false,
    });

    const accessToken = localStorage.getItem("accessToken");
    const [isAdminDashboard, setIsAdminDashboard] = useState(false);

    const shouldRunOnMount = useRef(true);

    useEffect(() => {
        if (shouldRunOnMount.current) {
            shouldRunOnMount.current = false;
            if (localStorage.getItem("siteUI")) {
                setIsAdminDashboard(JSON.parse(localStorage.getItem("siteUI")));
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("siteUI", JSON.stringify(isAdminDashboard));
    }, [isAdminDashboard]);

    useEffect(() => {
        if (accessToken) {
            http.get("/user/profile").then((res) => {
                setUser(res.data);
                setIsAdmin(res.data.accountType == 2);
            });
        }
    }, []);

    const adminRoutes = [
        { path: "/dashboard", component: AdminDashboard },
        { path: "/users", component: Users },
        { path: "/orders", component: Orders },
        { path: "/orders/:id/edit", component: EditOrder },
        { path: "/bikes/add", component: AddBike },
        { path: "/bikes", component: Bikes },
        { path: "/bikes/:bikeId/edit", component: EditBikes },
        { path: "/rewards", component: Rewards },
        { path: "/rewards/add", component: AddRewards },
        { path: "/rewards/:id/edit", component: EditRewards },
        { path: "/promotions/add", component: AddPromotion },
        { path: "/promotions", component: AdminPromotions },
        { path: "/promotions/:id/edit", component: EditPromotion },
        { path: "/promotions/:id/delete", component: DeletePromotion },
        { path: "/fault-reports", component: FaultReport },
    ];

    const custRoutes = [
        { path: "*", component: NotFound },
        {
            path: "/",
            component: accessToken ? UserDashboard : LandingPage,
        },
        { path: "/signin", component: Login },
        { path: "/signup", component: Register },
        {
            path: !isAdminDashboard ? "/editprofile" : "/admin/editprofile",
            component: EditProfile,
        },
        {
            path: !isAdminDashboard ? "/profile" : "/admin/profile",
            component: Profile,
        },
        { path: "/rent", component: Rent },
        { path: "/promotions", component: Promotions },
        { path: "/membership", component: Membership },
        { path: "/rewards", component: RewardsUser },
        {
            path: !isAdminDashboard ? "/security" : "/admin/security",
            component: AccSecurity,
        },
        { path: "/rental-history", component: RentalHistory },
        { path: "/rental-history/:id", component: SpecificRentalHistory },
        { path: "/wallet", component: PaymentMethods },
        { path: "/notifications", component: Notifications },
        { path: "/billing-history", component: BillingHistory },
        { path: "/redemption-history", component: RedemptionHistory },
        { path: "/review-order", component: OrderReview },
        { path: "/fault-reports", component: FaultReports },
    ];
    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                isAdmin,
                isAdminDashboard,
                setIsAdminDashboard,
            }}
        >
            <ThemeProvider theme={theme}>
                <Router>
                    <Routes>
                        {custRoutes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={<route.component />}
                            />
                        ))}
                        <Route
                            path="/admin/"
                            element={<Navigate to="/admin/dashboard" />}
                        />
                        {adminRoutes.map((route) => (
                            <Route
                                key={route.path}
                                path={`/admin${route.path}`}
                                element={
                                    <ProtectedRoute>
                                        <route.component />
                                    </ProtectedRoute>
                                }
                            />
                        ))}
                    </Routes>
                </Router>
            </ThemeProvider>
        </UserContext.Provider>
    );
}

export default App;
