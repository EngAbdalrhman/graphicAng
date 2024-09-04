import { Component, Input } from '@angular/core';
import { shapeInfo } from './shapeInfo';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.scss'],
})
export class ShapeComponent {
  @Input('shape') public shape: shapeInfo | undefined;

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
}
