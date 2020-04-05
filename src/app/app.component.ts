import { HostListener, Component } from '@angular/core';
import { HistoryService } from './history.service';
import { HistoryEntry } from './history-entry';
import { SimpleMath } from './simple-math';
import { MathNode, UnaryOperator, BinaryOperator, Operand } from './infix-nodes';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  root: MathNode = null;
  expression = '';
  storedOperand = '';
  operand = '';
  resetOperand = false;
  hasResult = false;
  operatorKey = '';
  inputKey = '';
  showHistory = true;
  isMouseDown = false; 
  keyHandlers = {};
  actions = [
    [{key: '%'}, {key: 'e', text:'CE'}, {key: 'C'}, {key: '<'}],
    [{key: 'i', text: 'inv'}, {key: 's', text:'sqr'}, {key: 'r', text:'sqrt'}, {key: '/'}],
    [{key: '7'}, {key: '8'}, {key: '9'}, {key: 'x'}],
    [{key: '4'}, {key: '5'}, {key: '6'}, {key: '-'}],
    [{key: '1'}, {key: '2'}, {key: '3'}, {key: '+'}],
    [{key: 't', text:'+/-'}, {key: '0'}, {key: '.'}, {key: '='}],
  ]

  

  constructor(
    private historyService: HistoryService,
  ) { 
    // Init key handlers dictionary.
    // Each 'key' will trigger a specific handler.
    this.keyHandlers = {
      'enter': this.compute,
      ' ': this.compute,
      '=': this.compute,
      '.': this.addDecimalPoint,
      '<': this.backspace,
      'backspace': this.backspace,
      't': this.toggleSignal,
      'c': this.clear,
      'e': this.clearOnlyOperand,
      '%': this.percentage,
      'i': this.inverseOperand,
    }

    for(var n = 0; n < 10; n++) {
      this.keyHandlers[n.toString()] = this.inputNumber;
    }

    Object.keys(MathNode.operators).forEach(key => {
      this.keyHandlers[key] = this.inputOperator
    });
  }

  ngOnInit() {
    this.checkShowHistory();
  }

  @HostListener('window:mousedown', ['$event'])
  handleMouseDown(event) {
    // lock mousedown var so that handleClick 
    // may delegate action to handleKey method.
    // this way, we will only handle button actions
    // that were triggered using mouse.
    // All keyboard button triggers (space or enter)
    // should be treated as 'compute result' action.
    this.isMouseDown = true;
  }
  
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.handleKey(event.key);
  }

  @HostListener('window:resize', ['$event'])
  handleResize(event) {
    this.checkShowHistory();
  }

  private checkShowHistory() {
    this.showHistory = window.innerWidth >= 400;
  }
  
  handleClick(key) {
    if (this.isMouseDown) {
      this.handleKey(key);
      this.isMouseDown = false;
    }  
  }

  handleKey(key: string) {
    key = key.toLocaleLowerCase();
    if (this.keyHandlers.hasOwnProperty(key)) {
      this.inputKey = key;
      this.keyHandlers[key].bind(this)();
    }
  }

  inputOperator() {
    this.operatorKey = this.inputKey;
    this.storedOperand = this.operand;
    this.resetOperand = true;
    this.hasResult = false;

    var newNode: MathNode = new Operand(this.operand);
    if (this.root != null && this.root instanceof BinaryOperator) {
      this.root.right = newNode;
      this.operand = this.root.compute();
      newNode = this.root;
    }
    this.root = MathNode.createOperator(this.operatorKey, newNode);
    this.expression = this.root.toString();

    if (this.root instanceof UnaryOperator) {
      this.compute();
    }
  }

  inputNumber() {
    if (this.operand.length > 12 && !this.resetOperand) {
      // We will limit the operand length so that it will fit in the html input
      return;
    } 

    if (this.hasResult) {
      this.clear();
    }

    if (this.resetOperand || this.operand === '0') {
      this.operand = '';
      this.resetOperand = false;
    }

    this.operand += this.inputKey;
  }

  percentage() {
    this.operand = this.fixPrecision(+this.storedOperand * +this.operand / 100);
    this.compute();
  }

  inverseOperand() {
    this.storedOperand = '1';
    this.operatorKey = '/';
    this.hasResult = false;
    this.compute();
  }

  toggleSignal() {
    this.operand = (- +this.operand).toString();
  }

  addDecimalPoint() {
    if (!this.operand.includes('.')) {
      this.operand += '.';
    }
  }

  backspace() {
    if (this.hasResult) {
      this.expression = '';
    } else {
      this.operand = this.operand.length > 1 ? this.operand.slice(0,-1) : '0';
    }
  }

  clearOnlyOperand() {
    this.resetOperand = true;
    this.operand = '0';
  }

  clear() {
    this.root = null;
    this.resetOperand = true;
    this.hasResult = false;
    this.expression = '';
    this.storedOperand = '';
    this.operatorKey = '';
    this.inputKey = '';
    this.operand = '0';
  }

  fixPrecision(number): string {
    return parseFloat(number.toPrecision(12)).toString();
  }

  compute() {
    if (!MathNode.hasOperator(this.operatorKey)) {
      // the given operation is not supported or not defined
      console.error(`Operation not defined = '${this.operatorKey}'`)
      return;
    }

    var leftOp, rightOp;
    if (this.hasResult) {
      [leftOp, rightOp] = [this.operand, this.storedOperand];
    } else {
      [leftOp, rightOp] = [this.storedOperand, this.operand];
      this.storedOperand = this.operand;
    }

    if (this.root == null) {
      this.root = MathNode.createOperator(this.operatorKey, new Operand(leftOp));
    }

    if (this.root instanceof BinaryOperator) {
      this.root.right = new Operand(rightOp);        
    }
    
    this.expression = this.root.toString() + " =";
    this.operand = this.fixPrecision(this.root.compute());
    this.root = null;

    this.hasResult = true;
    this.resetOperand = true;
    this.historyService.add(this.expression, this.operand, this.storedOperand, this.operatorKey);
  }

  onSelectHistory(entry: HistoryEntry) { 
    this.clear();
    this.expression = entry.operands;
    this.operand = entry.result;
    this.storedOperand = entry.storedOperand;
    this.operatorKey = entry.operatorKey;
    this.hasResult = true;
    this.resetOperand = true;
  }
}
