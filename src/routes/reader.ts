import { Router } from "express";
import { deleteReader, getAllReaders, getReaderById, getReaderStats } from "../controller/reader/controller";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.get("/readers", authenticateUser, getAllReaders);
router.get("/readers/", authenticateUser, getReaderById);
router.get("/readers/:id/stats", authenticateUser, getReaderStats)
router.delete("/readers/:id", authenticateUser, deleteReader);

export { router as ReaderRoutes }