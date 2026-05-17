const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='sans-serif' fill='%239baea6'%3EIMAGE UNAVAILABLE%3C/text%3E%3C/svg%3E";

const MAPTILER_KEY = "3dMLa7DkjEUKMyjsaUIw";

// Global data used by the AI modal
let encyclopediaData = [];

// Store markers and mapped dishes for sidebar interaction
let mapMarkersByDishId = {};
let mappedDishItems = [];
let activePopup = null;

// ===============================
// ORIGIN LOCATIONS
// ===============================

const ORIGIN_LOCATIONS = {
    belgium: {
        lng: 4.3517,
        lat: 50.8503,
        label: "Belgium"
    },
    france: {
        lng: 2.2137,
        lat: 46.2276,
        label: "France"
    },
    spain: {
        lng: -3.7038,
        lat: 40.4168,
        label: "Spain"
    },
    uk: {
        lng: -1.1743,
        lat: 52.3555,
        label: "United Kingdom"
    },
    italy: {
        lng: 12.5674,
        lat: 41.8719,
        label: "Italy"
    },
    hungary: {
        lng: 19.5033,
        lat: 47.1625,
        label: "Hungary"
    },
    sweden: {
        lng: 18.6435,
        lat: 60.1282,
        label: "Sweden"
    },
    usa: {
        lng: -95.7129,
        lat: 37.0902,
        label: "USA"
    },
    netherlands: {
        lng: 5.2913,
        lat: 52.1326,
        label: "Netherlands"
    },
    switzerland: {
        lng: 8.2275,
        lat: 46.8182,
        label: "Switzerland"
    },
    germany: {
        lng: 10.4515,
        lat: 51.1657,
        label: "Germany"
    },
    japan: {
        lng: 138.2529,
        lat: 36.2048,
        label: "Japan"
    },
    vietnam: {
        lng: 108.2772,
        lat: 14.0583,
        label: "Vietnam"
    },
    ireland: {
        lng: -8.2439,
        lat: 53.4129,
        label: "Ireland"
    },
    wales: {
        lng: -3.7837,
        lat: 52.1307,
        label: "Wales"
    },
    mexico: {
        lng: -102.5528,
        lat: 23.6345,
        label: "Mexico"
    },
    india: {
        lng: 78.9629,
        lat: 20.5937,
        label: "India"
    },
    greece: {
        lng: 21.8243,
        lat: 39.0742,
        label: "Greece"
    },
    china: {
        lng: 104.1954,
        lat: 35.8617,
        label: "China"
    },
    general: {
        lng: 15.0,
        lat: 35.0,
        label: "General / Mixed"
    }
};

// ===============================
// COUNTRY ZOOM SETTINGS
// ===============================

const ORIGIN_VIEWS = {
    world: {
        center: [10.0, 45.0],
        zoom: 3,
        pitch: 0,
        bearing: 0
    },
    belgium: {
        center: [4.35, 50.85],
        zoom: 6.8,
        pitch: 35,
        bearing: 0
    },
    france: {
        center: [2.2137, 46.2276],
        zoom: 5.4,
        pitch: 35,
        bearing: 0
    },
    spain: {
        center: [-3.7038, 40.4168],
        zoom: 5.2,
        pitch: 35,
        bearing: 0
    },
    uk: {
        center: [-1.1743, 52.3555],
        zoom: 5.3,
        pitch: 35,
        bearing: 0
    },
    italy: {
        center: [12.5, 42.8],
        zoom: 5.4,
        pitch: 35,
        bearing: 0
    },
    hungary: {
        center: [19.5033, 47.1625],
        zoom: 6.0,
        pitch: 35,
        bearing: 0
    },
    sweden: {
        center: [18.6435, 60.1282],
        zoom: 4.6,
        pitch: 35,
        bearing: 0
    },
    usa: {
        center: [-95.7, 37.1],
        zoom: 4.2,
        pitch: 35,
        bearing: 0
    },
    netherlands: {
        center: [5.2913, 52.1326],
        zoom: 6.7,
        pitch: 35,
        bearing: 0
    },
    switzerland: {
        center: [8.2275, 46.8182],
        zoom: 6.5,
        pitch: 35,
        bearing: 0
    },
    germany: {
        center: [10.4515, 51.1657],
        zoom: 5.2,
        pitch: 35,
        bearing: 0
    },
    japan: {
        center: [138.2529, 36.2048],
        zoom: 4.6,
        pitch: 35,
        bearing: 0
    },
    vietnam: {
        center: [108.2772, 14.0583],
        zoom: 5.2,
        pitch: 35,
        bearing: 0
    },
    ireland: {
        center: [-8.2439, 53.4129],
        zoom: 6.0,
        pitch: 35,
        bearing: 0
    },
    wales: {
        center: [-3.7837, 52.1307],
        zoom: 6.5,
        pitch: 35,
        bearing: 0
    },
    mexico: {
        center: [-102.5, 23.6],
        zoom: 4.5,
        pitch: 35,
        bearing: 0
    },
    india: {
        center: [78.9, 21.0],
        zoom: 4.5,
        pitch: 35,
        bearing: 0
    },
    greece: {
        center: [21.8243, 39.0742],
        zoom: 5.6,
        pitch: 35,
        bearing: 0
    },
    china: {
        center: [104.1954, 35.8617],
        zoom: 4.4,
        pitch: 35,
        bearing: 0
    },
    general: {
        center: [15.0, 35.0],
        zoom: 3.2,
        pitch: 20,
        bearing: 0
    }
};

