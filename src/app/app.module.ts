import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HistoryComponent } from './history/history.component';
import { HistoryService } from './history.service';
import { ResizableComponent } from './resizable/resizable.component';
import { DragResizableDirective } from './resizable/drag-resizable.directive';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HistoryComponent, ResizableComponent, DragResizableDirective ],
  bootstrap:    [ AppComponent ],
  providers: [HistoryService]
})
export class AppModule { 



}
