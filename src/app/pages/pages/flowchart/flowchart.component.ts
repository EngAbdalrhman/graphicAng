import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { shapeInfo } from './shape/shapeInfo';
@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrl: './flowchart.component.scss',
})
export class FlowchartComponent {
  @ViewChild('svg', { static: false }) svg!: ElementRef;

  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('shape') shape!: ElementRef;

  private line: SVGLineElement | undefined | null = null;
  private startAnchor: any = null;
  private startShape: shapeInfo | null = null;
  private _shapeStartMove: shapeInfo | undefined;
  private lastX: number = 0;
  private lastY: number = 0;
  DragItem: shapeInfo | undefined;
  drawing: boolean = false;
  shapes: shapeInfo[] = [];
  // startPoint: HTMLElement | null = null;
  // endPoint: HTMLElement | null = null;
  isShown: boolean = false;
  // shape: shapeInfo = this.shapes[0];
  anchors = [
    { x: 10, y: 85, id: 0 }, // top-left
    { x: 85, y: 10, id: 1 }, // top-right
    { x: 85, y: 150, id: 2 }, // bottom-right
    { x: 150, y: 85, id: 3 }, // bottom-left
  ];
  toolbar: shapeInfo[] = [
    {
      label: 'Rectangle',
      width: 50,
      height: 50,
      color: 'red',
      text_color: 'white',
      x: 10,
      y: 100,
    },
    {
      label: 'Ellipse',
      width: 50,
      height: 50,
      color: 'blue',
      text_color: 'white',
      x: 10,
      y: -100,
    },
    { label: 'Shape', width: 50, color: 'black', height: 50, x: 10, y: -250 },
  ];
  constructor() {
    // Get the shapes' coordinates from local storage
    const shapesPlacement = localStorage.getItem('shapesPlacement');
    if (shapesPlacement) {
      this.shapes = JSON.parse(shapesPlacement);
    }
  }
  onMouseOverShape(shape: shapeInfo) {
    // this.isShown = true;
    shape.anchorStatus = true;
  }

  onMouseUpShape(shape: shapeInfo) {
    // this.isShown = false;
    shape.anchorStatus = false;
  }
  handleAnchorClick(
    $event: MouseEvent,
    anchorIndex: number,
    shape: shapeInfo,
    shapeSvg: SVGElement
  ) {
    $event.stopPropagation();
    let anchor = this.anchors[anchorIndex];
    console.log('a:' + JSON.stringify(anchor));
    console.log('shape:' + JSON.stringify(shape));

    this.startDrawing({ anchor, shape, shapeSvg });
  }
  shapeStartMove($event: MouseEvent, shape: shapeInfo) {
    $event.preventDefault();
    this._shapeStartMove = shape;
    this.lastX = $event.clientX;
    this.lastY = $event.clientY;
  }
  shapeEndMove() {
    this._shapeStartMove = undefined;
  }
  moveShape($event: MouseEvent) {
    $event.preventDefault();
    if (this._shapeStartMove) {
      this._shapeStartMove.x += $event.clientX - this.lastX;
      this._shapeStartMove.y += $event.clientY - this.lastY;
      this.lastX = $event.clientX;
      this.lastY = $event.clientY;
    }
  }

  save() {
    localStorage.setItem('shapesPlacement', JSON.stringify(this.shapes));
  }

  drag($event: Event, shape: shapeInfo) {
    this.DragItem = shape;
  }
  allowDrag($event: Event) {
    $event.preventDefault();
  }
  shapeID = 1;
  dropItem($event: DragEvent, canvas: HTMLDivElement) {
    $event.preventDefault();
    if (this.DragItem) {
      let newItem: shapeInfo = { ...this.DragItem }; // make a clone of item because we don't want to share the same instance of the item
      let boundery = canvas.getBoundingClientRect();
      newItem.x = $event.clientX - boundery.x;
      newItem.y = $event.clientY - boundery.y;
      newItem.id = this.shapeID++;

      this.shapes.push(newItem);
      this.DragItem = undefined;
    }
  }
  clear() {
    this.shapes = []; // clear the shapes array
    localStorage.removeItem('shapesPlacement');
  }

  // ******* Drawing..

  onMouseMove = (event: MouseEvent) => {
    if (this.drawing && this.line) {
      console.log('Moving....');
      const svgRect = this.svg.nativeElement.getBoundingClientRect();
      const x = event.clientX - svgRect.left;
      const y = event.clientY - svgRect.top;
      this.line.setAttribute('x2', x.toString());
      this.line.setAttribute('y2', y.toString());
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.drawing && this.line) {
      console.log('Up.');

      this.drawing = false;
      // this.line.setAttribute('x2', event.clientX.toString());
      // this.line.setAttribute('y2', event.clientY.toString());

      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);

      // let target = event.target as HTMLElement;
      // if (target.tagName === 'circle') {
      //   let endAnchorId = target.getAttribute('data-id');
      //   let endShapeId = target.closest('svg')?.getAttribute('data-id');
      //   let endShape = this.shapes.find(
      //     (shape) => shape.id === parseInt(endShapeId!, 10)
      //   );
      //   let endAnchor = endShape?.anchors?.find(
      //     (anchor) => anchor.id === parseInt(endAnchorId!, 10)
      //   );

      //   if (endAnchor && endShape) {
      //     this.line.setAttribute('x2', (endShape.x + endAnchor.x).toString());
      //     this.line.setAttribute('y2', (endShape.y + endAnchor.y).toString());
      //   }
      // } else {
      //   if (this.svg && this.svg.nativeElement) {
      //     this.svg.nativeElement.removeChild(this.line);
      //   }
      // }

      this.line = null;
      this.startAnchor = null;
      this.startShape = null;
    }
  };

  startDrawing(event: { anchor: any; shape: shapeInfo; shapeSvg: SVGElement }) {
    this.startAnchor = event.anchor;
    this.startShape = event.shape;

    this.drawing = true;
    const svgRect = event.shapeSvg.getBoundingClientRect();
    const startX = this.startShape!.x + this.startAnchor.x - svgRect.left;
    const startY = this.startShape!.y + this.startAnchor.y - svgRect.top;

    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startX.toString());
    line.setAttribute('y1', startY.toString());

    line.setAttribute('stroke', 'black');
    line.setAttribute('stroke-width', '2');
    this.line = line;
    console.log('x:' + JSON.stringify(line.getAttribute('x1')));

    event.shapeSvg.appendChild(this.line);
    this.svg.nativeElement = event.shapeSvg;

    console.log('L:' + JSON.stringify(line));
    console.log('S:' + JSON.stringify(this.svg));
    // console.log('C:' + JSON.stringify(this.canvas));
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }
  ngAfterViewInit() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }
}
