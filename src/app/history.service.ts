import { Injectable } from '@angular/core';
import { HistoryEntry } from './history-entry';

@Injectable()
export class HistoryService {

  history: HistoryEntry[] = []

  constructor() { }

  add(ops: string, res: string, storedOp: string, opKey: string) {
    this.history.push({
      operands: ops, result: res, storedOperand: storedOp, operatorKey: opKey 
    })
  }

  clear() {
    this.history = []
  }

}