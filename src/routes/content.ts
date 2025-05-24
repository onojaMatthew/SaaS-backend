import { Router } from "express";
import { ContentController } from "../controller/content/controller";
import { authenticateUser, restrictTo } from "../middleware/auth";

const router = Router();

router.post("/contents", authenticateUser, ContentController.createContent);
router.get("/contents", authenticateUser, ContentController.getAllContent); // req.query.businessId
router.get("/contents/stats", authenticateUser, ContentController.getContentStats);
router.get("/contents/:id", authenticateUser, ContentController.getContentById);
router.post("/contents/:id/rate", authenticateUser, ContentController.rateContent);
 // req.query.id
router.put("/contents/:id/update", authenticateUser, ContentController.updateContent);
router.delete("/contents/:id/delete", authenticateUser, ContentController.deleteContent);


export { router as ContentRoutes }