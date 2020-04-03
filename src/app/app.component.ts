import { HostListener, Component } from '@angular/core';
import { HistoryService } from './history.service';
import { HistoryEntry } from './history-entry';
import { SimpleMath } from './simple-math';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  expression = '';
  storedOperand = '';
  operand = '';
  resetOperand = false;
  hasResult = false;
  operationKey = '';
  showHistory = true;
  
  operations = {
    '+': SimpleMath.sum,
    '-': SimpleMath.sub,
    '/': SimpleMath.div,
    '*': SimpleMath.mult,
  }

  actions = [
    [{key: '%'}, {key: '', text:'CE'}, {key: 'C'}, {key: 'Backspace', text: '<'}],
    [{key: 'i', text: 'inv'}, {key: 's', text:'sqr'}, {key: 'r', text:'sqrt'}, {key: '/'}],
    [{key: '7'}, {key: '8'}, {key: '9'}, {key: 'x'}],
    [{key: '4'}, {key: '5'}, {key: '6'}, {key: '-'}],
    [{key: '1'}, {key: '2'}, {key: '3'}, {key: '+'}],
    [{key: 't', text:'+/-'}, {key: '0'}, {key: '.'}, {key: '='}],
  ]

  keyHandlers = {
    '.': this.addDecimalPoint,
  }

  constructor(
    private historyService: HistoryService,
  ) { 
    console.log("constructor");
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.handleKey(event.key)
  }

  @HostListener('window:resize', ['$event'])
  handleResize(event) {
    this.checkShowHistory();
  }

  ngOnInit() {
    this.checkShowHistory();
  }

  private checkShowHistory() {
    this.showHistory = window.innerWidth >= 400;
  }
  
  handleKey(key: string) {
    if(key === 'Enter' || key === '=') {
      this.opResult();
      return;
    }

    if (key === '%') {
      this.operand = this.fixPrecision(+this.storedOperand * +this.operand / 100).toString();
      this.opResult();
      return;
    }

    if(key in this.operations) {
      this.operationKey = key;
      this.storedOperand = this.operand;
      this.resetOperand = true;
      this.updateExpression(this.operand, this.operationKey, this.hasResult);
      this.hasResult = false;
      return;
    }

    if(key === 'Backspace' || key === '<') {
      if(this.hasResult) {
        this.expression = '';
      } else {
        this.operand = this.operand.length > 1 ? this.operand.slice(0,-1) : '0';
      }
    }

    if(key === 'c' || key === 'C') {
      this.clear()
      return;
    }

    // the operations below will append to operand text
    if(this.operand.length > 12 && !this.resetOperand) {
      // We will limit the operand length so that it will fit in the html input
      return;
    } 

    if(key === 't') {
      this.operand = - +this.operand;
    }

    if(key === 'i') {
      this.storedOperand = 1;
      this.operationKey = '/';
      this.hasResult = false;
      this.opResult();
      return;
    }

    if(key.match(/\d/)) {
      if(this.hasResult) {
        this.clear();
      }

      if(this.resetOperand || this.operand === '0') {
        this.operand = '';
        this.resetOperand = false;
      }

      this.operand += key;
      return;
    }

    if(this.keyHandlers.hasOwnProperty(key)) {
      this.operand = this.keyHandlers[key](this.operand);
    }
  }

  addDecimalPoint(operand: string) {
    return operand.includes('.') ? operand : operand + '.'; 
  }

  updateExpression(op, opKey, reset=false) {
    if(reset) { this.expression = ''; }
    this.expression += `${op} ${opKey} `
  }

  clear() {
    this.resetOperand = true;
    this.hasResult = false;
    this.expression = '';
    this.operand = '0';
    this.storedOperand = '';
    this.operationKey = '';
  }

  fixPrecision(number) {
    return parseFloat(number.toPrecision(12));
  }

  opResult() {
    if(!this.operations.hasOwnProperty(this.operationKey)) {
      // the given operation is not supported or not defined
      console.error(`Operation not defined = '${this.operationKey}'`)
      return;
    }

    var leftOp, rightOp;
    if(this.hasResult) {
      [leftOp, rightOp] = [this.operand, this.storedOperand];
    } else {
      [leftOp, rightOp] = [this.storedOperand, this.operand];
      this.storedOperand = this.operand;
    }

    this.updateExpression(leftOp, this.operationKey, true);
    this.updateExpression(rightOp, '=');
    
    this.operand = this.operations[this.operationKey](+leftOp, +rightOp);
    this.operand = this.fixPrecision(this.operand).toString();
    this.hasResult = true;
    this.resetOperand = true;
    this.historyService.add(this.expression, this.operand, this.storedOperand, this.operationKey);
  }

  onSelectHistory(entry: HistoryEntry) { 
    this.clear();
    this.expression = entry.operands;
    this.operand = entry.result;
    this.storedOperand = entry.storedOperand;
    this.operationKey = entry.operationKey;
    this.hasResult = true;
    this.resetOperand = true;
  }
}