// ===============================
// EXACT DISH → MULTIPLE ORIGINS
// ===============================

const DISH_ORIGIN_RULES = {
    // Belgium
    "alma's traditional comfort food mash bowl": ["belgium"],
    "alma's traditional mashed potato bowl": ["belgium"],
    "alma's traditional mashed patato bowl": ["belgium"],
    "cheese croquettes with salad": ["belgium", "netherlands"],
    "chicken stew with salad and french fries": ["belgium", "france"],
    "chicken stew with salad and mashed potatoes": ["belgium", "france"],
    "creamy chicory soup": ["belgium", "france"],
    "flemish-style beef stew with salad and wheat": ["belgium"],
    "homemade pork stew": ["belgium"],
    "leek soup": ["belgium", "france", "ireland", "wales"],
    "minced steak with pepper sauce, green beans and mashed potatoes": ["belgium", "france"],

    // France
    "chervil cream soup": ["france"],
    "chervil soup": ["france"],
    "cordon bleu with baked cauliflower, mushroom sauce and potatoes": ["france", "switzerland"],
    "pangasius with broccoli, hollandaise sauce and potatoes": ["france", "netherlands", "vietnam"],
    "potato leek soup": ["france", "ireland", "wales"],
    "tomato and goat cheese pie with fried potatoes and salad": ["france"],

    // Spain
    "andalusian tomato soup": ["spain"],

    // United Kingdom
    "fish and chips": ["uk"],

    // Italy
    "italian chicken breast with broccoli": ["italy"],
    "meatballs in tomato sauce, green veggies and creamy mash": ["italy", "sweden", "usa"],
    "meatballs in tomato sauce, broken string beans and mashed potatoes": ["italy", "sweden", "usa"],
    "meatballs with tomato sauce, broccoli and mashed potatoes": ["italy", "sweden", "usa"],
    "tomato mascarpone soup": ["italy"],

    // Hungary
    "paprika soup": ["hungary"],
    "vegetarian hungarian goulash with rice": ["hungary"],

    // USA
    "angelo's loaded potatoes": ["usa"],
    "angelo's loaded patatoes": ["usa"],
    "broccoli soup": ["usa", "general"],
    "creamy tomato soup": ["usa", "general"],
    "crispy chicken fillet with peas, carrots and potatoes": ["usa", "general"],
    "fish stick with remoulade sauce, salad and mashed potatoes": ["usa", "general"],

    // Germany
    "minced meat roll, red cabbage and spuds": ["germany"],

    // Japan
    "cod tempura with spinach, cream, and mashed potatoes": ["japan"],

    // China + General / Mixed
    "oven-baked spring roll with vegetable rice and sweet-and-sour pineapple sauce": ["general", "china"],

    // General / Mixed
    "asparagus soup": ["general"],
    "cauliflower soup": ["general"],
    "meatballs, green pepper sauce, beans and mashed potatoes": ["general"],
    "mince roll with beans and potatoes": ["general"],
    "minced meat roll with spinach and mashed potatoes": ["general"],
    "mushroom soup": ["general"],
    "pumpkin soup": ["general"],
    "vegetable soup": ["general"]
};

// ===============================
// KEYWORD FALLBACK FOR OTHER DISHES
// ===============================

