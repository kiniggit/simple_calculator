import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appDragResizable]'
})
export class DragResizableDirective {
  /*
    References:
    https://angular.io/guide/attribute-directives
    https://stackoverflow.com/questions/42633117/how-can-i-add-a-class-to-an-element-on-hover
    https://stackblitz.com/edit/angular-xqeflh?file=src%2Fapp%2Fhover-class.directive.ts
  */
  
  constructor(private el: ElementRef) {}

  @Input('appDragResizable') direction: string;

  @HostListener('mouseover', ['$event']) onMouseOver(event) {
    this.el.nativeElement.style.cursor = this.direction+'-resize';
  }

  @HostListener('mouseout', ['$event']) onMouseOut(event) {
    this.el.nativeElement.style.cursor = 'pointer';
  }

  @HostListener('drag', ['$event']) onMouseDrag(event) {
    if(event.screenX == 0 && event.screenY == 0) {
      return;
    }

    var parentNode = this.el.nativeElement.parentNode;    
    var currHeight = +parentNode.style.height.slice(0,-2);
    var currWidth = +parentNode.style.width.slice(0,-2);
     
    if (this.direction == 'ns' || this.direction == 'nwse') {
      parentNode.style.height = `${currHeight+event.offsetY}px`;
    }
    if (this.direction == 'ew' || this.direction == 'nwse') {
      parentNode.style.width = `${currWidth+event.offsetX}px`;
    }
  }

}