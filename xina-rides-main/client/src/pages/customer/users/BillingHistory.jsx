import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomTable, FilterCard, NavContainer } from "../../../components";
import http from "../../../http.js";

const headers = ["Order ID", "Date", "Description", "Amount", "Payment Method"];

function BillingHistory() {
    const [data, setData] = useState([]);
    const [rows, setRows] = useState([]);
    const [filterValues, setFilterValues] = useState({
        rentalEndDate: "",
        rentalStartDate: "",
        orderTotalMin: "",
        orderTotalMax: "",
    });

    const fetchData = async () => {
        const ordersResponse = await http.get("/order/my-orders");
        const transactionsResponse = await http.get("/user/walletTransactions");
        const completedOrders = ordersResponse.data.filter(
            (result) => result.orderStatus === "COMPLETED"
        );
        const orderData = completedOrders.map((result) => ({
            id: result.orderId,
            date: result.rentalEndDate,
            description: "Rental",
            amount: result.orderTotal,
            paymentMethod: result.orderPaymentMethod,
        }));

        const transactionData = transactionsResponse.data.map((result) => ({
            id: result.orderID,
            date: result.createdAt,
            description: result.description,
            amount: result.amount,
            paymentMethod: result.paymentMethod,
        }));

        const allData = orderData.concat(transactionData);
        // or const allData = [...orderData, ...transactionData];

        setData(allData);
        console.log(allData)
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // use filter values to filter data
        const filteredData = data.filter((result) => {
            if (
                filterValues.rentalStartDate &&
                new Date(result.date) <
                    new Date(filterValues.rentalStartDate + "T00:00:00.000Z")
            ) {
                return false;
            }

            if (
                filterValues.rentalEndDate &&
                new Date(result.date) >
                    new Date(filterValues.rentalEndDate + "T00:00:00.000Z")
            ) {
                return false;
            }

            if (
                filterValues.orderTotalMin &&
                result.amount < filterValues.orderTotalMin
            ) {
                return false;
            }

            if (
                filterValues.orderTotalMax &&
                result.amount > filterValues.orderTotalMax
            ) {
                return false;
            }

            return true;
        });

        setRows(
            filteredData.map((result) => ({
                id: result.orderId ? result.orderId : result.id,
                date: result.rentalEndDate ? result.rentalEndDate : result.date,
                description: result.description ? result.description : "Rental",
                amount: result.orderTotal
                    ? `$${result.orderTotal}`
                    : `$${result.amount}`,
                paymentMethod:
                    result.orderPaymentMethod || result.paymentMethod,
            }))
        );
    }, [filterValues]);

    useEffect(() => {
        setRows(
            data.map((result) => ({
                id: result.orderId ? result.orderId : result.id,
                date: result.rentalEndDate ? result.rentalEndDate : result.date,
                description: result.description ? result.description : "Rental",
                amount: result.orderTotal
                    ? `$${result.orderTotal}`
                    : `$${result.amount}`,
                paymentMethod:
                    result.orderPaymentMethod || result.paymentMethod,
            }))
        );
    }, [data]);
    return (
        <NavContainer>
            <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                Billing History
            </Typography>
            <FilterCard
                filterValues={filterValues}
                setFilterValues={setFilterValues}
                data={data}
                fetchFunction={fetchData}
            />
            <CustomTable headers={headers} rows={rows} />
        </NavContainer>
    );
}

export default BillingHistory;
