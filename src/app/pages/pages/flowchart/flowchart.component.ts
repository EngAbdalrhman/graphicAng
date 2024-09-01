import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { shapeInfo } from './shape/shapeInfo';
@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrl: './flowchart.component.scss',
})
export class FlowchartComponent {
  @ViewChild('svg')
  svg!: ElementRef;
  private line: SVGLineElement | undefined;

  constructor() {
    // Get the shapes' coordinates from local storage
    const shapesPlacement = localStorage.getItem('shapesPlacement');
    if (shapesPlacement) {
      this.shapes = JSON.parse(shapesPlacement);
      // Update the shapes' coordinates
      // this.shapes.forEach((shape) => {
      //   const shapeCoords = shapes.find((s) => s.id === shape.id);
      //   if (shapeCoords) {
      //     shape.x = shapeCoords.x;
      //     shape.y = shapeCoords.y;
      //   }
      // });
    }
  }
  toolbar: shapeInfo[] = [
    // {label: 'Blue', width: 70, height: 50, color: 'blue', x: 5, y: 5},
    // {label: 'red', width: 70, height: 50, color: 'red', x: 5, y: 80},
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
  shapes: shapeInfo[] = [
    // {
    //   label: 'Rectangle',
    //   width: 100,
    //   height: 200,
    //   color: 'red',
    //   text_color: 'white',
    //   x: 0,
    //   y: 0,
    // },
    // {
    //   label: 'Ellipse',
    //   width: 100,
    //   height: 100,
    //   color: 'blue',
    //   text_color: 'white',
    //   x: 100,
    //   y: 0,
    // },
    // { label: 'Shape', width: 200, height: 100, x: 0, y: 100 },
  ];
  private _shapeStartMove: shapeInfo | undefined;
  private lastX: number = 0;
  private lastY: number = 0;
  // shape: shapeInfo = this.shapes[0];
  shapeStartMove($event: MouseEvent, shape: shapeInfo) {
    $event.preventDefault();
    this._shapeStartMove = shape;
    this.lastX = $event.x;
    this.lastY = $event.y;
  }
  shapeEndMove() {
    this._shapeStartMove = undefined;
  }
  moveShape($event: MouseEvent) {
    $event.preventDefault();
    if (this._shapeStartMove) {
      this._shapeStartMove.x += $event.x - this.lastX;
      this._shapeStartMove.y += $event.y - this.lastY;
      this.lastX = $event.x;
      this.lastY = $event.y;
    }
  }
  // saveObjects(shapeInfo: shapeInfo, x: number, y: number) {
  //   localStorage.setItem(shapeInfo.label, shapeInfo.toString());
  //   localStorage.setItem(shapeInfo.label + '-x', x.toString());
  //   localStorage.setItem(shapeInfo.label + '-y', y.toString());
  // }
  save() {
    localStorage.setItem('shapesPlacement', JSON.stringify(this.shapes));
  }
  // loadObjects(shapeInfo: shapeInfo, x: number, y: number) {
  //   shapeInfo.x = parseInt(localStorage.getItem(shapeInfo.label + '-x') || '0');
  //   shapeInfo.y = parseInt(localStorage.getItem(shapeInfo.label + '-y') || '0');
  // }
  DragItem: shapeInfo | undefined;
  drag($event: Event, shape: shapeInfo) {
    this.DragItem = shape;
    // console.log(shape);
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
      newItem.x = $event.x - boundery.x;
      newItem.y = $event.y - boundery.y;
      newItem.id = this.shapeID++;
      let anchors = [
        { x: 0, y: 0 }, // top-left
        { x: 50, y: 0 }, // top-right
        { x: 50, y: 50 }, // bottom-right
        { x: 0, y: 50 }, // bottom-left
      ];
      newItem.anchors = anchors;
      this.shapes.push(newItem);
      this.DragItem = undefined;
    }
  }
  clear() {
    this.shapes = []; // clear the shapes array
    localStorage.removeItem('shapesPlacement');
  }
  drawing: boolean = false;
  startPoint: HTMLElement | null = null;
  endPoint: HTMLElement | null = null;
  // shapeActive(e: any) {
  //   e.nativeElement.style.display = 'block';
  // }
  // shapeInactive(e: any) {
  //   e.nativeElement.style.display = 'none';
  // }
  // draw(e: any, $event: MouseEvent) {
  //   this.drawing = true;
  //   this.startPoint = e.target as HTMLElement;
  //   const startPointAnchor = this.getStartPointAnchor(this.startPoint);
  //   if (this.endPoint) {
  //     let endPointAnchor = this.getEndPointAnchor(this.endPoint);
  //   }
  // }
  stopDrawing(line: any, event: MouseEvent) {
    // if (this.drawing) {
    //   this.endPoint = component.target as HTMLElement;
    //   // draw line between startPoint and endPoint
    // }
    this.line = line;
    if (this.line) {
      this.line.setAttribute('x2', event.clientX.toString());
      this.line.setAttribute('y2', event.clientY.toString());
    }
  }
  // getStartPointAnchor(element: HTMLElement) {
  //   const anchors = element.querySelectorAll('.anchor');
  //   return anchors[0]; // return the first anchor point
  // }

  // getEndPointAnchor(element: HTMLElement) {
  //   const anchors = element.querySelectorAll('.anchor');
  //   return anchors[1]; // return the second anchor point
  // }

  finishDraw(line: any) {
    this.drawing = false;
    // this.line = line;
    if (this.line) {
      this.svg.nativeElement.removeChild(this.line);
      this.line = undefined;
      //anchorData = null;
    }
  }

  ngAfterViewInit() {
    this.svg.nativeElement.addEventListener(
      'mousedown',
      (event: { target: any }) => {
        const shape = event.target;
        if (shape.tagName === 'rect') {
          // handle mouse down event on shape
          const shapeId = shape.getAttribute('data-id');
          const shapeData = this.shapes.find(
            (shape) => shape.id === parseInt(shapeId, 10)
          );
          if (shapeData) {
            // draw line from shape to anchor point
            const anchorPoint = this.getAnchorPoint(shapeData);
            if (anchorPoint) {
              this.line = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'line'
              );
              this.line.setAttribute('x1', shapeData.x.toString());
              this.line.setAttribute('y1', shapeData.y.toString());
              // line.setAttribute('x2', anchorPoint.x.toString());
              // line.setAttribute('y2', anchorPoint.y.toString());
              this.line.setAttribute('stroke', 'black');
              this.line.setAttribute('stroke-width', '2');
              this.svg.nativeElement.appendChild(this.line);
            }
          }
        }
      }
    );
  }

  getAnchorPoint(shapeData: any) {
    // implement logic to get anchor point for shape
    // return the anchor point object or null if not found
    // ...
    // const anchorPoint = { x: 0, y: 0 }; // replace with actual logic to get anchor point
    // return anchorPoint;
    return { x: shapeData.x + 10, y: shapeData.y + 10 };
  }
}
