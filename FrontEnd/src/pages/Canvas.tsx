import { useEffect, useRef, useState } from "react";
import { existingShapes, rectDraw } from "../draw/reactangle";
import { IconButton } from "../icons";
import { Pencil, RectangleHorizontalIcon, Circle, LucideEllipsis, PencilLineIcon, ArrowLeftCircleIcon, Text, Undo2Icon } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Shape } from "../draw/reactangle";
import { useNavigate } from "react-router-dom";



type shape = "circle" | "rectangle" | "pencil" | "ellipse" | "line" | "arrow" | "text" | "undo";

export let existingShapes1: Shape[] = [];
export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<shape>("pencil");
  const [title, setTitle] = useState<string>("");
  const { documentid } = useParams();
  const navigate = useNavigate();
  const [shapesLoaded, setShapesLoaded] = useState<Boolean>(false);

  useEffect(() => {
    //@ts-ignore
    window.selectedTool = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    async function getShapes() {
      if(!documentid || documentid==""){
        setShapesLoaded(true); 
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/v0/canvas/${documentid}`);
        if (response.data.canvas?.shapes) {
          existingShapes1 = response.data.canvas.shapes;
          setTitle(response.data.canvas.title);
          console.log("Fetched shapes:", response.data.canvas.shapes);
          setShapesLoaded(true); 
        }
      } catch (error) {
        console.error("Error fetching shapes:", error);
      }
    }

    getShapes();
  }, [documentid]);

  useEffect(() => {
    if (shapesLoaded && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.log("No context found");
        return;
      }

      rectDraw(ctx);
      console.log("Drawing existing shapes:", existingShapes1);
    }
  }, [shapesLoaded]); 

    // Save handler
    const handleSave = async () => {
      try {
        const token = localStorage.getItem("token");
      let response;
       if (documentid!=="") {
         response = await axios.post(
          "http://localhost:3000/api/v0/canvas",
          { documentId: documentid, title, shapes:existingShapes },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
       }
       else {
        response = await axios.post(
          "http://localhost:3000/api/v0/canvas",
          {  title, shapes:existingShapes },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
  
       }
  
        console.log("Success:", response!.data);
        let slug = (response.data.canvas._id);
         navigate(`/canvas/${slug}`);
      } catch (error: any) {
        if (error.response) {
          console.error(
            "Server Error:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("No Response Received:", error.request);
        } else {
          console.error("Axios Error:", error.message);
        }
      }
    };

  
  return (
    <div className="relative">
      <div
        className="overflow-scroll relative"
        style={{
          height: `${window.innerHeight * 8}px`,
          width: `${window.innerWidth * 3}px`,
        }}
      >
        <canvas
          ref={canvasRef}
          width={window.innerWidth * 3}
          height={window.innerHeight * 8}
          style={{ display: "block" }}
        ></canvas>
      </div>

      <div className="fixed top-5 left-10">
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} title={title} setTitle={setTitle}   handleSave={handleSave} navigate={navigate} />
      </div>
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
  title,
  setTitle,
  handleSave,
  navigate


}: {
  selectedTool: shape;
  setSelectedTool: (s: shape) => void;
  title : string;
  setTitle : (s : string) => void;
  handleSave: () => Promise<void>;
  navigate: any;
}) {
  return (
    <div>
      
    <div className="flex flex-row gap-4 text-white">
    <IconButton
        activated={false}
        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-left-icon lucide-chevrons-left"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>}
        onClick={() => {
          navigate("/dashboard");
        }}
      />

      <IconButton
        activated={selectedTool === "pencil"}
        icon={<Pencil />}
        onClick={() => {
          setSelectedTool("pencil");
        }}
      />
      <IconButton
        activated={selectedTool === "rectangle"}
        icon={<RectangleHorizontalIcon />}
        onClick={() => {
          setSelectedTool("rectangle");
        }}
      />
      <IconButton
        activated={selectedTool === "circle"}
        icon={<Circle />}
        onClick={() => {
          setSelectedTool("circle");
        }}
      />
      <IconButton
        activated={selectedTool === "ellipse"}
        icon={<LucideEllipsis />}
        onClick={() => {
          setSelectedTool("ellipse");
        }}
      />
      <IconButton
        activated={selectedTool === "line"}
        icon={<PencilLineIcon />}
        onClick={() => {
          setSelectedTool("line");
        }}
      />
      <IconButton
        activated={selectedTool === "arrow"}
        icon={<ArrowLeftCircleIcon />}
        onClick={() => {
          setSelectedTool("arrow");
        }}
      />
      <IconButton
        activated={selectedTool === "text"}
        icon={<Text />}
        onClick={() => {
          setSelectedTool("text");
          setTimeout(() => {
            setSelectedTool("pencil");
          }, 3000);
        }}
      />
      <IconButton
        activated={selectedTool === "undo"}
        icon={<Undo2Icon />}
        onClick={() => {
          //@ts-ignore
          window.undoLastShape();
        }}
      />

      <div onClick={()=>{
              console.log("canvas se milne wali shapes : ",existingShapes);
              console.log(title);
              handleSave();
            }} >
      <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 border-2 p-2 rounded-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
      </div>
      <div >
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter document title..." className="w-full px-3 py-2 text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

    </div>
    </div>
  );
}
