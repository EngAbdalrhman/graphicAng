import { Component } from '@angular/core';
import { shapeInfo } from './shape/shapeInfo';
@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrl: './flowchart.component.scss',
})
export class FlowchartComponent {
  shapes: shapeInfo[] = [
    {
      label: 'Rectangle',
      width: 100,
      height: 200,
      color: 'red',
      text_color: 'white',
      x: 0,
      y: 0,
    },
    {
      label: 'Ellipse',
      width: 100,
      height: 100,
      color: 'blue',
      text_color: 'white',
      x: 100,
      y: 0,
    },
    { label: 'Shape', width: 200, height: 100, x: 0, y: 100 },
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
}
