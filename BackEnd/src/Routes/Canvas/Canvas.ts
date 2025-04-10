
import express, { Request, Response } from "express";
import { UserModel, CanvasModel} from "../../db/db";
import { middleware } from "../../Middlewares/Middleware";



const router = express.Router();


router.post("/", middleware, async (req: Request, res: Response): Promise<void> => {
     
        //@ts-ignore
        const userId = req.userId;

    const {documentId , shapes,title } = req.body;
    console.log(shapes);

 if(!documentId || documentId==""){
    try {
        const canvas = await CanvasModel.create({
            type: "canvas",
            title,
            userId,
            shapes
        })
        res.json({
            message: "Canvas created successfully",
            canvas
        })
    } catch(e:any) {
        res.status(411).json({
          error: e.message
        })
    }
 }

 if (documentId && documentId!="" && title && shapes){
    try {
        const canvas = await CanvasModel.findOneAndUpdate({
            _id: documentId
        },{
            title,
            shapes
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
}
  
});

router.get("/:canvasId", async (req: Request, res: Response): Promise<void> => {
    const { canvasId } = req.params;

    try {
        const canvas = await CanvasModel.findOne({
            _id: canvasId
        });
        res.json({
            message: "Canvas found",
            canvas
        })
    } catch(e:any) {
        res.status(411).json({
          error:"Canvas not found"
        })
    }
});



router.get("/", middleware ,async (req: Request, res: Response): Promise<void> => {
     //@ts-ignore
     const userId = req.userId;
     console.log(userId);

    const document = await CanvasModel.find({userId: userId},{ shapes: 0 });
    res.json({
        message: "Canvas found",
        document
    })
});

export default router;



{/*{
  "shapes": [
    { "type": "rect", "x": 53, "y": 157, "width": 242, "height": 103 },
    { "type": "rect", "x": 53, "y": 157, "width": 242, "height": 103 },
    { "type": "circle", "x": 408, "y": 196, "radius": 67.23094525588644 },
    { "type": "circle", "x": 408, "y": 196, "radius": 67.23094525588644 },
    { "type": "ellipse", "x": 627.5, "y": 211, "radiusX": 102.5, "radiusY": 47 },
    { "type": "ellipse", "x": 627.5, "y": 211, "radiusX": 102.5, "radiusY": 47 },
    { "type": "line", "x1": 934, "y1": 142, "x2": 589, "y2": 210 },
    { "type": "line", "x1": 934, "y1": 142, "x2": 589, "y2": 210 },
    { "type": "line", "x1": 915, "y1": 262, "x2": 607, "y2": 117 },
    { "type": "line", "x1": 915, "y1": 262, "x2": 607, "y2": 117 },
    { "type": "text", "x": 1175, "y": 192, "content": "accha", "bold": true },
    { "type": "text", "x": 951, "y": 335, "content": "kyu bhai", "bold": true },
    { "type": "rect", "x": 225, "y": 308, "width": 0, "height": -1 },
    { "type": "rect", "x": 225, "y": 308, "width": 0, "height": -1 },
    { "type": "rect", "x": 272, "y": 327, "width": 438, "height": 0 },
    { "type": "rect", "x": 272, "y": 327, "width": 438, "height": 0 },
    { "type": "rect", "x": 370, "y": 285, "width": 1001, "height": -163 },
    { "type": "rect", "x": 370, "y": 285, "width": 1001, "height": -163 },
    { "type": "circle", "x": 135.5, "y": 266, "radius": 58.77286788986905 }
  ]
}
 */}