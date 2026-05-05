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
        encyclopediaData = json.data;

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