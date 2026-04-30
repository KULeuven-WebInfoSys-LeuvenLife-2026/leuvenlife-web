const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' alignment-baseline='middle' font-family='sans-serif' fill='%239baea6'%3EIMAGE UNAVAILABLE%3C/text%3E%3C/svg%3E";

// --- A large array of varied, high-quality food/luxury imagery ---
const presetPhotos = [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop", // Cheesecake
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop", // Pasta aesthetic
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop", // Cake slice
    "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=800&auto=format&fit=crop", // Bakery prep
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop", // Rustic food spread
    "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop", // Elegant table
    "https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=800&auto=format&fit=crop", // Sweet treats
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop", // Artisanal bread
    "https://images.unsplash.com/photo-1484723091791-c0810d8c11aa?q=80&w=800&auto=format&fit=crop", // Dark chocolate
    "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop"  // Croissant
];

// --- The Promo Content Data ---
const promoContents = [
    { title: "Fresh Taste", text1: "EXPLORE OUR", text2: "SEASONAL", text3: "INGREDIENTS" },
    { title: "Delights", text1: "FIND OUT MORE", text2: "ABOUT SPECIAL", text3: "OFFERS" },
    { title: "Our Story", text1: "TRADITION MEETS", text2: "MODERN", text3: "CAMPUS LIFE" },
    { title: "Crafted", text1: "PREPARED FRESH", text2: "EVERY SINGLE", text3: "MORNING" }
];

let encyclopediaData = [];

document.addEventListener("DOMContentLoaded", async () => {
    await fetchAndRenderData();
    setupFilters();
});

async function fetchAndRenderData() {
    const loader = document.getElementById('loader');
    try {
        const response = await fetch('alma_encyclopedia_dish_soup.json');
        const json = await response.json();
        encyclopediaData = json.data;
        renderGrid(encyclopediaData);
        updateStats(encyclopediaData.length, "Items");
    } catch (error) {
        console.error("Error loading encyclopedia:", error);
        loader.innerHTML = "Unable to connect to the culinary database.";
    }
}

// --- Dynamic Interleaved Rendering ---
function renderGrid(items) {
    const grid = document.getElementById('menu-grid');
    const loader = document.getElementById('loader');
    grid.innerHTML = ''; 

    let foodIndex = 0;
    let promoCount = 0;
    let gridCellIndex = 0;

    // Loop until we run out of food items
    while (foodIndex < items.length) {
        
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
                    const catTitles = item.categories.map(c => c.title).join(" ");
                    return !catTitles.includes("Soep") && !(item.mealEn && item.mealEn.toLowerCase().includes("soup"));
                });
            } else if (filterType === 'soup') {
                filteredArray = encyclopediaData.filter(item => {
                    const catTitles = item.categories.map(c => c.title).join(" ");
                    return catTitles.includes("Soep") || (item.mealEn && item.mealEn.toLowerCase().includes("soup"));
                });
            }

            // Re-render completely so the 3-1-1-1 pattern stays perfectly intact
            renderGrid(filteredArray);

            let label = "Items";
            if (filterType === 'warm') label = "Warm dishes";
            if (filterType === 'soup') label = "Soups";
            updateStats(filteredArray.length, label);
        });
    });
}

function updateStats(count, label) {
    document.getElementById('stats-display').innerHTML = `Viewing <span class="text-brand-text">${count}</span> ${label}`;
}