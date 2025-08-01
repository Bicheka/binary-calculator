export class Calculator {
    operator;
    firstOperand;
    secondOperand;
    result;
    placeholder;
    constructor() {
        this.operator = document.getElementById("operation-selector");
        this.firstOperand = document.getElementById("first-operand");
        this.secondOperand = document.getElementById("second-operand");
        this.result = document.getElementById("calculation-result");
        this.placeholder = this.secondOperand.placeholder;
        this.operator.value = "+";
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
        this.operator.addEventListener("change", this.calculate.bind(this));
    }

    calculate() {
        let result;

        // Handle placeholder only for division
        if (this.operator.value === "/") {
            if (this.secondOperand.value === "") {
                this.secondOperand.placeholder = "1";
            }
        } else {
            // Restore original placeholder for non-division ops
            this.secondOperand.placeholder = this.placeholder;
        }

        switch (this.operator.value) {
            case "+":
                result = this.add(
                    this.firstOperand.value,
                    this.secondOperand.value
                );
                break;
            case "-":
                result = this.substract();
                break;
            case "*":
                result = this.multiply(
                    this.firstOperand.value,
                    this.secondOperand.value
                );
                break;
            case "/":
                return this.result.textContent = this.divide();
            default:
                break;
        }
        this.result.textContent = result.replace(/^0+/, "") || "0";
    }

    add(operand1, operand2) {
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
        let a = this.firstOperand.value;
        let b = this.secondOperand.value;
        let is_negative = false;
    
        if (a === b) return "0";
    
        if (!this.isBinaryGreater(a, b)) {
            [a, b] = this.swapValues(a, b);
            is_negative = true;
        }
    
        let result = this.subBinary(a, b);
        return is_negative ? "-" + result : result;
    }

    subBinary(a, b) {
        // Ensure a >= b
        if (!this.isBinaryGreater(a, b) && a !== b) {
            [a, b] = this.swapValues(a, b);
        }
    
        let carry = 0;
        let result = "";
    
        let i = a.length - 1;
        let j = b.length - 1;
    
        while (i >= 0 || j >= 0) {
            let bitA = i >= 0 ? +a[i--] : 0;
            let bitB = j >= 0 ? +b[j--] : 0;
    
            let diff = bitA - bitB - carry;
    
            if (diff === -1) {
                carry = 1;
                result = "1" + result;
            } else if (diff === -2) {
                carry = 1;
                result = "0" + result;
            } else {
                carry = 0;
                result = diff + result;
            }
        }
    
        return result.replace(/^0+/, "") || "0";
    }
    

    multiply(operand1: string, operand2: string) {
        let result = "";
        let placesShifted = 0;

        const x = (factor1, factor2) => {
            for (let i = 0; i < factor2.length; i++) {
                placesShifted = factor2.length - 1 - i;
                if (factor2.charAt(i) === "1") {
                    result = this.add(
                        factor1 + "0".repeat(placesShifted),
                        result
                    );
                }
            }
        };
        // use the smaller operand as the second factor to avoid iterating over the larger one
        if (operand1.length >= operand2.length) {
            x(operand1, operand2);
        } else {
            x(operand2, operand1);
        }
        return result;
    }
    divide() {
        const rawDividend = this.firstOperand.value;
        const rawDivisor = this.secondOperand.value;
    
        // Early return for empty divisor field
        if (rawDivisor === "") {
            this.secondOperand.placeholder = "1";
            return rawDividend.replace(/^0+/, "") || "0";
        }
    
        // Handle division by zero BEFORE stripping leading zeros
        if (rawDivisor.replace(/^0+/, "") === "") {
            return "You cannot divide by zero";
        }
    
        let dividend = rawDividend.replace(/^0+/, "") || "0";
        let divisor = rawDivisor.replace(/^0+/, "") || "0";
    
        // Handle zero dividend
        if (dividend === "0") return "0 R: 0";
    
        // Handle dividend < divisor
        if (!this.isBinaryGreater(dividend, divisor) && dividend !== divisor) {
            return `0 R: ${dividend}`;
        }
    
        // Handle dividend == divisor
        if (dividend === divisor) return "1 R: 0";
    
        let quotient = "0";
        let remainder = "";
    
        for (let i = 0; i < dividend.length; i++) {
            remainder += dividend[i];
            remainder = remainder.replace(/^0+/, "") || "0";
    
            if (this.isBinaryGreater(remainder, divisor) || remainder === divisor) {
                remainder = this.subBinary(remainder, divisor);
                quotient += "1";
            } else {
                quotient += "0";
            }
        }
    
        quotient = quotient.replace(/^0+/, "") || "0";
        remainder = remainder.replace(/^0+/, "") || "0";
    
        return `${quotient} R: ${remainder}`;
    }
    
    

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