const KEYWORD_ORIGIN_RULES = [
    { keywords: ["spaghetti", "lasagne", "lasagna", "aglio", "caponata", "penne", "minestrone"], origins: ["italy"] },
    { keywords: ["pizza"], origins: ["italy"] },
    { keywords: ["fajita", "burrito", "taco", "nachos", "puebla", "chimichurri", "tex mex"], origins: ["mexico"] },
    { keywords: ["curry"], origins: ["india"] },
    { keywords: ["poke"], origins: ["usa"] },
    { keywords: ["burger"], origins: ["usa"] },
    { keywords: ["gyros", "pita"], origins: ["greece"] },
    { keywords: ["stoofvlees", "koninginnenhapje"], origins: ["belgium"] },
    { keywords: ["goulash", "paprika"], origins: ["hungary"] },
    { keywords: ["cordon bleu"], origins: ["france", "switzerland"] },
    { keywords: ["tempura"], origins: ["japan"] },
    { keywords: ["spring roll"], origins: ["china"] }
];

document.addEventListener("DOMContentLoaded", async () => {
    await initCulturalMap();
    setupOriginZoomSelector();
    setupSidebarDishClick();
});

// ===============================
// MAP INIT
// ===============================

async function initCulturalMap() {
    maptilersdk.config.apiKey = MAPTILER_KEY;

    const map = new maptilersdk.Map({
        container: 'map-container',
        style: maptilersdk.MapStyle.WINTER,
        center: [10.0, 45.0],
        zoom: 3,
        projection: 'globe',
        attributionControl: false,
        geolocateControl: false,
        navigationControl: false
    });

    window.map = map;
    window.almaMap = map;
    window.leuvenLifeMap = map;

    map.addControl(new maptilersdk.NavigationControl({ showCompass: false }), 'top-right');

    try {
        const response = await fetch('alma_encyclopedia_dish_soup.json');
        const json = await response.json();
        encyclopediaData = json.data || [];

        mapMarkersByDishId = {};
        mappedDishItems = [];

        encyclopediaData.forEach(item => {
            const dishName = item.mealEn || item.meal || "Unknown Dish";
            const normalizedName = normalizeDishName(dishName);
            const originKeys = getOriginKeysForDish(normalizedName);
            const imageSrc = item.image ? item.image : FALLBACK_IMG;

            originKeys.forEach((countryKey, originIndex) => {
                const originLocation = ORIGIN_LOCATIONS[countryKey] || ORIGIN_LOCATIONS.general;
                const markerKey = `${item.id}-${countryKey}`;

                const lngOffset = getStableOffset(item.id, originIndex, "lng");
                const latOffset = getStableOffset(item.id, originIndex, "lat");
                const markerLngLat = [
                    originLocation.lng + lngOffset,
                    originLocation.lat + latOffset
                ];

                const el = document.createElement('div');
                el.className = 'cursor-pointer';

// IMPORTANT:
// Do NOT set transform on this outer element.
// MapTiler uses transform internally to position markers.
// If we overwrite transform here, the marker jumps to the corner.
                el.style.width = '22px';
                el.style.height = '22px';
                el.style.display = 'flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';

                const dot = document.createElement('div');
                dot.style.width = '14px';
                dot.style.height = '14px';
                dot.style.borderRadius = '9999px';
                dot.style.background = '#c9ab77';
                dot.style.border = '1.5px solid rgba(255, 247, 230, 0.9)';
                dot.style.boxShadow = '0 0 8px rgba(201, 171, 119, 0.35)';
                dot.style.opacity = '0.96';
                dot.style.transition = 'transform 0.25s ease, box-shadow 0.25s ease';

                dot.addEventListener('mouseenter', () => {
                    dot.style.transform = 'scale(1.22)';
                    dot.style.boxShadow = '0 0 14px rgba(201, 171, 119, 0.5)';
                });

                dot.addEventListener('mouseleave', () => {
                    dot.style.transform = 'scale(1)';
                    dot.style.boxShadow = '0 0 8px rgba(201, 171, 119, 0.35)';
                });

                el.appendChild(dot);

                const popupHTML = `
                    <div class="p-5 flex flex-col w-[240px]">
                        <img src="${imageSrc}" class="w-full h-32 object-contain mb-4 drop-shadow-lg" onerror="this.src='${FALLBACK_IMG}'">
                        <h3 class="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-text mb-2 leading-snug">${dishName}</h3>
                        <p class="font-sans text-[9px] text-brand-accent uppercase tracking-widest mb-4">📍 ${originLocation.label}</p>
                        <button class="w-full font-sans text-[9px] tracking-[0.2em] uppercase text-brand-bg bg-brand-accent py-2 hover:bg-white transition-colors duration-300 explain-btn" data-id="${item.id}" data-nl-name="${item.meal}">
                            ASK AI ✦
                        </button>
                    </div>
                `;

                const popup = new maptilersdk.Popup({ offset: 15, closeButton: false })
                    .setHTML(popupHTML);

                popup.on('open', () => {
                    if (activePopup && activePopup !== popup) {
                        activePopup.remove();
                    }

                    activePopup = popup;

                    const content = popup.getElement().querySelector('.maplibregl-popup-content');
                    const tip = popup.getElement().querySelector('.maplibregl-popup-tip');

                    if (content) {
                        content.style.backgroundColor = '#1a2421';
                        content.style.padding = '0';
                        content.style.border = '1px solid #33423d';
                    }

                    if (tip) {
                        tip.style.borderTopColor = '#1a2421';
                        tip.style.borderBottomColor = '#1a2421';
                    }
                });

                const marker = new maptilersdk.Marker({ element: el })
                    .setLngLat(markerLngLat)
                    .setPopup(popup)
                    .addTo(map);

                mapMarkersByDishId[markerKey] = marker;

                mappedDishItems.push({
                    id: item.id,
                    markerKey: markerKey,
                    name: dishName,
                    origin: originLocation.label,
                    countryKey: countryKey,
                    lngLat: markerLngLat
                });
            });
        });

        renderOriginSidebar("world");
        updateVisibleMarkers("world");

    } catch (error) {
        console.error("Error loading encyclopedia for the map:", error);
    }
}

