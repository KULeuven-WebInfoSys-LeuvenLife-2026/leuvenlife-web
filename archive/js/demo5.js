const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='sans-serif' fill='%239baea6'%3EIMAGE UNAVAILABLE%3C/text%3E%3C/svg%3E";

// --- A large array of varied, high-quality food imagery ---
const presetPhotos = [
    "./assets/images/Image1.png", // Barbecue
    "./assets/images/Image2.png", // Croissant
    "./assets/images/Image3.png", // Box
    "./assets/images/Image8.png", // Canteen
    "./assets/images/Image4.png", // Meet
    "./assets/images/Image5.png", // Soup
    "./assets/images/Image6.png", // Chips
    "./assets/images/Image9.png", // Alma
    "./assets/images/Image7.png", // Salad
    "./assets/images/Image10.png",  // People
];

// --- The Promo Content Data ---
const promoContents = [
    { title: "Fresh Taste", text1: "EXPLORE OUR", text2: "SEASONAL", text3: "INGREDIENTS" },
    { title: "Delights", text1: "FIND OUT MORE", text2: "ABOUT SPECIAL", text3: "OFFERS" },
    { title: "Our Story", text1: "TRADITION MEETS", text2: "MODERN", text3: "CAMPUS LIFE" },
    { title: "Crafted", text1: "PREPARED FRESH", text2: "EVERY SINGLE", text3: "MORNING" }
];

let encyclopediaData = [];
const FAVORITES_KEY = "leuvenlife_favorite_dishes";

function getFavoriteIds() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

function saveFavoriteIds(ids) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

function isFavoriteDish(id) {
    return getFavoriteIds().includes(String(id));
}

function toggleFavoriteDish(id) {
    const dishId = String(id);
    let favorites = getFavoriteIds();

    if (favorites.includes(dishId)) {
        favorites = favorites.filter(savedId => savedId !== dishId);
    } else {
        favorites.push(dishId);
    }

    saveFavoriteIds(favorites);
}

async function fetchAndRenderData() {
    const loader = document.getElementById('loader');
    try {
        const response = await fetch('alma_encyclopedia_dish_soup.json');
        const json = await response.json();
        encyclopediaData = json.data;
        populateLocationFilter(encyclopediaData);
        renderGrid(encyclopediaData);
        updateStats(encyclopediaData.length, "Items");
    } catch (error) {
        console.error("Error loading encyclopedia:", error);
        loader.innerHTML = "Unable to connect to the culinary database.";
    }
}
// --- Menu Section Classification ---
const sectionOrder = [
    "Soups",
    "Belgian & Alma Classics",
    "Italian & Mediterranean",
    "Global Street Food & Fusion",
    "Other Warm Plates"
];

function getCategoryTitles(item) {
    return (item.categories || [])
        .map(category => {
            const mainTitle = category.title || "";
            const subTitles = (category.subcategories || [])
                .map(sub => sub.title || "")
                .join(" ");
            return `${mainTitle} ${subTitles}`;
        })
        .join(" ")
        .toLowerCase();
}

function isSoupItem(item) {
    const name = `${item.mealEn || ""} ${item.meal || ""}`.toLowerCase();
    const categoryTitles = getCategoryTitles(item);

    return (
        name.includes("soup") ||
        name.includes("soep") ||
        name.includes("minestrone") ||
        categoryTitles.includes("soup") ||
        categoryTitles.includes("soep")
    );
}

