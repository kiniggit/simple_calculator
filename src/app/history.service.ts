import { Injectable } from '@angular/core';
import { HistoryEntry } from './history-entry';

@Injectable()
export class HistoryService {

  history: HistoryEntry[] = []

  constructor() { }

  add(ops: string, res: string, op2: string, opKey: string) {
    this.history.push({
      operands: ops, result: res, op2: op2, operationKey: opKey 
    })
  }

  clear() {
    this.history = []
  }

}