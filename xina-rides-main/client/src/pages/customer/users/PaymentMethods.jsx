import {
    Box,
    Typography,
    Button,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment,
    ButtonGroup,
} from "@mui/material";
import { NavContainer } from "../../../components";
import { useContext, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import * as yup from "yup";
import http from "../../../http";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PaymentMethods() {
    const { user, setUser } = useContext(UserContext);
    const [openTransfer, setOpenTransfer] = useState(false);
    const [openConvert, setOpenConvert] = useState(false);
    const [transferAmount, setTransferAmount] = useState(0);
    const [convertAmount, setConvertAmount] = useState(0);

    const validateTransfer = yup.object().shape({
        transferAmount: yup
            .number()
            .typeError("Transfer amount must only contain numbers"),
        convertAmount: yup
            .number()
            .typeError("Convert amount must only contain numbers"),
    });

    const handleOpenTransfer = () => {
        setOpenTransfer(true);
    };

    const handleCloseTransfer = () => {
        setOpenTransfer(false);
    };

    const handleOpenConvert = () => {
        setOpenConvert(true);
    };

    const handleCloseConvert = () => {
        setConvertAmount(0);
        setOpenConvert(false);
    };

    const handleTransferChange = (e) => {
        setTransferAmount(e.target.value);
    };

    const handleConvertChange = (e) => {
        setConvertAmount(e.currentTarget.getAttribute("data-value"));
    };

    const handleTransfer = () => {
        validateTransfer
            .validate({
                transferAmount: parseFloat(transferAmount),
            })
            .then(() => {
                http.post("/user/transferToWallet", {
                    transfer_amount: parseFloat(transferAmount).toFixed(2),
                }).then((res) => {
                    window.location.href = res.data.paymentLink;
                });
            })
            .catch((err) => {
                toast.error(`${err.response.data.message}`);
            });
    };

    const handleConvert = () => {
        validateTransfer
            .validate({
                convertAmount: parseFloat(convertAmount),
            })
            .then(() => {
                http.post("/user/convertToWallet", {
                    convert_amount: parseFloat(convertAmount),
                })
                    .then((res) => {
                        toast.success(res.data.message);
                        updateUserState();
                        setOpenConvert(false);
                    })
                    .catch((err) => {
                        toast.error(`${err.response.data.message}`);
                    });
            })
            .catch((err) => {
                toast.error(`${err.response.data.message}`);
            });
    };

    const updateUserState = () => {
        http.get("/user/profile").then((res) => {
            setUser(res.data);
        });
    };

    return (
        <NavContainer>
            <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                Wallet
            </Typography>
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <Card sx={{ p: 2, width: "30rem", height: "12rem", mr: 3 }}>
                    <Typography variant="subtitle">Balance</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 6,
                        }}
                    >
                        <Typography variant="h4" component="p">
                            ${user.wallet}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={handleOpenTransfer}
                        >
                            Top Up Wallet
                        </Button>
                    </Box>
                    <Typography variant="subtitle">XCredits</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h4" component="p">
                            {user.xcredit}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={handleOpenConvert}
                        >
                            Convert XCredits to Wallet
                        </Button>
                    </Box>
                </Card>
            </Box>
            <Dialog open={openTransfer}>
                <DialogTitle>
                    Transfer cash into your XinaRides Wallet
                </DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={handleTransferChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    $
                                </InputAdornment>
                            ),
                        }}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCloseTransfer}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        onClick={handleTransfer}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openConvert}>
                <DialogTitle>
                    Convert XCredits into your XinaRides Wallet
                </DialogTitle>
                <DialogContent>
                    <ButtonGroup size="large">
                        <Button
                            data-value="500"
                            color="secondary"
                            onClick={handleConvertChange}
                            sx={{
                                bgcolor:
                                    convertAmount == 500 ? "lightgrey" : "",
                            }}
                        >
                            500 XCredits
                        </Button>
                        <Button
                            data-value="1000"
                            color="secondary"
                            onClick={handleConvertChange}
                            sx={{
                                bgcolor:
                                    convertAmount == 1000 ? "lightgrey" : "",
                            }}
                        >
                            1000 XCredits
                        </Button>
                        <Button
                            data-value="1500"
                            color="secondary"
                            onClick={handleConvertChange}
                            sx={{
                                bgcolor:
                                    convertAmount == 1500 ? "lightgrey" : "",
                            }}
                        >
                            1500 XCredits
                        </Button>
                    </ButtonGroup>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCloseConvert}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        onClick={handleConvert}
                    >
                        Convert
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog>
                <DialogTitle>Are you sure you want to convert </DialogTitle>
            </Dialog>
            <ToastContainer />
        </NavContainer>
    );
}

export default PaymentMethods;
