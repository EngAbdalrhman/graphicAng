import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowchartRoutingModule } from './flowchart-routing.module';
import { FlowchartComponent } from './flowchart.component';
import { SplitterModule } from 'primeng/splitter';
import { ShapeComponent } from './shape/shape.component';
import { shapeInfo } from './shape/shapeInfo';
import { Button } from 'primeng/button';

@NgModule({
  declarations: [FlowchartComponent, ShapeComponent],
  imports: [CommonModule, FlowchartRoutingModule, SplitterModule, Button],
})
export class FlowchartModule {}
