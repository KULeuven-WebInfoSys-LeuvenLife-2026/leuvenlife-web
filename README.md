# LeuvenLife: Digital Student Guide 
**KU Leuven Web Information Systems [B-KUL-G0Y11A] - Group 4 (2026)**

LeuvenLife is a centralized web application designed as a digital onboarding guide for international students arriving at KU Leuven. By integrating real-time web services (APIs), the platform acts as the first website a new student visits, solving concrete problems across three main pillars: **Food, Housing, and Transport**.

🚀 **Live Demo1:** [View the Homepage Prototype Here](https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/index-demo1.html)

🚀 **Live Demo2:** [View the Homepage Prototype Here](https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/index-demo2.html)

🚀 **Live Demo3 (map):** [View the Homepage Prototype Here](https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/map.html)

## 👥 Team Members
* YIN Renlong
* Guo Lingzhi
* Zhao Sirui
* Hou Yilin

## 📂 Repository Architecture
This is a pure frontend web application (HTML5, CSS3, JavaScript). Please place your files in the following directories:
* 📄 `index.html` - The main homepage/landing page.
* 📁 `/css` - Custom CSS files (to be used alongside Tailwind/Bootstrap).
* 📁 `/js` - JavaScript logic, API fetch calls, and DOM manipulation.
* 📁 `/assets` - Images, logos, and UI icons.
* 📁 `/docs` - Project proposals, Figma UI sketches, and the final PDF report.

---

## 🎯 Project Strategy & Mentor Feedback
Based on our mentor meeting, our team is focusing heavily on **User Experience (UX) and Design** before diving into complex API logic. 
1. **Design First:** We are sketching the UI (Figma) before coding to ensure a unified user flow.
2. **Scope Overload:** To avoid a cluttered design, we will carefully limit our API scope (e.g., potentially focusing purely on Alma for the Food pillar).
3. **Robustness:** We will prioritize an error-free frontend. A backup video will be recorded for the final presentation in case of live API rate limits.

---

## 📝 Development & Changelog
*A chronological log to track project milestones, team contributions, and design thinking.*



**[5 May 2026] - Interactive 3D Globe & Azure OpenAI Integration (YIN Renlong)**

To fulfill the "Dynamic Data" and "Creativity" requirements of the rubric, I architected a dedicated "Taste The World" module (`map.html`) and integrated a live Large Language Model (LLM) to act as a cultural culinary historian for international students.

* **3D Interactive Cultural Map (MapTiler & MapLibre GL JS):**
  * *Architecture:* Integrated the MapTiler SDK (v4.0.1) via CDN to generate an interactive 3D rotating globe (`projection: 'globe'`). This serves as a secondary, highly creative view of our Food Encyclopedia.
  * *HCI & Visual Design:* Implemented the `MapStyle.WINTER` map style to create a stunning, high-contrast aesthetic against our dark forest green UI. Programmed custom DOM elements to replace default map markers with animated, glowing gold pins. Synchronized the map's popup UI to perfectly mirror the CSS styling of our main menu cards.
  * *Algorithmic Geocoding & Debugging:* Since the Alma API lacks GPS data, I engineered a "Cultural Geocoder" dictionary in Vanilla JS that cross-references dish names (e.g., "Fajita", "Stoofvlees") and assigns them latitude/longitude coordinates (Mexico, Belgium, etc.). *Debugging Insight:* I mathematically constrained the randomization offsets for clustered pins to `0.4` degrees (~44km) to ensure pins rendered accurately on landmasses rather than spilling into the ocean.

* **Azure OpenAI Integration (Dynamic Data):**
  * *Serverless API Connection:* Built a direct `fetch()` pipeline from the browser to our Azure OpenAI deployment. 
  * *Prompt Engineering:* Wrote a strict system prompt instructing the AI to act as a "culinary historian" and return exactly two elegant sentences of cultural context based on the native Dutch dish name (`data-nl-name`).
  * *UI Implementation:* Designed a seamless, backdrop-blurred modal that triggers when a user clicks the "ASK AI ✦" button. It features a pulsing loading state ("Consulting the chef...") to respect HCI principles during API latency.

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

