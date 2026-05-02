document.addEventListener("DOMContentLoaded", () => {

  const translateBtn = document.getElementById('btn-translate');
  const menu = document.getElementById('lang-menu');
  const options = document.querySelectorAll('.lang-option');

  let currentLang = 'EN';
  let isTranslating = false;

  // store data
  let menuData = [];

  // UI dictionary
  const UI_TEXT = {
    EN: {
      title: "A Taste of Alma",
      all: "All Items",
      warm: "Warm Dishes",
      soup: "Soups",
      loading: "Loading database..."
    },
    NL: {
      title: "Een voorproefje van Alma",
      all: "Alle artikelen",
      warm: "Warme gerechten",
      soup: "Soepen",
      loading: "Database laden..."
    },
    ZH: {
      title: "阿尔玛美食体验",
      all: "所有菜品",
      warm: "热菜",
      soup: "汤类",
      loading: "加载中..."
    }
  };

  const uiElements = {
    all: document.querySelector('[data-filter="all"]'),
    warm: document.querySelector('[data-filter="warm"]'),
    soup: document.querySelector('[data-filter="soup"]'),
    loader: document.getElementById('loader'),
    title: document.querySelector('h1')
  };

  // open language menu
  translateBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  // ✅ FIXED URL（你之前拼错了 encyclopedia）
  const DATA_URL = "https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/alma_encyclopedia_dish_soup.json";

  fetch(DATA_URL)
    .then(res => {
      if (!res.ok) {
        throw new Error("❌ JSON not found (check URL)");
      }
      return res.json();
    })
    .then(data => {

      // support multiple formats
      if (Array.isArray(data)) {
        menuData = data;
      } else if (data.days) {
        menuData = data.days.flatMap(day => day.meals || []);
      } else {
        menuData = [];
      }

      console.log("✅ Menu loaded:", menuData.length);
      renderMenu('EN');
    })
    .catch(err => {
      console.error("❌ Failed to load menu:", err);
      uiElements.loader.innerText = "Failed to load data";
    });

  function renderMenu(lang) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    menuData.forEach(item => {

      let title = '';
      let desc = '';

      if (lang === 'NL') {
        title = item.name_nl || item.name?.nl || item.name_en || "";
        desc = item.description_nl || item.description?.nl || item.description_en || "";
      } else {
        title = item.name_en || item.name?.en || item.name_nl || "";
        desc = item.description_en || item.description?.en || item.description_nl || "";
      }

      const card = `
        <div class="p-4">
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>
      `;

      grid.innerHTML += card;
    });

    uiElements.loader.classList.add('hidden');
    document.getElementById('menu-grid').classList.remove('hidden');
  }

  // language switch
  options.forEach(option => {
    option.addEventListener('click', async () => {

      const targetLang = option.dataset.lang;
      menu.classList.add('hidden');

      if (targetLang === currentLang) return;

      // update UI
      Object.keys(uiElements).forEach(key => {
        if (uiElements[key] && UI_TEXT[targetLang][key]) {
          uiElements[key].innerText = UI_TEXT[targetLang][key];
        }
      });

      // EN
      if (targetLang === 'EN') {
        renderMenu('EN');
        currentLang = 'EN';
        return;
      }

      // NL
      if (targetLang === 'NL') {
        renderMenu('NL');
        currentLang = 'NL';
        return;
      }

      // ZH (DeepL)
      if (targetLang === 'ZH') {

        if (isTranslating) return;
        isTranslating = true;

        translateBtn.innerText = "Translating...";

        // ✅ 加上介绍文本一起翻译
        const elements = document.querySelectorAll('h2, #menu-grid h3, #menu-grid p, section p');

        const texts = [];
        elements.forEach(el => texts.push(el.innerText));

        try {
          const res = await fetch('https://alma-translate.onrender.com/translate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              text: texts,
              targetLang: 'ZH'
            })
          });

          const data = await res.json();

          elements.forEach((el, i) => {
            if (data.translations[i]) {
              el.innerText = data.translations[i].text;
            }
          });

          currentLang = 'ZH';

        } catch (err) {
          console.error("❌ Translation error:", err);
        }

        translateBtn.innerText = "🌐";
        isTranslating = false;
      }

    });
  });

});
