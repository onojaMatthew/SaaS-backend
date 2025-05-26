import { Router } from "express";
import { ContentController } from "../controller/content/controller";
import { authenticateUser, restrictTo } from "../middleware/auth";
import { validate } from "../validation";
import { userInputSchema } from "../validation/business.validator";

const router = Router();

router.post("/contents", authenticateUser, ContentController.createContent);
router.get("/contents", authenticateUser, ContentController.getAllContent);
router.get("/contents/stats", authenticateUser, ContentController.getContentStats);
router.get("/contents", authenticateUser, ContentController.getContentById);
router.post("/contents/rate", authenticateUser, ContentController.rateContent);
router.put("/contents/update", authenticateUser, ContentController.updateContent);
router.delete("/contents/delete", authenticateUser, ContentController.deleteContent);


export { router as ContentRoutes }