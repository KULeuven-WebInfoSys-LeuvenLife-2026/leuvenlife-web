# LeuvenLife: Digital Student Guide 
**KU Leuven Web Information Systems [B-KUL-G0Y11A] - Group 4 (2026)**

LeuvenLife is a centralized web application designed as a digital onboarding guide for international students arriving at KU Leuven. While initially conceptualized to cover multiple pillars of student life, we strategically pivoted our scope to deliver a highly robust, deeply interactive experience focused entirely on campus dining.  Today, LeuvenLife serves as the ultimate **Alma Culinary Encyclopedia**, utilizing live APIs, AI cultural analysis, and 3D mapping to introduce international freshmen to Belgian campus food.

🚀 **Live Demo (Classic Grid):** [View Prototype V1 Here](https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/index-demo1.html)

✨ **Live Demo (Luxury Editorial UI):** [View Prototype V2 Here](https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/index-demo2.html)

🌍 **Live Demo (Interactive 3D Map):** [Explore 'Taste The World' Here](https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/map.html)

## 👥 Team Members
* YIN Renlong
* Guo Lingzhi
* Zhao Sirui
* Hou Yilin

## 📂 Repository Architecture
This is a Serverless Single Page Application (SPA) built with HTML5, Vanilla JavaScript, and Tailwind CSS.
* 📄 `index-demo2.html` - The main luxury dashboard layout.
* 📄 `map.html` - The interactive 3D globe MapTiler integration.
* 💾 `alma_encyclopedia_dish_soup.json` - Our custom-consolidated, flattened database of 75 unique meals.
* 📁 `/assets/img/foods/` - Locally hosted image assets for zero-dependency loading and 100% uptime.
* 📁 `/js` - Modular Vanilla JavaScript logic (`app.js`, `map.js`, etc.) handling DOM manipulation and API fetching.

---

## 🎯 Project Strategy & Mentor Feedback (May 5, 2026)

Following a highly constructive mentor feedback session with our TA, our team recognized the need to balance advanced technical architecture with strict, user-centric HCI (Human-Computer Interaction) principles. To ensure we achieve a perfect score across **Robustness**, **Design**, and **Teamwork**, we made the following strategic pivots:

### 1. Applying "Occam's Razor" to UI/UX Design

- **Feedback:** While our initial design was aesthetically luxurious, it risked creating "Cognitive Load" and user misunderstanding. Generic fine-dining images and pseudo-buttons (e.g., decorative "Discover" text) were misleading for a university cafeteria application.
- **Action:** We applied Occam's Razor—eliminating purely decorative elements that did not serve a functional purpose. We removed the confusing decorative images and focused entirely on the actual Alma data. Every button, including our category filters (Warm Dishes, Soups) and dietary tags, is now strictly functional, drastically improving the application's usability for students with specific dietary or religious requirements.

### 2. Meaningful Data Orchestration & Filtering

- **Feedback:** Displaying 78 menu items simultaneously without robust categorization renders the data useless to the end-user. Furthermore, the 3D Map needed a clearer bidirectional purpose rather than just being a visual novelty.
- **Action:** We shifted our focus from simply *fetching* data to *orchestrating* it. We are implementing robust filtering logic to allow students to sort by location (Alma 1 vs. Alma 2), Price, and Dietary Preferences. We also realigned the 3D Map to act as a macro-indexer, ensuring that the geographical visualization provides immediate, actionable context to the menu items.

### 3. Focused Scope & Decoupled Architecture

- **Strategy:** We abandoned the Housing and Transport modules to focus entirely on perfecting the Alma Food experience. To prevent the app from breaking if the Alma servers go offline during grading, we engineered a pipeline to download the data locally. The SPA now loads instantly and securely, freeing up our resources to creatively combine complex web services like MapTiler (3D Globe) and Azure OpenAI (Cultural Dish Explanations).

## 📝 Development & Changelog

*A chronological log to track project milestones, team contributions, and design thinking.*

**[5 May 2026] - Interactive AI Cultural Historian & Serverless Security (YIN Renlong)**

To elevate the "Creativity" and "Dynamic Data" aspects of the project, I evolved the previously planned static AI integration into a fully interactive, conversational "Culinary Historian" accessible across both the main Grid (index-demo2.html) and the 3D Globe (map.html).

