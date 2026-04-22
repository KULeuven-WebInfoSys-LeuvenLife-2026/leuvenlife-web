# LeuvenLife: Digital Student Guide 🇧🇪
**KU Leuven Web Information Systems [B-KUL-G0Y11A] - Group 4 (2026)**

LeuvenLife is a centralized web application designed as a digital onboarding guide for international students arriving at KU Leuven. By integrating real-time web services (APIs), the platform acts as the first website a new student visits, solving concrete problems across three main pillars: **Food, Housing, and Transport**.

🚀 **Live Demo:** [View the Homepage Prototype Here](https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/)

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

**[22 April 2026] - Initial Setup & Homepage Prototype (YIN Renlong)**
* **Architecture:** Created the GitHub Organization, set up the `leuvenlife-web` repository, and built the standard web development folder structure (`/css`, `/js`, `/assets`, `/docs`) using macOS CLI.
* **UI/UX Design Thinking:** Designed and coded the initial `index.html` homepage prototype. 
    * *Concept:* I chose a modern **Swiss Grid / Brutalist design style** using Tailwind CSS. This style uses a deep KU Leuven-inspired blue background (`#1920A6`) with strong, full-height vertical white lines. 
    * *Rationale:* This specific 4-column layout perfectly matches our project's "Three Pillar" concept. It visually separates **Food**, **Housing**, and **Transport** into equal, responsive columns. 
    * *Refinements:* To improve clickability and visual hierarchy, I removed numerical prefixes from the buttons, increased the font size, and implemented full-height borders (`border-l`) that stretch across the entire screen, ensuring the UI remains clean and structural across both desktop and mobile devices.
* **Deployment:** Added the live GitHub Pages URL to the README for easy access.
