import React, { useState, useEffect, useRef, useContext } from "react";
import http from "../../../http.js";
import {
    Box,
    Typography,
    Input,
    IconButton,
    Dialog,
    DialogContent,
    Card,
    Grid,
    CardContent,
    Button,
    TextField,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { Search, Clear } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navbar, PromoBanner } from "../../../components";
import UserContext from "../../../contexts/UserContext.js";
import Moment from "moment";
import { parseISO } from "date-fns";
import moment from "moment";

function Promotions() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [all_promotions, setAllPromotions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState("");
    const sliderRef = useRef(null);
    const scrollInterval = 10000;
    const { user } = useContext(UserContext);
    const [usesDict, setUsesDict] = useState({});

    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        onDelayFunc();
    };

    const searchPromotions = () => {
        http.get(`/promotion?search=${search}`).then((res) => {
            const promotions = res.data;
            var active_promotions = promotions.filter(
                (promotion) => !promotion.is_deleted
            );
            active_promotions = active_promotions.filter(
                (promotions) =>
                    !(
                        moment(new Date()).isBefore(
                            parseISO(
                                `${Moment(promotions.start_date).format(
                                    "YYYY-MM-DD"
                                )}T${promotions.start_time}`
                            )
                        ) ||
                        moment(new Date()).isAfter(
                            parseISO(
                                `${Moment(promotions.end_date).format(
                                    "YYYY-MM-DD"
                                )}T${promotions.end_time}`
                            )
                        )
                    )
            );
            setAllPromotions(active_promotions);
        });
    };

    let onDelayFunc = searchDebounce(searchPromotions, 2000);

    function searchDebounce(fn, d) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, d);
        };
    }

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

    const disabled_button = (promotion) => {
        try {
            http.get(
                `/user_promotion?PromotionId=${promotion.id}&UserId=${user.id}`
            ).then((res) => {
                if (res.data.length > 0) {
                    setUsesDict((prevUsesDict) => ({
                        ...prevUsesDict,
                        [promotion.id]: parseFloat(
                            res.data[0].user_uses
                        ),
                    }));
                } else {
                    setUsesDict((prevUsesDict) => ({
                        ...prevUsesDict,
                        [promotion.id]: 0
                    }));
                }
            });
        } catch (error) {
            setUsesDict((prevUsesDict) => ({
                ...prevUsesDict,
                [promotion.id]: 0
            }));
        }
    };

    const isDisabled = (promotion) => {
        disabled_button(promotion);
        const buttonstate = usesDict[promotion.id];
        return buttonstate;
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleClaimButtonClick = async (promotion) => {
        try {
            const email_req = {
                stripe_account_id: user.stripe_account_id,
                promotion_name: promotion.promotion_name,
                promotion_code: promotion.promotion_code,
                email: user.email,
                discount_amount: promotion.discount_amount,
                total_uses: usesDict[promotion.id],
            };

            http.post("/email_promotion/sendCustomPromotionCode", email_req);

            const user_promotion_req = {
                UserId: user.id,
                PromotionId: promotion.id,
                promotion_code: promotion.promotion_code,
            };

            const existingUserPromotion = await http.get(
                `/user_promotion?PromotionId=${promotion.id}&UserId=${user.id}`
            );

            if (existingUserPromotion.data.length > 0) {
                user_promotion_req.user_uses =
                    existingUserPromotion.data[0].user_uses + 1;
                await http.put("/user_promotion/", user_promotion_req);
            } else {
                user_promotion_req.user_uses = 1;
                await http.post("/user_promotion/", user_promotion_req);
            }
        } catch (error) {
        }
        setDialogOpen(true);
    };

    useEffect(() => {
        http.get("/promotion").then((res) => {
            const promotions = res.data;
            var active_promotions = promotions.filter(
                (promotion) => !promotion.is_deleted
            );

            active_promotions = active_promotions.filter(
                (promotions) =>
                    !(
                        moment(new Date()).isBefore(
                            parseISO(
                                `${Moment(promotions.start_date).format(
                                    "YYYY-MM-DD"
                                )}T${promotions.start_time}`
                            )
                        ) ||
                        moment(new Date()).isAfter( 
                            parseISO(
                                `${Moment(promotions.end_date).format(
                                    "YYYY-MM-DD"
                                )}T${promotions.end_time}`
                            )
                        )
                    )
            );
            setAllPromotions(active_promotions);
        });

        const slider = sliderRef.current;
        let intervalId;

        const startAutoScroll = () => {
            intervalId = setInterval(() => {
                slider.slickNext();
            }, scrollInterval);
        };

        const stopAutoScroll = () => {
            clearInterval(intervalId);
        };

        startAutoScroll();

        return () => {
            stopAutoScroll();
        };
    }, []);

    return (
        <>
            <Navbar />
            <Box sx={{ alignItems: "center", width: "100%" }}>
                <PromoBanner />
                <Typography variant="h2" sx={{ flexGrow: 1, px: "20px" }}>
                    Promotions
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        px: "20px",
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
                </Box>
                <Grid
                    container
                    spacing={2}
                    sx={{ px: "20px", minHeight: "100vh" }}
                >
                    {all_promotions.map((promotion) => (
                        <Grid
                            key={promotion.id}
                            item
                            xs={12}
                            md={6}
                            lg={4}
                            sx={{
                                backgroundColor: "CAC4D0",
                            }}
                        >
                            <Card
                                sx={{
                                    backgroundColor: "CAC4D0",
                                }}
                            >
                                {
                                    <Box
                                        sx={{
                                            width: "100%",
                                            height: "40vh",
                                            background: `url(${
                                                import.meta.env
                                                    .VITE_FILE_BASE_URL
                                            }${promotion.card_image})`,
                                            backgroundSize: "contain",
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                            px: 0,
                                        }}
                                        onClick={() =>
                                            handleImageClick(
                                                `${
                                                    import.meta.env
                                                        .VITE_FILE_BASE_URL
                                                }${promotion.card_image}`
                                            )
                                        }
                                    />
                                }
                                <CardContent>
                                    <Box sx={{ display: "flex", mb: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{ flexGrow: 1 }}
                                        >
                                            {promotion.promotion_name}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                                        {promotion.promotion_description}
                                    </Typography>
                                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                                        This Promotion Code can be used up to{" "}
                                        {promotion.total_uses} time(s)
                                    </Typography>
                                    {
                                        <Button
                                            onClick={() =>
                                                handleClaimButtonClick(
                                                    promotion
                                                )
                                            }
                                            sx={{ mt: 1 }}
                                            variant="outlined"
                                            disabled={
                                                isDisabled(promotion) >=
                                                promotion.total_uses
                                            }
                                        >
                                            Claim Promotion
                                        </Button>
                                    }
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                    <DialogContent>
                        Promotion Code has been sent to your email! (You can
                        only claim this once)
                    </DialogContent>
                </Dialog>
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
            </Box>
        </>
    );
}

export default Promotions;