function classifyDish(item) {
    const name = `${item.mealEn || ""} ${item.meal || ""}`.toLowerCase();

    if (isSoupItem(item)) {
        return "Soups";
    }

    if (
        name.includes("burrito") ||
        name.includes("fajita") ||
        name.includes("taco") ||
        name.includes("tex mex") ||
        name.includes("nacho") ||
        name.includes("curry") ||
        name.includes("spring roll") ||
        name.includes("loempia") ||
        name.includes("falafel") ||
        name.includes("poke") ||
        name.includes("thai") ||
        name.includes("chimichurri")
    ) {
        return "Global Street Food & Fusion";
    }

    if (
        name.includes("italian") ||
        name.includes("provencal") ||
        name.includes("lasagne") ||
        name.includes("lasagna") ||
        name.includes("spaghetti") ||
        name.includes("pasta") ||
        name.includes("penne") ||
        name.includes("pizza") ||
        name.includes("caponata") ||
        name.includes("aglio") ||
        name.includes("bolognese") ||
        name.includes("gyros") ||
        name.includes("pita") ||
        name.includes("goat cheese")
    ) {
        return "Italian & Mediterranean";
    }

    if (
        name.includes("alma") ||
        name.includes("flemish") ||
        name.includes("stew") ||
        name.includes("stoofvlees") ||
        name.includes("croquette") ||
        name.includes("meatball") ||
        name.includes("meatballs") ||
        name.includes("mash") ||
        name.includes("mashed") ||
        name.includes("mince") ||
        name.includes("minced") ||
        name.includes("burger")
    ) {
        return "Belgian & Alma Classics";
    }

    return "Other Warm Plates";
}

