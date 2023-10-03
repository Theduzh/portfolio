import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { encode, decode } from "../../utils/specialID";
import GeolocateControl from "../GeolocateControl";

import stopImagePath from "../../assets/stop.png";

import busStops from "../../busStops.json";

import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
    "pk.eyJ1IjoiamFzZmVydG9oIiwiYSI6ImNsazBzanVlOTAwYnIzam15cXoxdW9xamkifQ.LTdBxxsXQwBRmIVmg7P3zg";

const BREAKPOINT = () => window.innerWidth > 640;
const supportsHover =
    window.matchMedia && matchMedia("(any-hover: hover)").matches;
const supportsTouch =
    (window.matchMedia && matchMedia("(any-pointer: coarse)").matches) ||
    "ontouchstart" in window ||
    navigator.MaxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
let map;
const lowerLat = 1.2,
    upperLat = 1.48,
    lowerLong = 103.59,
    upperLong = 104.05;
const $tooltip = document.getElementById("tooltip");
const $map = document.getElementById("map");

function showStopTooltip(data) {
    $tooltip.innerHTML = `<span class="stop-tag">${data.number}</span> ${data.name}`;
    $tooltip.classList.add("show");
    const { x, y: top } = data;
    const left = Math.max(
        5 + $map.offsetLeft,
        Math.min(
            window.innerWidth - $tooltip.offsetWidth - 5,
            x + $map.offsetLeft - 5
        )
    );
    $tooltip.style.transform = `translate(${left}px, ${top}px)`;
}

function hideStopTooltip() {
    $tooltip.classList.remove("show");
}

