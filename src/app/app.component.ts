import { HostListener, Component } from '@angular/core';
import { HistoryService } from './history.service';
import { HistoryEntry } from './history-entry';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  expression = '';
  op1 = '';
  op2 = '';
  operand = '';
  resetExpression = false;
  resetOperand = false;
  hasResult = false;
  operationKey = '';
  showHistory = true;
  operations = {
    '+': this.sum,
    '-': this.sub,
    '/': this.div,
    '*': this.mult,
  }

  actions = [
    [{key: '%'}, {key: '', text:'CE'}, {key: 'C'}, {key: 'Backspace', text: '<'}],
    [{key: 'i', text: 'inv'}, {key: 's', text:'sqr'}, {key: 'r', text:'sqrt'}, {key: '/'}],
    [{key: '7'}, {key: '8'}, {key: '9'}, {key: 'x'}],
    [{key: '4'}, {key: '5'}, {key: '6'}, {key: '-'}],
    [{key: '1'}, {key: '2'}, {key: '3'}, {key: '+'}],
    [{key: 't', text:'+/-'}, {key: '0'}, {key: '.'}, {key: '='}],
  ]

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

    if(key in this.operations) {
      this.operationKey = key;
      this.op1 = this.operand;
      this.resetOperand = true;
      this.updateExpression(this.operand, this.operationKey);
      this.hasResult = false;
      return;
    }

    if(key === 'Backspace' || key === '<') {
      this.backspace();
      return;
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

    if(key.match(/\d/)) {
      if(this.hasResult) {
        this.clear();
        this.hasResult = false;
      }

      if(this.resetOperand || this.operand === '0') {
        this.operand = '';
        this.resetOperand = false;
      }
      this.operand += key;
      return;
    }

    if(key === '.' && !this.operand.includes('.')) {
      this.operand += '.';
      return;
    }

  }

  updateExpression(op, opKey) {
    if(this.resetExpression) {
      this.expression = ''
      this.resetExpression = false;
    }
    this.expression += `${op} ${opKey} `
  }

  clear() {
    this.resetOperand = true;
    this.expression = '';
    this.operand = '0';
    this.op1 = '';
    this.op2 = '';
    this.operationKey = '';
  }

  backspace() {
    if(this.hasResult) {
      this.expression = '';
      return;
    }

    if(this.operand != '0') {
      this.operand = this.operand.length > 1 ? this.operand.slice(0,-1) : '0';
    }
  }

  sum(a, b) {
    return a + b;
  }

  sub(a, b) {
    return a - b;
  }

  mult(a, b) {
    return a * b;
  }

  div(a, b) {
    return a / b;
  }

  fixPrecision(number) {
    return parseFloat(number.toPrecision(12));
  }

  opResult() {
    if(!this.op1) {
      this.op1 = this.operand;
      this.resetExpression = true;
      this.updateExpression(this.op1, this.operationKey);
    } else {
      this.op2 = this.operand;
    }
    this.updateExpression(this.op2, '=');
    this.resetExpression = true;
    this.resetOperand = true;
    this.operand = this.operations[this.operationKey](+this.op1, +this.op2);
    this.operand = this.fixPrecision(this.operand).toString();
    this.hasResult = true;
    this.op1 = '';
    this.historyService.add(this.expression, this.operand, this.op2,this.operationKey);
  }

  onSelectHistory(entry: HistoryEntry) { 
    this.clear();
    this.expression = entry.operands;
    this.operand = entry.result;
    this.op2 = entry.op2;
    this.operationKey = entry.operationKey;
    this.hasResult = true;
    this.resetExpression = true;
    this.resetOperand = true;
  }
}
