import { Router } from 'express';
import controller from '../controllers/songController';

// routes for our API
const router = Router();

router.post('/create', controller.createSong);
router.get('/read/:songId', controller.readSong);
router.get('/read', controller.readAllSong);
router.patch('/update/:songId', controller.updateSong);
router.delete('/delete/:songId', controller.deleteSong);
router.get('/statistics', controller.calculateStatistics);
router.get('/artist', controller.artistSong);
router.get('/album', controller.albumSong);
router.get('/genre', controller.genreSong);

export default router;
