import { useState } from "react";
import { Move } from "lucide-react";
import tailwindColors from '../ColorClasses';

type ShapeType = "rectangle" | "circle";
type Color = "red" | "blue" | "yellow" | "green" | "pink";




interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
}

export default function DrawPage() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<ShapeType>("rectangle");
  const [currentColor, setCurrentColor] = useState<Color>("blue");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);


  const handleDraw = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingId || resizingId || isDragging || moveMode || deleteMode) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    setShapes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: currentShape,
        x,
        y,
        width: currentShape === "rectangle" ? 160 : 80,
        height: 80,
        color: currentColor,
      },
    ]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    if (draggingId && moveMode) {
      setIsDragging(true);
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === draggingId
            ? {
                ...shape,
                x: mouseX - offset.x,
                y: mouseY - offset.y,
              }
            : shape
        )
      );
    }

    if (resizingId && moveMode) {
      setIsDragging(true);
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === resizingId
            ? {
                ...shape,
                width: Math.max(20, mouseX - shape.x),
                height: Math.max(20, mouseY - shape.y),
              }
            : shape
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
    setIsDragging(false);
  };

  return (
    <div
      className="min-h-screen bg-gray-100 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Toolbar */}
      <div className="p-4 flex flex-wrap gap-4">
        <button
          onClick={() => setMoveMode(!moveMode)}
          className={`px-4 py-2 rounded flex gap-2 items-center ${
            moveMode ? "bg-green-600 text-white" : "bg-green-100 text-green-700"
          }`}
        >
          <Move size={16} />
          Move Mode
        </button>

        <button
          onClick={() => setCurrentShape("rectangle")}
          className={`px-4 py-2 rounded ${
            currentShape === "rectangle" && !moveMode
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-700"
          }`}
          disabled={moveMode}
        >
          Rectangle
        </button>

        <button
          onClick={() => {setCurrentShape("circle")
            console.log(shapes);
          }}
          className={`px-4 py-2 rounded ${
            currentShape === "circle" && !moveMode
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-700"
          }`}
          disabled={moveMode}

        >
          Circle
        </button>

                <button
        onClick={() => setDeleteMode(!deleteMode)}
        className={`px-4 py-2 rounded ${
            deleteMode ? "bg-red-600 text-white" : "bg-red-100 text-red-700"
        }`}
        >
        Delete Mode
        </button>


        {/* Color Buttons */}
        {(["red", "blue", "yellow", "green", "pink"] as Color[]).map((color) => (
          <button
            key={color}
            onClick={() => setCurrentColor(color)}
            className={`px-4 py-2 rounded border ${
              currentColor === color
                ? `bg-${color}-600 text-white`
                : `bg-${color}-100 text-${color}-700`
            }`}
            disabled={moveMode}
          >
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </button>
          
        ))}
      </div>

      {/* Drawing Area */}
      <div
        onClick={handleDraw}
        className={`relative w-full h-[90vh] bg-white border-2 border-gray-400 overflow-hidden ${
          moveMode ? "cursor-move" : "cursor-crosshair"
        }`}
      >
        {shapes.map((shape) => (
          <div
            key={shape.id}
            onMouseDown={(e) => {
                e.stopPropagation();
              
                if (!moveMode && deleteMode) {
                  setShapes((prev) => prev.filter((s) => s.id !== shape.id));
                  return;
                }
              
                if (!moveMode) return;
              
                const rect = e.currentTarget.getBoundingClientRect();
                setOffset({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
                setDraggingId(shape.id);
              }}
              
            className={`absolute opacity-80 transition-all duration-200  ${
              shape.type === "rectangle"
                ? `border-2 bg-${shape.color}-200 border-${shape.color}-500 hover:bg-${shape.color}-300`
                : `border-2 bg-${shape.color}-200 border-${shape.color}-500 hover:bg-${shape.color}-300 rounded-full`
            }`}
            style={{
              left: shape.x,
              top: shape.y,
              width: shape.width,
              height: shape.height,
              cursor: moveMode ? "move" : "default",
            }}
          >
            {moveMode && !deleteMode && (
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setResizingId(shape.id);
                }}
                className="absolute bottom-0 right-0 w-4 h-4 bg-white border-2 border-gray-600 rounded-full cursor-nwse-resize hover:bg-gray-200 transition-colors"
                style={{
                  transform: "translate(30%, 30%)",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