// ===============================
// ORIGIN MATCHING HELPERS
// ===============================

function normalizeDishName(name) {
    return (name || "")
        .toLowerCase()
        .replace(/[’‘]/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

function getOriginKeysForDish(normalizedName) {
    if (DISH_ORIGIN_RULES[normalizedName]) {
        return DISH_ORIGIN_RULES[normalizedName];
    }

    for (const rule of KEYWORD_ORIGIN_RULES) {
        if (rule.keywords.some(keyword => normalizedName.includes(keyword))) {
            return rule.origins;
        }
    }

    return ["general"];
}

function getStableOffset(id, originIndex, axis) {
    const seed = Number(id || 0) * 37 + originIndex * 19 + (axis === "lng" ? 7 : 13);
    const raw = Math.sin(seed) * 10000;
    const decimal = raw - Math.floor(raw);

    return (decimal - 0.5) * 0.7;
}

// ===============================
// COUNTRY / SIDEBAR HELPERS
// ===============================

function getCountryLabel(countryKey) {
    const labels = {
        world: "All Origins",
        belgium: "Belgium",
        france: "France",
        spain: "Spain",
        uk: "United Kingdom",
        italy: "Italy",
        hungary: "Hungary",
        sweden: "Sweden",
        usa: "USA",
        netherlands: "Netherlands",
        switzerland: "Switzerland",
        germany: "Germany",
        japan: "Japan",
        vietnam: "Vietnam",
        ireland: "Ireland",
        wales: "Wales",
        mexico: "Mexico",
        india: "India",
        greece: "Greece",
        china: "China",
        general: "General / Mixed"
    };

    return labels[countryKey] || "All Origins";
}

function renderOriginSidebar(countryKey = "world") {
    const listEl = document.getElementById("origin-dish-list");
    const titleEl = document.getElementById("sidebar-title");
    const countEl = document.getElementById("sidebar-count");

    if (!listEl || !titleEl || !countEl) return;

    let items = mappedDishItems;

    if (countryKey && countryKey !== "world") {
        items = mappedDishItems.filter(item => item.countryKey === countryKey);
    }

    items = [...items].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

    titleEl.innerText = getCountryLabel(countryKey);
    countEl.innerText = `${items.length} origin entries`;

    if (items.length === 0) {
        listEl.innerHTML = `
            <div class="px-4 py-6 text-brand-muted font-sans text-sm leading-relaxed">
                No dishes found for this origin.
            </div>
        `;
        return;
    }

    listEl.innerHTML = items.map(item => `
        <button class="origin-dish-btn w-full text-left px-4 py-3 border border-brand-border hover:border-brand-accent hover:text-brand-accent transition-colors duration-300"
                data-marker-key="${item.markerKey}">
            <span class="block font-sans text-[11px] uppercase tracking-[0.18em] text-brand-text leading-relaxed">
                ${item.name}
            </span>
            <span class="block font-sans text-[9px] uppercase tracking-[0.2em] text-brand-muted mt-1">
                ${item.origin}
            </span>
        </button>
    `).join("");
}

function updateVisibleMarkers(countryKey = "world") {
    const map = window.map || window.almaMap || window.leuvenLifeMap;

    if (!map) return;

    mappedDishItems.forEach(item => {
        const marker = mapMarkersByDishId[item.markerKey];

        if (!marker) return;

        if (countryKey === "world" || item.countryKey === countryKey) {
            marker.addTo(map);
        } else {
            marker.remove();
        }
    });
}

// ===============================
// DEMO4 COUNTRY ZOOM SELECTOR
// ===============================

function setupOriginZoomSelector() {
    const originSelect = document.getElementById("origin-select");

    if (!originSelect) return;

    originSelect.addEventListener("change", function () {
        const selectedOrigin = this.value;

        if (activePopup) {
            activePopup.remove();
            activePopup = null;
        }

        const view = ORIGIN_VIEWS[selectedOrigin];
        const map = window.map || window.almaMap || window.leuvenLifeMap;

        if (!view || !map) return;

        map.flyTo({
            center: view.center,
            zoom: view.zoom,
            pitch: view.pitch,
            bearing: view.bearing,
            duration: 1400,
            essential: true
        });

        renderOriginSidebar(selectedOrigin);
        updateVisibleMarkers(selectedOrigin);
    });
}

// ===============================
// SIDEBAR DISH CLICK LOGIC
// ===============================

function setupSidebarDishClick() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".origin-dish-btn");

        if (!btn) return;

        const markerKey = btn.getAttribute("data-marker-key");
        const marker = mapMarkersByDishId[markerKey];
        const item = mappedDishItems.find(d => d.markerKey === markerKey);
        const map = window.map || window.almaMap || window.leuvenLifeMap;

        if (!marker || !item || !map) return;

        map.flyTo({
            center: item.lngLat,
            zoom: getSidebarClickZoom(item.countryKey),
            pitch: 35,
            bearing: 0,
            duration: 1200,
            essential: true
        });

        setTimeout(() => {
            if (activePopup) {
                activePopup.remove();
                activePopup = null;
            }

            const popup = marker.getPopup();

            popup.setLngLat(item.lngLat);
            popup.addTo(map);

            activePopup = popup;
        }, 900);
    });
}

