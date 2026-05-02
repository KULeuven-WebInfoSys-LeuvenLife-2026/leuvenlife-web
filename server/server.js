require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// 👉 read cache
let cache = {};
if (fs.existsSync('translations.json')) {
  cache = JSON.parse(fs.readFileSync('translations.json', 'utf-8'));
}

// 👉 normalize text
function normalize(text) {
  return text.trim().toLowerCase();
}

// 🚀 FAST TRANSLATE (batch + cache)
app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  try {
    // 1️⃣ find out content requiring translation
    const textsToTranslate = [];
    const indexMap = [];

    text.forEach((t, i) => {
      const key = normalize(t);

      if (!cache[key] || !cache[key][targetLang]) {
        textsToTranslate.push(t);
        indexMap.push(i);
      }
    });

    // 2️⃣ call API for one time, key optimization
    let translatedResults = [];

    if (textsToTranslate.length > 0) {
      const response = await axios.post(
        'https://api-free.deepl.com/v2/translate',
        {
          text: textsToTranslate,
          target_lang: targetLang
        },
        {
          headers: {
            'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      translatedResults = response.data.translations;
    }

    // 3️⃣ final combinatikon
    const finalResults = [];

    let newIndex = 0;

    text.forEach((t, i) => {
      const key = normalize(t);

      // cached already
      if (cache[key] && cache[key][targetLang]) {
        finalResults.push({ text: cache[key][targetLang] });
      } else {
        // new translation
        const translated = translatedResults[newIndex].text;
        newIndex++;

        if (!cache[key]) cache[key] = {};
        cache[key][targetLang] = translated;

        finalResults.push({ text: translated });
      }
    });

    // 4️⃣ write into cache file
    fs.writeFileSync('translations.json', JSON.stringify(cache, null, 2));

    res.json({ translations: finalResults });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Translation error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
