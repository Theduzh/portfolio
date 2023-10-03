import { Menu, MenuItem, Button } from "@mui/material";
import React, { useState } from "react";

function AccountMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    return (
        <>
            <Button onClick={handleClick}>Hello World</Button>
            <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "account-button",
                }}
            >
                <MenuItem onClick={handleClose}>Resources</MenuItem>
                <MenuItem onClick={handleClose}>About</MenuItem>
            </Menu>
        </>
    );
}

export default AccountMenu;
