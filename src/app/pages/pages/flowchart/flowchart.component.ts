import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { shapeInfo } from './shape/shapeInfo';
@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrl: './flowchart.component.scss',
})
export class FlowchartComponent {
  @ViewChild('svg', { static: true })
  svg!: ElementRef;
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
  startPoint: HTMLElement | null = null;
  endPoint: HTMLElement | null = null;
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

  // draw(e: any, $event: MouseEvent) {
  //   this.drawing = true;
  //   this.startPoint = e.target as HTMLElement;
  //   const startPointAnchor = this.getStartPointAnchor(this.startPoint);
  //   if (this.endPoint) {
  //     let endPointAnchor = this.getEndPointAnchor(this.endPoint);
  //   }
  // }
  // draw(event: MouseEvent) {
  //   const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  //   line.setAttribute('x1', event.clientX.toString());
  //   line.setAttribute('y1', event.clientY.toString());
  //   line.setAttribute('stroke', 'black');
  //   line.setAttribute('stroke-width', '2');
  //   this.svg.nativeElement.appendChild(line);
  //   this.line = line;
  //   this.drawing = true;
  // }

  stopDrawing(line: any, event: MouseEvent) {
    // if (this.drawing) {
    //   this.endPoint = component.target as HTMLElement;
    // draw line between startPoint and endPoint
    // }
    this.line = line;
    if (this.line) {
      this.line.setAttribute('x2', event.clientX.toString());
      this.line.setAttribute('y2', event.clientY.toString());
      this.drawing = false;
    }
  }
  // connectToShape(shape: any, event: MouseEvent) {
  //   const line = this.line;
  //   if (line) {
  //     const shapeRect = shape.getBoundingClientRect();
  //     const x = shapeRect.left + shapeRect.width / 2;
  //     const y = shapeRect.top + shapeRect.height / 2;
  //     // if (x !== line.getAttribute('x1') && y !== line.getAttribute('y1')) {
  //     line.setAttribute('x2', x.toString());
  //     line.setAttribute('y2', y.toString());
  //     // }
  //   }
  // }
  onMouseMove = (event: MouseEvent) => {
    if (this.drawing && this.line) {
      this.line.setAttribute('x2', event.clientX.toString());
      this.line.setAttribute('y2', event.clientY.toString());
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.drawing && this.line) {
      this.drawing = false;
      this.line.setAttribute('x2', event.clientX.toString());
      this.line.setAttribute('y2', event.clientY.toString());

      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);

      let target = event.target as HTMLElement;
      if (target.tagName === 'circle') {
        let endAnchorId = target.getAttribute('data-id');
        let endShapeId = target.closest('svg')?.getAttribute('data-id');
        let endShape = this.shapes.find(
          (shape) => shape.id === parseInt(endShapeId!, 10)
        );
        let endAnchor = endShape?.anchors?.find(
          (anchor) => anchor.id === parseInt(endAnchorId!, 10)
        );

        if (endAnchor && endShape) {
          this.line.setAttribute('x2', (endShape.x + endAnchor.x).toString());
          this.line.setAttribute('y2', (endShape.y + endAnchor.y).toString());
        }
      } else {
        if (this.svg && this.svg.nativeElement) {
          this.svg.nativeElement.removeChild(this.line);
        }
      }

      this.line = null;
      this.startAnchor = null;
      this.startShape = null;
    }
  };

  startDrawing(event: { anchor: any; shape: shapeInfo }) {
    this.startAnchor = event.anchor;
    this.startShape = event.shape;
    // this.startShape = anchor.parentNode;

    this.drawing = true;

    this.line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    this.line.setAttribute(
      'x1',
      (this.startShape!.x + this.startAnchor.x).toString()
    );
    this.line.setAttribute(
      'y1',
      (this.startShape!.y + this.startAnchor.y).toString()
    );
    this.line.setAttribute('stroke', 'black');
    this.line.setAttribute('stroke-width', '2');
    if (this.svg) {
      this.svg.nativeElement.appendChild(this.line);
    }
    this.canvas.nativeElement.appendChild(this.line);
    console.log('L:' + JSON.stringify(this.line));
    console.log('S:' + JSON.stringify(this.svg));
    console.log('C:' + JSON.stringify(this.canvas));

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown(event: MouseEvent, shape: shapeInfo) {
    event.preventDefault();
    this.shapeStartMove(event, shape);
  }

  finishDraw(line: any) {
    this.drawing = false;
    // this.line = line;
    if (this.line) {
      this.svg.nativeElement.removeChild(this.line);
      this.line = undefined;
      //anchorData = null;
    }
  }

  // ngAfterViewInit() {
  //   this.svg.nativeElement.addEventListener(
  //     'mousedown',
  //     (event: { target: any }) => {
  //       let anchor = event.target;
  //       if (anchor.tagName === 'circle') {
  //         let anchorId = anchor.getAttribute('data-id');
  //         let anchorData = this.anchors.find(
  //           (anchor) => anchor.id === parseInt(anchorId, 10)
  //         );
  //         if (anchorData) {
  //           let line = document.createElementNS(
  //             'http://www.w3.org/2000/svg',
  //             'line'
  //           );
  //           line.setAttribute('x1', anchorData.x.toString());
  //           line.setAttribute('y1', anchorData.y.toString());
  //           line.setAttribute('stroke', 'black');
  //           line.setAttribute('stroke-width', '2');
  //           this.svg.nativeElement.appendChild(line);
  //           this.line = line;
  //         }
  //       }
  //     }
  //   );

  //   document.addEventListener('mousemove', (event: MouseEvent) => {
  //     if (this.line) {
  //       this.line.setAttribute('x2', event.clientX.toString());
  //       this.line.setAttribute('y2', event.clientY.toString());
  //     }
  //   });

  //   document.addEventListener('mouseup', () => {
  //     if (this.line) {
  //       this.svg.nativeElement.removeChild(this.line);
  //       this.line = null;
  //     }
  //   });
  // }
  // ngAfterViewInit() {
  //   this.svg.nativeElement.addEventListener(
  //     'mousedown',
  //     (event: { target: any }) => {
  //       const shape = event.target;
  //       if (shape.tagName === 'rect') {
  //         // handle mouse down event on shape
  //         const shapeId = shape.getAttribute('data-id');
  //         const shapeData = this.shapes.find(
  //           (shape) => shape.id === parseInt(shapeId, 10)
  //         );
  //         if (shapeData) {
  //           // draw line from shape to anchor point
  //           const anchorPoint = this.getAnchorPoint(shapeData);
  //           if (anchorPoint) {
  //             const line = document.createElementNS(
  //               'http://www.w3.org/2000/svg',
  //               'line'
  //             );
  //             line.setAttribute('x1', shapeData.x.toString());
  //             line.setAttribute('y1', shapeData.y.toString());
  //             line.setAttribute('x2', anchorPoint.x.toString());
  //             line.setAttribute('y2', anchorPoint.y.toString());
  //             line.setAttribute('stroke', 'black');
  //             line.setAttribute('stroke-width', '2');
  //             this.svg.nativeElement.appendChild(line);
  //           }
  //         }
  //       }
  //     }
  //   );
  // }
  // ngAfterViewInit() {
  //   this.svg.nativeElement.addEventListener(
  //     'mousedown',
  //     (event: { target: any }) => {
  //       const shape = event.target;
  //       if (shape.tagName === 'rect') {
  //         // handle mouse down event on shape
  //         const shapeId = shape.getAttribute('data-id');
  //         const shapeData = this.shapes.find(
  //           (shape) => shape.id === parseInt(shapeId, 10)
  //         );
  //         if (shapeData) {
  //           // draw line from shape to anchor point
  //           const anchorPoint = this.getAnchorPoint(shapeData);
  //           if (anchorPoint) {
  //             this.line = document.createElementNS(
  //               'http://www.w3.org/2000/svg',
  //               'line'
  //             );
  //             this.line.setAttribute('x1', shapeData.x.toString());
  //             this.line.setAttribute('y1', shapeData.y.toString());
  //             // line.setAttribute('x2', anchorPoint.x.toString());
  //             // line.setAttribute('y2', anchorPoint.y.toString());
  //             this.line.setAttribute('stroke', 'black');
  //             this.line.setAttribute('stroke-width', '2');
  //             this.svg.nativeElement.appendChild(this.line);
  //           }
  //         }
  //       }
  //     }
  //   );
  // }

  getAnchorPoint(shapeData: any) {
    // implement logic to get anchor point for shape
    // return the anchor point object or null if not found
    // ...
    // const anchorPoint = { x: 0, y: 0 }; // replace with actual logic to get anchor point
    // return anchorPoint;
    return { x: shapeData.x + 10, y: shapeData.y + 10 };
  }

  // ngAfterViewInit() {
  //   this.canvas.nativeElement.addEventListener(
  //     'mousedown',
  //     (event: { target: any }) => {
  //       const shape = event.target;
  //       if (shape.tagName === 'DIV') {
  //         // handle mouse down event on shape
  //         const shapeId = shape.getAttribute('data-id');
  //         const shapeData = this.shapes.find(
  //           (shape) => shape.id === parseInt(shapeId, 10)
  //         );
  //         if (shapeData) {
  //           // make shape draggable
  //           shape.style.cursor = 'move';
  //           shape.style.position = 'absolute';
  //           shape.style.top = shapeData.y + 'px';
  //           shape.style.left = shapeData.x + 'px';

  //           // add event listeners to make shape draggable
  //           shape.addEventListener(
  //             'mousemove',
  //             (event: { clientY: number; clientX: number }) => {
  //               shape.style.top = shapeData.y + event.clientY + 'px';
  //               shape.style.left = shapeData.x + event.clientX + 'px';
  //             }
  //           );
  //           shape.addEventListener('mouseup', () => {
  //             shape.style.cursor = 'default';
  //           });
  //         }
  //       }
  //     }
  //   );

  //   this.canvas.nativeElement.addEventListener('dblclick', (event: any) => {
  //     // connect shapes with lines
  //     const shape1 = this.shapes[0];
  //     const shape2 = this.shapes[1];
  //     const line = document.createElementNS(
  //       'http://www.w3.org/2000/svg',
  //       'line'
  //     );
  //     line.setAttribute('x1', shape1.x.toString());
  //     line.setAttribute('y1', shape1.y.toString());
  //     line.setAttribute('x2', shape2.x.toString());
  //     line.setAttribute('y2', shape2.y.toString());
  //     line.setAttribute('stroke', 'black');
  //     line.setAttribute('stroke-width', '2');
  //     this.canvas.nativeElement.appendChild(line);
  //   });
  // }
  // ngAfterViewInit() {
  //   this.shape.nativeElement.addEventListener(
  //     'mousedown',
  //     (event: { target: any }) => {
  //       const anchor = event.target;
  //       if (anchor.tagName === 'DIV') {
  //         // handle mouse down event on anchor
  //         this.startDrawing(anchor);
  //       }
  //     }
  //   );
  // }

  ngAfterViewInit() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    // this.canvas.nativeElement.addEventListener(
    //   'mousedown',
    //   (event: { target: any }) => {
    //     const anchor = event.target;
    //     if (anchor.tagName === 'circle') {
    //       this.startDrawing(anchor);
    //     }
    //   }
    // );
  }
}