- **Interactive AI Dialogue System & Context Engineering:**
  - *Architecture:* Implemented a stateful conversation model using the OpenAI API (gpt-4o-mini). Instead of forcing the user to type their initial question, the JavaScript silently acts as a context broker. Upon clicking "Ask AI", the script uses the data-id attribute to index the encyclopediaData array, extracts the dish's Dutch/English names, dietary tags (e.g., Vegan), and allergens, and bundles them into a hidden System Prompt.
  - *State Management:* Engineered a Javascript memory array (currentChatHistory) that stores the ongoing conversation. This allows the user to ask follow-up questions (e.g., "Is it spicy?") and the AI natively understands the anaphoric reference to the specific dish.
  - *HCI & UX Design:* Designed a luxury-themed, backdrop-blurred chat modal. Implemented responsive UI feedback, including an animate-pulse loading state ("Thinking... ✦") to mask API latency. Programmed custom auto-scrolling logic (scrollTop = scrollHeight) to mimic native messaging apps, alongside distinct visual styling for user prompts (gold/dark green right-aligned bubbles) versus AI responses (left-aligned with golden borders).
- **Enterprise-Grade Security (Cloudflare Workers Proxy):**
  - *Security Challenge:* Directly calling the OpenAI API from vanilla JavaScript exposes the secret sk-proj-... API key in the browser's Network tab and GitHub repository, violating modern security protocols.
  - *Serverless Solution:* I architected and deployed a free Serverless Edge proxy using **Cloudflare Workers** (alma-ai-proxy). The frontend now sends a safe POST request to this worker. The worker handles CORS preflight (OPTIONS) requirements, securely injects the hidden environment variable (CFWORKER_OPENAI_API_KEY_WIS_KULEUVEN_2026), forwards the payload to OpenAI, and returns the response to the client. This guarantees 100% repository security and protects against unauthorized API billing abuse.
- **Advanced Debugging & Application Robustness:**
  - *DOM Lifecycle & Event Delegation:* Encountered a silent failure where the chat's "Ask" button and "Enter" keypress would not trigger the API. Diagnosed this as a DOM-loading issue caused by the modal being initially hidden (hidden class). Resolved this by engineering an **Event Delegation** pattern, attaching the click/keypress listeners to the global document and filtering via e.target.closest(), ensuring 100% reliable execution regardless of DOM re-renders.
  - *Lexical Scoping Resolution:* Debugged a severe ReferenceError: encyclopediaData is not defined explicitly on the map.js page. Traced the bug to a block-scoping error where the JSON payload was trapped inside initCulturalMap() via a const declaration. Fixed this by declaring a global let encyclopediaData = [] and mutating it inside the fetch block, safely exposing the data to the global click listeners.
  - *Graceful Degradation:* Wrapped all API fetch logic in strict try/catch blocks. If the user loses internet connection or the Cloudflare Edge node times out, the application catches the promise rejection and dynamically injects a styled fallback error message ("Sorry, connection lost."), fulfilling the rubric's strict requirement for zero unhandled crashes.

**[5 May 2026] - Interactive 3D Globe & UX Engineering (YIN Renlong)**

To fulfill the "Dynamic Data" and "Creativity" requirements of the rubric, I architected a dedicated "Taste The World" module (`map.html`) to visualize the cultural origins of our cafeteria food for international freshmen.

* **3D Interactive Cultural Map (MapTiler SDK & MapLibre):**
  * *Architecture:* Integrated the MapTiler SDK (v4.0.1) via CDN to generate an interactive 3D rotating globe (`projection: 'globe'`). The map dynamically iterates through our pre-processed `alma_encyclopedia_dish_soup.json` file, ensuring the 3D globe renders instantly with zero API latency.
  * *HCI & Visual Design:* Selected the `MapStyle.WINTER` map style to create a stunning, crisp aesthetic that contrasts beautifully against our dark UI. Programmed custom DOM elements to replace default map markers with animated, glowing gold pins. Synchronized the map's popup UI to perfectly mirror the CSS styling of our main menu cards.
  * *Algorithmic Geocoding & Debugging:* Since the raw Alma API lacks GPS data, I engineered a "Cultural Geocoder" dictionary in Vanilla JS that cross-references dish names (e.g., "Fajita", "Stoofvlees") and assigns them latitude/longitude coordinates (Mexico, Belgium, etc.). *Debugging Insight:* I mathematically constrained the randomization offsets for clustered pins to `0.4` degrees (~44km) to ensure pins rendered accurately on landmasses rather than spilling into the ocean.

