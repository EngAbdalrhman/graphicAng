import { Component } from '@angular/core';
import { shapeInfo } from './shape/shapeInfo';
@Component({
  selector: 'app-flowchart',
  templateUrl: './flowchart.component.html',
  styleUrl: './flowchart.component.scss',
})
export class FlowchartComponent {
  // constructor(){
  //   localStorage.getItem(this.shapes[0].toString());
  // }
  toolbar:shapeInfo[] = [
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
  { label: 'Shape', width: 50,color:'black', height: 50, x: 10, y: -250 },];
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

  // loadObjects(shapeInfo: shapeInfo, x: number, y: number) {
  //   shapeInfo.x = parseInt(localStorage.getItem(shapeInfo.label + '-x') || '0');
  //   shapeInfo.y = parseInt(localStorage.getItem(shapeInfo.label + '-y') || '0');
  // }
  DragItem : shapeInfo | undefined;
  drag($event:Event,shape:shapeInfo)
  {
    this.DragItem = shape;
    // console.log(shape);
    
  }
  allowDrag($event:Event){
    $event.preventDefault();
  }
  dropItem($event:DragEvent,canvas:HTMLDivElement){
    $event.preventDefault();
    if(this.DragItem){
      let newItem:shapeInfo = {...this.DragItem}; // make a clone of item because we don't want to share the same instance of the item 
      let boundery = canvas.getBoundingClientRect();
      newItem.x = $event.x - boundery.x;
      newItem.y = $event.y - boundery.y;
      this.shapes.push(newItem);
      this.DragItem = undefined;
    }
  }
}
