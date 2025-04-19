import { useState } from "react";
import { Move } from "lucide-react";
import tailwindColors from '../ColorClasses';

type ShapeType = "rectangle" | "circle" | "line" | "arrow" | "none";
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


interface TextArea {
  id: string;
  x: number;
  y: number;
  text: string;
}

export default function DrawPage() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [drawingLine, setDrawingLine] = useState<Shape | null>(null);
  const [currentShape, setCurrentShape] = useState<ShapeType>("none");
  const [currentColor, setCurrentColor] = useState<Color>("blue");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [textAreas, setTextAreas] = useState<TextArea[]>([]);
  const [addingText, setAddingText] = useState(false);



  const handleLineDraw = (e: React.MouseEvent<HTMLDivElement>) => {
    if (deleteMode) return;

    if (["line", "arrow"].includes(currentShape)) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      setStartPos({ x, y });
      setDrawingLine({
        id: crypto.randomUUID(),
        type: currentShape,
        x,
        y,
        width: 0,
        height: 0,
        color: currentColor,
      });
    }
  };

  const handleDraw = (e: React.MouseEvent<HTMLDivElement>) => {
    // the control is with above lind handling funciton
    if (["line", "arrow"].includes(currentShape)) return ;

    if (draggingId || resizingId || isDragging || moveMode || deleteMode || addingText || currentShape === "none") return;

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
            ? { ...shape, x: mouseX - offset.x, y: mouseY - offset.y }
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

    if (drawingLine) {
      setDrawingLine({
        ...drawingLine,
        width: mouseX - startPos.x,
        height: mouseY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (drawingLine) {
      setShapes((prev) => [...prev, drawingLine]);
      setDrawingLine(null);
    }
    setDraggingId(null);
    setResizingId(null);
    setIsDragging(false);
  };

  const handleAddTextArea = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!addingText) return;
    setCurrentShape("none");

    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    setTextAreas((prev) => [
      ...prev,
      { id: crypto.randomUUID(), x, y, text: "Enter here!" }, // Set default text
    ]);
    setAddingText(false);
  };

  const handleTextChange = (id: string, newText: string, element: HTMLTextAreaElement) => {
    setTextAreas((prev) =>
      prev.map((textArea) =>
        textArea.id === id ? { ...textArea, text: newText } : textArea
      )
    );

    element.style.height = "auto";
    element.style.width = "auto";
    element.style.height = `${element.scrollHeight}px`;
    element.style.width = `${element.scrollWidth}px`;
  };

  const renderTextAreas = () => {
    return textAreas.map((textArea) => (
      <textarea
        key={textArea.id}
        value={textArea.text}
        onChange={(e) => handleTextChange(textArea.id, e.target.value, e.target)}
        onFocus={(e) => {
          setCurrentShape("none");
          e.target.style.border = "1px solid gray";
        }}
        onBlur={(e) => {
          e.target.style.border = "none";
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (deleteMode) {
            setTextAreas((prev) => prev.filter((t) => t.id !== textArea.id));
          }
        }}
        className="absolute bg-transparent resize-none focus:outline-none"
        style={{
          left: textArea.x,
          top: textArea.y,
          height: "auto",
          width: "auto",
          overflow: "hidden",
        }}
        ref={(element) => {
          if (element && textArea.text === "") {
            element.focus();
            element.style.border = "1px solid gray";
          }
        }}
      />
    ));
  };

  const renderShape = (shape: Shape) => {
    if (["line", "arrow"].includes(shape.type)) {
      const angle = Math.atan2(shape.height, shape.width);
      const length = Math.sqrt(shape.width ** 2 + shape.height ** 2);

      return (
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
          className="absolute"
          style={{
            left: shape.x,
            top: shape.y,
            width: length,
            height: 2,
            backgroundColor: shape.color,
            transform: `rotate(${angle}rad)`,
            transformOrigin: "0% 50%",
            cursor: moveMode ? "move" : "default",
          }}
        >
          {shape.type === "arrow" && (
            <div
              className="absolute -right-2 top-1/2 -translate-y-1/2"
              style={{
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: `12px solid ${shape.color}`,
              }}
            />
          )}
        </div>
      );
    }

    return (
      <div
        key={shape.id}
        onMouseDown={(e) => {
          e.stopPropagation();
          //if delete mode then removing that shape using id
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
        className={`absolute opacity-80 transition-all duration-200 ${
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
            style={{ transform: "translate(30%, 30%)" }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gray-100 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="p-4 flex flex-wrap gap-4">
        <button
          onClick={() => {
            console.log(shapes)
            setMoveMode(!moveMode)}}
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
          onClick={() => setCurrentShape("circle")}
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
          onClick={() => setCurrentShape("line")}
          className={`px-4 py-2 rounded ${
            currentShape === "line" && !moveMode
              ? "bg-purple-600 text-white"
              : "bg-purple-100 text-purple-700"
          }`}
          disabled={moveMode}
        >
          Line
        </button>

        <button
          onClick={() => setCurrentShape("arrow")}
          className={`px-4 py-2 rounded ${
            currentShape === "arrow" && !moveMode
              ? "bg-orange-600 text-white"
              : "bg-orange-100 text-orange-700"
          }`}
          disabled={moveMode}
        >
          Arrow
        </button>

        <button
          onClick={() => setDeleteMode(!deleteMode)}
          className={`px-4 py-2 rounded ${
            deleteMode ? "bg-red-600 text-white" : "bg-red-100 text-red-700"
          }`}
        >
          Delete Mode
        </button>

        <button
          onClick={() => setAddingText(!addingText)}
          className={`px-4 py-2 rounded ${
            addingText ? "bg-yellow-600 text-white" : "bg-yellow-100 text-yellow-700"
          }`}
        >
          Add Text
        </button>

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

      <div
        onMouseDown={(e) => {
          if (["line", "arrow"].includes(currentShape)) {
            handleLineDraw(e);
          } else if (addingText) {
            handleAddTextArea(e);
          }
        }}
        onClick={handleDraw}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-[90vh] bg-white border-2 border-gray-400 overflow-hidden ${
          moveMode ? "cursor-move" : addingText ? "cursor-text" : "cursor-crosshair"
        }`}
      >
        {shapes.map(renderShape)}
        {drawingLine && renderShape(drawingLine)}
        {renderTextAreas()}
      </div>
    </div>
  );
}
