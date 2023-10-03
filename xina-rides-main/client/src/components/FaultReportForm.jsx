import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    FormHelperText,
} from "@mui/material";
import { useState } from "react";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";

function FaultReportForm({ open, onClose, id }) {
    const [faultType, setFaultType] = useState("");
    const [faultDescription, setFaultDescription] = useState("");
    const [error, setError] = useState({
        faultType: "",
        faultDescription: "",
    });

    const handleFaultTypeChange = (event) => {
        setFaultType(event.target.value);
        setError((prevError) => ({
            ...prevError,
            faultType: "",
        }));
    };

    const handleFaultDescriptionChange = (event) => {
        setFaultDescription(event.target.value);
        setError((prevError) => ({
            ...prevError,
            faultDescription: "",
        }));
    };

    const validateForm = () => {
        let valid = true;
        const newError = {
            faultType: "",
            faultDescription: "",
        };

        if (!faultType) {
            newError.faultType = "Please select a fault type";
            valid = false;
        }
        if (!faultDescription) {
            newError.faultDescription = "Please provide a fault description";
            valid = false;
        }

        setError(newError);
        return valid;
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const order = await fetchOrder(id);

        const newFaultReport = {
            faultType,
            faultReportDescription: faultDescription,
            bikeId: order.bikeId,
        };

        http.post("/fault-report", newFaultReport).then(() => {
            onClose();
        });

        // reset form
        setFaultType("");
        setFaultDescription("");
        setError({
            faultType: "",
            faultDescription: "",
        });
        toast.success("Fault reported successfully");
    };

    const fetchOrder = async (id) => {
        const response = await http.get(`/order/${id}`);
        return response.data;
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Report Fault</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide details about the fault.
                    </DialogContentText>
                    <FormControl component="fieldset" error={!!error.faultType}>
                        <FormLabel component="legend">Fault Type</FormLabel>
                        <RadioGroup
                            aria-label="faultType"
                            name="faultType"
                            value={faultType}
                            onChange={handleFaultTypeChange}
                        >
                            <FormControlLabel
                                value="mechanical"
                                control={<Radio />}
                                label="Mechanical"
                            />
                            <FormControlLabel
                                value="electrical"
                                control={<Radio />}
                                label="Electrical"
                            />
                            <FormControlLabel
                                value="other"
                                control={<Radio />}
                                label="Other"
                            />
                        </RadioGroup>
                        {error.faultType && (
                            <FormHelperText>{error.faultType}</FormHelperText>
                        )}
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="faultDescription"
                        label="Fault Description"
                        type="text"
                        fullWidth
                        value={faultDescription}
                        onChange={handleFaultDescriptionChange}
                        error={!!error.faultDescription}
                        helperText={error.faultDescription}
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleFormSubmit}
                    >
                        Report Fault
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </>
    );
}

export default FaultReportForm;
