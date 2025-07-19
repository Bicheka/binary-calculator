function onOperandChange(){
    const binaryInputs = document.querySelectorAll('.operand');

    binaryInputs.forEach(input => {
        input.addEventListener('input', () => {
            //enforce only binary
            input.value = input.value.replace(/[^01]/g, '');
            
            //perform addition
            const result = calculateBinary();
        });
    });
}

function calculateBinary(){
    const operatorEl = document.getElementById('operation-selector');
    const operand1El = document.getElementById('first-operand');
    const operand2El = document.getElementById('second-operand');
    const operator = operatorEl?.value;
    const operand1 = operand1El?.value || '0';
    const operand2 = operand2El?.value || '0';

    let result = '';

    if (operator === '+') {
        result = addBinary(operand1, operand2);
    } else if (operator === '-') {
        result = subtractBinary(operand1, operand2);
    } else {
        result = 'Invalid operation';
    }
    
    document.getElementById('calculation-result').textContent = result;
}

function addBinary(operand1, operand2) {
    let carry = 0;
    let result = '';
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
    return 'Work in Progress'
}

document.getElementById('operation-selector').addEventListener('change', calculateBinary);
onOperandChange();