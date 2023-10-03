import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TablePagination,
    Box,
    Chip,
} from "@mui/material";

import { useState } from "react";
import ActionButton from "./ActionButton";
import dayjs from "dayjs";
import global from "../global";

function CustomTable({ headers, rows, handleOpen, actions }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const formatValue = (value) => {
        if (
            typeof value !== "string" ||
            !dayjs(value).isValid() ||
            value.toString().startsWith("Visa") ||
            value.toString().startsWith("MasterCard") ||
            value.toString().startsWith("American Express") ||
            value.toString().startsWith("$")
        ) {
            return value; // Return the original value if it's not a valid date or starts with "ORD"
        } else {
            return dayjs(value).format(global.datetimeFormat); // Format the date as desired
        }
    };

    const renderCell = (key, value) => {
        if (key === "rentalDates") {
            return `${formatValue(value.start)} - ${formatValue(value.end)}`;
        } else {
            return formatValue(value);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const renderTableBody = () => {
        if (rows.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={headers.length} align="center">
                        No data available
                    </TableCell>
                </TableRow>
            );
        }

        return rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
                const cells = Object.keys(row)
                    .filter((key) => key !== "mapCenter") // Exclude "mapCenter" key
                    .map((key) => (
                        <TableCell key={key}>
                            {key === "orderStatus" ? (
                                <Chip
                                    label={row[key]}
                                    sx={{
                                        borderRadius: "16px", // Adjust the radius as needed
                                        backgroundColor:
                                            row[key] === "COMPLETED"
                                                ? "lightgreen"
                                                : row[key] === "CANCELLED"
                                                ? "lightgrey"
                                                : "orange", // Change the background color based on the value
                                        color: "#000", // Change the text color
                                    }}
                                />
                            ) : key === "faultReportStatus" ? (
                                <Chip
                                    label={row[key]}
                                    sx={{
                                        borderRadius: "16px", // Adjust the radius as needed
                                        backgroundColor:
                                            row[key] === "OPEN"
                                                ? "#eacdff"
                                                : row[key] === "IN PROGRESS"
                                                ? "orange"
                                                : "lightgreen", // Change the background color based on the value
                                        color: "#000", // Change the text color
                                    }}
                                />
                            ) : (
                                renderCell(key, row[key])
                            )}
                        </TableCell>
                    ));

                return (
                    <TableRow key={row.id}>
                        {cells}
                        {actions && actions.length > 0 && (
                            <TableCell>
                                <ActionButton
                                    key={row.id}
                                    id={row.id}
                                    actions={actions}
                                />
                            </TableCell>
                        )}
                    </TableRow>
                );
            });
    };
    return (
        <Box sx={{ mt: 2 }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="generic table">
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell key={header}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>{renderTableBody()}</TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                style={{ marginTop: "1rem" }} // Adjust the margin as needed
            />
        </Box>
    );
}

export default CustomTable;
