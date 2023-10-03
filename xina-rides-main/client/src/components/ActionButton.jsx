import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert, Edit, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import http from "../http.js";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

function ActionButton({ id, actions }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [newActions, setNewActions] = useState(actions);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleActionClick = (action) => {
        handleClose();
        action.onClick(id);
    };

    const fetchFaultReport = async (id) => {
        const response = await http.get(`/fault-report/${id}`);
        return response.data;
    };

    // check if the current page is "/admin/fault-report"
    const location = useLocation();

    // fetch fault reports if current page is indeed /admin/fault-report
    useEffect(() => {
        if (location.pathname === "/admin/fault-reports") {
            fetchFaultReport(id).then((faultReport) => {
                const lowerCaseStatus =
                    faultReport.faultReportStatus.toLowerCase();

                if (lowerCaseStatus === "open") {
                    setNewActions(
                        actions.filter(
                            (action) => action.label !== "Mark as open"
                        )
                    );
                } else if (lowerCaseStatus === "in progress") {
                    setNewActions(
                        actions.filter(
                            (action) => action.label !== "Mark as in progress"
                        )
                    );
                } else if (lowerCaseStatus === "resolved") {
                    setNewActions(
                        actions.filter(
                            (action) => action.label !== "Mark as resolved"
                        )
                    );
                }
            });
        }
    }, [id, location.pathname, actions]);
    return (
        <Box>
            <IconButton
                aria-controls="action-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVert />
            </IconButton>
            <Menu
                id="action-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {newActions.map((action) => (
                    <MenuItem
                        key={action.label}
                        onClick={() => handleActionClick(action)}
                        sx={{
                            color: action.label === "Delete" ? "red" : "black",
                        }}
                    >
                        {action.icon && (
                            <Box
                                component="span"
                                sx={{
                                    mr: 1,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {action.icon}
                            </Box>
                        )}
                        {action.label}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}

export default ActionButton;
