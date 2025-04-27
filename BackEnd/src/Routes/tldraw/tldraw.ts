import { title } from 'process';
import express, { Request, Response } from "express";
import { TldrawModel } from "../../db/db";
import { middleware } from "../../Middlewares/Middleware";

const router = express.Router();

// POST route to save or update Tldraw canvas
router.post("/", middleware, async (req: Request, res: Response): Promise<void> => {
    const { documentId, data, title } = req.body;
    // @ts-ignore
    const userId = req.userId;

    // console.log("Received POST request for Tldraw:");
    // console.log("documentId:", documentId);
    // console.log("userId:", userId);
    // console.log("typeof data:", typeof data);
    // console.log("current wala canvas")
    // console.dir(data, { depth: null });

   
    if (!documentId || documentId === "") {
        try {
            const newCanvas = await TldrawModel.create({
                data,
                userId,
                title,
                
            });
         
            console.log("New canvas created successfully", newCanvas);
            res.json({
                message: "Tldraw canvas created successfully",
                tldraw: newCanvas,
            });
        } catch (e: any) {
            res.status(500).json({
                error: "Error creating canvas: " + e.message,
            });
        }
    }


    if (documentId && documentId !== "" && data) {
        try {
            const updatedCanvas = await TldrawModel.findOneAndUpdate(
                { _id: documentId },
                {
                    data,
                    userId,
                    title,
                },
                { new: true }
            );

            res.json({
                message: "Tldraw canvas updated successfully",
                tldraw: updatedCanvas,
            });
        } catch (e: any) {
            res.status(500).json({
                error: "Error updating canvas: " + e.message,
            });
        }
    }
});

router.get("/:canvasId", async (req: Request, res: Response): Promise<void | any> => {
    const { canvasId } = req.params;

    try {
      

        const tldraw = await TldrawModel.findOne({ _id: canvasId }).lean();

        if (!tldraw) {
            return res.status(404).json({ error: "Tldraw canvas not found" });
        }

        
        const rawData = JSON.parse(JSON.stringify(tldraw));

        res.json({
            message: "Tldraw canvas found",
            tldraw: rawData
        });

    } catch (e: any) {
        res.status(500).json({
            error: "Error retrieving canvas: " + e.message,
        });
    }
});



router.get("/", middleware, async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
    const userId = req.userId;
  
    try {
      const canvases = await TldrawModel.find({ userId }, { data: 0 }); // Exclude heavy canvas data if not needed
      res.json({
        message: "Tldraw canvases found",
        canvases,
      });
    } catch (e: any) {
      res.status(500).json({
        error: "Error retrieving canvases: " + e.message,
      });
    }
  });
  

  router.delete("/:canvasId", middleware, async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
    const userId = req.userId;
    const { canvasId } = req.params;    
    try {
      const canvas = await TldrawModel.findOneAndDelete({
        _id: canvasId
      });
      res.json({
        message: "Canvas deleted successfully",
        canvas
      })
    } catch(e:any) {
      res.status(411).json({
        error: e.message
      })
    }
  });

  router.post("/:canvasId/tags", middleware, async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
    const userId = req.userId;
    const { canvasId } = req.params;
    const { tags } = req.body;
    try {
      const canvas = await TldrawModel.findOneAndUpdate({
        _id: canvasId
      },{
        tags,
      })
      res.json({
        message: "Canvas updated successfully",
        canvas
      })
    } catch(e:any) {
      res.status(411).json({
        error: e.message
      })
    }
  });



export default router;