function buildSectionedItems(items) {
    const groups = {};

    sectionOrder.forEach(section => {
        groups[section] = [];
    });

    items.forEach(item => {
        const section = classifyDish(item);
        groups[section].push(item);
    });

    const sectionedItems = [];

    sectionOrder.forEach(section => {
        if (groups[section].length > 0) {
            sectionedItems.push({
                isSectionHeading: true,
                title: section,
                count: groups[section].length
            });

            sectionedItems.push(...groups[section]);
        }
    });

    return sectionedItems;
}
// --- Dynamic Interleaved Rendering ---
function renderGrid(items) {
    const grid = document.getElementById('menu-grid');
    const loader = document.getElementById('loader');
    grid.innerHTML = ''; 

    items = buildSectionedItems(items);

    let foodIndex = 0;
    let promoCount = 0;
    let gridCellIndex = 0;

    // Loop until we run out of food items
    while (foodIndex < items.length) {
        const currentEntry = items[foodIndex];

        if (currentEntry.isSectionHeading) {
            grid.innerHTML += `
            <div class="col-span-full px-8 lg:px-12 pt-14 pb-5 border-t border-brand-muted/20">
                <p class="font-sans text-[10px] tracking-[0.35em] uppercase text-brand-muted mb-2">
                    Alma Menu Section · ${currentEntry.count} items
                </p>
                <h2 class="font-sans text-2xl md:text-3xl tracking-[0.25em] uppercase text-brand-text">
                    ${currentEntry.title}
                </h2>
            </div>
        `;

            foodIndex++;
            continue;
        }


    
        
        // --- 1. PROMO DESIGN A (Happens at cell 3, 9, 15...) ---
        // Formula: Remainder of 3 when divided by 6
        if (gridCellIndex % 6 === 3) {
            const photo = presetPhotos[promoCount % presetPhotos.length];
            const content = promoContents[promoCount % promoContents.length];
            
            grid.innerHTML += `
                <div class="group relative flex flex-col items-center pt-16 px-8 bg-brand-bg h-full min-h-[450px] overflow-hidden">
                    <img src="${photo}" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000">
                    <!-- Gradient fading from top to bottom -->
                    <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent transition-colors duration-500"></div>
                    
                    <div class="relative z-10 flex flex-col items-center text-center">
                        <h2 class="font-script text-5xl md:text-6xl text-white mb-6 drop-shadow-md tracking-wide transform -rotate-2">${content.title}</h2>
                        <!-- Top and Bottom bordered 'DISCOVER' -->
                        <p class="font-sans text-[10px] tracking-[0.2em] uppercase text-white/90 border-t border-b border-white/50 py-2 cursor-pointer transition-colors duration-300 hover:border-white hover:text-white">
                            DISCOVER
                        </p>
                    </div>
                </div>
            `;
            promoCount++;
            gridCellIndex++;
            continue; // Skip food rendering for this cell
        }

        // --- 2. PROMO DESIGN B (Happens at cell 5, 11, 17...) ---
        // Formula: Remainder of 5 when divided by 6
        if (gridCellIndex % 6 === 5) {
            const photo = presetPhotos[promoCount % presetPhotos.length];
            const content = promoContents[promoCount % promoContents.length];
            
            grid.innerHTML += `
                <div class="group relative flex flex-col items-center pt-16 px-8 bg-brand-bg h-full min-h-[450px] overflow-hidden">
                    <img src="${photo}" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000">
                    <div class="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-500"></div>
                    
                    <div class="relative z-10 flex flex-col items-center text-center">
                        <h2 class="font-script text-5xl md:text-6xl text-brand-accent mb-6 drop-shadow-md tracking-wide">${content.title}</h2>
                        <!-- 3 Lines of Text -->
                        <h3 class="font-sans text-xl md:text-2xl text-white tracking-[0.2em] uppercase leading-loose mb-6 font-light">
                            ${content.text1}<br>${content.text2}<br>${content.text3}
                        </h3>
                        <!-- Bottom bordered 'DISCOVER' -->
                        <p class="font-sans text-[10px] tracking-[0.2em] uppercase text-white/90 border-b border-white/50 pb-1 cursor-pointer transition-colors duration-300 hover:border-white hover:text-white">
                            DISCOVER
                        </p>
                    </div>
                </div>
            `;
            promoCount++;
            gridCellIndex++;
            continue; // Skip food rendering for this cell
        }

        // --- 3. STANDARD FOOD CARDS ---
        const item = items[foodIndex];
        const catTitles = item.categories.map(c => c.title).join(" ");
        const isSoup = catTitles.includes("Soep") || (item.mealEn && item.mealEn.toLowerCase().includes("soup"));
        const categoryClass = isSoup ? 'type-soup' : 'type-warm';

        const imageSrc = item.image ? item.image : FALLBACK_IMG;
        const priceHTML = item.defaultPrice !== null ? `€${item.defaultPrice.toFixed(2)}` : `FREE`;
        const diets = item.diets.length > 0 ? item.diets.map(d => d.titleEn).join(', ') : '';
        const allergies = item.allergies.length > 0 ? item.allergies.map(a => a.titleEn).join(', ') : '';
        
        let metaString = diets;
        if (allergies) {
            metaString += metaString ? `<br>Contains: ${allergies}` : `Contains: ${allergies}`;
        }
        if (!metaString) metaString = "Standard preparation";

        grid.innerHTML += `
            <div class="group flex flex-col justify-between p-8 lg:p-12 bg-brand-bg h-full min-h-[450px] menu-card ${categoryClass}">
                <!-- Top Text -->
                <div class="flex justify-between items-start mb-4 z-10 w-full">
                    <div class="flex flex-col max-w-[70%]">
                        <h3 class="font-sans text-sm md:text-base tracking-[0.2em] uppercase text-brand-text mb-3 leading-snug">
                            ${item.mealEn || 'Unknown Dish'}
                        </h3>
                        <button class="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-muted border-b border-brand-muted hover:text-brand-text hover:border-brand-text transition-all duration-300 self-start pb-1 explain-btn" data-id="${item.id}" data-nl-name="${item.meal}">
                            ASK AI ✦
                        </button>
                        
                        <button class="favorite-btn font-sans text-[10px] tracking-[0.2em] uppercase text-brand-muted hover:text-brand-accent transition-all duration-300 self-start pb-1 mt-2"
                                data-id="${item.id}">
                            ${isFavoriteDish(item.id) ? '♥ Saved' : '♡ Save'}
                        </button>
                    </div>
                    <span class="font-sans text-sm tracking-wider text-brand-text mt-1">
                        ${priceHTML}
                    </span>
                </div>

                <!-- Floating Image -->
                <div class="flex-grow flex items-center justify-center py-6 w-full relative">
                    <img src="${imageSrc}" alt="${item.mealEn}" loading="lazy"
                         class="max-w-[85%] max-h-[180px] object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl" 
                         onerror="this.src='${FALLBACK_IMG}'">
                </div>

                <!-- Bottom Text -->
                <div class="mt-4 font-sans text-xs text-brand-muted font-light leading-relaxed w-full">
                    ${metaString}
                </div>
            </div>
        `;
        
        foodIndex++;
        gridCellIndex++;
    }

    loader.classList.add('hidden');
    grid.classList.remove('hidden');
}