* **[IN PROGRESS] Azure OpenAI Integration (Dynamic Data):**
  * *Current Status:* Preparing the front-end architecture to act as a "cultural culinary historian."
  * *Planned Implementation:* Developing a Serverless `fetch()` pipeline from the browser to an Azure OpenAI deployment. The architecture is set up to capture the `data-nl-name` from the UI buttons and pass it to a strict system prompt. 
  * *UI Preparation:* Currently wireframing a seamless, backdrop-blurred modal with a pulsing loading state ("Consulting the chef...") to handle anticipated API latency while maintaining strong HCI principles.

* **Robustness & Error Handling:**
  * Secured the entire Azure OpenAI API call within strict `try/catch` blocks. If the Azure endpoint times out or fails, the application does not crash. Instead, the UI catches the error and gracefully displays a fallback message ("The chef is currently unavailable. Please try again later."), guaranteeing our 5/5 score for zero application errors.

**[30 April 2026] - Core Architecture, Data Engineering & Front-End UI/UX (YIN Renlong)**

As the core architect for the Food module, I engineered the end-to-end data pipeline and designed the resulting Single Page Application (SPA) frontend. My work spanned from raw API extraction to advanced DOM manipulation and HCI-focused UI design.

* **API Sourcing & Custom Extraction Pipeline (Python):**
  * Secured explicit permission from *Quivr.be* to utilize the official Alma API.
  * Engineered a custom Python extraction script utilizing `requests`, custom user-agent headers, and programmatic rate-limiting (`time.sleep`) to safely scrape historical and future data without triggering server DOS protections.
  * Successfully extracted 405 daily JSON files across 9 Alma locations (spanning March to April 2026), yielding over 19,600 raw menu records.
* **Data Auditing, Debugging & Cleansing:**
  * Wrote multiple diagnostic Python scripts (`advanced_auditor.py`, `granular_auditor.py`) to debug the raw API data. Successfully identified and handled massive edge cases: KU Leuven Easter holiday closures (missing data), static weekend menus (duplicate JSON arrays), internal Alma IT testing errors (diets labeled "Todo" or "Weg"), and deprecated meals (labeled "ZZZ").
  * **Data Consolidation Pipeline:** To optimize the SPA's load time, I built `generate_encyclopedia.py` to flatten the 19,600 raw rows into a highly optimized, single `alma_encyclopedia_dish_soup.json` file. 
  * *Iteration & Refinement:* Wrote Regex logic to strip repetitive portion sizes `(B)`/`(S)` from soup names, excluded side dishes (e.g., extra broccoli), and implemented an "Image Priority" algorithm that automatically kept database entries with photos while discarding duplicate text-only entries. The final payload was perfectly condensed to 75 unique meals.
* **Front-End Architecture & JavaScript Logic:**
  * Designed the app to fetch the consolidated JSON payload directly into browser memory on load, allowing for lightning-fast, serverless category filtering (Warm Dishes vs. Soups) without any API latency.
  * Handled complex UI data states in Vanilla JS, such as converting `null` default prices into a stylized "FREE" tag, and flattening nested diet/allergy JSON arrays into clean, comma-separated typography.
  * Pre-configured data attributes (e.g., `data-nl-name`) into the DOM buttons to prepare the architecture for our upcoming DeepL and Azure OpenAI API integrations.
* **HCI, UI/UX Design & Visual Iteration (HTML/Tailwind):**
  * *Aesthetic Direction:* Rejected standard, generic card grids in favor of a highly responsive, premium "Editorial Magazine" layout (dark forest green `#1a2421`, pale gold `#d8cbb8`, with `Playfair Display` and `Great Vibes` typography). Designed a 50/50 split-screen photographic hero section with overlapping luxury text.
  * *Algorithmic Grid Rendering:* To solve the HCI problem of visual monotony when scrolling through 75 food items, I engineered a mathematical DOM-rendering loop. Using modulo operators (`index % 6`), the JavaScript dynamically interleaves full-cover, photographic promotional blocks with cursive typography directly into the grid between standard food cards.
  * *Graceful Error Fallbacks:* Discovered that ~45% of Alma API items lack images. Instead of allowing broken UI layouts, I engineered a custom SVG fallback system. Combined with Tailwind's `object-contain` and `drop-shadow-2xl`, both real transparent PNGs and fallback placeholders float seamlessly within the elegant borderless grid.

