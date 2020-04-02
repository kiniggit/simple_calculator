import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HistoryService } from '../history.service';
import { HistoryEntry } from '../history-entry'; 

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @Output()
  notify = new EventEmitter<HistoryEntry>();

  constructor(
    public historyService: HistoryService
  ) { }

  ngOnInit() {
  }

}