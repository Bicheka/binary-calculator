export class Calculator {
    operator;
    firstOperand;
    secondOperand;
    result;
    constructor() {
        this.operator = document.getElementById("operation-selector");
        this.firstOperand = document.getElementById("first-operand");
        this.secondOperand = document.getElementById("second-operand");
        this.result = document.getElementById("calculation-result");

        this.setupEventListeners();
    }

    setupEventListeners() {
        const onInputChange = (operand) => {
            operand.addEventListener("input", () => {
                //enforce only binary
                operand.value = operand.value.replace(/[^01]/g, "");

                //perform calculation when operands value change
                this.calculate();
            });
        };
        onInputChange(this.firstOperand);
        onInputChange(this.secondOperand);
        this.operator.addEventListener('change', this.calculate.bind(this))
    }

    calculate() {
        switch (this.operator.value) {
            case "+":
                this.result.textContent = this.add();
                break;
            case "-":
                this.result.textContent = this.substract();
                break;
            case "*":
                this.result.textContent = this.multiply();
                break;
            case "/":
                this.result.textContent = this.divide();
                break;
            default:
                break;
        }
    }

    add() {
        let operand1 = this.firstOperand.value;
        let operand2 = this.secondOperand.value;
        let carry = 0;
        let result = "";
        let i = operand1.length - 1;
        let j = operand2.length - 1;
    
        while (i >= 0 || j >= 0 || carry) {
            const bitA = i >= 0 ? +operand1[i--] : 0;
            const bitB = j >= 0 ? +operand2[j--] : 0;
            const sum = bitA + bitB + carry;
            result = (sum % 2) + result;
            carry = sum > 1 ? 1 : 0;
        }
    
        return result;
    }
    substract() {
        let operand1 = this.firstOperand.value;
        let operand2 = this.secondOperand.value;
        let carry = 0;
        let result = "";
        let is_negative = false;
    
        if (operand1 === operand2) return (result = "0");
    
        // invert operand values if operand1 is less than operand2
        if (!this.isBinaryGreater(operand1, operand2)) {
            [operand1, operand2] = this.swapValues(operand1, operand2);
            is_negative = true;
        }
    
        let i = operand1.length - 1;
        let j = operand2.length - 1;
    
        while (i >= 0 || j >= 0 || carry) {
            const bitA = i >= 0 ? +operand1[i] : 0;
            const bitB = j >= 0 ? +operand2[j] : 0;
            let sub;
            if (bitA > bitB) {
                if (carry === 1) {
                    sub = 0;
                    carry = 0;
                } else {
                    sub = 1;
                }
            } else if (bitA < bitB) {
                if (carry === 1) {
                    sub = 0;
                } else {
                    sub = 1;
                    carry = 1;
                }
            } else {
                if (carry === 1) {
                    sub = 1;
                } else sub = 0;
            }
            result = sub + result;
    
            i--;
            j--;
        }
        result = result.replace(/^0+/, "") || "0";
        if (is_negative) {
            result = "-" + result;
        }
        return result;
    }

    multiply() {}
    divide() {}

    isBinaryGreater(a, b) {
        // Remove leading zeros
        a = a.replace(/^0+/, "") || "0";
        b = b.replace(/^0+/, "") || "0";
    
        // Compare lengths
        if (a.length > b.length) return true;
        if (a.length < b.length) return false;
    
        // Compare bit by bit
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return a[i] === "1"; // '1' > '0'
            }
        }
    
        // They are equal
        return false;
    }

    swapValues(x, y) {
        let t = x;
        x = y;
        y = t;
        return [x, y];
    }

    // TODO AND OR XOR etc
}
