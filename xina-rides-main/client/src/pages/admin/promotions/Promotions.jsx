import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Input,
    IconButton,
    Button,
    Container,
    Dialog,
    DialogContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { NavContainer, Navbar, SideNav } from "../../../components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Search, Clear, Edit, Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import http from "../../../http.js";
import Moment from "moment";
import { parseISO } from "date-fns";
import moment from "moment";

function AdminPromotions() {
    const [promotion_list, setPromotionList] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
        const today = new Date();

        const columns = [
            {
                field: "promotion_name",
                headerName: "Promotion Name",
                width: 200,
            },
            {
                field: "promotion_code",
                headerName: "Promotion Code",
                width: 150,
            },
            {
                field: "start_date",
                headerName: "Start Date",
                width: 150,
                valueGetter: (params) =>
                    Moment(params.row.start_date).format("YYYY-MM-DD"),
            },
            {
                field: "end_date",
                headerName: "End Date",
                width: 150,
                valueGetter: (params) =>
                    Moment(params.row.end_date).format("YYYY-MM-DD"),
            },
            {
                field: "status",
                headerName: "Status",
                width: 150,
                valueGetter: (params) => {
                    const row = params.row;
                    if (row.is_deleted) {
                        return "Deleted";
                    } else if (
                        moment(today).isBefore(
                            parseISO(
                                `${Moment(row.start_date).format(
                                    "YYYY-MM-DD"
                                )}T${row.start_time}`
                            )
                        ) ||
                        moment(today).isAfter(
                            parseISO(
                                `${Moment(row.end_date).format("YYYY-MM-DD")}T${
                                    row.end_time
                                }`
                            )
                        )
                    ) {
                        return "Inactive";
                    } else {
                        return "Active";
                    }
                },
            },
            { field: "total_uses", headerName: "Total Uses", width: 150 },
            {
                field: "discount_amount",
                headerName: "Discount Amount",
                width: 150,
            },
            {
                field: "banner_image",
                headerName: "Banner Image",
                width: 125,
                renderCell: (params) => (
                    <Box
                        sx={{
                            width: "50px",
                            height: "50px",
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            handleImageClick(
                                `${import.meta.env.VITE_FILE_BASE_URL}${
                                    params.row.image_file
                                }`
                            )
                        }
                    >
                        <img
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${
                                params.row.image_file
                            }`}
                            alt="None"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                ),
            },
            {
                field: "card_image",
                headerName: "Card Image",
                width: 125,
                renderCell: (params) => (
                    <Box
                        sx={{
                            width: "50px",
                            height: "50px",
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            handleImageClick(
                                `${import.meta.env.VITE_FILE_BASE_URL}${
                                    params.row.card_image
                                }`
                            )
                        }
                    >
                        <img
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${
                                params.row.card_image
                            }`}
                            alt="None"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                ),
            },
            {
                field: "edit",
                headerName: "Edit",
                width: 70,
                renderCell: (params) =>
                    !params.row.is_deleted ? (
                        <Link to={`/admin/promotions/${params.row.id}/edit`}>
                            <IconButton color="primary" sx={{ padding: "4px" }}>
                                <Edit />
                            </IconButton>
                        </Link>
                    ) : null,
            },
            {
                field: "delete",
                headerName: "Delete",
                width: 70,
                renderCell: (params) => (
                    !params.row.is_deleted ? (
                    <Link to={`/admin/promotions/${params.row.id}/delete`}>
                        <IconButton color="primary" sx={{ padding: "4px" }}>
                            <Delete />
                        </IconButton>
                    </Link> ): null
                ),
            },
        ];

    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getPromotions = () => {
        http.get("/promotion").then((res) => {
            const sortedPromotions = res.data.sort(customSort);
            setPromotionList(sortedPromotions);
        });
    };

    const searchPromotions = () => {
        http.get(`/promotion?search=${search}`).then((res) => {
            setPromotionList(res.data);
        });
    };

    useEffect(() => {
        getPromotions();
        console.log(promotion_list);
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchPromotions();
        }
    };

    const onClickSearch = () => {
        searchPromotions();
    };

    const onClickClear = () => {
        setSearch("");
        searchPromotions();
    };

    const customSort = (a, b) => {
        if (a.is_deleted && !b.is_deleted) {
            return 1;
        }
        if (!a.is_deleted && b.is_deleted) {
            return -1;
        }
        return 0;
    };

    return (
        <NavContainer>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Promotions
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    <Link
                        to="/admin/promotions/add"
                        style={{ textDecoration: "none" }}
                    >
                        <Button variant="outlined" color="secondary">
                            Add Promotion
                        </Button>
                    </Link>
                }
            </Box>

            <DataGrid
                autoHeight
                rows={promotion_list}
                columns={columns}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                }}
            />

            <Dialog open={selectedImage !== null} onClose={handleClose}>
                <DialogContent>
                    <img
                        src={selectedImage}
                        alt="No Image"
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                        }}
                    />
                </DialogContent>
            </Dialog>
        </NavContainer>
    );
}

export default AdminPromotions;
