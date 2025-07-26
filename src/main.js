import { BaseConverter } from "./BaseConverter";

// Make sure input is only 0s and 1s and recalculates on every change
function onOperandChange() {
    const binaryInputs = document.querySelectorAll(".operand");

    binaryInputs.forEach((input) => {
        input.addEventListener("input", () => {
            //enforce only binary
            input.value = input.value.replace(/[^01]/g, "");

            //perform addition
            calculateBinary();
        });
    });
}

function calculateBinary() {
    const operatorEl = document.getElementById("operation-selector");
    const operand1El = document.getElementById("first-operand");
    const operand2El = document.getElementById("second-operand");
    const operator = operatorEl?.value;
    const operand1 = operand1El?.value || "0";
    const operand2 = operand2El?.value || "0";

    let result = "";

    if (operator === "+") {
        result = addBinary(operand1, operand2);
    } else if (operator === "-") {
        result = subtractBinary(operand1, operand2);
    } else {
        result = "Invalid operation";
    }

    document.getElementById("calculation-result").textContent = result;
}

function addBinary(operand1, operand2) {
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

function subtractBinary(operand1, operand2) {
    let carry = 0;
    let result = "";
    let is_negative = false;

    if (operand1 === operand2) return (result = "0");

    // invert operand values if operand1 is less than operand2
    if (!isBinaryGreater(operand1, operand2)) {
        [operand1, operand2] = swapValues(operand1, operand2);
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

function isBinaryGreater(a, b) {
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

function swapValues(x, y) {
    let t = x;
    x = y;
    y = t;
    return [x, y];
}

// Calculate when operator changes eg from '+' tp '-'
document
    .getElementById("operation-selector")
    .addEventListener("change", calculateBinary);

onOperandChange();

new BaseConverter();