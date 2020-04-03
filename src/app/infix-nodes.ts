import { SimpleMath } from './simple-math';

export abstract class MathNode {
	
  abstract compute();

  static factories = {
    '+': MathNode.createSum,
    '-': MathNode.createSub,
    '/': MathNode.createDiv,
    '*': MathNode.createMult,
    'r': MathNode.createSqrt,
    's': MathNode.createSqr,
  }

  static createSum(left: MathNode, right: MathNode) {
    return new BinaryOperator('+', SimpleMath.sum, left, right, false);
  }

  static createSub(left: MathNode, right: MathNode) {
    return new BinaryOperator('-', SimpleMath.sub, left, right, false);
  }

  static createDiv(left: MathNode, right: MathNode) {
    return new BinaryOperator('/', SimpleMath.div, left, right);
  } 

  static createMult(left: MathNode, right: MathNode) {
    return new BinaryOperator('*', SimpleMath.mult, left, right);
  }

  static createSqrt(node: MathNode) {
    return new UnaryOperator('sqrt', Math.sqrt, node);
  }

  static createSqr(node: MathNode) {
    return new UnaryOperator('sqr', (value) => Math.pow(value, 2), node);
  }

  static createOperator(opKey: string, left: MathNode) {
    if(!MathNode.factories.hasOwnProperty(opKey)) {
      throw new Error(`Operator '${opKey}' is not defined!`);
    }
    return MathNode.factories[opKey](left, null);
  }
}

export class BinaryOperator extends MathNode {

  opKey; operator; left; right; parenthesis;

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
     if(leftSide && this.left instanceof BinaryOperator) {
       leftSide = `(${leftSide})`;
     }
     if(rightSide && this.right instanceof BinaryOperator) {
       rightSide = `(${rightSide})`;
     } 
    }
  	return `${leftSide} ${this.opKey} ${rightSide}`;
  }
}

export class UnaryOperator extends MathNode {

  opKey; operator; node; parenthesis;

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

export class Operand extends MathNode {
  value;

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