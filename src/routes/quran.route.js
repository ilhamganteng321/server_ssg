// src/routes/quran.route.js
import express from 'express';
import createDbConnection from '../utils/db.js';

const router = express.Router();

// Connect to the quran.db SQLite database
const db = createDbConnection();

/**
 * Get all surahs
 * GET /api/quran/surahs
 */
router.get('/surahs', (req, res) => {
    try {
        // Prepare and execute the SQL query to get all surahs
        const query = db.prepare(`
      SELECT no_surat, nm_surat, nm_surat2, arti_surat, jml_ayat, tmp_turun, asb_nuzul
      FROM m_quran_t
      ORDER BY no_surat ASC
    `);

        const surahs = query.all();
        res.status(200).json(surahs);
    } catch (error) {
        console.error('Error fetching surahs:', error);
        res.status(500).json({ message: 'Failed to fetch surah list' });
    }
});

/**
 * Get details of a specific surah with its ayahs
 * GET /api/quran/surah/:id
 */
router.get('/surah/:id', (req, res) => {
    try {
        const { id } = req.params;

        // Validate surah ID
        if (!id || isNaN(id) || id < 1 || id > 114) {
            return res.status(400).json({ message: 'Invalid surah ID' });
        }

        // Get surah details
        const surahQuery = db.prepare(`
      SELECT no_surat, nm_surat, nm_surat2, arti_surat, jml_ayat, tmp_turun, asb_nuzul
      FROM m_quran_t
      WHERE no_surat = ?
    `);

        const surah = surahQuery.get(id);

        if (!surah) {
            return res.status(404).json({ message: 'Surah not found' });
        }

        // Get all ayahs for this surah
        const ayahsQuery = db.prepare(`
      SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
      FROM m_surat_t
      WHERE no_surat = ?
      ORDER BY no_ayat ASC
    `);

        const ayahs = ayahsQuery.all(id);

        // Combine surah details with its ayahs
        const result = {
            ...surah,
            ayahs
        };

        res.status(200).json(result);
    } catch (error) {
        console.error(`Error fetching surah ${req.params.id}:`, error);
        res.status(500).json({ message: 'Failed to fetch surah details' });
    }
});

/**
 * Get all ayahs of a surah
 * GET /api/quran/surah/:surahId/ayat
 */
router.get('/surah/:surahId/ayat', (req, res) => {
    try {
        const { surahId } = req.params;

        // Validate surah ID
        if (!surahId || isNaN(surahId) || surahId < 1 || surahId > 114) {
            return res.status(400).json({ message: 'Invalid surah ID' });
        }

        // Get all ayahs for this surah
        const query = db.prepare(`
      SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
      FROM m_surat_t
      WHERE no_surat = ?
      ORDER BY no_ayat ASC
    `);

        const ayahs = query.all(surahId);

        if (ayahs.length === 0) {
            return res.status(404).json({ message: 'No ayahs found for this surah' });
        }

        res.status(200).json(ayahs);
    } catch (error) {
        console.error(`Error fetching ayahs for surah ${req.params.surahId}:`, error);
        res.status(500).json({ message: 'Failed to fetch ayahs' });
    }
});

/**
 * Get a specific ayah from a surah
 * GET /api/quran/surah/:surahId/ayat/:ayatId
 */
router.get('/surah/:surahId/ayat/:ayatId', (req, res) => {
    try {
        const { surahId, ayatId } = req.params;

        // Validate IDs
        if (!surahId || isNaN(surahId) || surahId < 1 || surahId > 114) {
            return res.status(400).json({ message: 'Invalid surah ID' });
        }

        if (!ayatId || isNaN(ayatId)) {
            return res.status(400).json({ message: 'Invalid ayat ID' });
        }

        // Get the specific ayah
        const query = db.prepare(`
      SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
      FROM m_surat_t
      WHERE no_surat = ? AND no_ayat = ?
    `);

        const ayah = query.get(surahId, ayatId);

        if (!ayah) {
            return res.status(404).json({ message: 'Ayat not found' });
        }

        // Return as an array with one element for consistent frontend handling
        res.status(200).json([ayah]);
    } catch (error) {
        console.error(`Error fetching ayat ${req.params.ayatId} from surah ${req.params.surahId}:`, error);
        res.status(500).json({ message: 'Failed to fetch ayat' });
    }
});

