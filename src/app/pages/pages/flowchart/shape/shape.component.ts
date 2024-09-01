import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { shapeInfo } from './shapeInfo';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrl: './shape.component.scss',
})
export class ShapeComponent {
  @ViewChild('svg')
  svg!: ElementRef;
  @Input('shape')
  public shape: shapeInfo | undefined;
  @Output()
  public line: SVGLineElement | undefined;

  public setShape(shape: shapeInfo) {
    this.shape = shape;
    this.label = shape.label;
    shape.line = this.line;
  }
  public label: any = 'shape';
  anchors = [
    { x: 10, y: 85, id: 0 }, // top-left
    { x: 85, y: 10, id: 1 }, // top-right
    { x: 85, y: 150, id: 2 }, // bottom-right
    { x: 150, y: 85, id: 3 }, // bottom-left
  ];
  isShown = false;
  onMouseOverShape() {
    this.isShown = true;
  }
  onMouseUpShape() {
    this.isShown = false;
  }
  handleAnchorClick($event: MouseEvent, i: number) {
    // this.isShown = true;
    // // logic start drawing
    // this.isShown = false;
  }
  // ngAfterViewInit() {
  //   this.svg.nativeElement.addEventListener(
  //     'mousedown',
  //     (event: { target: any }) => {
  //       let anchor = event.target;
  //       if (anchor.tagName === 'circle') {
  //         // handle mouse down event on anchor point
  //       }
  //     }
  //   );
  // }

  ngAfterViewInit() {
    this.svg.nativeElement.addEventListener(
      'mousedown',
      (event: { target: any }) => {
        const anchor = event.target;
        if (anchor.tagName === 'circle') {
          // handle mouse down event on anchor point
          const anchorId = anchor.getAttribute('data-id');
          const anchorData = this.anchors.find(
            (anchor) => anchor.id === parseInt(anchorId, 10)
          );
          if (anchorData) {
            // draw line from anchor point to shape
            let shape = this.getShape(anchorData);
            if (shape) {
              this.line = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'line'
              );
              this.line.setAttribute('x1', anchorData.x.toString());
              this.line.setAttribute('y1', anchorData.y.toString());
              // to
              // line.setAttribute('x2', shape.x.toString());
              // line.setAttribute('y2', shape.y.toString());
              this.line.setAttribute('stroke', 'black');
              this.line.setAttribute('stroke-width', '2');
              this.svg.nativeElement.appendChild(this.line);
              this.shape!.line = this.line;
            }
          }
        }
      }
    );
  }

  getShape(anchorData: { x: any; y: any }) {
    // implement logic to get shape for anchor point
    // the drawing feature
    // for example:
    return { x: anchorData.x + 200, y: anchorData.y + 200 };
  }
  public isHoveringAnchor = false;
  public hoveredAnchorIndex: number | null = null;

  public onMouseEnterAnchor(index: number) {
    this.isHoveringAnchor = true;
    this.hoveredAnchorIndex = index;
  }

  public onMouseLeaveAnchor() {
    this.isHoveringAnchor = false;
    this.hoveredAnchorIndex = null;
  }
}
