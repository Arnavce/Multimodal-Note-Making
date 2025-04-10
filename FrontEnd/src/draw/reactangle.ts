
import { existingShapes1 } from "../pages/Canvas";



// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import { shapesAtom } from '../Store/atoms';

export type Shape = 
  | { type: "rect"; x: number; y: number; width: number; height: number; }
  | { type: "circle"; x: number; y: number; radius: number; }
  | { type: "ellipse"; x: number; y: number; radiusX: number; radiusY: number; }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; directed: boolean; }
  | { type: "text"; x: number; y: number; content: string; bold?: boolean; strikethrough?: boolean; italic?: boolean; };

  export let existingShapes: Shape[] = [];

  
    
    // let existingShapes = useRecoilValue(shapesAtom);
    
    // const setshapes = useSetRecoilState(shapesAtom);
    
    
    
    export function rectDraw(ctx: CanvasRenderingContext2D) {
      
  existingShapes = existingShapes1;
  const canvas = ctx.canvas;
     //console.log("canvas se",existingShapes);
  
  clearCanvas(existingShapes, ctx);
  

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let startX = 0;
  let startY = 0;
  let clicked = false;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;

    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    // @ts-ignore
    const selectedTool = window.selectedTool;

    if (selectedTool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        const bold = confirm("Bold?");
        const strikethrough = confirm("Strikethrough?");
        const italic = confirm("Italic?");

        existingShapes.push({
          type: "text",
          x: startX,
          y: startY,
          content: text,
          bold,
          strikethrough,
          italic,
        });
        clearCanvas(existingShapes, ctx);
        // @ts-ignore
        window.selectedTool = "rectangle";
      }
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!clicked) return;
    clicked = false;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    // @ts-ignore
    const selectedTool = window.selectedTool;

    
    const shapeProps = {
      startX,
      startY,
      endX,
      endY,
      width: endX - startX,
      height: endY - startY,
    };

    switch (selectedTool) {
      case "rectangle":
        existingShapes.push({
          type: "rect",
          x: startX,
          y: startY,
          width: shapeProps.width,
          height: shapeProps.height,
        });
        break;

      case "circle":
        const radius = Math.sqrt(shapeProps.width ** 2 + shapeProps.height ** 2) / 2;
        existingShapes.push({
          type: "circle",
          x: startX + shapeProps.width / 2,
          y: startY + shapeProps.height / 2,
          radius,
        });
        break;

      case "ellipse":
        existingShapes.push({
          type: "ellipse",
          x: startX + shapeProps.width / 2,
          y: startY + shapeProps.height / 2,
          radiusX: Math.abs(shapeProps.width / 2),
          radiusY: Math.abs(shapeProps.height / 2),
        });
        break;

      case "line":
      case "arrow":
        existingShapes.push({
          type: "line",
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          directed: selectedTool === "arrow",
        });
        break;
    }

    clearCanvas(existingShapes, ctx);
  });



  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    if (!clicked) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const width = currentX - startX;
    const height = currentY - startY;

    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    clearCanvas(existingShapes, ctx);

    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.lineWidth = 2;

    // @ts-ignore
    const selectedTool = window.selectedTool;

    switch (selectedTool) {
      case "rectangle":
        ctx.strokeRect(startX, startY, width, height);
        break;

      case "circle":
        const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
        ctx.beginPath();
        ctx.arc(startX + width / 2, startY + height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case "ellipse":
        ctx.beginPath();
        ctx.ellipse(
          startX + width / 2,
          startY + height / 2,
          Math.abs(width / 2),
          Math.abs(height / 2),
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        break;

      case "line":
      case "arrow":
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        if (selectedTool === "arrow") {
          drawArrowhead(ctx, startX, startY, currentX, currentY);
        }
        break;
    }
  });

  // @ts-ignore
  window.undoLastShape = () => {
    existingShapes.pop();
    clearCanvas(existingShapes, ctx);
  };
}

export function clearCanvas(existingShapes: Shape[], ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);



  existingShapes.forEach((shape) => {
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.lineWidth = 2;

    switch(shape.type) {
      case "rect":
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;

      case "circle":
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case "ellipse":
        ctx.beginPath();
        ctx.ellipse(shape.x, shape.y, shape.radiusX, shape.radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case "line":
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.lineWidth = 3
        ctx.stroke();
        if (shape.directed) {
          drawArrowhead(ctx, shape.x1, shape.y1, shape.x2, shape.y2);
        }
        break;

      case "text":
        ctx.font = `${shape.bold ? "bold " : ""}${shape.italic ? "italic " : ""}32px Arial`;
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        if (shape.strikethrough) {
          const textWidth = ctx.measureText(shape.content).width;
          ctx.fillText(shape.content, shape.x, shape.y);
          ctx.beginPath();
          ctx.moveTo(shape.x, shape.y - 10);
          ctx.lineTo(shape.x + textWidth, shape.y - 10);
          ctx.stroke();
        } else {
          ctx.fillText(shape.content, shape.x, shape.y);
        }
        break;
    }
  });
}

function drawArrowhead(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const arrowSize = 10;
  const angle = Math.atan2(y2 - y1, x2 - x1);

  ctx.save();
  ctx.beginPath();
  ctx.translate(x2, y2);
  ctx.rotate(angle);

  ctx.moveTo(0, 0);
  ctx.lineTo(-arrowSize, arrowSize/2);
  ctx.lineTo(-arrowSize, -arrowSize/2);
  ctx.closePath();

  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fill();
  ctx.restore();
}