// --- Filtering Logic ---
let activeTypeFilter = 'all';
let activeLocationFilter = 'all';

function populateLocationFilter(data) {
    const locationFilter = document.getElementById('location-filter');

    if (!locationFilter) return;

    const locations = [...new Set(
        data
            .map(item => item.location)
            .filter(location => location)
    )].sort();

    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

function applyFilters() {
    const filteredArray = encyclopediaData.filter(item => {
        const matchesType =
            activeTypeFilter === 'all' ||
            (activeTypeFilter === 'warm' && !isSoupItem(item)) ||
            (activeTypeFilter === 'soup' && isSoupItem(item));

        const matchesLocation =
            activeLocationFilter === 'all' ||
            item.location === activeLocationFilter;

        return matchesType && matchesLocation;
    });

    renderGrid(filteredArray);

    let label = "Items";

    if (activeTypeFilter === 'warm') label = "Warm dishes";
    if (activeTypeFilter === 'soup') label = "Soups";

    if (activeLocationFilter !== 'all') {
        label += ` at ${activeLocationFilter}`;
    }

    updateStats(filteredArray.length, label);
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const locationFilter = document.getElementById('location-filter');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => {
                b.classList.remove('text-brand-accent', 'border-brand-accent');
                b.classList.add('text-brand-muted', 'border-transparent');
            });

            e.target.classList.remove('text-brand-muted', 'border-transparent');
            e.target.classList.add('text-brand-accent', 'border-brand-accent');

            activeTypeFilter = e.target.getAttribute('data-filter');
            applyFilters();
        });
    });

    if (locationFilter) {
        locationFilter.addEventListener('change', (e) => {
            activeLocationFilter = e.target.value;
            applyFilters();
        });
    }
}


// ==========================================
// OPENAI CULTURAL HISTORIAN (INTERACTIVE CHAT)
// ==========================================


// Global variable to remember the conversation context for follow-up questions!
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

    const diets = dish.diets.length > 0 ? dish.diets.map(d => d.titleEn).join(', ') : 'None';
    const allergies = dish.allergies.length > 0 ? dish.allergies.map(a => a.titleEn).join(', ') : 'None';

    const systemPrompt = "You are an elegant, high-end culinary guide for international university students in Belgium. You answer questions directly, keeping responses brief, polite, and beautifully written. Tone: Welcoming, appetizing, premium.";
    const initialUserPrompt = `Context: The student is looking at "${dish.mealEn}" (Dutch: ${dish.meal}). It has diets: ${diets}. Allergens: ${allergies}. Please give a 2-sentence explanation of its cultural origin and flavor.`;

    // Reset the chat history memory
    currentChatHistory = [
        { role: "system", content: systemPrompt },
        { role: "user", content: initialUserPrompt }
    ];

    try {
        const aiResponse = await fetchOpenAI(currentChatHistory);
        // Save AI's response to memory
        currentChatHistory.push({ role: "assistant", content: aiResponse });
        // Display AI's response
        chatEl.innerHTML = `<div class="text-brand-text mb-4 leading-relaxed">${aiResponse}</div>`;
    } catch (error) {
        chatEl.innerHTML = `<span class="text-red-400">The historian is resting. Please try again.</span>`;
    }
}

// 4. Handle the user asking a follow-up question (USING EVENT DELEGATION)
document.addEventListener('click', (e) => {
    // If they click the button (or the star icon inside it)
    if (e.target.closest('#ai-send-btn')) {
        handleUserFollowUp();
    }
});

