import React, { useEffect, useState } from "react";
import { CustomTable, NavContainer } from "../../../components";
import { Typography } from "@mui/material";
import http from "../../../http";

const headers = [
    "Fault ID",
    "Bike ID",
    "Fault Description",
    "Fault Status",
    "Date Reported",
    "Date Resolved",
];

function FaultReports() {
    const [rows, setRows] = useState([]);

    const fetchFaultReports = async () => {
        const response = await http.get("/fault-report");
        const responseData = response.data;

        const user = await http.get("/user/profile");
        const userId = user.data.id;

        setRows(
            responseData
                .filter((faultReport) => faultReport.userId === userId)
                .map((faultReport) => ({
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
    };

    useEffect(() => {
        fetchFaultReports();
    }, []);
    return (
        <NavContainer>
            <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                Fault Reports
            </Typography>
            <CustomTable headers={headers} rows={rows} />
        </NavContainer>
    );
}

export default FaultReports;
