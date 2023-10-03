import React, { useEffect, useState } from "react";
import { NavContainer, Navbar, SideNav } from "../../../components";
import { Link } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Avatar,
    Button,
    IconButton,
    Input,
    TextField,
    Menu,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Stack,
    Pagination,
} from "@mui/material";
import AspectRatio from "@mui/joy/AspectRatio/AspectRatio";
import { deepPurple } from "@mui/material/colors";
import { AccessTime, Celebration, Search } from "@mui/icons-material";
import Ticket from "@mui/icons-material/ConfirmationNumberOutlined";
import Cake from "@mui/icons-material/CakeOutlined";
import Wallet from "@mui/icons-material/AccountBalanceWalletOutlined";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import http from "../../../http";
import dayjs from "dayjs";
import global from "../../../global";

function Rewards() {
    const [rewardsList, setRewardsList] = useState([]);
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [view, setView] = useState("list");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [anchorMenuEl, setAnchorMenuEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [RewardID, setRewardID] = useState(1);
    const [slcRow, setSlcRow] = useState(null);
    const open = Boolean(anchorEl);
    const openMenu = Boolean(anchorMenuEl);

    function deleteRewards() {
        http.delete(`/rewards/${RewardID}`)
            .then((res) => {
                console.log(res.data);
            })
            .then(getRewards());
    }

    function handleRewardID(id) {
        console.log(id);
        setRewardID(id);
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(event - 1);
    };
    
    
    const handleChangeRowsPerPage = (event, newPage) => {
        setRowsPerPage(event.target.value);
        setPage(0)
    };



    const handleView = (event, newView) => {
        if (newView != null) {
            setView(newView);
        }
    };

    const handleMoreMenuClick = (event) => {
        setAnchorMenuEl(event.currentTarget);
    };

    const handleMoreMenuClose = () => {
        setAnchorMenuEl(null);
    };

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        if (index == 0) {
            http.get("/rewards").then((res) => {
                setRewardsList(res.data);
            });
        } else {
            http.get(`/rewards?search=${options[index]}`).then((res) => {
                setRewardsList(res.data);
            });
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const options = ["Last updated", "Event", "Holiday"];

    function logo(category) {
        if (category === "Event") {
            return <EventAvailableIcon />;
        } else if (category === "Holiday") {
            return <Celebration />;
        }
    }

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getRewards = () => {
        http.get("/rewards").then((res) => {
            setRewardsList(res.data);
        });
    };

    const searchRewards = () => {
        http.get(`/rewards?search=${search}`).then((res) => {
            setRewardsList(res.data);
        });
    };

    useEffect(() => {
        getRewards();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchRewards();
        }
    };

    const onClickSearch = () => {
        searchRewards();
    };

    const onClickClear = () => {
        setSearch("");
        getRewards();
    };

    //debouncing wrapper
    let onDelayFunc = searchDebounce(searchRewards(), 2000);

    function searchDebounce(fn, d) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, d);
        };
    }

    function renderMoreMenu() {
        return (
            <Menu
                id="more-menu"
                MenuListProps={{
                    "aria-labelledby": "long-button",
                }}
                anchorEl={anchorMenuEl}
                open={openMenu}
                onClose={handleMoreMenuClose}
            >
                <Link
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                    }}
                    to={`/admin/rewards/${RewardID}/edit`}
                >
                    <MenuItem
                        key="edit"
                        onClick={handleMoreMenuClose}
                        sx={{
                            gap: 2,
                        }}
                    >
                        <EditOutlinedIcon fontSize="small" />
                        Edit
                    </MenuItem>
                </Link>
                <MenuItem
                    key="delete"
                    onClick={function (event) {
                        handleMoreMenuClose();
                        handleDialogOpen();
                    }}
                    sx={{
                        width: 150,
                        color: "red",
                        gap: 2,
                    }}
                >
                    <DeleteOutlinedIcon fontSize="small" />
                    Delete
                </MenuItem>
            </Menu>
        );
    }

    function renderNone() {
        if (rewardsList.length === 0) {
            return (
                <Box sx={{ height: "60vh" }}>
                    <Typography variant="h4" color="initial" mt={3}>
                        No rewards currently
                    </Typography>
                </Box>
            );
        }
    }

    return (
        <NavContainer>
            <Typography variant="h4">Rewards</Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Box mt={2}>
                    <TextField
                        sx={{
                            width: 300,
                            bgcolor: deepPurple[50],
                            borderRadius: 1,
                        }}
                        label="Search rewards"
                        inputProps={{ type: "search" }}
                        value={search}
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown}
                        onTouchCancel={onClickClear}
                    ></TextField>
                    <IconButton
                        color="primary"
                        sx={{ mt: 1, ml: 1 }}
                        onClick={onClickSearch}
                    >
                        <Search />
                    </IconButton>
                </Box>
                <Box mt={1}>
                    <Link
                        to="/admin/rewards/add"
                        sx={{
                            color: deepPurple[300],
                            textDecoration: "none",
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="secondary"
                            // sx={{
                            //     borderColor: deepPurple[300],
                            //     color: deepPurple[300],
                            // }}
                        >
                            Create rewards
                        </Button>
                    </Link>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    gap: 3,
                    alignItems: "center",
                }}
            >
                <Button
                    id="sort-button"
                    aria-controls="menu"
                    aria-haspopup="listbox"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClickListItem}
                    variant="outlined"
                    color="inherit"
                    endIcon={<ArrowDropDownOutlinedIcon fontSize="large" />}
                    sx={{ borderRadius: 1, my: 2, borderColor: "silver" }}
                >
                    Sort by: {options[selectedIndex]}
                </Button>
                <Menu
                    id="menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        "aria-labelledby": "sort-button",
                        role: "listbox",
                    }}
                >
                    {options.map((option, index) => {
                        return (
                            <MenuItem
                                key={option}
                                selected={index === selectedIndex}
                                onClick={(event) =>
                                    handleMenuClick(event, index)
                                }
                                sx={{ minWidth: "150px" }}
                            >
                                {option}
                            </MenuItem>
                        );
                    })}
                </Menu>
                <ToggleButtonGroup
                    size="small"
                    value={view}
                    exclusive
                    onChange={handleView}
                    aria-label="view rewards"
                    sx={{ height: 40 }}
                >
                    <ToggleButton value="list">
                        <ViewListOutlinedIcon />
                    </ToggleButton>
                    <ToggleButton value="cards">
                        <ViewModuleOutlinedIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            {renderNone()}
            {view == "cards" && (
                <Grid container spacing={4} width={"83w"} mt={0}>
                    {rewardsList
                        .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                        )
                        .map((rewards) => {
                            return (
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    lg={4}
                                    key={rewards.id}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"flex-start"}
                                >
                                    <Card
                                        sx={{
                                            width: 330,
                                            bgcolor: deepPurple[50],
                                        }}
                                    >
                                        <CardHeader
                                            avatar={
                                                <Avatar
                                                    sx={{
                                                        bgcolor:
                                                            deepPurple[300],
                                                    }}
                                                    aria-label="recipe"
                                                >
                                                    {logo(rewards.category)}
                                                </Avatar>
                                            }
                                            title={rewards.header}
                                            subheader={rewards.category}
                                        />
                                        <CardMedia
                                            sx={{ height: 200 }}
                                            component="img"
                                            image={
                                                rewards.imageFile
                                                    ? `http://localhost:3001/uploads/${rewards.imageFile}`
                                                    : "../uploads/card.png" //default pic
                                            }
                                            alt={rewards.haeder}
                                        />
                                        <CardContent>
                                            <Typography
                                                variant="body1"
                                                color="text.primary"
                                            >
                                                {rewards.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ my: 1 }}
                                            >
                                                {rewards.titleSubhead}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ height: 50 }}
                                            >
                                                {rewards.description}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    flexDirection: "row",
                                                    marginTop: "1vh",
                                                }}
                                            >
                                                <Link
                                                    to={`/admin/rewards/${rewards.id}/edit`}
                                                >
                                                    <Button
                                                        style={{
                                                            marginRight: "8px",
                                                        }}
                                                        color="primary"
                                                        variant="outlined"
                                                    >
                                                        Update
                                                    </Button>
                                                </Link>
                                                <Button
                                                    color="error"
                                                    variant="contained"
                                                    onClick={function (event) {
                                                        handleDialogOpen();
                                                        handleRewardID(
                                                            rewards.id
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                </Grid>
            )}
            {view == "list" && rewardsList.length != 0 && (
                <Box mt={2}>
                    <TableContainer
                        sx={{
                            borderRadius: 1,
                            boxShadow: 1,
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">S/N</TableCell>
                                    <TableCell align="center">
                                        Rewards Header
                                    </TableCell>
                                    <TableCell align="center">
                                        Category
                                    </TableCell>
                                    <TableCell align="center">Title</TableCell>
                                    <TableCell align="center">
                                        Last Updated
                                    </TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rewardsList
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((rewards, i) => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={rewards.id}
                                            >
                                                <TableCell align="center">
                                                    {i + 1}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {rewards.header}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {rewards.category}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {rewards.title}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {dayjs(
                                                        rewards.updatedAt
                                                    ).format(
                                                        global.datetimeFormat
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        aria-label="more"
                                                        id={"long-button"}
                                                        aria-controls={
                                                            open
                                                                ? "more-menu"
                                                                : undefined
                                                        }
                                                        aria-expanded={
                                                            open
                                                                ? "true"
                                                                : undefined
                                                        }
                                                        aria-haspopup="true"
                                                        onClick={function (
                                                            event
                                                        ) {
                                                            handleMoreMenuClick(
                                                                event
                                                            );
                                                            handleRewardID(
                                                                rewards.id
                                                            );
                                                        }}
                                                    >
                                                        {renderMoreMenu()}
                                                        <MoreVertOutlinedIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            <Dialog open={dialogOpen} onClose={handleClose}>
                <DialogTitle>Delete Rewards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this reward?
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
                        color="error"
                        onClick={function (event) {
                            deleteRewards();
                            handleClose();
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {view === "list" ? (
                
                <TablePagination
                    rowsPerPageOptions={[3, 6, 9]}
                    component="div"
                    count={Math.ceil(rewardsList.length/rowsPerPage)}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{ marginTop: "1rem" }} // Adjust the margin as needed
                />
            ) : ""}
            {rewardsList.length > rowsPerPage && view === "cards" && (
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        mt: 4,
                    }}
                >
                    <Stack spacing={2}>
                        <Pagination
                            count={
                                parseInt(rewardsList.length / rowsPerPage) + 1
                            }
                            onChange={(e, value) => handleChangePage(value)}
                        />
                    </Stack>
                </Box>
            )}
        </NavContainer>
    );
}

export default Rewards;
