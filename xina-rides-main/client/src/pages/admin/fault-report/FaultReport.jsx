import React, { useEffect, useState } from "react";
import { CustomTable, FilterCard, NavContainer } from "../../../components";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from "@mui/material";
import { Cached, Check, LockOpen } from "@mui/icons-material";
import http from "../../../http";
import { ToastContainer, toast } from "react-toastify";

const headers = [
    "Fault ID",
    "Bike ID",
    "Fault Description",
    "Fault Status",
    "Date Reported",
    "Date Resolved",
    "",
];

function FaultReport() {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [currentId, setCurrentId] = useState(null);
    const [rows, setRows] = useState([]);
    const [currentStatus, setCurrentStatus] = useState(null);

    const [filterValues, setFilterValues] = useState({
        faultReportStatus: "All",
        faultReportDate: "",
        faultReportResolvedDate: "",
    });

    const handleOpen = (status, id) => {
        setCurrentStatus(status);
        setCurrentId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchFaultReports = async () => {
        try {
            const params = {
                search: filterValues.faultReportStatus, // Using faultReportStatus for the status query, but customize based on your API
                faultReportDate: filterValues.faultReportDate,
                faultReportResolvedDate: filterValues.faultReportResolvedDate,
            };

            const response = await http.get("/fault-report", { params });
            const faultReports = response.data;

            setData(faultReports);
        } catch (error) {
            console.error("Error fetching fault reports:", error);
            toast.error(
                "An error occurred while fetching fault reports.",
                "error"
            );
        }
    };

    const handleMark = async (status) => {
        http.put(`/fault-report/${currentId}/mark`, {
            status: status,
        }).then(() => {
            toast.success(`Fault report marked as ${status}`);
            setOpen(false);
            fetchFaultReports();
        });
    };

    const actions = [
        {
            label: "Mark as open",
            icon: <LockOpen />,
            onClick: (id) => handleOpen("open", id),
        },
        {
            label: "Mark as in progress",
            icon: <Cached />,
            onClick: (id) => handleOpen("in progress", id),
        },
        {
            label: "Mark as resolved",
            icon: <Check />,
            onClick: (id) => handleOpen("resolved", id),
        },
    ];
    useEffect(() => {
        fetchFaultReports();
    }, [filterValues]);

    useEffect(() => {
        setRows(
            data.map((faultReport) => ({
                id: faultReport.faultReportId,
                bikeId: faultReport.bikeId,
                faultReportDescription: faultReport.faultReportDescription,
                faultReportStatus: faultReport.faultReportStatus,
                faultReportDate: faultReport.faultReportDate,
                faultReportResolvedDate: faultReport.faultReportResolvedDate
                    ? faultReport.faultReportResolvedDate
                    : "N/A",
            }))
        );
    }, [data]);

    return (
        <NavContainer>
            <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                Fault Reports
            </Typography>
            <Typography
                variant="p"
                fontSize={16}
                fontWeight={"medium"}
                sx={{ color: "#79747E" }}
            >
                All Fault Reports
            </Typography>
            <FilterCard
                filterValues={filterValues}
                setFilterValues={setFilterValues}
                data={data}
                fetchFunction={fetchFaultReports}
            />
            <CustomTable
                headers={headers}
                rows={rows}
                actions={actions}
                handleOpen={handleOpen}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Mark as {currentStatus}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to mark this fault report as
                        {currentStatus}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleMark(currentStatus, currentId)}
                    >
                        Mark as {currentStatus}
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </NavContainer>
    );
}

export default FaultReport;
