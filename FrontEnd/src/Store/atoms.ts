import { atom } from "recoil";

type Shape = 
  | { type: "rect"; x: number; y: number; width: number; height: number; }
  | { type: "circle"; x: number; y: number; radius: number; }
  | { type: "ellipse"; x: number; y: number; radiusX: number; radiusY: number; }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; directed: boolean; }
  | { type: "text"; x: number; y: number; content: string; bold?: boolean; strikethrough?: boolean; italic?: boolean; };

export let shapesAtom = atom<Shape[]>({
  key: "shapesAtom",
  default: [],
});



