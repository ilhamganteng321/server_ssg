// src/routes/quran.route.js
import express from 'express';
import createDbConnection from '../utils/db.js';

const router = express.Router();

// Connect to the quran.db SQLite database

/**
 * Get all surahs
 * GET /api/quran/surahs
*/
router.get('/surahs', async (req, res) => {
  const db = await createDbConnection();
    try {
      const surahs = await db.all(`
        SELECT no_surat, nm_surat, nm_surat2, arti_surat, jml_ayat, tmp_turun, asb_nuzul
        FROM m_quran_t
        ORDER BY no_surat ASC
      `);
      res.status(200).json(surahs);
    } catch (error) {
      console.error('Error fetching surahs:', error);
      res.status(500).json({ message: 'Failed to fetch surah list' });
    }finally {
      db.close();
    }
  });
  
  /**
   * Get details of a specific surah with its ayahs
   * GET /api/quran/surah/:id
   */
  router.get('/surah/:id', async (req, res) => {
    const db = await createDbConnection();
    try {
      const { id } = req.params;
      
      // Validate surah ID
      if (!id || isNaN(id) || id < 1 || id > 114) {
        return res.status(400).json({ message: 'pilih no surat dari 1 - 114' });
      }
      
      
      // Get surah details
      const surah = await db.get(`
        SELECT no_surat, nm_surat, nm_surat2, arti_surat, jml_ayat, tmp_turun, asb_nuzul
        FROM m_quran_t
        WHERE no_surat = ?
      `, id);
      
      if (!surah) {
        await db.close();
        return res.status(404).json({ message: 'Surah not found' });
      }
      
      // Get all ayahs for this surah
      const ayahs = await db.all(`
        SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
        FROM m_surat_t
        WHERE no_surat = ?
        ORDER BY no_ayat ASC
      `, id);
      
      // Combine surah details with its ayahs
      const result = {
        ...surah,
        ayahs
      };
      
      res.status(200).json(result);
    } catch (error) {
      console.error(`Error fetching surah ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to fetch surah details' });
    }finally {
      await db.close();
    }
  });
  
  /**
   * Get all ayahs of a surah
   * GET /api/quran/surah/:surahId/ayat
   */
  router.get('/surah/:surahId/ayat', async (req, res) => {
    const db = await createDbConnection();
    try {
      const { surahId } = req.params;
      
      // Validate surah ID
      if (!surahId || isNaN(surahId) || surahId < 1 || surahId > 114) {
        return res.status(400).json({ message: 'Invalid surah ID' });
      }
      
      
      // Get all ayahs for this surah
      const ayahs = await db.all(`
        SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
        FROM m_surat_t
        WHERE no_surat = ?
        ORDER BY no_ayat ASC
      `, surahId);
      
      if (ayahs.length === 0) {
        await db.close();
        return res.status(404).json({ message: 'No ayahs found for this surah' });
      }
      
      res.status(200).json(ayahs);
    } catch (error) {
      console.error(`Error fetching ayahs for surah ${req.params.surahId}:`, error);
      res.status(500).json({ message: 'Failed to fetch ayahs' });
    }finally{
      await db.close();
    }
  });
  
  /**
   * Get a specific ayah from a surah
   * GET /api/quran/surah/:surahId/ayat/:ayatId
   */
  router.get('/surah/:surahId/ayat/:ayatId', async (req, res) => {
    const db = await createDbConnection();
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
      const ayah = await db.get(`
        SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
        FROM m_surat_t
        WHERE no_surat = ? AND no_ayat = ?
      `, [surahId, ayatId]);
      
      if (!ayah) {
        await db.close();
        return res.status(404).json({ message: 'Ayat not found' });
      }
      
      // Return as an array with one element for consistent frontend handling
      res.status(200).json([ayah]);
    } catch (error) {
      console.error(`Error fetching ayat ${req.params.ayatId} from surah ${req.params.surahId}:`, error);
      res.status(500).json({ message: 'Failed to fetch ayat' });
    }finally{
      await db.close();
    }
  });
  
  /**
   * Get all ayahs in a specific juz
   * GET /api/quran/juz/:juzId
   */
  router.get('/juz/:juzId', async (req, res) => {
    const db = await createDbConnection();
    try {
      const { juzId } = req.params;
      
      // Validate juz ID
      if (!juzId || isNaN(juzId) || juzId < 1 || juzId > 30) {
        return res.status(400).json({ message: 'Invalid juz ID' });
      }
          
      // Get all ayahs for this juz
      const ayahs = await db.all(`
        SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
        FROM m_surat_t
        WHERE no_juz = ?
        ORDER BY no_surat ASC, no_ayat ASC
      `, juzId);
      
      if (ayahs.length === 0) {
        await db.close();
        return res.status(404).json({ message: 'No ayahs found for this juz' });
      }
      
      // Get all surah names for reference
      const surahNames = await db.all(`
        SELECT no_surat, nm_surat
        FROM m_quran_t
      `);
      
      // Create a lookup map for faster access
      const surahMap = {};
      surahNames.forEach(surah => {
        surahMap[surah.no_surat] = surah.nm_surat;
      });
      
      // Add surah names to ayahs
      const ayahsWithSurahInfo = ayahs.map(ayah => ({
        ...ayah,
        surah_name: surahMap[ayah.no_surat] || null
      }));
      
      res.status(200).json(ayahsWithSurahInfo);
    } catch (error) {
      console.error(`Error fetching ayahs for juz ${req.params.juzId}:`, error);
      res.status(500).json({ message: 'Failed to fetch juz' });
    }finally{
      await db.close();
    }
  });
  
  /**
   * Get ayahs by page number
   * GET /api/quran/page/:pageId
   */
  router.get('/page/:pageId', async (req, res) => {
    const db = await createDbConnection();
    try {
      const { pageId } = req.params;
      
      // Validate page ID
      if (!pageId || isNaN(pageId) || pageId < 1 || pageId > 604) {
        return res.status(400).json({ message: 'Invalid page ID' });
      }
          
      // Get all ayahs for this page
      const ayahs = await db.all(`
        SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
        FROM m_surat_t
        WHERE no_hal = ?
        ORDER BY no_surat ASC, no_ayat ASC
      `, pageId);
      
      if (ayahs.length === 0) {
        await db.close();
        return res.status(404).json({ message: 'No ayahs found for this page' });
      }
      
      // Get all surah names for reference
      const surahNames = await db.all(`
        SELECT no_surat, nm_surat
        FROM m_quran_t
      `);
      a
      // Create a lookup map for faster access
      const surahMap = {};
      surahNames.forEach(surah => {
        surahMap[surah.no_surat] = surah.nm_surat;
      });
      
      // Add surah names to ayahs
      const ayahsWithSurahInfo = ayahs.map(ayah => ({
        ...ayah,
        surah_name: surahMap[ayah.no_surat] || null
      }));
      
      res.status(200).json(ayahsWithSurahInfo);
    } catch (error) {
      console.error(`Error fetching ayahs for page ${req.params.pageId}:`, error);
      res.status(500).json({ message: 'Failed to fetch page' });
    }finally{
      await db.close();
    }
  });
  
  /**
   * Search the Quran
   * GET /api/quran/search?q=:searchText
   */
  router.get('/search', async (req, res) => {
    const db = await createDbConnection();
    try {
      const { q } = req.query;
      
      if (!q || q.trim() === '') {
        return res.status(400).json({ message: 'Search query is required' });
      }      
      
      // Search in both Arabic text and translation/tafsir
      const searchPattern = `%${q}%`;
      const results = await db.all(`
        SELECT no_surat, no_ayat, arab, tafsir, no_juz, no_hal
        FROM m_surat_t
        WHERE arab LIKE ? OR tafsir LIKE ?
        ORDER BY no_surat ASC, no_ayat ASC
        LIMIT 100
      `, [searchPattern, searchPattern]);
      
      if (results.length === 0) {
        await db.close();
        return res.status(404).json({ message: 'No matching ayahs found' });
      }
      
      res.status(200).json(results);
    } catch (error) {
      console.error(`Error searching Quran for "${req.query.q}":`, error);
      res.status(500).json({ message: 'Failed to search Quran' });
    }finally{
    await db.close();
    }
  });
  
  export default router;