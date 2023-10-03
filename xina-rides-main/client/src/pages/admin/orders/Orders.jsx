import {
    FilterCard,
    CustomTable,
    SideNav,
    Navbar,
    NavContainer,
} from "../../../components";
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TableCell,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import http from "../../../http.js";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router";

const headers = [
    "Order ID",
    "Rental Dates",
    "Customer",
    "Bike",
    "Order Total",
    "Order Status",
    "Payment Status",
    "Action",
];

function Orders() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [rows, setRows] = useState([]);
    const [currentId, setCurrentId] = useState(null);

    const [filterValues, setFilterValues] = useState({
        rentalStartDate: "",
        rentalEndDate: "",
        orderStatus: "All",
        orderTotalMin: "",
        orderTotalMax: "",
    });

    async function fetchUserData(userId) {
        try {
            const userResponse = await http.get(`/user/getUser/${userId}`);
            return (
                userResponse.data.firstName + " " + userResponse.data.lastName
            ); // Assuming the user object has a property called 'name'
        } catch (error) {
            console.error(
                `Error fetching user data for user ID ${userId}: ${error.message}`
            );
            return null;
        }
    }

    const fetchOrders = async () => {
        try {
            const params = {
                search: filterValues.orderStatus, // Using orderStatus for the search query, but you can customize this based on your API
                rentalStartDate: filterValues.rentalStartDate,
                rentalEndDate: filterValues.rentalEndDate,
                orderTotalMin: filterValues.orderTotalMin,
                orderTotalMax: filterValues.orderTotalMax,
            };

            const response = await http.get("/order", { params });
            const orders = response.data;

            for (const order of orders) {
                const customerName = await fetchUserData(order.userId);
                order.customerName = customerName; // Add the 'userName' property to the order object
            }
            setData(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("An error occurred while fetching orders.", "error");
        }
    };

    const [open, setOpen] = useState(false);

    const handleOpen = (id) => {
        setCurrentId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEditOrder = (id) => {
        navigate(`/admin/orders/${id}/edit`);
    };

    const deleteOrder = (id) => {
        http.delete(`/order/${id}`).then((res) => {
            toast.success("Order deleted successfully!", "success");
            handleClose();
            fetchOrders();
        });
    };

    const actions = [
        {
            label: "Edit",
            icon: <Edit />,
            onClick: handleEditOrder,
        },
        {
            label: "Delete",
            icon: <Delete />,
            onClick: handleOpen,
        },
    ];
    useEffect(() => {
        fetchOrders();
    }, [filterValues]);

    useEffect(() => {
        setRows(
            data.map((result) => ({
                id: result.orderId,
                rentalDates: {
                    start: result.rentalStartDate,
                    end: result.rentalEndDate,
                },
                user: result.customerName,
                bike: result.bikeId,
                orderTotal: result.orderTotal,
                orderStatus: result.orderStatus,
                orderPaymentStatus: result.orderPaymentStatus,
            }))
        );
    }, [data]);

    return (
        <NavContainer>
            <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                Orders
            </Typography>
            <Typography
                variant="p"
                fontSize={16}
                fontWeight={"medium"}
                sx={{ color: "#79747E" }}
            >
                All Orders
            </Typography>
            <FilterCard
                filterValues={filterValues}
                setFilterValues={setFilterValues}
                data={data}
                fetchFunction={fetchOrders}
            />
            <CustomTable
                headers={headers}
                rows={rows}
                actions={actions}
                handleOpen={handleOpen}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this order?
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
                        onClick={() => deleteOrder(currentId)}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </NavContainer>
    );
}

export default Orders;
