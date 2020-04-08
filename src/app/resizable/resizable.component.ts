import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-resizable',
  templateUrl: './resizable.component.html',
  styleUrls: ['./resizable.component.css']
})
export class ResizableComponent {

  @Input() width;
  @Input() height;

  constructor() {}

  ngAfterViewInit() {
    var mainDiv = document.getElementsByClassName('resizable-main')[0];
    console.log(mainDiv);
    mainDiv.style.width = this.width+'px';
    mainDiv.style.height = this.height+'px';
  }

}