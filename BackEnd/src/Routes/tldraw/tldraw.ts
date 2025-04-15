import express, { Request, Response } from "express";
import { TldrawModel } from "../../db/db"; // Make sure the path is correct

const router = express.Router();


router.post("/", async (req: Request, res: Response): Promise<void> => {
    const { documentId, title, data } = req.body;

   
    if (documentId === "1234") {
        try {
            
            const existingCanvas = await TldrawModel.findOneAndUpdate(
                { _id: documentId },
                { title, data },
                { new: true, upsert: true } // upsert will create a new document if none exists
            );

            res.json({
                message: "Tldraw canvas saved/updated successfully",
                tldraw: existingCanvas,
            });
        } catch (e: any) {
            res.status(411).json({
                error: e.message,
            });
        }
    } else {
        res.status(400).json({
            error: "Invalid documentId. Expected '1234'.",
        });
    }
});

// Get Tldraw canvas by ID (only '1234' allowed)
router.get("/:canvasId", async (req: Request, res: Response): Promise<void> => {
    const { canvasId } = req.params;

    // If the canvasId is "1234"
    if (canvasId === "1234") {
        try {
            const tldraw = await TldrawModel.findOne({ _id: canvasId });

            if (tldraw) {
                res.json({
                    message: "Tldraw canvas found",
                    tldraw,
                });
            } else {
                res.status(404).json({
                    error: "Tldraw canvas not found",
                });
            }
        } catch (e: any) {
            res.status(411).json({
                error: e.message,
            });
        }
    } else {
        res.status(400).json({
            error: "Invalid canvasId. Expected '1234'.",
        });
    }
});

export default router;
