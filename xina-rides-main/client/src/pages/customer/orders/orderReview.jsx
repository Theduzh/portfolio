import { useEffect, useState } from "react";
import http from "../../../http.js";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
    Box,
    Container,
    Divider,
    Grid,
    Typography,
    Button,
    InputLabel,
    Select,
    MenuItem,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import WalletIcon from "@mui/icons-material/Wallet";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Navbar from "../../../components/Navbar.jsx";
import { AnimatePresence, motion, wrap } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderReview(props) {
    const [order, setOrder] = useState({});
    const [RedeemList, setRedeemList] = useState([]);
    const [rewards, setRewards] = useState("default");
    const [users, setUsers] = useState([]);
    const [successOpen, setSuccessOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const receivedData = location.state || null;

    const formatDuration = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Format hours, minutes, and seconds separately
        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");

        // Combine and return the formatted duration in HH:MM:SS format
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };

    const fetchOrder = async (orderId) => {
        try {
            const response = await http.get(`/order/${orderId}`);
            setOrder(response.data);
        } catch (error) {
            console.error(`Error fetching order: ${error}`);
            return null;
        }
    };

    const handleClose = () => {
        window.location.href = "/rental-history";
        setSuccessOpen(false);
    };

    const handleWalletConfirm = async () => {
        if (!receivedData) {
            return;
        }
        if (parseFloat(users.wallet) < parseFloat(order.orderTotal)) {
            // toast.error("Insufficient funds in wallet to pay for ride");
            console.log("Insufficient funds in wallet to pay for ride");
        } else {
            http.post("/checkout/payByWallet", {
                orderTotal: parseFloat(order.orderTotal).toFixed(2),
                bike: JSON.stringify(receivedData.bike),
                rentalId: receivedData.rentalId,
                accessToken: localStorage.getItem("accessToken"),
            })
                .then(() => {
                    setSuccessOpen(true);
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    };

    console.log(order.rewards);

    const handleConfirm = async (e) => {
        e.preventDefault();
        console.log(receivedData)
        console.log(order.reward)
        if (receivedData) {
            const bike = receivedData.bike;
            const rentalId = receivedData.rentalId;
            const orderTotal = order.orderTotal;
            let rewards = order.rewards;
            if (rewards == undefined){
                rewards = {}
            }
            const customer = await http.get("/user/profile");
            console.log(rewards, 'test')
            http.post("/checkout/createPaymentLink", {
                bike: bike,
                orderTotal: parseFloat(orderTotal).toFixed(2),
                rentalDuration: receivedData.rentalDuration,
                coords: receivedData.coords,
                rentalId: rentalId,
                rewards: rewards,
                accessToken: localStorage.getItem("accessToken"),
                customerEmail: customer.data.email,
                cancelURL: window.location.href,
                successURL: `${window.location.origin}/rental-history`,
            }).then((res) => {
                window.location.href = res.data.paymentLink;
            });
        }
    };

    const getCurrentRedeem = () => {
        http.get(`userrewards/${users.id}`).then((res) => {
            let tempRewardList = [];
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].Users[0].User_Rewards.Used === false) {
                    tempRewardList.push(res.data[i]);
                }
            }
            setRedeemList(tempRewardList);
        });
    };

    useEffect(() => {
        if (receivedData) {
            fetchOrder(receivedData.rentalId);
        } else {
            navigate("/rental-history");
        }
        if (localStorage.getItem("accessToken")) {
            http.get("/user/profile").then((res) => {
                setUsers(res.data);
            });
        }
    }, []);

    useEffect(() => {
        if (users) {
            getCurrentRedeem();
        }
    }, [users]);

    const handleMenuItem = (e) => {
        setRewards(e.target.value);
        http.get(`rewards/${e.target.value}`).then((res) => {
            const reward_amount = res.data.discount;
            var newOrderTotal;
            if (order.rewards == undefined) {
                newOrderTotal =
                    (order.orderTotal * (100 - reward_amount)) / 100;
            } else {
                newOrderTotal =
                    (order.orderTotal / (100 - order.rewards.discount)) *
                    (100 - reward_amount);
            }
            setOrder((prevOrder) => ({
                ...prevOrder,
                orderTotal: parseFloat(newOrderTotal).toFixed(2), // assuming orderTotal is a string with two decimal places
                rewards: res.data,
            }));
        });
    };

    const handleDeleteRewards = () => {
        setRewards("default");
        order.orderTotal = (
            (order.orderTotal / (100 - order.rewards.discount)) *
            100
        ).toFixed(2);
        order.rewards = undefined;
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: 3 }}>
                <Typography variant="h4" color="initial">
                    Review Ride
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Box
                        pr={4}
                        width={"50%"}
                        sx={{ borderRight: "1px solid lightgrey" }}
                    >
                        <Card
                            sx={{
                                px: 2,
                                py: 4,
                                border: "1px solid blue",
                                boxShadow: 2,
                            }}
                        >
                            <Typography
                                variant="body1"
                                fontWeight={500}
                                color="initial"
                            >
                                Bike
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    pb: 8,
                                }}
                            >
                                <Box>
                                    <Typography>
                                        Bike ID:&nbsp;{order.bikeId}
                                    </Typography>
                                    <Typography>
                                        Duration:&nbsp;
                                        {formatDuration(
                                            receivedData.rentalDuration
                                        )}
                                    </Typography>
                                    <Typography>
                                        Distance travelled:&nbsp;
                                        {order.distanceTravelled
                                            ? order.distanceTravelled
                                            : 0}
                                        km
                                    </Typography>
                                </Box>
                                <Box>
                                    {order.rewards != undefined ? (
                                        <Typography>
                                            $
                                            {parseFloat(
                                                (order.orderTotal /
                                                    (100 -
                                                        order.rewards
                                                            .discount)) *
                                                    100
                                            ).toFixed(2)}
                                        </Typography>
                                    ) : (
                                        <Typography>
                                            ${order.orderTotal}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            <Divider />
                            <AnimatePresence>
                                {order.rewards != undefined && (
                                    <motion.div
                                        key={order.rewards.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                pb: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    mt: 1,
                                                }}
                                            >
                                                <Typography fontWeight={400}>
                                                    Rewards
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        gap: 2,
                                                        mt: 2,
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            order.rewards
                                                                .imageFile
                                                                ? `http://localhost:3001/uploads/${order.rewards.imageFile}`
                                                                : "../uploads/card.png"
                                                        }
                                                        width={100}
                                                        style={{
                                                            borderRadius: 4,
                                                        }}
                                                    ></img>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            color="initial"
                                                        >
                                                            {
                                                                order.rewards
                                                                    .title
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="initial"
                                                        >
                                                            {
                                                                order.rewards
                                                                    .description
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            {order.rewards != undefined && (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "end",
                                                    }}
                                                >
                                                    <Typography mt={5}>
                                                        -
                                                        {order.rewards.discount}
                                                        %
                                                    </Typography>
                                                    <Button
                                                        color="error"
                                                        onClick={
                                                            handleDeleteRewards
                                                        }
                                                    >
                                                        Remove Reward
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                        <Divider />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                }}
                            >
                                <Typography variant="h6">Subtotal</Typography>
                                <Typography>${order.orderTotal}</Typography>
                            </Box>
                            <Divider />
                        </Card>
                    </Box>
                    <Box width={"50%"}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                minHeight: "46vh",
                            }}
                        >
                            <Card
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 2,
                                    borderRadius: "8px",
                                    width: "370px",
                                    bgcolor: deepPurple[50],
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        color: deepPurple[500],
                                    }}
                                >
                                    <SavingsOutlinedIcon />
                                    <Typography variant="h6">
                                        XCredits
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h5"
                                    color={deepPurple[500]}
                                >
                                    {users.xcredit}
                                </Typography>
                            </Card>
                            <Box mt={2}>
                                You'll earn {parseInt(order.orderTotal)}
                                &nbsp;XCredits after payment is completed
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                {RedeemList.length > 0 && (
                                    <Box>
                                        <InputLabel
                                            htmlFor="rewards"
                                            sx={{
                                                fontSize: "0.93rem",
                                                fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;`,
                                                fontWeight: "500",
                                                mt: 2,
                                            }}
                                        >
                                            Rewards
                                        </InputLabel>
                                        <Box sx={{ display: "flex" }}>
                                            <Select
                                                value={rewards}
                                                onChange={(e) =>
                                                    handleMenuItem(e)
                                                }
                                                fullWidth
                                                sx={{
                                                    borderRadius: "4px", // Optional: Add borderRadius to match Stripe styles.
                                                    border: "1px solid #ccc", // Optional: Add border to match Stripe styles.
                                                    "&:focus": {
                                                        outline: "none",
                                                        borderColor: "#AC78FF", // Optional: Add focus color to match Stripe styles.
                                                    },
                                                    width: "400px",
                                                    display: "flex",
                                                }}
                                            >
                                                <MenuItem
                                                    disabled={true}
                                                    key={0}
                                                    value="default"
                                                >
                                                    <Box>
                                                        <Typography>
                                                            Select a reward
                                                        </Typography>
                                                    </Box>
                                                </MenuItem>
                                                {RedeemList.map(
                                                    (reward, option) => {
                                                        return (
                                                            <MenuItem
                                                                key={option + 1}
                                                                value={
                                                                    reward.id
                                                                }
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={
                                                                            reward.imageFile
                                                                                ? `http://localhost:3001/uploads/${reward.imageFile}`
                                                                                : "../uploads/card.png"
                                                                        }
                                                                        width={
                                                                            80
                                                                        }
                                                                        style={{
                                                                            borderRadius: 4,
                                                                        }}
                                                                    ></img>
                                                                    <Box
                                                                        ml={2}
                                                                        sx={{
                                                                            display:
                                                                                "flex",
                                                                            flexDirection:
                                                                                "column",
                                                                            width: 100,
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            width={
                                                                                100
                                                                            }
                                                                        >
                                                                            {
                                                                                reward.header
                                                                            }
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            color="black"
                                                                            width={
                                                                                100
                                                                            }
                                                                        >
                                                                            {
                                                                                reward.discount
                                                                            }
                                                                            %
                                                                            Off
                                                                            Checkout
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </MenuItem>
                                                        );
                                                    }
                                                )}
                                            </Select>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                            <Typography variant="h6" color="initial" mt={2}>
                                Checkout With
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={handleWalletConfirm}
                                    startIcon={<WalletIcon />}
                                    sx={{ width: "110px", borderColor: "blue" }}
                                >
                                    Wallet
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={handleConfirm}
                                    startIcon={<CreditCardIcon />}
                                    sx={{ width: "110px", borderColor: "blue" }}
                                >
                                    Card
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
            <Dialog open={successOpen}>
                <DialogTitle>Payment Success</DialogTitle>
                <DialogContent>Successfully paid with wallet</DialogContent>
                <DialogActions>
                    <Button onClose={handleClose} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </>
    );
}

export default OrderReview;