* **Infrastructure Robustness (Decoupling):**
  * To ensure maximum reliability during grading and eliminate dependencies on the unpredictable Alma servers, I wrote a Python script to scrape and download the physical image files locally to the /assets/img/foods/ directory. The JSON database was automatically rewritten to point to these local assets. By serving the entire payload via GitHub Pages' CDN, the SPA achieves 100% uptime, instant load speeds, and total offline capability.

**[30 April 2026] - Alma API Data Profiling & Statistical Analysis (Zhao Sirui)**
* **Data Auditing:** Conducted a comprehensive statistical analysis of the raw Alma JSON dataset. Parsed 19,600 menu records spanning 9 locations over 45 days (2026-03-01 to 2026-04-28). 
* **Data Integrity & Deduplication:** Verified that the dataset was clean, with zero `id-date-location` duplicates. Identified 812 unique item IDs and condensed them into 216 unique English dish names. Accurately mapped the core categories, isolating exactly 61 "Warm buffet" dishes and 27 "Soups".
* **Filter Logic Strategy:** Discovered a critical API limitation: the lack of raw ingredient lists (e.g., tomatoes, chicken). To solve this, I mapped the distribution of the `allergies` and `diets` metadata to power our frontend filter panel. 
    * *Dietary Mapping:* Highlighted highly populated tags to prioritize in the UI, such as Vegetarian (94 unique dishes), Vegan (41), Pork (23), and Poultry (26).
    * *Allergen Mapping:* Quantified the prevalence of specific allergens across the menu (e.g., Wheat in 180 dishes, Milk in 134, Eggs in 104) to ensure our exclusion filters are robust and safe for students.



**[30 April 2026] - Information Architecture & Feature Mapping (Hou Yilin)**

* **UI/UX Planning:** Developed the foundational "Page Structure & Function" matrix using an Excel spreadsheet to wireframe the application's user flow and interaction logic.
* **Feature Conceptualization:** Outlined the core modules required for the Single Page Application (SPA), including a "Menu of Today" section and a historical "Food Encyclopedia" section.
* **HCI Specifications:** Drafted the functional requirements for the frontend elements, including:
    * *Filter Panels:* Dual-action filtering (click to select diets, click to exclude allergens).
    * *Interactive Elements:* The "Ask AI" button for dish explanations, Language switchers (EN/NL/CN), and "Add to Favorite" toggles.
    * *Contextual UI:* Hover tooltips for Alma opening hours, a geolocation prompt ("Nearest Alma for you?"), and visual hierarchy rules for displaying the subsidized student price dynamically. 
* *Note:* While this spreadsheet served as an early conceptual wireframe rather than the final technical layout, it successfully established the core feature requirements and Human-Computer Interaction (HCI) goals that guided the team's subsequent coding phases.



**[22 April 2026] - Initial Setup & Homepage Prototype (YIN Renlong)**

* **Architecture:** Created the GitHub Organization, set up the `leuvenlife-web` repository, and built the standard web development folder structure (`/css`, `/js`, `/assets`, `/docs`) using macOS CLI.
* **UI/UX Design Thinking:** Designed and coded the initial `index.html` homepage prototype. 
    * *Concept:* I chose a modern **Swiss Grid / Brutalist design style** using Tailwind CSS. This style uses a deep KU Leuven-inspired blue background (`#1920A6`) with strong, full-height vertical white lines. 
    * *Rationale:* This specific 4-column layout perfectly matches our project's "Three Pillar" concept. It visually separates **Food**, **Housing**, and **Transport** into equal, responsive columns. 
    * *Refinements:* To improve clickability and visual hierarchy, I removed numerical prefixes from the buttons, increased the font size, and implemented full-height borders (`border-l`) that stretch across the entire screen, ensuring the UI remains clean and structural across both desktop and mobile devices.
* **Deployment:** Added the live GitHub Pages URL to the README for easy access.