function getSidebarClickZoom(countryKey) {
    if (countryKey === "belgium") return 8.2;
    if (countryKey === "france") return 6.4;
    if (countryKey === "spain") return 6.3;
    if (countryKey === "uk") return 6.3;
    if (countryKey === "italy") return 6.6;
    if (countryKey === "hungary") return 6.8;
    if (countryKey === "sweden") return 5.8;
    if (countryKey === "usa") return 5.4;
    if (countryKey === "netherlands") return 7.0;
    if (countryKey === "switzerland") return 7.0;
    if (countryKey === "germany") return 6.2;
    if (countryKey === "japan") return 5.8;
    if (countryKey === "vietnam") return 6.0;
    if (countryKey === "ireland") return 6.8;
    if (countryKey === "wales") return 7.0;
    if (countryKey === "mexico") return 5.7;
    if (countryKey === "india") return 5.7;
    if (countryKey === "greece") return 6.8;
    if (countryKey === "china") return 5.2;
    if (countryKey === "general") return 4.0;

    return 6;
}

// ==========================================
// OPENAI CULTURAL HISTORIAN (INTERACTIVE CHAT)
// ==========================================

let currentChatHistory = [];

// 1. Listen for clicks on ANY "Ask AI" button on a food card
document.addEventListener('click', (e) => {
    if (e.target.closest('.explain-btn')) {
        const btn = e.target.closest('.explain-btn');
        const dishId = parseInt(btn.getAttribute('data-id'));
        const dish = encyclopediaData.find(d => d.id === dishId);

        if (dish) {
            startAILesson(dish);
        }
    }
});

