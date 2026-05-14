const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='sans-serif' fill='%239baea6'%3EIMAGE UNAVAILABLE%3C/text%3E%3C/svg%3E";

// ===============================
// CATEGORY / INFO CARDS
// ===============================

// These cards are scattered among the dish cards.
// The first 8 are functional category filters.
// Dessert is kept as a future content placeholder.
// About Alma / About Us have been removed because they are now in the top navbar.
const SCATTER_CARDS = [
    {
        id: "soup",
        type: "category",
        title: "Soups",
        subtitle: "Warm bowls and seasonal broths",
        image: "./assets/images/Image5.png"
    },
    {
        id: "mexican",
        type: "category",
        title: "Tex-Mex",
        subtitle: "Burritos, tacos, fajitas and nachos",
        image: "./assets/images/Image1.png"
    },
    {
        id: "italian",
        type: "category",
        title: "Italian / Pasta / Pizza",
        subtitle: "Spaghetti, lasagne, pizza and Mediterranean comfort",
        image: "./assets/images/Image11.webp"
    },
    {
        id: "vegetarian",
        type: "category",
        title: "Vegetarian / Vegan",
        subtitle: "Plant-based and lighter campus choices",
        image: "./assets/images/Image7.png"
    },
    {
        id: "poultry",
        type: "category",
        title: "Poultry",
        subtitle: "Chicken, gyros and spiced poultry dishes",
        image: "./assets/images/Image12.webp"
    },
    {
        id: "seafood",
        type: "category",
        title: "Seafood",
        subtitle: "Fish, scampi and sea-inspired plates",
        image: "./assets/images/Image13.jpg"
    },
    {
        id: "comfort",
        type: "category",
        title: "Belgian Comfort / Meat Classics",
        subtitle: "Mash bowls, stews, meatballs and local classics",
        image: "./assets/images/Image6.png"
    },
    {
        id: "street",
        type: "category",
        title: "Burgers / Casual Bites",
        subtitle: "Burgers, pita, pizza and loaded potatoes",
        image: "./assets/images/Image3.png"
    },
    {
        id: "dessert",
        type: "info",
        title: "Dessert",
        subtitle: "A future section for sweet campus treats",
        image: "./assets/images/Image2.png"
    }
];

const CATEGORY_RULES = {
    soup: ["soup", "soep", "minestrone"],
    mexican: ["puebla", "burrito", "fajita", "nachos", "taco", "tex mex", "chimichurri"],
    italian: ["spaghetti", "lasagne", "lasagna", "pizza", "aglio", "caponata", "minestrone", "penne"],
    vegetarian: ["vegetable", "vegan", "veggie", "vegetarian", "quorn", "falafel", "plant-based", "goat cheese", "chili sin carne"],
    poultry: ["chicken", "kip", "poultry", "gevogelte", "gyros"],
    seafood: ["fish", "vis", "cod", "koolvis", "pangasius", "scampi", "seastick"],
    comfort: ["meatball", "meatballs", "mince", "minced", "pork", "varken", "stoofvlees", "cordon bleu", "steak", "mash", "mashed", "puree", "stew"],
    street: ["burger", "pita", "pizza", "burrito", "taco", "nachos", "kapsalon", "patatas"]
};

let encyclopediaData = [];
let currentChatHistory = [];

// ===============================
// PAGE INIT
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
    await fetchAndRenderData();
    setupFilters();
});

async function fetchAndRenderData() {
    const loader = document.getElementById('loader');

    try {
        const response = await fetch('alma_encyclopedia_dish_soup.json');
        const json = await response.json();

        encyclopediaData = json.data || [];

        const sortedData = sortByEnglishName(encyclopediaData);

        renderGrid(sortedData, true);
        updateStats(sortedData.length, "Items");

    } catch (error) {
        console.error("Error loading encyclopedia:", error);
        loader.innerHTML = "Unable to connect to the culinary database.";
    }
}

// ===============================
// CATEGORY HELPERS
// ===============================

function getDishSearchText(item) {
    const categoryText = item.categories
        ? item.categories.map(c => c.title || "").join(" ")
        : "";

    const subcategoryText = item.categories
        ? item.categories.flatMap(c => c.subcategories || []).map(s => s.title || "").join(" ")
        : "";

    const dietText = item.diets
        ? item.diets.map(d => `${d.title || ""} ${d.titleEn || ""}`).join(" ")
        : "";

    const allergyText = item.allergies
        ? item.allergies.map(a => `${a.title || ""} ${a.titleEn || ""}`).join(" ")
        : "";

    return `
        ${item.meal || ""}
        ${item.mealEn || ""}
        ${categoryText}
        ${subcategoryText}
        ${dietText}
        ${allergyText}
    `.toLowerCase();
}

function filterByCategory(categoryId) {
    const keywords = CATEGORY_RULES[categoryId] || [];

    return encyclopediaData.filter(item => {
        const text = getDishSearchText(item);
        return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    });
}

