import { SimpleMath } from './simple-math';

export abstract class Node {
	
  abstract compute();

  static factories = {
    '+': Node.createSum,
    '-': Node.createSub,
    '/': Node.createDiv,
    '*': Node.createMult,
    'r': Node.createSqrt,
    's': Node.createSqr,
  }

  static createSum(left: Node, right: Node) {
    return new BinaryOperatorNode('+', SimpleMath.sum, left, right, false);
  }

  static createSub(left: Node, right: Node) {
    return new BinaryOperatorNode('-', SimpleMath.sub, left, right, false);
  }

  static createDiv(left: Node, right: Node) {
    return new BinaryOperatorNode('/', SimpleMath.div, left, right);
  } 

  static createMult(left: Node, right: Node) {
    return new BinaryOperatorNode('*', SimpleMath.mult, left, right);
  }

  static createSqrt(node: Node) {
    return new UnaryOperatorNode('sqrt', Math.sqrt, node);
  }

  static createSqr(node: Node) {
    return new UnaryOperatorNode('sqr', (value) => Math.pow(value, 2), node);
  }

  static createOperator(opKey: string, left: Node) {
    if(!Node.factories.hasOwnProperty(opKey)) {
      throw new Error(`Operator '${opKey}' is not defined!`);
    }
    return Node.factories[opKey](left, null);
  }
}

export class BinaryOperatorNode extends Node {
  
  constructor(opKey, operator, left, right, parenthesis = true) {
  	super();
    this.opKey = opKey;
  	this.operator = operator;
    this.left = left;
    this.right = right;
    this.parenthesis = parenthesis;
  }
  
  compute() {
    if(this.left && this.right) {
      return this.operator(this.left.compute(), this.right.compute());
    }
  }

  toString() {
   	var leftSide = this.left ? this.left.toString() : '';
    var rightSide = this.right ? this.right.toString() : '';
    if(this.parenthesis) {
     if(leftSide && this.left instanceof BinaryOperatorNode) {
       leftSide = `(${leftSide})`;
     }
     if(rightSide && this.right instanceof BinaryOperatorNode) {
       rightSide = `(${rightSide})`;
     } 
    }
  	return `${leftSide} ${this.opKey} ${rightSide}`;
  }
}

export class UnaryOperatorNode extends Node {

  constructor(opKey, operator, node, parenthesis = true) {
  	super();
    this.opKey = opKey;
  	this.operator = operator;
    this.node = node;
    this.parenthesis = parenthesis;
  }

  compute() {
    if(this.node) {
      return this.operator(this.node.compute());
    }
  }

  toString() {
   	var valueStr = this.node ? this.node.toString() : '';
    if(this.parenthesis && valueStr) {
     valueStr = `(${valueStr})`;
    }
  	return `${this.opKey}${valueStr}`;
  }

}

export class OperandNode extends Node {
	constructor(value) {
  	super();
  	this.value = value;
  }
  
  compute() {
    return +this.value;
  }

  toString() {
  	return this.value.toString();
  }
}