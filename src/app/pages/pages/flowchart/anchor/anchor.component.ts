import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-anchor',
  templateUrl: './anchor.component.html',
  styleUrl: './anchor.component.scss',
})
export class AnchorComponent {
  @Input()
  anchor!: { x: number; y: number } | undefined;
  ngAfterViewInit() {
    document.addEventListener('mousedown', (e) => {
      // draw line from anchor point to shape
      const line = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line'
      );
      line.setAttribute('x1', this.anchor!.x.toString());
      line.setAttribute('y1', this.anchor!.y.toString());
      line.setAttribute('x2', e.clientX.toString());
      line.setAttribute('y2', e.clientY.toString());
      line.setAttribute('stroke', 'black');
      line.setAttribute('stroke-width', '2');
      document.body.appendChild(line);
    });
  }
}
