import { LayerGroup, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import QRCode from "react-qr-code";
import http from "../../../http";
import bikeIcon from "../icons/bikeIcon";
import { toast, ToastContainer } from "react-toastify";

function BikeLayer({ bikes }) {
    const [selectedBike, setSelectedBike] = useState(null);
    const [open, setOpen] = useState(false);
    const [qrData, setQRData] = useState();
    const [qrModalOpen, setQRModalOpen] = useState(false);
    const [qrModalWasOpened, setQrModalWasOpened] = useState(false);

    const updatedBikes = bikes.filter((bike) => bike.currentlyInUse === false);

    const handleClose = () => {
        setOpen(false);
        // set bike in use to true
        http.put(`/bike/${selectedBike.bikeId}/rent`);

        // After the first modal is closed, set the data for the second modal and open it
        setTimeout(() => {
            setQRData("http://localhost:3001/order/");
            setQRModalOpen(true);
            setQrModalWasOpened(true);
        }, 500);
    };

    const handleQRClick = () => {
        // Perform the POST request using http.js (axios)
        http.post(qrData, {
            orderStatus: "ACTIVE",
            orderTotal: 0,
            orderNotes: "",
            orderPaymentStatus: "UNPAID",
            orderPaymentMethod: "",
            bikeId: selectedBike.bikeId,
        })
            .then(() => {
                // Handle the response if needed
                handleClose();
            })
            .catch((error) => {
                // Handle errors
                console.error("POST request error:", error);
            });
    };

    const handleMarkerClick = async (bike) => {
        const accountType = await http.get("/user/profile").then((res) => {
            console.log(res.data.AccountTypeId);
            return res.data.accountType === 1 ? "user" : "admin";
        });

        if (accountType == "user") {
            setSelectedBike(bike);
            setOpen(true);
            setQRData("http://localhost:3001/order/");
        } else {
            // toast error message "you are not a customer"
            toast.error("Admins cannot rent bikes");
        }
    };

    const handleCloseQRModal = () => {
        setQRModalOpen(false);
        handleQRClick();
    };

    const handleQRBackdropClick = () => {
        setOpen(false);
        setQRModalOpen(false);
    };

    const handleBackdropClick = () => {
        setQRModalOpen(false); // Close the second modal
    };

    useEffect(() => {
        // This effect will be triggered whenever qrModalOpen changes its state.
        // If qrModalOpen becomes false, it means the second modal is closing.
        if (!qrModalOpen && qrModalWasOpened) {
            // Reload the page or map when the second modal is closed
            window.location.reload();
        }
    }, [qrModalOpen, qrModalWasOpened]);

    return (
        <LayerGroup>
            {updatedBikes.map((bike) => {
                return (
                    <Marker
                        position={[bike.bikeLat, bike.bikeLon]}
                        icon={bikeIcon}
                        key={bike.bikeId}
                        eventHandlers={{
                            click: () => handleMarkerClick(bike),
                        }}
                    >
                        <Tooltip>{bike.name}</Tooltip>
                    </Marker>
                );
            })}

            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={(props) => (
                    <Backdrop {...props} onClick={handleQRBackdropClick} />
                )}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "#FFF",
                            padding: "1rem",
                            outline: "none",
                            boxShadow: 24,
                            maxWidth: 400,
                        }}
                    >
                        {qrData && (
                            <Box
                                sx={{
                                    py: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <QRCode
                                    id="qr-code"
                                    value={qrData}
                                    title="QR Code"
                                    bgColor={"#FFFFFF"}
                                    fgColor={"#000"}
                                    size={256}
                                    onClick={() => handleQRClick()}
                                />
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    Scan this QR code to rent this bike
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    {selectedBike.name}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ mt: 2, width: "100%" }}
                                    onClick={handleQRClick}
                                >
                                    Rent
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Modal>
            {selectedBike && (
                <Modal
                    open={qrModalOpen}
                    onClose={handleCloseQRModal}
                    closeAfterTransition
                    BackdropComponent={(props) => (
                        <Backdrop {...props} onClick={handleBackdropClick} />
                    )}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={qrModalOpen}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: "#FFF",
                                padding: "1rem",
                                outline: "none",
                                boxShadow: 24,
                                maxWidth: 400,
                            }}
                        >
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Bike Rental Successful!
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                You have successfully rented the bike named{" "}
                                {selectedBike.name}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleCloseQRModal}
                                sx={{ mt: 2, width: "100%" }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Fade>
                </Modal>
            )}
            <ToastContainer />
        </LayerGroup>
    );
}

export default BikeLayer;
