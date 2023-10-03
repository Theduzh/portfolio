import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavContainer, CustomTable } from "../../../components";
import http from "../../../http.js";

const headers = ["Rewards ID", "Title", "User ID", "Name", "Date", "XCredits"];

function RedemptionHistory() {
    const [data, setData] = useState([]);
    const [RedeemList, setRedeemList] = useState([]);
    const [RewardsList, setRewardsList] = useState([]);
    const [UserList, setUserList] = useState([]);
    const [rows, setRows] = useState([]);

    const getRedeem = () => {
        http.get("/userrewards").then((res) => {
            setRedeemList(res.data);
        });
    };

    const getRewards = () => {
        http.get("/rewards").then((res) => {
            setRewardsList(res.data);
        });
    };

    const getUsers = () => {
        http.get("/user/accounts").then((res) => {
            setUserList(res.data);
        });
    };

    const setTableData = () => {
        http.get("/userrewards/fulldetails").then((res) => {
            console.log(res.data)
        })
        // for (let i = 0; i < RedeemList.length; i++){
        //     RedeemList[i].RewardId 
        // }
    };

    useEffect(() => {
        getRedeem();
        getRewards();
        getUsers();
        setTableData()
    }, []);

    return (
        <NavContainer>
            <Typography variant="h4" fontSize={36} sx={{ mb: 3 }}>
                Redemption History
            </Typography>
        </NavContainer>
    );
}

export default RedemptionHistory;
