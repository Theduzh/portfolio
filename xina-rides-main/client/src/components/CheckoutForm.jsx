import { useEffect, useState, useContext } from "react";
import {
    Box,
    Button,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import http from "../http.js";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

export default function CheckoutForm({ receivedData, order, setOrder }) {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentIntent, setPaymentIntent] = useState(null);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);
    const [RedeemList, setRedeemList] = useState([]);
    const { orderId, orderTotal } = receivedData;

    useEffect(() => {
        fetchOrder(orderId);
    }, []);

    const fetchOrder = async (orderId) => {
        try {
            const response = await http.get(`/order/${orderId}`);
            setOrder(response.data);
        } catch (error) {
            console.error(`Error fetching order: ${error}`);
            return null;
        }
    };

    const updateOrder = async (orderId) => {
        try {
            await http.put(`/order/${orderId}`, {
                ...order,
                orderTotal: parseFloat(order.orderTotal),
                orderInitial: parseFloat(order.orderTotal),
                orderStatus: "COMPLETED",
                orderPaymentStatus: "PAID",
                orderPaymentMethod: "CREDIT_CARD",
                promotionCode: order.promotionCode, // Add the promo code to the request payload
            });

            const bike = await http.get(`/bike/${order.bikeId}`);

            await http.put(`/bike/${order.bikeId}`, {
                name: bike.data.name,
                rentalPrice: parseFloat(bike.data.rentalPrice),

                bikeLat: Number(bike.data.bikeLat),
                bikeLon: Number(bike.data.bikeLon),
                currentlyInUse: false,
            });

            navigate("/completion");
        } catch (error) {
            console.error(`Error updating order: ${error}`);
        }
    };

    const updateRedemption = async (order) => {
        console.log(order.rewards.id);
        try {
            await http.put(`userrewards/${users.id}/${order.rewards.id}`, {
                Used: true,
            });
        } catch (error) {
            console.error(`Error updating redemption: ${error}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            http.get("/user/profile").then((res) => {
                setUsers(res.data);
            });
        }
    }, []);

    useEffect(() => {
        if (users) {
            http.get(`userrewards/${users.id}`).then((res) => {
                let tempRewardList = [];
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].Users[0].User_Rewards.Used === false) {
                        tempRewardList.push(res.data[i]);
                    }
                }
                setRedeemList(tempRewardList);
            });
        }
    }, [users]);

    const handleMenuItem = (e) => {
        setRewards(e.target.value);
        http.get(`rewards/${e.target.value}`).then((res) => {
            const reward_amount = res.data.discount;
            var newOrderTotal;
            if (order.rewards == undefined) {
                newOrderTotal = (order.orderTotal * reward_amount) / 100;
            } else {
                newOrderTotal =
                    (order.orderTotal / order.rewards.discount) * reward_amount;
            }
            setOrder((prevOrder) => ({
                ...prevOrder,
                orderTotal: parseFloat(newOrderTotal).toFixed(2), // assuming orderTotal is a string with two decimal places
                rewards: res.data,
            }));
        });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                px: "20px",
            }}
        >
            <Box sx={{ mb: 2, mt: 2 }}>
                {RedeemList.length > 0 && (
                    <Box>
                        <InputLabel
                            htmlFor="promoCode"
                            sx={{
                                fontSize: "0.93rem",
                                fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;`,
                                fontWeight: "500",
                                mt: 2,
                            }}
                        >
                            Rewards
                        </InputLabel>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Select
                                value={rewards}
                                onChange={(e) => handleMenuItem(e)}
                                placeholder="Enter promo code"
                                sx={{
                                    py: 0,
                                    flex: 1, // Take up remaining available space in the flex container.
                                    borderRadius: "4px", // Optional: Add borderRadius to match Stripe styles.
                                    border: "1px solid #ccc", // Optional: Add border to match Stripe styles.
                                    "&:focus": {
                                        outline: "none",
                                        borderColor: "#AC78FF", // Optional: Add focus color to match Stripe styles.
                                    },
                                }}
                            >
                                <MenuItem
                                    disabled={true}
                                    key={0}
                                    value="default"
                                >
                                    Select a reward
                                </MenuItem>
                                {RedeemList.map((reward, option) => {
                                    return (
                                        <MenuItem
                                            key={option + 1}
                                            value={reward.id}
                                        >
                                            {reward.header}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
