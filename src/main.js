// Make sure input is only 0s and 1s and recalculates on every change
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
    let carry = 0;
    let result = '';
    let is_negative = false;

    if(operand1 === operand2) return result = '0';

    // invert operand values if operand1 is less than operand2
    if(!isBinaryGreater(operand1, operand2)){
        [operand1, operand2] = swapValues(operand1, operand2);
        is_negative = true;
    }

    let i = operand1.length - 1;
    let j = operand2.length - 1;
    
    while (i >= 0 || j >= 0 || carry) {
        const bitA = i >= 0 ? +operand1[i] : 0;
        const bitB = j >= 0 ? +operand2[j] : 0;
        let sub;
        if(bitA > bitB){
            if(carry === 1) {
                sub = 0;
                carry = 0;
            }
            else{
                sub = 1;
            }
        }
        else if (bitA < bitB){
            if(carry === 1){
                sub = 0;
            }
            else{
                sub = 1;
                carry = 1;
            }
        }
        else{
            if(carry === 1){
                sub = 1;
            }
            else sub = 0;
        }
        result = sub + result;

        i--;
        j--;
    }
    result = result.replace(/^0+/, '') || '0';
    if(is_negative){
        result = '-' + result;
    }
    return result;
}

function isBinaryGreater(a, b) {
    // Remove leading zeros
    a = a.replace(/^0+/, '') || '0';
    b = b.replace(/^0+/, '') || '0';

    // Compare lengths
    if (a.length > b.length) return true;
    if (a.length < b.length) return false;

    // Compare bit by bit
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
        return a[i] === '1'; // '1' > '0'
        }
    }

    // They are equal
    return false;
}

function swapValues(x, y){
    let t = x;
    x = y;
    y = t;
    return [x, y];
}

// Calculate when operator changes eg from '+' tp '-'
document.getElementById('operation-selector').addEventListener('change', calculateBinary);

onOperandChange();


// Converter Logic
class BaseConverter {
    leftBase;
    rightBase;
    leftBaseValue = '';
    rightBaseValue = '';

    inputLeft;
    inputRight;

    constructor(){
        this.leftBase = document.getElementById('base-left');
        this.rightBase = document.getElementById('base-right');

        this.leftBaseValue = this.leftBase.value;
        this.rightBaseValue = this.rightBase.value;

        const leftInput = document.getElementById('input-left');
        const rightInput = document.getElementById('input-right');
        leftInput.addEventListener('input', () => {
            this.inputLeft = leftInput.value;
            if(this.leftBaseValue === 'binary' & this.rightBaseValue === 'decimal'){
                rightInput.value = this.binaryToDecimal();
            }
            else if(this.leftBaseValue === 'binary' & this.rightBaseValue === 'hex'){
                rightInput.value = this.binaryToHex();
            }
            else if(this.leftBaseValue === 'decimal' & this.rightBaseValue === 'binary'){
                rightInput.value = this.decimalToBinary();
            }
        });
        rightInput.addEventListener('input', () => {this.inputRight = rightInput.value});
    }

    swap(){
        let temp = this.leftBaseValue;
        this.leftBase.value = this.rightBaseValue;
        this.rightBase.value = temp;
        this.leftBaseValue = this.leftBase.value;
        this.rightBaseValue = this.rightBase.value;
        
        //swap input values
        const leftInput = document.getElementById('input-left');
        const rightInput = document.getElementById('input-right');

        temp = leftInput.value;
        leftInput.value = rightInput.value;
        rightInput.value = temp;
    }

    updateValues(base, value){
        if(base === 'left'){
            this.leftBaseValue = value;
        }
        else if(base === 'right'){
            this.rightBaseValue = value;
        }
    }

    binaryToDecimal(){
        let bNum = '';
        let dNum = 0;
        if(this.leftBaseValue === 'binary'){
            bNum = this.inputLeft;
        }
        else{
            bNum = this.inputRight;
        }
        let exp = 0;
        for(let i = bNum.length-1; i >= 0; i--){
            if(bNum[i] === '1'){
                dNum += Math.pow(2, exp);
            }
            exp++;
        }
        return dNum;
    }
    binaryToHex(){
        let bNum = '';
        let hexNum = '';

        const hexMap = new Map([
            ['0', '0'],
            ['1', '1'],
            ['10', '2'],
            ['11', '3'],
            ['100', '4'],
            ['101', '5'],
            ['110', '6'],
            ['111', '7'],
            ['1000', '8'],
            ['1001', '9'],
            ['1010', 'A'],
            ['1011', 'B'],
            ['1100', 'C'],
            ['1101', 'D'],
            ['1110', 'E'],
            ['1111', 'F'],
        ]);

        if(this.leftBaseValue === 'binary'){
            bNum = this.inputLeft;
        }
        else{
            bNum = this.inputRight;
        }

        let i = bNum.length - 1;
        let nibble = '';
        while(i >= 0) {
            nibble = bNum[i] + nibble;
            if(i === 0){
                if(nibble.replace(/^0+/, '') !== ''){
                hexNum = hexMap.get(nibble.replace(/^0+/, '')) + hexNum;
                }
            }
            else if(nibble.length === 4){
                if(nibble.replace(/^0+(?!$)/, '') !== ''){
                hexNum = hexMap.get(nibble.replace(/^0+(?!$)/, '')) + hexNum;
                }
                nibble = '';
            }
            i--;
        }
        return hexNum.replace(/^0+/, '');
    }
    decimalToBinary(){
        let bNum = '';
        let dNum;

        if(this.leftBaseValue === 'decimal'){
            dNum = +this.inputLeft;
        }
        else{
            dNum = +this.inputRight;
        }
        while(dNum !== 0){
            let remainder = dNum % 2;
            if(remainder === 1){
                bNum = 1 + bNum;
            }
            else{
                bNum = 0 + bNum;
            }
            dNum = Math.floor(dNum / 2);
        }
        return bNum;
    }
    decimalToHex(){

    }
    hexToBinary(){

    }
    hexToDecimal(){

    }
    
}

// swap the bases to be converted if selected the same one
function swapBaseOnEquals(){
    const baseLeft = document.getElementById('base-left');
    const baseRight = document.getElementById('base-right');
    const converter = new BaseConverter();

    baseLeft.addEventListener('change', () => {
        if(baseLeft.value === baseRight.value){
            converter.swap();
        }
        else{
            converter.updateValues('left', baseLeft.value);

            const leftInput = document.getElementById('input-left');
            leftInput.value = '';
        }
    });
    baseRight.addEventListener('change', () => {
        if(baseLeft.value === baseRight.value){
            converter.swap();
        }
        else{
            converter.updateValues('right', baseRight.value);
            
            const rightInput = document.getElementById('input-right');
            rightInput.value = '';
        }
    });
}
swapBaseOnEquals();