function sortByEnglishName(items) {
    return [...items].sort((a, b) => {
        return (a.mealEn || a.meal || "").localeCompare(
            b.mealEn || b.meal || "",
            undefined,
            { sensitivity: "base" }
        );
    });
}

// ===============================
// CARD RENDER HELPERS
// ===============================

function renderVisualCard(card) {
    const isCategory = card.type === "category";

    return `
        <div class="group relative flex flex-col justify-end p-8 lg:p-12 bg-brand-bg h-full min-h-[450px] overflow-hidden cursor-pointer ${isCategory ? 'category-card' : 'info-card'}"
             data-category="${isCategory ? card.id : ''}"
             data-info="${!isCategory ? card.id : ''}">
            
            <img src="${card.image}" 
                 alt="${card.title}" 
                 class="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-1000"
                 onerror="this.style.display='none'">

            <div class="absolute inset-0 bg-black/55 group-hover:bg-black/65 transition-colors duration-500"></div>

            <div class="relative z-10">
                <h2 class="font-serif text-2xl md:text-3xl text-white tracking-[0.18em] uppercase leading-snug mb-4">
                    ${card.title}
                </h2>

                <p class="font-sans text-[11px] tracking-[0.2em] uppercase text-white/80 border-b border-white/50 inline-block pb-1">
                    ${isCategory ? "Explore" : "Coming Soon"}
                </p>

                <p class="font-sans text-xs text-white/75 mt-4 leading-relaxed max-w-[90%]">
                    ${card.subtitle}
                </p>
            </div>
        </div>
    `;
}

function renderBackCard() {
    return `
        <div class="group flex flex-col justify-center items-center p-8 lg:p-12 bg-brand-bg h-full min-h-[450px] cursor-pointer back-card border border-brand-border hover:bg-[#22302c] transition-colors duration-500">
            <h2 class="font-serif text-2xl md:text-3xl text-brand-text tracking-[0.18em] uppercase leading-snug mb-4 text-center">
                Back to Menu
            </h2>

            <p class="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-muted border-b border-brand-muted inline-block pb-1">
                Return
            </p>

            <p class="font-sans text-xs text-brand-muted mt-4 leading-relaxed max-w-[80%] text-center">
                Go back to the full Alma menu and visual category guide.
            </p>
        </div>
    `;
}

function renderDishCard(item) {
    const catTitles = item.categories ? item.categories.map(c => c.title).join(" ") : "";
    const isSoup = catTitles.includes("Soep") || (item.mealEn && item.mealEn.toLowerCase().includes("soup"));
    const categoryClass = isSoup ? 'type-soup' : 'type-warm';

    const imageSrc = item.image ? item.image : FALLBACK_IMG;
    const priceHTML = item.defaultPrice !== null && item.defaultPrice !== undefined
        ? `€${item.defaultPrice.toFixed(2)}`
        : `FREE`;

    const diets = item.diets && item.diets.length > 0
        ? item.diets.map(d => d.titleEn).join(', ')
        : '';

    const allergies = item.allergies && item.allergies.length > 0
        ? item.allergies.map(a => a.titleEn).join(', ')
        : '';

    let metaString = diets;

    if (allergies) {
        metaString += metaString ? `<br>Contains: ${allergies}` : `Contains: ${allergies}`;
    }

    if (!metaString) metaString = "Standard preparation";

    return `
        <div class="group flex flex-col justify-between p-8 lg:p-12 bg-brand-bg h-full min-h-[450px] menu-card ${categoryClass} cursor-pointer"
             data-id="${item.id}">
             
            <div class="flex justify-between items-start mb-4 z-10 w-full">
                <div class="flex flex-col max-w-[70%]">
                    <h3 class="font-sans text-sm md:text-base tracking-[0.2em] uppercase text-brand-text mb-3 leading-snug">
                        ${item.mealEn || item.meal || 'Unknown Dish'}
                    </h3>

                    <button class="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-muted border-b border-brand-muted hover:text-brand-text hover:border-brand-text transition-all duration-300 self-start pb-1 explain-btn"
                            data-id="${item.id}"
                            data-nl-name="${item.meal}">
                        ASK AI ✦
                    </button>
                </div>

                <span class="font-sans text-sm tracking-wider text-brand-text mt-1">
                    ${priceHTML}
                </span>
            </div>

            <div class="flex-grow flex items-center justify-center py-6 w-full relative">
                <img src="${imageSrc}" alt="${item.mealEn || item.meal}" loading="lazy"
                     class="max-w-[85%] max-h-[180px] object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
                     onerror="this.src='${FALLBACK_IMG}'">
            </div>

            <div class="mt-4 font-sans text-xs text-brand-muted font-light leading-relaxed w-full">
                ${metaString}
            </div>
        </div>
    `;
}

// ===============================
// RENDER GRID
// ===============================

