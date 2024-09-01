import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-anchor',
  templateUrl: './anchor.component.html',
  styleUrl: './anchor.component.scss',
})
export class AnchorComponent {
  @Input()
  anchor!: { x: number; y: number } | undefined;
}
