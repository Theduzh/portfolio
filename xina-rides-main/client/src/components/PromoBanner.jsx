import React, { useState, useEffect, useRef } from "react";
import http from "../http.js";
import {
    Box
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function PromoBanner() {
    const [image_list, setImageList] = useState([]);
    const sliderRef = useRef(null);
    const scrollInterval = 10000;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 5000,
        appendDots: (dots) => (
            <div
                style={{
                    position: "absolute",
                    bottom: "20px",
                    width: "100%",
                }}
            >
                <ul
                    style={{
                        margin: "0",
                        padding: "0",
                        textAlign: "center",
                    }}
                >
                    {dots}
                </ul>
            </div>
        ),
    };

    useEffect(() => {
        http.get("/promotion").then((res) => {
            const promotions = res.data;
            const promotionsWithImage = promotions.filter(
                (promotion) => promotion.image_file && !promotion.is_deleted
            );

            setImageList(promotionsWithImage);
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
        <Box
            sx={{
                boxShadow: 2,
                height: "75vh",
                borderRadius: 4,
                width: "100%",
            }}
        >
            <Slider
                ref={sliderRef}
                {...settings}
                classes={{
                    root: "classes-state-root",
                    disabled: "disabled",
                }}
            >
                {image_list.map((item, index) => (
                    <div key={index}>
                        <img
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${
                                item.image_file
                            }`}
                            alt={`Image ${index + 1}`}
                            style={{
                                width: "100%",
                                height: "75vh",
                                objectFit: "contain",
                                px: "0px",
                                overflow: "hidden",
                                borderRadius: 4
                            }}
                        />
                    </div>
                ))}
            </Slider>
        </Box>
    );
}

export default PromoBanner;
