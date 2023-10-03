import { useState, useEffect } from "react";
import {
    CustomTable,
    SideNav,
    MapWrapper,
    Navbar,
    NavContainer,
} from "../../../components";
import {
    Box,
    Typography,
    Input,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { Marker } from "react-leaflet";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import http from "../../../http";
import Moment from "moment";
import { Search, Clear, Edit, Delete } from "@mui/icons-material";
import MapIcon from "@mui/icons-material/Map";
import bikeIcon from "../../../components/maps/icons/bikeIcon";

const headers = [
    "Bike ID",
    "Name",
    "In Use?",
    "Price per Hour",
    "Condition",
    "Location",
    "Last Updated At",
    "Created At",
    "",
];

function Bikes() {
    const [bikeList, setBikeList] = useState([]);
    const navigate = useNavigate();

    const getBikes = () => {
        http.get("/bike").then((res) => {
            setBikeList(res.data);
        });
    };

    const searchBikes = () => {
        http.get(`/bike?search=${search}`).then((res) => {
            setBikeList(res.data);
        });
    };

    useEffect(() => {
        getBikes();
    }, []);

    const [search, setSearch] = useState("");

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchBikes();
        }
    };

    const onClickSearch = () => {
        searchBikes();
    };

    const onClickClear = () => {
        setSearch("");
        searchBikes();
    };

    const [openDeleteId, setDeleteId] = useState("");

    const handleDeleteOpen = (id) => {
        setDeleteId(id);
    };

    const handleDeleteClose = () => {
        setDeleteId("");
    };

    const [openMap, setMap] = useState("");

    const handleMapOpen = (id) => {
        setMap(rows.filter((row) => row.id == id)[0]);
    };

    const handleMapClose = () => {
        setMap("");
    };

    const handleEditBike = (id) => {
        navigate(`/admin/bikes/${id}/edit`);
    };

    const [rows, setRows] = useState([]);

    useEffect(() => {
        document.title = "Show All Bikes | XinaRides";
        setRows(
            bikeList.map((row) => ({
                id: row.bikeId,
                name: row.name,
                currentlyInUse: row.currentlyInUse ? "In use" : "Not in use",
                rentalPrice: "$" + String(row.rentalPrice),
                condition: !row.condition ? "" : row.condition,
                loc:
                    !(row.bikeLat || row.bikeLat == 0) ||
                    !(row.bikeLon || row.bikeLon == 0)
                        ? "Not set"
                        : row.bikeLat + ", " + row.bikeLon,

                updatedAt: Moment(row.updatedAt).format(
                    "YYYY-MM-DD hh:mm:ss A"
                ),
                createdAt: Moment(row.createdAt).format(
                    "YYYY-MM-DD hh:mm:ss A"
                ),
                mapCenter:
                    !(row.bikeLat || row.bikeLat == 0) ||
                    !(row.bikeLon || row.bikeLon == 0)
                        ? null
                        : [row.bikeLat, row.bikeLon],
            }))
        );
    }, [bikeList]);

    const actions = [
        {
            label: "Edit",
            icon: <Edit />,
            onClick: handleEditBike,
        },
        {
            label: "Delete",
            icon: <Delete />,
            onClick: handleDeleteOpen,
        },
        {
            label: "Show on Map",
            icon: <MapIcon />,
            onClick: handleMapOpen,
        },
    ];

    // let columns = [
    //     {
    //         field: "id",
    //         headerName: "Bike ID",
    //         width: 80,
    //         editable: false,
    //     },
    //     {
    //         field: "name",
    //         headerName: "Name",
    //         width: 300,
    //         editable: false,
    //     },
    //     {
    //         field: "currentlyInUse",
    //         headerName: "In Use?",
    //         width: 150,
    //         editable: false,
    //     },
    //     {
    //         field: "rentalPrice",
    //         headerName: "Price per Hour",
    //         width: 150,
    //         editable: false,
    //     },
    //     {
    //         field: "condition",
    //         headerName: "Condition",
    //         width: 150,
    //         editable: false,
    //     },
    //     {
    //         field: "loc",
    //         headerName: "Location",
    //         width: 150,
    //         editable: false,
    //     },
    //     {
    //         field: "updatedAt",
    //         headerName: "Last Updated At",
    //         width: 150,
    //         editable: false,
    //     },
    //     {
    //         field: "createdAt",
    //         headerName: "Created At",
    //         width: 150,
    //         editable: false,
    //     },
    //     {
    //         field: "edit",
    //         headerName: "",
    //         width: 80,
    //         sortable: false,
    //         renderCell: (params) => {
    //             return (
    //                 <Link to={`/admin/bikes/${params.id}/edit`}>
    //                     <IconButton color="primary" sx={{ padding: "4px" }}>
    //                         <Edit />
    //                     </IconButton>
    //                 </Link>
    //             );
    //         },
    //     },
    //     {
    //         field: "delete",
    //         headerName: "",
    //         width: 80,
    //         sortable: false,
    //         editable: false,
    //         renderCell: (params) => {
    //             return (
    //                 <IconButton
    //                     color="error"
    //                     sx={{ padding: "4px" }}
    //                     onClick={() => handleDeleteOpen(params.id)}
    //                 >
    //                     <Delete />
    //                 </IconButton>
    //             );
    //         },
    //     },
    //     {
    //         field: "showOnMap",
    //         headerName: "",
    //         width: 80,
    //         sortable: false,
    //         editable: false,
    //         renderCell: (params) => {
    //             if (params.row.mapCenter) {
    //                 return (
    //                     <IconButton
    //                         sx={{ padding: "4px" }}
    //                         onClick={() =>
    //                             handleMapOpen({
    //                                 latLng: params.row.mapCenter,
    //                                 message: `Bike ${params.id}`,
    //                             })
    //                         }
    //                     >
    //                         <MapIcon />
    //                     </IconButton>
    //                 );
    //             }
    //         },
    //     },
    // ];

    return (
        <NavContainer>
            <Box sx={{ overflowY: "hidden" }}>
                <Box sx={{ display: "flex" }}>
                    <Box
                        sx={{
                            p: 1,
                            width: "100%",
                            height: "calc(100vh - 200px)",
                            overflowY: "auto",
                        }}
                    >
                        <Typography variant="h4" fontSize={36}>
                            Bikes
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                                mx: 2,
                            }}
                        >
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
                                    to="/admin/bikes/add"
                                    style={{ textDecoration: "none" }}
                                >
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                    >
                                        Add Bikes
                                    </Button>
                                </Link>
                            }
                        </Box>
                        <CustomTable
                            headers={headers}
                            rows={rows}
                            actions={actions}
                            handleOpen={handleDeleteOpen}
                        />
                    </Box>

                    {/* <Box sx={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                    />
                </Box> */}

                    <Dialog
                        open={Boolean(openDeleteId)}
                        onClose={handleDeleteClose}
                    >
                        <DialogTitle>Delete Bike</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this bike?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={handleDeleteClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    http.delete(`/bike/${openDeleteId}`).then(
                                        (res) => {
                                            console.log(res.data);
                                            onClickSearch();
                                            handleDeleteClose();
                                        }
                                    );
                                }}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={Boolean(openMap)} onClose={handleMapClose}>
                        <DialogTitle>Map</DialogTitle>
                        {
                            /* This is weird because React-Leaflet crashes when MUI handles the popup close.
                            So... we make sure that we are not rendering the map before closing the popup. */
                            Boolean(openMap) ? (
                                <MapWrapper
                                    center={openMap.mapCenter}
                                    zoom={15}
                                    style={{ height: "50vh", width: "50vh" }}
                                >
                                    <Marker
                                        position={openMap.mapCenter}
                                        icon={bikeIcon}
                                    />
                                </MapWrapper>
                            ) : (
                                ""
                            )
                        }
                        <DialogActions>
                            <Button
                                variant="contained"
                                color="inherit"
                                onClick={() => handleMapClose()}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </NavContainer>
    );
}

export default Bikes;
