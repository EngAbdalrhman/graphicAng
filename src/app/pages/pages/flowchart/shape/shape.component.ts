import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { shapeInfo } from './shapeInfo';

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.scss'],
})
export class ShapeComponent {
  @ViewChild('svg') svg!: ElementRef;
  @Input('shape') public shape: shapeInfo | undefined;
  @Output() startDrawing = new EventEmitter<{
    anchor: any;
    shape: shapeInfo;
  }>();

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

  handleAnchorClick($event: MouseEvent, anchorIndex: number) {
    $event.stopPropagation();
    let anchor = this.anchors[anchorIndex];
    this.startDrawing.emit({ anchor, shape: this.shape! });
  }

  ngAfterViewInit() {
    this.svg.nativeElement.addEventListener(
      'mousedown',
      (event: { target: any }) => {
        let anchor = event.target;
        if (anchor.tagName === 'circle') {
          let anchorId = anchor.getAttribute('data-id');
          let anchorData = this.anchors.find(
            (anchor) => anchor.id === parseInt(anchorId, 10)
          );
          if (anchorData) {
            this.startDrawing.emit({ anchor: anchorData, shape: this.shape! });
          }
        }
      }
    );
  }

  // public isHoveringAnchor = false;
  // public hoveredAnchorIndex: number | null = null;

  // public onMouseEnterAnchor(index: number) {
  //   this.isHoveringAnchor = true;
  //   this.hoveredAnchorIndex = index;
  // }

  // public onMouseLeaveAnchor() {
  //   this.isHoveringAnchor = false;
  //   this.hoveredAnchorIndex = null;
  // }

  // onMouseDown(event: MouseEvent) {
  //   event.stopPropagation();
  // }
}
