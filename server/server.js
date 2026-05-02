require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ IMPORTANT: Render needs dynamic port
const PORT = process.env.PORT || 3000;

// ✅ DEBUG: check env (very important for Render)
console.log("DEEPL KEY:", process.env.DEEPL_API_KEY);

// 👉 read cache
let cache = {};
if (fs.existsSync('translations.json')) {
  try {
    cache = JSON.parse(fs.readFileSync('translations.json', 'utf-8'));
  } catch (e) {
    cache = {};
  }
}

// 👉 normalize text
function normalize(text) {
  return text.trim().toLowerCase();
}

// 🚀 FAST TRANSLATE (batch + cache)
app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  // ❗ basic validation
  if (!text || !Array.isArray(text)) {
    return res.status(400).send('Invalid text input');
  }

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

    let translatedResults = [];

    // 2️⃣ call DeepL only if needed
    if (textsToTranslate.length > 0) {

      if (!process.env.DEEPL_API_KEY) {
        console.error("❌ Missing DEEPL_API_KEY");
        return res.status(500).send("Missing API key");
      }

      const response = await axios.post(
        'https://api-free.deepl.com/v2/translate',
        new URLSearchParams({
          target_lang: targetLang,
          text: textsToTranslate
        }),
        {
          headers: {
            'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      translatedResults = response.data.translations;
    }

    // 3️⃣ combine results
    const finalResults = [];
    let newIndex = 0;

    text.forEach((t) => {
      const key = normalize(t);

      if (cache[key] && cache[key][targetLang]) {
        finalResults.push({ text: cache[key][targetLang] });
      } else {
        const translated = translatedResults[newIndex]?.text || t;
        newIndex++;

        if (!cache[key]) cache[key] = {};
        cache[key][targetLang] = translated;

        finalResults.push({ text: translated });
      }
    });

    // 4️⃣ save cache
    fs.writeFileSync('translations.json', JSON.stringify(cache, null, 2));

    res.json({ translations: finalResults });

  } catch (error) {
    console.error("❌ DeepL ERROR:", error.response?.data || error.message);
    res.status(500).send('Translation error');
  }
});

// ✅ health check (optional but useful)
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