// Listen for the "Enter" key globally, but only trigger if they are typing in our specific input box
document.addEventListener('keypress', (e) => {
    if (e.target.id === 'ai-user-input' && e.key === 'Enter') {
        e.preventDefault(); // Prevent accidental form submissions
        handleUserFollowUp();
    }
});

async function handleUserFollowUp() {
    const inputEl = document.getElementById('ai-user-input');
    const chatEl = document.getElementById('ai-chat-history');
    const text = inputEl.value.trim();
    
    if (!text) return; // Don't send empty messages

    // 1. Add user's question to the UI (styled elegantly right-aligned in Gold)
    chatEl.innerHTML += `
        <div class="flex justify-end mt-4 mb-4">
            <div class="bg-[#23312d] text-brand-accent px-4 py-3 rounded text-sm italic max-w-[85%] border border-brand-border">
                "${text}"
            </div>
        </div>
    `;
    inputEl.value = ''; // clear box
    
    // Scroll to the bottom of the chat
    chatEl.scrollTop = chatEl.scrollHeight; 

    // 2. Add user question to Javascript memory
    currentChatHistory.push({ role: "user", content: text });

    // 3. Show loading UI
    const loadingId = 'loading-' + Date.now();
    chatEl.innerHTML += `<div id="${loadingId}" class="animate-pulse text-brand-muted italic mt-2">Thinking... ✦</div>`;
    chatEl.scrollTop = chatEl.scrollHeight;

    try {
        // 4. Fetch AI response (sending the whole history!)
        const aiResponse = await fetchOpenAI(currentChatHistory);
        
        // 5. Save and Display
        currentChatHistory.push({ role: "assistant", content: aiResponse });
        document.getElementById(loadingId).remove();
        chatEl.innerHTML += `<div class="text-brand-text mt-2 leading-relaxed border-l-2 border-brand-accent pl-4">${aiResponse}</div>`;
        chatEl.scrollTop = chatEl.scrollHeight;

    } catch (error) {
        document.getElementById(loadingId).remove();
        chatEl.innerHTML += `<div class="text-red-400 mt-2">Sorry, connection lost.</div>`;
    }
}

// 5. The core Fetch function to talk to your SECURE CLOUDFLARE WORKER
async function fetchOpenAI(messagesArray) {
    const WORKER_URL = "https://alma-ai-proxy.trarc.workers.dev";

    // CORRECTED: Fetching your worker URL! No authorization header needed here!
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
    
    // Cloudflare returns { error: "..." } if it fails on the server side
    if (data.error) throw new Error(data.error); 

    return data.choices[0].message.content;
}

function updateStats(count, label) {
    const statsDisplay = document.getElementById("stats-display");

    if (!statsDisplay) return;

    statsDisplay.innerHTML = `Viewing <span class="text-brand-text">${count}</span> ${label}`;
}

function setupFavorites() {
    const favoritesBtn = document.getElementById("favorites-btn");
    const grid = document.getElementById("menu-grid");

    if (favoritesBtn) {
        favoritesBtn.addEventListener("click", () => {
            const favoriteIds = getFavoriteIds();

            const favoriteItems = encyclopediaData.filter(item =>
                favoriteIds.includes(String(item.id))
            );

            renderGrid(favoriteItems);
            updateStats(favoriteItems.length, "Favorite items");
        });
    }

    if (grid) {
        grid.addEventListener("click", (event) => {
            const favoriteBtn = event.target.closest(".favorite-btn");

            if (!favoriteBtn) return;

            const id = favoriteBtn.getAttribute("data-id");

            toggleFavoriteDish(id);

            favoriteBtn.innerHTML = isFavoriteDish(id) ? "♥ Saved" : "♡ Save";
        });
    }
}

// Start favorites without changing the original loading structure
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupFavorites);
} else {
    setupFavorites();
}
// --- Page Initialization ---
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", async () => {
        await fetchAndRenderData();

        if (typeof setupFilters === "function") {
            setupFilters();
        }
    });
} else {
    fetchAndRenderData().then(() => {
        if (typeof setupFilters === "function") {
            setupFilters();
        }
    });
}