// 2. Modal UI controls
document.addEventListener('click', (e) => {
    const modal = document.getElementById('ai-modal');

    if (e.target.id === 'close-ai-modal' || e.target === modal) {
        modal.classList.add('hidden');
    }
});

// 3. Start a brand new conversation about a dish
async function startAILesson(dish) {
    const modal = document.getElementById('ai-modal');
    const titleEl = document.getElementById('ai-dish-name');
    const chatEl = document.getElementById('ai-chat-history');
    const inputEl = document.getElementById('ai-user-input');

    titleEl.innerText = dish.mealEn || dish.meal;
    chatEl.innerHTML = '<div class="animate-pulse text-brand-muted italic">Consulting the culinary historian... ✦</div>';
    inputEl.value = '';
    modal.classList.remove('hidden');

    const diets = dish.diets && dish.diets.length > 0
        ? dish.diets.map(d => d.titleEn).join(', ')
        : 'None';

    const allergies = dish.allergies && dish.allergies.length > 0
        ? dish.allergies.map(a => a.titleEn).join(', ')
        : 'None';

    const systemPrompt = "You are an elegant, high-end culinary guide for international university students in Belgium. You answer questions directly, keeping responses brief, polite, and beautifully written. Tone: Welcoming, appetizing, premium.";

    const initialUserPrompt = `Context: The student is looking at "${dish.mealEn}" (Dutch: ${dish.meal}). It has diets: ${diets}. Allergens: ${allergies}. Please give a 2-sentence explanation of its cultural origin and flavor.`;

    currentChatHistory = [
        { role: "system", content: systemPrompt },
        { role: "user", content: initialUserPrompt }
    ];

    try {
        const aiResponse = await fetchOpenAI(currentChatHistory);

        currentChatHistory.push({ role: "assistant", content: aiResponse });

        chatEl.innerHTML = `<div class="text-brand-text mb-4 leading-relaxed">${aiResponse}</div>`;

    } catch (error) {
        chatEl.innerHTML = `<span class="text-red-400">The historian is resting. Please try again.</span>`;
    }
}

// 4. Handle the user asking a follow-up question
document.addEventListener('click', (e) => {
    if (e.target.closest('#ai-send-btn')) {
        handleUserFollowUp();
    }
});

// Listen for the "Enter" key globally, but only trigger if they are typing in our specific input box
document.addEventListener('keypress', (e) => {
    if (e.target.id === 'ai-user-input' && e.key === 'Enter') {
        e.preventDefault();
        handleUserFollowUp();
    }
});

async function handleUserFollowUp() {
    const inputEl = document.getElementById('ai-user-input');
    const chatEl = document.getElementById('ai-chat-history');
    const text = inputEl.value.trim();

    if (!text) return;

    chatEl.innerHTML += `
        <div class="flex justify-end mt-4 mb-4">
            <div class="bg-[#23312d] text-brand-accent px-4 py-3 rounded text-sm italic max-w-[85%] border border-brand-border">
                "${text}"
            </div>
        </div>
    `;

    inputEl.value = '';
    chatEl.scrollTop = chatEl.scrollHeight;

    currentChatHistory.push({ role: "user", content: text });

    const loadingId = 'loading-' + Date.now();

    chatEl.innerHTML += `<div id="${loadingId}" class="animate-pulse text-brand-muted italic mt-2">Thinking... ✦</div>`;
    chatEl.scrollTop = chatEl.scrollHeight;

    try {
        const aiResponse = await fetchOpenAI(currentChatHistory);

        currentChatHistory.push({ role: "assistant", content: aiResponse });

        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        chatEl.innerHTML += `
            <div class="text-brand-text mt-2 leading-relaxed border-l-2 border-brand-accent pl-4">
                ${aiResponse}
            </div>
        `;

        chatEl.scrollTop = chatEl.scrollHeight;

    } catch (error) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        chatEl.innerHTML += `<div class="text-red-400 mt-2">Sorry, connection lost.</div>`;
    }
}

// 5. The core Fetch function to talk to your secure Cloudflare Worker
async function fetchOpenAI(messagesArray) {
    const WORKER_URL = "https://alma-ai-proxy.trarc.workers.dev";

    const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messagesArray,
            max_tokens: 150,
            temperature: 0.7
        })
    });

    if (!response.ok) throw new Error("API Error");

    const data = await response.json();

    if (data.error) throw new Error(data.error);

    return data.choices[0].message.content;
}