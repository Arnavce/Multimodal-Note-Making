// custom.d.ts
declare module '@excalidraw/excalidraw' {
    
    export type ExcalidrawElement = {
      id: string;
      type: string;
      x: number;
      y: number;
      width: number;
      height: number;
      angle: number;
      strokeColor: string;
      fillColor: string;
      [key: string]: any; // Allow additional properties
    };
  }
  