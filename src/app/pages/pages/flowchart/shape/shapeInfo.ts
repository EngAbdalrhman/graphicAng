export interface shapeInfo {
  style?: any;
  label: string;
  width?: number;
  height?: number;
  color?: string;
  text_color?: string;
  x: number;
  y: number;
  id?: number;
  anchors?: {
    x: number;
    y: number;
    id: number;
  }[];
  line?: SVGLineElement;
  anchorStatus?: boolean;
}
