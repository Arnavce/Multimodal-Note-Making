import express, { Request, Response } from "express";
import { DocumentModel} from "../../db/db";
import { middleware } from "../../Middlewares/Middleware";



const router = express.Router();




router.post("/", middleware, async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
    const userId = req.userId;
    console.log(userId);

     const { title, content , documentId  } = req.body;
      
     
    
     if(!documentId || documentId=="")
        try {
            const document = await DocumentModel.create({
                title,
                content,
                userId
            })
            res.json({
                message: "Document created successfully",
                document
            })
        } catch(e:any) {
            res.status(411).json({
              error: e.message
            })
        }
      if(documentId && documentId!="" && title && content)
        try {
            const document = await DocumentModel.findOneAndUpdate({
                _id: documentId
            },{
                title,
                content
            })
            res.json({
                message: "Document updated successfully",
                document
            })
        } catch(e:any) {
            res.status(411).json({
              error: e.message
            })
        }

});


router.get("/:documentId", async (req: Request, res: Response): Promise<void> => {
    const { documentId } = req.params;

    try {
        const document = await DocumentModel.findOne({
            _id: documentId
        });
        res.json({
            message: "Document found",
            document
        })
    } catch(e:any) {
        res.status(411).json({
          error: e.message
        })
    }
});

router.delete("/:documentId", middleware, async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
    const userId = req.userId;
    const { documentId } = req.params;

    try {
        const document = await DocumentModel.findOneAndDelete({
            _id: documentId
        });
        res.json({
            message: "Document deleted successfully",
            document
        })
    } catch(e:any) {
        res.status(411).json({
          error: e.message
        })
    }
});

router.get("/", middleware ,async (req: Request, res: Response): Promise<void> => {
     //@ts-ignore
     const userId = req.userId;
    //  console.log(userId);
    const document = await DocumentModel.find({userId: userId},{ content: 0 });
    res.json({
        message: "Documents found",
        document
    })
});

router.post("/:documentId/tags", middleware, async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
     const userId = req.userId;
     const { documentId } = req.params;
    const { tags } = req.body;
    try {
        const document = await DocumentModel.findOneAndUpdate({
            _id: documentId
        },{
            tags,
        })
        res.json({
            message: "Document updated successfully",
            document
        })
    } catch(e:any) {
        res.status(411).json({
          error: e.message
        })
    }
});


export default router;