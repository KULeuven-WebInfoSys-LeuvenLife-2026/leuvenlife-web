# LeuvenLife: Digital Student Guide 
**KU Leuven Web Information Systems [B-KUL-G0Y11A] - Group 4 (2026)**

LeuvenLife is a centralized web application designed as a digital onboarding guide for international students arriving at KU Leuven. By integrating real-time web services (APIs), the platform acts as the first website a new student visits, solving concrete problems across three main pillars: **Food, Housing, and Transport**.

🚀 **Live Demo1:** [View the Homepage Prototype Here](https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/index-demo1.html)

🚀 **Live Demo2:** [View the Homepage Prototype Here](https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/index-demo2.html)

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



**[30 April 2026] - Alma API Data Engineering & Food Encyclopedia UI (YIN Renlong & Team)**

* **API Sourcing & Extraction:** Reached out to *Quivr.be* to secure permission to utilize the official Alma API. Wrote a rate-limited Python script to fetch historical and future menu data (March–April 2026) across all 9 Alma locations, safely downloading 405 raw JSON files.
* **Data Auditing & Cleaning:** To ensure a robust SPA (Single Page Application), we performed a granular data audit. We discovered anomalies such as the KU Leuven Easter holiday closures and redundant weekend menus. To optimize loading times, I wrote a Python consolidation script (`generate_encyclopedia.py`) that flattened 19,600 raw JSON rows into a single `alma_encyclopedia_dish_soup.json` file. This process stripped duplicate sizes `(B)/(S)`, filtered out retired `ZZZ` items, handled missing images, and output exactly 75 unique Hot Dishes and Soups.
* **UI/UX Front-End Architecture:** Designed a highly responsive, elegant borderless layout for the Food module (`index-demo2.html`). 
  * *Aesthetic:* Adopted a premium, editorial magazine-style design using deep forest greens, pale gold accents, and classic typography (`Playfair Display` and `Great Vibes`).
  * *HCI Decisions:* To prevent visual monotony when displaying 75 food cards, I engineered an interleaved DOM-rendering algorithm in Vanilla JavaScript. The JS dynamically reconstructs the grid to inject beautiful, full-cover promotional image blocks at specific mathematical intervals (e.g., every 4th or 5th card). 
  * *Graceful Fallbacks:* Implemented responsive `object-contain` rules for transparent PNGs and integrated an elegant SVG fallback for the ~45% of items missing official images, ensuring the grid remains structurally perfect. Added client-side category filtering (Warm Dishes vs. Soups) without requiring page reloads.



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

