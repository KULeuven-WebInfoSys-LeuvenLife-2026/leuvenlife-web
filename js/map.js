const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='sans-serif' fill='%239baea6'%3EIMAGE UNAVAILABLE%3C/text%3E%3C/svg%3E";
const MAPTILER_KEY = "3dMLa7DkjEUKMyjsaUIw"; // Your MapTiler Key

// --- Cultural Geocoding Dictionary ---
const culturalCoordinates = {
    "spaghetti": { lng: 12.5674, lat: 41.8719, region: "Italy" },
    "lasagne": { lng: 12.5674, lat: 41.8719, region: "Italy" },
    "pizza": { lng: 14.2681, lat: 40.8518, region: "Naples, Italy" },
    "fajita": { lng: -102.5528, lat: 23.6345, region: "Mexico" },
    "burrito": { lng: -102.5528, lat: 23.6345, region: "Mexico" },
    "taco": { lng: -102.5528, lat: 23.6345, region: "Mexico" },
    "curry": { lng: 78.9629, lat: 20.5937, region: "India" },
    "poke": { lng: -157.8583, lat: 21.3069, region: "Hawaii, USA" },
    "gyros": { lng: 21.8243, lat: 39.0742, region: "Greece" },
    "stoofvlees": { lng: 4.7005, lat: 50.8798, region: "Leuven, Belgium" },
    "koninginnenhapje": { lng: 4.7005, lat: 50.8798, region: "Belgium" },
    "default": { lng: 4.3517, lat: 50.8503, region: "Brussels, Belgium" }
};

document.addEventListener("DOMContentLoaded", async () => {
    initCulturalMap();
});

async function initCulturalMap() {
    // 1. Authenticate with your API key globally
    maptilersdk.config.apiKey = MAPTILER_KEY;

    // 2. Initialize the 3D Globe Map!
    const map = new maptilersdk.Map({
        container: 'map-container', 
        style: maptilersdk.MapStyle.WINTER,
        center: [10.0, 45.0], 
        zoom: 3, // 
        projection: 'globe', // <-- This will finally work!
        attributionControl: false,
        geolocateControl: false,
        navigationControl: false 
    });

    map.addControl(new maptilersdk.NavigationControl({ showCompass: false }), 'top-right');


    // 3. Fetch the Food Encyclopedia
    try {
        const response = await fetch('alma_encyclopedia_dish_soup.json');
        const json = await response.json();
        const encyclopediaData = json.data;

        // 4. Plot the pins
        encyclopediaData.forEach(item => {
            const name = item.mealEn.toLowerCase();
            let coords = culturalCoordinates["default"];
            
            // Match the dish name to a cultural region
            for (const [key, value] of Object.entries(culturalCoordinates)) {
                if (name.includes(key)) {
                    coords = value;
                    break;
                }
            }

            const lngOffset = (Math.random() - 0.5) * 0.4; 
            const latOffset = (Math.random() - 0.5) * 0.4;
            const imageSrc = item.image ? item.image : FALLBACK_IMG;

            // Custom Gold Marker Pin
            const el = document.createElement('div');
            el.className = 'w-3 h-3 bg-brand-accent rounded-full border border-brand-bg shadow-[0_0_10px_rgba(196,166,120,0.8)] cursor-pointer hover:scale-150 transition-transform duration-300';

            // Custom Luxury Popup
            const popupHTML = `
                <div class="p-5 flex flex-col w-[240px]">
                    <img src="${imageSrc}" class="w-full h-32 object-contain mb-4 drop-shadow-lg" onerror="this.src='${FALLBACK_IMG}'">
                    <h3 class="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-text mb-2 leading-snug">${item.mealEn}</h3>
                    <p class="font-sans text-[9px] text-brand-accent uppercase tracking-widest mb-4">📍 ${coords.region}</p>
                    <button class="w-full font-sans text-[9px] tracking-[0.2em] uppercase text-brand-bg bg-brand-accent py-2 hover:bg-white transition-colors duration-300 explain-btn" data-id="${item.id}" data-nl-name="${item.meal}">
                        ASK AI ✦
                    </button>
                </div>
            `;

            // Note: Using maptilersdk instead of maplibregl
            const popup = new maptilersdk.Popup({ offset: 15, closeButton: false })
                .setHTML(popupHTML);

            // Inject custom CSS to override default white popup background
            popup.on('open', () => {
                const content = popup.getElement().querySelector('.maplibregl-popup-content');
                const tip = popup.getElement().querySelector('.maplibregl-popup-tip');
                if (content) {
                    content.style.backgroundColor = '#1a2421';
                    content.style.padding = '0';
                    content.style.border = '1px solid #33423d';
                }
                if(tip) tip.style.borderTopColor = '#1a2421';
                if(tip) tip.style.borderBottomColor = '#1a2421';
            });

            new maptilersdk.Marker({element: el})
                .setLngLat([coords.lng + lngOffset, coords.lat + latOffset])
                .setPopup(popup)
                .addTo(map);
        });

    } catch (error) {
        console.error("Error loading encyclopedia for the map:", error);
    }
}