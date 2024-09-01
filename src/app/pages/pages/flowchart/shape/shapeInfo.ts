export interface shapeInfo {
  label: string;
  width?: number;
  height?: number;
  color?: string;
  text_color?: string;
  x: number;
  y: number;
  id?: number;
  anchors?: { x: number; y: number }[];
  line?: SVGLineElement;
}