function renderGrid(items, showVisualCards = true) {
    const grid = document.getElementById('menu-grid');
    const loader = document.getElementById('loader');

    grid.innerHTML = '';

    // Category result mode:
    // Show selected category dish cards first.
    // Back to Menu is placed at the very end.
    if (!showVisualCards) {
        items.forEach(item => {
            grid.innerHTML += renderDishCard(item);
        });

        grid.innerHTML += renderBackCard();

        loader.classList.add('hidden');
        grid.classList.remove('hidden');
        return;
    }

    // Main menu mode:
    // Scatter category/info cards among all dish cards.
    const totalItems = items.length;
    const scatterCards = [...SCATTER_CARDS];

    const interval = scatterCards.length > 0
        ? Math.max(4, Math.floor(totalItems / (scatterCards.length + 1)))
        : totalItems + 1;

    items.forEach((item, index) => {
        grid.innerHTML += renderDishCard(item);

        const shouldInsertScatterCard =
            scatterCards.length > 0 &&
            (index + 1) % interval === 0;

        if (shouldInsertScatterCard) {
            const nextCard = scatterCards.shift();
            grid.innerHTML += renderVisualCard(nextCard);
        }
    });

    // If any scatter cards remain, place them at the end.
    // About Alma / About Us are no longer rendered here.
    if (scatterCards.length > 0) {
        scatterCards.forEach(card => {
            grid.innerHTML += renderVisualCard(card);
        });
    }

    loader.classList.add('hidden');
    grid.classList.remove('hidden');
}

// ===============================
// TOP FILTER BUTTONS
// ===============================

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => {
                b.classList.remove('text-brand-accent', 'border-brand-accent');
                b.classList.add('text-brand-muted', 'border-transparent');
            });

            e.target.classList.remove('text-brand-muted', 'border-transparent');
            e.target.classList.add('text-brand-accent', 'border-brand-accent');

            const filterType = e.target.getAttribute('data-filter');
            let filteredArray = [];

            if (filterType === 'all') {
                filteredArray = encyclopediaData;
            } else if (filterType === 'warm') {
                filteredArray = encyclopediaData.filter(item => {
                    const catTitles = item.categories ? item.categories.map(c => c.title).join(" ") : "";
                    return !catTitles.includes("Soep") && !(item.mealEn && item.mealEn.toLowerCase().includes("soup"));
                });
            } else if (filterType === 'soup') {
                filteredArray = encyclopediaData.filter(item => {
                    const catTitles = item.categories ? item.categories.map(c => c.title).join(" ") : "";
                    return catTitles.includes("Soep") || (item.mealEn && item.mealEn.toLowerCase().includes("soup"));
                });
            }

            const sortedArray = sortByEnglishName(filteredArray);

            renderGrid(sortedArray, true);

            let label = "Items";
            if (filterType === 'warm') label = "Warm dishes";
            if (filterType === 'soup') label = "Soups";

            updateStats(sortedArray.length, label);
        });
    });
}

function updateStats(count, label) {
    document.getElementById('stats-display').innerHTML = `Viewing <span class="text-brand-text">${count}</span> ${label}`;
}

// ===============================
// CATEGORY CARD CLICK LOGIC
// ===============================

document.addEventListener('click', (e) => {
    const categoryCard = e.target.closest('.category-card');

    if (!categoryCard) return;

    const categoryId = categoryCard.getAttribute('data-category');

    const filteredItems = sortByEnglishName(filterByCategory(categoryId));

    // Category mode:
    // Only selected category dishes + Back to Menu at the end.
    renderGrid(filteredItems, false);

    const label = SCATTER_CARDS.find(card => card.id === categoryId)?.title || "Items";
    updateStats(filteredItems.length, label);

    window.scrollTo({
        top: document.getElementById('menu-grid').offsetTop - 80,
        behavior: 'smooth'
    });
});

// Back to full menu
document.addEventListener('click', (e) => {
    const backCard = e.target.closest('.back-card');

    if (!backCard) return;

    const sortedData = sortByEnglishName(encyclopediaData);

    renderGrid(sortedData, true);
    updateStats(sortedData.length, "Items");

    window.scrollTo({
        top: document.getElementById('menu-grid').offsetTop - 80,
        behavior: 'smooth'
    });
});

// Info cards: placeholder behavior for future content
document.addEventListener('click', (e) => {
    const infoCard = e.target.closest('.info-card');

    if (!infoCard) return;

    const infoId = infoCard.getAttribute('data-info');

    if (infoId === "dessert") {
        alert("Dessert section coming soon.");
    }
});

// ==========================================
// OPENAI CULTURAL HISTORIAN
// ==========================================

// Click anywhere inside a food card to open the same AI modal
document.addEventListener('click', (e) => {
    const card = e.target.closest('.menu-card');

    if (!card) return;

    const dishId = parseInt(card.getAttribute('data-id'));
    const dish = encyclopediaData.find(d => d.id === dishId);

    if (dish) {
        startAILesson(dish);
    }
});

// Modal close controls
document.addEventListener('click', (e) => {
    const modal = document.getElementById('ai-modal');

    if (e.target.id === 'close-ai-modal' || e.target === modal) {
        modal.classList.add('hidden');
    }
});

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

document.addEventListener('click', (e) => {
    if (e.target.closest('#ai-send-btn')) {
        handleUserFollowUp();
    }
});

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