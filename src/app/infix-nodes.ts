import { SimpleMath } from './simple-math';

export abstract class MathNode {
	
  abstract compute();

  static factories = {
    '+': (left: MathNode, right: MathNode) => {
      return new BinaryOperator('+', SimpleMath.sum, left, right, false);
    },
    '-': (left: MathNode, right: MathNode) => {
      return new BinaryOperator('-', SimpleMath.sub, left, right, false);
    },
    '/': (left: MathNode, right: MathNode) => {
      return new BinaryOperator('/', SimpleMath.div, left, right);
    },
    '*': (left: MathNode, right: MathNode) => {
      return new BinaryOperator('*', SimpleMath.mult, left, right);
    },
    'r': (node: MathNode) => {
      return new UnaryOperator('sqrt', Math.sqrt, node);
    },
    's': (node: MathNode) => {
      return new UnaryOperator('sqr', (value) => Math.pow(value, 2), node);
    },
  }

  static createOperator(opKey: string, node: MathNode) {
    if(!MathNode.factories.hasOwnProperty(opKey)) {
      throw new Error(`Operator '${opKey}' is not defined!`);
    }
    return MathNode.factories[opKey](node, null);
  }
}

export abstract class OperatorNode extends MathNode {
  opKey; operator; parenthesis;
  constructor(opKey, operator, parenthesis) {
    super();
    this.opKey = opKey;
  	this.operator = operator;
    this.parenthesis = parenthesis;
  }
}

export class BinaryOperator extends OperatorNode {
  
  left; right;

  constructor(opKey, operator, left, right, parenthesis = true) {
  	super(opKey, operator, parenthesis);
    this.left = left;
    this.right = right;
  }
  
  compute() {
    if(!(this.left && this.right)) {
      throw new Error("Cannot compute without both left and right nodes assigned!");
    }
    return this.operator(this.left.compute(), this.right.compute());
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

export class UnaryOperator extends OperatorNode {

  node; 

  constructor(opKey, operator, node, parenthesis = true) {
  	super(opKey, operator, parenthesis);
    this.node = node;
  }

  compute() {
    if(!this.node) {
      throw new Error("Cannot compute without an assigned MathNode!");
    }
    return this.operator(this.node.compute());
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