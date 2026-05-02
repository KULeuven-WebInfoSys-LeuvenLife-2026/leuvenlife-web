document.addEventListener("DOMContentLoaded", () => {

  const translateBtn = document.getElementById('btn-translate');
  const menu = document.getElementById('lang-menu');
  const options = document.querySelectorAll('.lang-option');

  let currentLang = 'EN';
  let isTranslating = false;

  let menuData = [];

  const DATA_URL = "https://kuleuven-webinfosys-leuvenlife-2026.github.io/leuvenlife-web/alma_encyclopedia_dish_soup.json";

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

  // 打开语言菜单
  translateBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  // ✅ 正确加载 JSON（关键修复点）
  fetch(DATA_URL)
    .then(res => {
      if (!res.ok) throw new Error("JSON load failed");
      return res.json();
    })
    .then(data => {

      console.log("RAW DATA:", data);

      // ✅ 正确读取 data.data
      menuData = data.data || [];

      console.log("MENU LENGTH:", menuData.length);

      if (menuData.length === 0) {
        throw new Error("Empty menu");
      }

      renderMenu('EN');
    })
    .catch(err => {
      console.error("❌ Load error:", err);
      uiElements.loader.innerText = "Failed to load menu";
    });

  // ✅ 渲染菜单（关键修复字段）
  function renderMenu(lang) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    menuData.forEach(item => {

      let title = '';

      if (lang === 'NL') {
        title = item.meal || "";
      } else {
        title = item.mealEn || item.meal || "";
      }

      const card = `
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-lg">${title}</h3>
        </div>
      `;

      grid.innerHTML += card;
    });

    uiElements.loader.classList.add('hidden');
    document.getElementById('menu-grid').classList.remove('hidden');
  }

  // 语言切换
  options.forEach(option => {
    option.addEventListener('click', async () => {

      const targetLang = option.dataset.lang;
      menu.classList.add('hidden');

      if (targetLang === currentLang) return;

      // UI文字切换
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

      // ✅ 中文（DeepL 修复版）
      if (targetLang === 'ZH') {

        if (isTranslating) return;
        isTranslating = true;

        translateBtn.innerText = "Translating...";

        const elements = document.querySelectorAll('#menu-grid h3');

        const texts = [];
        elements.forEach(el => texts.push(el.innerText));

        try {
          const res = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
              'Authorization': 'd380d287-feec-4ebf-b2b8-edfcf1d46086:fx',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: texts,
              target_lang: 'ZH'
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