function BusMap({ selectedStop }) {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [stopPopoverData, setStopPopoverData] = useState(null);
    const [showStopPopover, setShowStopPopover] = useState(false);
    const [showBetweenPopover, setShowBetweenPopover] = useState(false);

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const prevStopNumber = useRef(null);
    const servicesList = useRef(null);
    const searchField = useRef(null);
    const searchPopover = useRef(null);
    const stopPopover = useRef(null);
    const floatPill = useRef(null);
    const betweenPopover = useRef(null);
    const servicePopover = useRef(null);

    const _showStopPopover = (number) => {
        const { services, coordinates, name } = busStops[number];

        const popoverHeight = stopPopover.current?.offsetHeight;
        const offset = BREAKPOINT() ? [0, 0] : [0, -popoverHeight / 2];
        const zoom = map.getZoom();
        if (zoom < 17) {
            map.flyTo({
                zoom: 17,
                center: coordinates,
                offset,
                animate: zoom >= 12,
            });
        } else {
            map.easeTo({ center: coordinates, offset });
        }

        if (prevStopNumber.current) {
            map.setFeatureState(
                {
                    source: "stops",
                    id: prevStopNumber.current,
                },
                {
                    selected: false,
                }
            );
            map.setFeatureState(
                {
                    source: "stops-highlight",
                    id: prevStopNumber.current,
                },
                {
                    selected: false,
                }
            );
        }
        map.setFeatureState(
            {
                source: "stops",
                id: number,
            },
            {
                selected: true,
            }
        );
        map.setFeatureState(
            {
                source: "stops-highlight",
                id: number,
            },
            {
                selected: true,
            }
        );

        prevStopNumber.current = number;
        setShowStopPopover(true);
        setStopPopoverData({ number, name, services });

        requestAnimationFrame(() => {
            if (popoverHeight === stopPopover.current?.offsetHeight) return;
            const offset = BREAKPOINT()
                ? [0, 0]
                : [0, -stopPopover.current?.offsetHeight / 2];
            const zoom = map.getZoom();
            if (zoom < 17) {
                map.flyTo({
                    zoom: 17,
                    center: coordinates,
                    offset,
                    animate: zoom >= 12,
                });
            } else {
                map.easeTo({ center: coordinates, offset });
            }
        });
    };

    const hideStopPopover = (e) => {
        const number = stopPopoverData?.number || prevStopNumber.current;
        let stopToBeHighlighted;
        if (number) {
            map.setFeatureState(
                {
                    source: "stops",
                    id: number,
                },
                {
                    selected: false,
                }
            );
            map.setFeatureState(
                {
                    source: "stops-highlight",
                    id: number,
                },
                {
                    selected: false,
                }
            );
            if (stopPopover.current?.classList.contains("expand")) {
                requestAnimationFrame(() => {
                    stopToBeHighlighted = servicePopover.current?.querySelector(
                        `a[data-stop="${number}"]`
                    );
                    stopToBeHighlighted?.classList.add("flash");
                    stopToBeHighlighted?.scrollIntoView({
                        behaviour: "smooth",
                        block: "center",
                        inline: "center",
                    });
                });
            }
        }
        setShowStopPopover(false);
        prevStopNumber.current = null;
        setTimeout(() => {
            stopToBeHighlighted?.classList.remove("flash");
        }, 1000);
    };

    const onLoad = async () => {
        map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            renderWorldCopies: false,
            boxZoom: false,
            minZoom: 8,
            logoPosition: "bottom-left",
            attributionControl: false,
            pitchWithRotate: false,
            dragRotate: supportsTouch,
            touchPitch: false,
            bounds: [lowerLong, lowerLat, upperLong, upperLat],
        });
        if (!supportsTouch) {
            map.touchZoomRotate.disableRotation();
        }

        // Controls
        map.addControl(
            new mapboxgl.AttributionControl({
                compact: true,
            }),
            "bottom-left"
        );
        map.addControl(
            new GeolocateControl({
                offset: () => {
                    if (!BREAKPOINT()) {
                        if (stopPopover.current?.classList.contains("expand")) {
                            return [0, -stopPopover.current.offsetHeight / 2];
                        } else if (
                            servicePopover.current?.classList.contains("expand")
                        ) {
                            return [
                                0,
                                -servicePopover.current.offsetHeight / 2,
                            ];
                        } else if (
                            betweenPopover.current?.classList.contains("expand")
                        ) {
                            return [
                                0,
                                -betweenPopover.current.offsetHeight / 2,
                            ];
                        }
                    }
                    return [0, 0];
                },
            }),
            "top-right"
        );

        map.addControl(
            new mapboxgl.NavigationControl({
                showCompass: true,
                showZoom: !supportsTouch,
            }),
            "top-right"
        );
        const compassButton = document.querySelector(".mapboxgl-ctrl-compass");
        map.on("rotateend", () => {
            const bearing = map.getBearing();
            compassButton.classList.toggle("show", bearing !== 0);
        });

        let initialMoveStart = false;
        const initialHideSearch = () => {
            if (initialMoveStart) return;
            initialMoveStart = true;
        };
        map.once("dragstart", initialHideSearch);
        map.once("zoomstart", initialHideSearch);

        await new Promise((resolve, reject) => {
            map.once("styledata", () => {
                const layers = map.getStyle().layers;
                console.log(layers);

                // labelLayerId = layers.find(
                //   (l) => l.type == 'symbol' && l.layout['text-field'],
                // ).id;

                resolve();
            });
        });

        // const localizedStyle = language.setLanguage(map.getStyle(), 'zh-Hans');
        // map.setStyle(localizedStyle);

        map.loadImage(stopImagePath, (e, img) => {
            if (e) throw e;
            map.addImage("stop", img);
        });

        setMapLoaded(true);
    };

    useEffect(() => {
        onLoad();
    }, []);

    useEffect(() => {
        if (!mapLoaded) return;
        const mapCanvas = map.getCanvas();

        const stopTextPartialFormat = ["get", "number"];
        const stopTextFullFormat = [
            "format",
            ["get", "number"],
            { "font-scale": 0.8 },
            "\n",
            {},
            ["get", "name"],
            { "text-color": "#000" },
        ];
        const stopText = {
            layout: {
                "text-optional": true,
                "text-field": [
                    "step",
                    ["zoom"],
                    "",
                    15,
                    stopTextPartialFormat,
                    16,
                    stopTextFullFormat,
                ],
                "text-size": ["step", ["zoom"], 12, 16, 14],
                "text-justify": [
                    "case",
                    ["boolean", ["get", "left"], false],
                    "right",
                    "left",
                ],
                "text-anchor": [
                    "case",
                    ["boolean", ["get", "left"], false],
                    "right",
                    "left",
                ],
                "text-offset": [
                    "case",
                    ["boolean", ["get", "left"], false],
                    ["literal", [-1, 0]],
                    ["literal", [1, 0]],
                ],
                // 'text-justify': 'auto',
                // 'text-variable-anchor': ['left', 'right'],
                // 'text-radial-offset': 1,
                "text-padding": 0.5,
                "text-font": [
                    "DIN Offc Pro Medium",
                    "Arial Unicode MS Regular",
                ],
                "text-max-width": 16,
                "text-line-height": 1.1,
            },
            paint: {
                "text-color": "#f01b48",
                "text-halo-width": 1,
                "text-halo-color": "#fff",
            },
        };

        map.addSource("stops", {
            type: "geojson",
            tolerance: 10,
            buffer: 0,
            data: {
                type: "FeatureCollection",
                features: busStops.map((stop) => ({
                    type: "Feature",
                    id: encode(stop.code),
                    properties: {
                        code: stop.code,
                        name: stop.name,
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [stop.longitude, stop.latitude],
                    },
                })),
            },
        });

        map.addSource("stops-highlight", {
            type: "geojson",
            tolerance: 10,
            buffer: 0,
            data: {
                type: "FeatureCollection",
                features: [],
            },
        });

        map.addLayer(
            {
                id: "stops",
                type: "circle",
                source: "stops",
                layout: {
                    visibility: "visible",
                },
                paint: {
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        [
                            "case",
                            ["boolean", ["feature-state", "selected"], false],
                            4,
                            0.75,
                        ],
                        14,
                        4,
                        15,
                        [
                            "case",
                            ["boolean", ["feature-state", "selected"], false],
                            12,
                            6,
                        ],
                    ],
                    "circle-color": [
                        "case",
                        ["boolean", ["feature-state", "selected"], false],
                        "#fff",
                        "#f01b48",
                    ],
                    "circle-stroke-color": [
                        "case",
                        ["boolean", ["feature-state", "selected"], false],
                        "#f01b48",
                        "#fff",
                    ],
                    "circle-stroke-width": [
                        "case",
                        ["boolean", ["feature-state", "selected"], false],
                        5,
                        1,
                    ],
                    "circle-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        1,
                        13.9,
                        1,
                        14,
                        0.5,
                    ],
                    "circle-stroke-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        [
                            "case",
                            ["boolean", ["feature-state", "selected"], false],
                            1,
                            0,
                        ],
                        13.5,
                        1,
                        14,
                        0.5,
                    ],
                },
            },
            "settlement-subdivision-label"
        );

        map.addLayer({
            id: "stops-icon",
            type: "symbol",
            source: "stops",
            filter: ["any", [">=", ["zoom"], 14], ["get", "interchange"]],
            layout: {
                visibility: "visible",
                // 'symbol-z-order': 'source',
                "icon-image": "stop",
                "icon-size": ["step", ["zoom"], 0.4, 15, 0.5, 16, 0.6],
                "icon-padding": 0.5,
                "icon-allow-overlap": true,
                // 'icon-ignore-placement': true,
                ...stopText.layout,
            },
            paint: {
                "icon-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    ["case", ["get", "interchange"], 1, 0],
                    14,
                    1,
                ],
                ...stopText.paint,
            },
        });

        requestIdleCallback(() => {
            map.on("mouseenter", "stops", () => {
                mapCanvas.style.cursor = "pointer";
            });

            let lastFrame = null;
            if (supportsHover) {
                let lastFeature = null;
                map.on("mousemove", (e) => {
                    const { point } = e;
                    const features = map.queryRenderedFeatures(point, {
                        layers: ["stops", "stops-highlight"],
                        validate: false,
                    });
                    if (
                        features.length &&
                        map.getZoom() < 16 &&
                        !map.isMoving()
                    ) {
                        if (lastFeature && features[0].id === lastFeature.id) {
                            return;
                        }
                        lastFeature = features[0];
                        const stopID = features[0].id;
                        const data = busStops[stopID];
                        if (lastFrame) cancelAnimationFrame(lastFrame);
                        lastFrame = requestAnimationFrame(() => {
                            showStopTooltip({
                                ...data,
                                ...point,
                            });
                        });
                    } else if (lastFeature) {
                        lastFeature = null;
                        hideStopTooltip();
                    }
                });
            }
            map.on("mouseleave", "stops", () => {
                mapCanvas.style.cursor = "";
                if (lastFrame) cancelAnimationFrame(lastFrame);
                requestAnimationFrame(hideStopTooltip);
            });
            map.on("mouseout", hideStopTooltip);
            map.on("movestart", hideStopTooltip);
        });

        requestIdleCallback(() => {
            map.on("mouseenter", "stops", () => {
                mapCanvas.style.cursor = "pointer";
            });

            let lastFrame = null;
            if (supportsHover) {
                let lastFeature = null;
                map.on("mousemove", (e) => {
                    const { point } = e;
                    const features = map.queryRenderedFeatures(point, {
                        layers: ["stops", "stops-highlight"],
                        validate: false,
                    });
                    if (
                        features.length &&
                        map.getZoom() < 16 &&
                        !map.isMoving()
                    ) {
                        if (lastFeature && features[0].id === lastFeature.id) {
                            return;
                        }
                        lastFeature = features[0];
                        const stopID = decode(features[0].id);
                        const data = busStops[stopID];
                        if (lastFrame) cancelAnimationFrame(lastFrame);
                        lastFrame = requestAnimationFrame(() => {
                            showStopTooltip({
                                ...data,
                                ...point,
                            });
                        });
                    } else if (lastFeature) {
                        lastFeature = null;
                        hideStopTooltip();
                    }
                });
            }
            map.on("mouseleave", "stops", () => {
                mapCanvas.style.cursor = "";
                if (lastFrame) cancelAnimationFrame(lastFrame);
                requestAnimationFrame(hideStopTooltip);
            });
            map.on("mouseout", hideStopTooltip);
            map.on("movestart", hideStopTooltip);
        });

        map.addLayer({
            id: "stops-highlight",
            type: "symbol",
            source: "stops-highlight",
            filter: [
                "any",
                [">=", ["zoom"], 14],
                ["==", ["get", "type"], "end"],
                ["==", ["get", "type"], "intersect"],
            ],
            layout: {
                "icon-image": [
                    "case",
                    ["==", ["get", "type"], "end"],
                    "stop-end",
                    ["==", ["get", "type"], "intersect"],
                    "stop-end",
                    "stop",
                ],
                "icon-size": [
                    "step",
                    ["zoom"],
                    0.3,
                    10,
                    [
                        "case",
                        ["==", ["get", "type"], "end"],
                        0.3,
                        ["==", ["get", "type"], "intersect"],
                        0.25,
                        0.45,
                    ],
                    15,
                    [
                        "case",
                        ["==", ["get", "type"], "end"],
                        0.45,
                        ["==", ["get", "type"], "intersect"],
                        0.4,
                        0.6,
                    ],
                ],
                "icon-anchor": [
                    "case",
                    ["==", ["get", "type"], "end"],
                    "bottom",
                    ["==", ["get", "type"], "intersect"],
                    "bottom",
                    "center",
                ],
                "icon-padding": 0.5,
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                ...stopText.layout,
                "text-field": [
                    "step",
                    ["zoom"],
                    [
                        "case",
                        ["==", ["get", "type"], "end"],
                        stopTextFullFormat,
                        "",
                    ],
                    14,
                    [
                        "case",
                        ["==", ["get", "type"], "end"],
                        stopTextFullFormat,
                        stopTextPartialFormat,
                    ],
                    16,
                    stopTextFullFormat,
                ],
                "text-size": [
                    "step",
                    ["zoom"],
                    ["case", ["==", ["get", "type"], "end"], 14, 11],
                    16,
                    14,
                ],
            },
            paint: {
                ...stopText.paint,
                "text-halo-width": [
                    "case",
                    ["==", ["get", "type"], "end"],
                    2,
                    1,
                ],
            },
        });

        requestIdleCallback(() => {
            map.on("mouseenter", "stops-highlight", () => {
                mapCanvas.style.cursor = "pointer";
            });
            map.on("mouseleave", "stops-highlight", () => {
                mapCanvas.style.cursor = "";
            });
        });

        // // Traffic
        // map.addSource("traffic", {
        //     type: "vector",
        //     url: "mapbox://mapbox.mapbox-traffic-v1",
        // });
        // map.addLayer(
        //     {
        //         id: "traffic",
        //         type: "line",
        //         source: "traffic",
        //         "source-layer": "traffic",
        //         minzoom: 14,
        //         filter: [
        //             "all",
        //             ["==", "$type", "LineString"],
        //             ["has", "congestion"],
        //         ],
        //         layout: {
        //             "line-join": "round",
        //             "line-cap": "round",
        //             visibility: "none",
        //         },
        //         paint: {
        //             "line-width": 3,
        //             "line-offset": [
        //                 "case",
        //                 [
        //                     "match",
        //                     ["get", "class"],
        //                     ["link", "motorway_link", "service", "street"],
        //                     true,
        //                     false,
        //                 ],
        //                 6,
        //                 [
        //                     "match",
        //                     ["get", "class"],
        //                     ["secondary", "tertiary"],
        //                     true,
        //                     false,
        //                 ],
        //                 6,
        //                 ["==", "class", "primary"],
        //                 12,
        //                 ["==", "class", "trunk"],
        //                 12,
        //                 ["==", "class", "motorway"],
        //                 9,
        //                 6,
        //             ],
        //             "line-color": [
        //                 "match",
        //                 ["get", "congestion"],
        //                 "low",
        //                 "rgba(36, 218, 26, .2)",
        //                 "moderate",
        //                 "rgba(253, 149, 0, .55)",
        //                 "heavy",
        //                 "rgba(252, 77, 77, .65)",
        //                 "severe",
        //                 "rgba(148, 41, 76, .75)",
        //                 "transparent",
        //             ],
        //             "line-opacity": [
        //                 "interpolate",
        //                 ["linear"],
        //                 ["zoom"],
        //                 14.1,
        //                 0,
        //                 16,
        //                 1,
        //             ],
        //         },
        //     },
        //     "road-label-navigation"
        // );

        // // Service live buses
        // map.addSource("buses-service", {
        //     type: "geojson",
        //     data: {
        //         type: "FeatureCollection",
        //         features: [],
        //     },
        // });
        // map.loadImage(busTinyImagePath, (e, img) => {
        //     if (e) throw e;
        //     map.addImage("bus-tiny", img);
        // });
        // map.addLayer({
        //     id: "buses-service",
        //     type: "symbol",
        //     source: "buses-service",
        //     minzoom: 9,
        //     layout: {
        //         "icon-image": "bus-tiny",
        //         "icon-allow-overlap": true,
        //         "icon-ignore-placement": true,
        //         "icon-size": [
        //             "step",
        //             ["zoom"],
        //             0.3,
        //             14,
        //             0.35,
        //             15,
        //             0.45,
        //             16,
        //             0.55,
        //         ],
        //     },
        // });
    }, [mapLoaded]);

    useEffect(() => {
        if (!mapLoaded) return;

        const handleMapClick = (e) => {
            if (e.originalEvent.altKey) {
                console.log(e.lngLat);
            }
            const { point } = e;
            const features = map.queryRenderedFeatures(point, {
                layers: ["stops", "stops-icon", "stops-highlight"],
                validate: false,
            });
            if (features.length) {
                const zoom = map.getZoom();
                const feature = features[0];
                const center = feature.geometry.coordinates;
                if (zoom < 12) {
                    // Slowly zoom in first
                    map.flyTo({ zoom: zoom + 2, center });
                } else {
                    if (feature.source == "stops") {
                        location.hash = `/stops/${feature.properties.number}`;
                    } else {
                        _showStopPopover(feature.properties.code);
                    }
                }
            } else {
                hideStopPopover();
            }
        };
        map.on("click", handleMapClick);
        return () => map.off("click", handleMapClick);
    }, [mapLoaded, _showStopPopover, hideStopPopover]);

    return (
        <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
    );
}

export default BusMap;
