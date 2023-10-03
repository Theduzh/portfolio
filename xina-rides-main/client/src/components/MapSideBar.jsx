import React, { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import { Box, Typography, TextField, Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { FixedSizeList } from "react-window";

function MapSideBar({ trafficIncidents = [], trainServiceAlerts = [] }) {
    const [searchText, setSearchText] = useState("");
    const [displayType, setDisplayType] = useState("traffic");
    const [searchResults, setSearchResults] = useState(trafficIncidents);

    const trafficFuse = useMemo(
        () =>
            new Fuse(trafficIncidents, {
                keys: ["Type", "Message"],
                threshold: 0.5,
            }),
        []
    );

    const mrtFuse = useMemo(
        () =>
            new Fuse(trainServiceAlerts, {
                keys: ["Content"],
                threshold: 0.5,
            }),
        []
    );

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchText(value);
    };

    const handleTabChange = (event, newDisplayType) => {
        setDisplayType(newDisplayType);
        setSearchText(""); // Clear the search text when switching tabs
    };

    useEffect(() => {
        if (searchText === "") {
            setSearchResults(
                displayType === "traffic"
                    ? trafficIncidents
                    : trainServiceAlerts
            );
        } else {
            const fuse = displayType === "traffic" ? trafficFuse : mrtFuse;
            const results = fuse.search(searchText);
            setSearchResults(results.map((result) => result.item));
        }
    }, [searchText, displayType]);

    // const searchResults = useMemo(() => {
    //     if (searchText === "") {
    //         return displayType === "traffic"
    //             ? trafficIncidents
    //             : trainServiceAlerts;
    //     } else {
    //         const fuse = displayType === "traffic" ? trafficFuse : mrtFuse;
    //         const results = fuse.search(searchText);
    //         return results.map((result) => result.item);
    //     }
    // }, [searchText, displayType]);

    // const Row = ({ index, style }) => (
    //     <Box
    //         style={style}
    //         key={index}
    //         sx={{
    //             py: 1,
    //             px: 2,
    //             backgroundColor: "#EADDFF",
    //             borderRadius: 2,
    //             cursor: "pointer",
    //         }}
    //     >
    //         <Typography variant="p" fontSize={12}>
    //             {searchResults[index].Message}
    //         </Typography>
    //     </Box>
    // );

    return (
        <Box
            sx={{
                pl: 2,
                width: "450px",
            }}
        >
            <TabContext value={displayType}>
                <Tabs
                    value={displayType}
                    onChange={handleTabChange}
                    sx={{ mb: 2 }}
                >
                    <Tab value="traffic" label="Traffic Incidents" />
                    <Tab value="mrt" label="MRT Service Alerts" />
                </Tabs>
                {/* <TextField
                    label="Search"
                    variant="outlined"
                    value={searchText}
                    onChange={handleSearchChange}
                    sx={{ width: "95%" }}
                /> */}
                <Box
                    sx={{
                        height: "calc(100vh - 200px)",
                        overflow: "auto",
                        maxHeight: "800px",
                        spacing: "2px",
                    }}
                >
                    <TabPanel value="traffic">
                        {trafficIncidents.map((result, index) => {
                            return (
                                <Box
                                    sx={{
                                        py: 1,
                                        px: 2,
                                        backgroundColor: "#EADDFF",
                                        borderRadius: 2,
                                    }}
                                    key={index}
                                >
                                    <Typography variant={"p"} fontSize={16}>
                                        {displayType === "traffic"
                                            ? result.Message
                                            : result.Content}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </TabPanel>
                    <TabPanel value="mrt">
                        {trainServiceAlerts.map((result, index) => {
                            return (
                                <Box
                                    sx={{
                                        py: 1,
                                        px: 2,
                                        backgroundColor: "#EADDFF",
                                        borderRadius: 2,
                                    }}
                                    key={index}
                                >
                                    <Typography variant={"p"} fontSize={16}>
                                        {displayType === "traffic"
                                            ? result.Message
                                            : result.Content}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </TabPanel>
                    {/* <FixedSizeList
                    height={searchResults.length * 32}
                    width="100%"
                    itemSize={32}
                    itemCount={searchResults.length}
                    style={{ overflow: "hidden" }}
                >
                    {Row}
                </FixedSizeList> */}
                </Box>
            </TabContext>
        </Box>
    );
}

export default MapSideBar;
