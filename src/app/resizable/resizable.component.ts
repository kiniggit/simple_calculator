import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-resizable',
  templateUrl: './resizable.component.html',
  styleUrls: ['./resizable.component.css']
})
export class ResizableComponent implements AfterViewInit {

  @ViewChild('resizableMain', null) resizableMain: ElementRef;

  @Input() width;
  @Input() height;

  constructor() {}

  ngAfterViewInit() {
    let el = this.resizableMain.nativeElement;
    el.style.width = this.width+'px';
    el.style.height = this.height+'px';
  }

}