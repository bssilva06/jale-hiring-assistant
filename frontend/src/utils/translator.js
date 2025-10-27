/**
 * Translation utility for dynamic content (job descriptions, etc.)
 * Uses client-side caching to avoid re-translating the same content
 */

const translationCache = new Map();

/**
 * Translate text from one language to another using Claude AI
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - Target language ('en' or 'es')
 * @param {string} sourceLanguage - Source language ('en' or 'es')
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text, targetLanguage, sourceLanguage = 'en') => {
  // Don't translate if target is same as source
  if (targetLanguage === sourceLanguage) {
    return text;
  }

  // Check cache first
  const cacheKey = `${text}-${targetLanguage}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const response = await fetch('http://localhost:5000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage
      })
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    const translatedText = data.translatedText;

    // Cache the result
    translationCache.set(cacheKey, translatedText);

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text;
  }
};

/**
 * Translate a job object's content
 * @param {Object} job - Job object with title, description, requirements
 * @param {string} targetLanguage - Target language ('en' or 'es')
 * @returns {Promise<Object>} Job object with translated fields
 */
export const translateJob = async (job, targetLanguage) => {
  if (!job) return job;

  // If job already has language field and matches target, no translation needed
  if (job.language === targetLanguage) {
    return job;
  }

  try {
    const [translatedTitle, translatedDescription] = await Promise.all([
      translateText(job.title, targetLanguage, job.language || 'en'),
      translateText(job.description, targetLanguage, job.language || 'en')
    ]);

    // Translate requirements array
    let translatedRequirements = job.requirements;
    if (Array.isArray(job.requirements) && job.requirements.length > 0) {
      translatedRequirements = await Promise.all(
        job.requirements.map(req => translateText(req, targetLanguage, job.language || 'en'))
      );
    }

    return {
      ...job,
      title: translatedTitle,
      description: translatedDescription,
      requirements: translatedRequirements,
      _originalLanguage: job.language || 'en',
      _translated: true
    };
  } catch (error) {
    console.error('Error translating job:', error);
    return job; // Return original if translation fails
  }
};

/**
 * Translate an array of jobs
 * @param {Array} jobs - Array of job objects
 * @param {string} targetLanguage - Target language ('en' or 'es')
 * @returns {Promise<Array>} Array of translated job objects
 */
export const translateJobs = async (jobs, targetLanguage) => {
  if (!Array.isArray(jobs)) return jobs;
  
  try {
    return await Promise.all(
      jobs.map(job => translateJob(job, targetLanguage))
    );
  } catch (error) {
    console.error('Error translating jobs:', error);
    return jobs;
  }
};

/**
 * Clear translation cache (useful for testing or memory management)
 */
export const clearTranslationCache = () => {
  translationCache.clear();
};
