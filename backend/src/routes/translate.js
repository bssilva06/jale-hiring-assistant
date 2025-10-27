const express = require('express');
const router = express.Router();
const { translateText } = require('../services/claudeService');

// POST /api/translate
router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ 
        error: 'Missing required fields: text and targetLanguage' 
      });
    }

    // Validate languages
    const validLanguages = ['en', 'es'];
    if (!validLanguages.includes(targetLanguage) || !validLanguages.includes(sourceLanguage)) {
      return res.status(400).json({ 
        error: 'Invalid language. Supported languages: en, es' 
      });
    }

    // Don't translate if source and target are the same
    if (targetLanguage === sourceLanguage) {
      return res.json({ translatedText: text });
    }

    console.log(`🌐 Translating from ${sourceLanguage} to ${targetLanguage}...`);
    
    const translatedText = await translateText(text, targetLanguage, sourceLanguage);

    res.json({ translatedText });
  } catch (error) {
    console.error('Translation API error:', error);
    res.status(500).json({ 
      error: 'Translation failed',
      message: error.message 
    });
  }
});

module.exports = router;
