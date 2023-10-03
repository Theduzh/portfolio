const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

// this function returns a promise. take note!
function getCurrentLocation(options = defaultOptions) {
    let getLocationPromise = new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then((result) => {
                    if (
                        result.state === "granted" ||
                        result.state === "prompt"
                    ) {
                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                let latLng = {
                                    latitude: pos.coords.latitude,
                                    longitude: pos.coords.longitude,
                                };
                                resolve(latLng);
                            },
                            (err) => {
                                reject(
                                    `Geolocation Error ${err.code}: ${err.message}`
                                );
                            },
                            options
                        );
                    } else if (result.state === "denied") {
                        reject("Permissions to Geolocation were denied.");
                    }
                });
        } else {
            reject("Browser does not support Geolocation.");
        }
    });

    return getLocationPromise;
}

export default getCurrentLocation;