/**
 * Get all ayahs in a specific juz
 * GET /api/quran/juz/:juzId
 */
router.get('/juz/:juzId', (req, res) => {
    try {
        const { juzId } = req.params;

        // Validate juz ID
        if (!juzId || isNaN(juzId) || juzId < 1 || juzId > 30) {
            return res.status(400).json({ message: 'Invalid juz ID' });
        }

        // Get all ayahs for this juz
        const query = db.prepare(`
      SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
      FROM m_surat_t
      WHERE no_juz = ?
      ORDER BY no_surat ASC, no_ayat ASC
    `);

        const ayahs = query.all(juzId);

        if (ayahs.length === 0) {
            return res.status(404).json({ message: 'No ayahs found for this juz' });
        }

        // Also get the surah name for each ayah
        const surahQuery = db.prepare(`
      SELECT no_surat, nm_surat
      FROM m_quran_t
      WHERE no_surat = ?
    `);

        const ayahsWithSurahInfo = ayahs.map(ayah => {
            const surahInfo = surahQuery.get(ayah.no_surat);
            return {
                ...ayah,
                surah_name: surahInfo ? surahInfo.nm_surat : null
            };
        });

        res.status(200).json(ayahsWithSurahInfo);
    } catch (error) {
        console.error(`Error fetching ayahs for juz ${req.params.juzId}:`, error);
        res.status(500).json({ message: 'Failed to fetch juz' });
    }
});

/**
 * Get ayahs by page number
 * GET /api/quran/page/:pageId
 */
router.get('/page/:pageId', (req, res) => {
    try {
        const { pageId } = req.params;

        // Validate page ID
        if (!pageId || isNaN(pageId) || pageId < 1 || pageId > 604) {
            return res.status(400).json({ message: 'Invalid page ID' });
        }

        // Get all ayahs for this page
        const query = db.prepare(`
      SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
      FROM m_surat_t
      WHERE no_hal = ?
      ORDER BY no_surat ASC, no_ayat ASC
    `);

        const ayahs = query.all(pageId);

        if (ayahs.length === 0) {
            return res.status(404).json({ message: 'No ayahs found for this page' });
        }

        // Also get the surah name for each ayah
        const surahQuery = db.prepare(`
      SELECT no_surat, nm_surat
      FROM m_quran_t
      WHERE no_surat = ?
    `);

        const ayahsWithSurahInfo = ayahs.map(ayah => {
            const surahInfo = surahQuery.get(ayah.no_surat);
            return {
                ...ayah,
                surah_name: surahInfo ? surahInfo.nm_surat : null
            };
        });

        res.status(200).json(ayahsWithSurahInfo);
    } catch (error) {
        console.error(`Error fetching ayahs for page ${req.params.pageId}:`, error);
        res.status(500).json({ message: 'Failed to fetch page' });
    }
});

/**
 * Search the Quran
 * GET /api/quran/search?q=:searchText
 */
router.get('/search', (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Search in both Arabic text and translation/tafsir
        const query = db.prepare(`
      SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
      FROM m_surat_t
      WHERE arab LIKE ? OR tafsir LIKE ?
      ORDER BY no_surat ASC, no_ayat ASC
      LIMIT 100
    `);

        const searchPattern = `%${q}%`;
        const results = query.all(searchPattern, searchPattern);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No matching ayahs found' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error(`Error searching Quran for "${req.query.q}":`, error);
        res.status(500).json({ message: 'Failed to search Quran' });
    }
});

export default router;