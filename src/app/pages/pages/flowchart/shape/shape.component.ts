import { Component, Input } from '@angular/core';
import { shapeInfo } from './shapeInfo';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrl: './shape.component.scss',
})
export class ShapeComponent {
  @Input('shape')
  public shape: shapeInfo | undefined;

  public setShape(shape: shapeInfo) {
    this.shape = shape;
    this.label = shape.label;
  }
  public label: any = 'shape';
}
