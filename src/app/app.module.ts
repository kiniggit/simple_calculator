import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HistoryComponent } from './history/history.component';
import { HistoryService } from './history.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HistoryComponent ],
  bootstrap:    [ AppComponent ],
  providers: [HistoryService]
})
export class AppModule { 



}
