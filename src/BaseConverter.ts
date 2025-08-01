export class BaseConverter {
    leftBaseSelector;
    currentLeftSelectorValue;

    rightBaseSelector;
    currentRightSelectorValue;

    leftInput;

    rightInput;

    isUpdating = false;

    conversionMap;

    constructor() {
        this.leftBaseSelector = document.getElementById("base-left");
        this.rightBaseSelector = document.getElementById("base-right");
        this.leftInput = document.getElementById("input-left");
        this.rightInput = document.getElementById("input-right");

        // set initial input value status before any changes
        this.currentLeftSelectorValue = this.leftBaseSelector.value;
        this.currentRightSelectorValue = this.rightBaseSelector.value;

        this.conversionMap = {
            "binary->decimal": this.binaryToDecimal,
            "binary->hex": this.binaryToHex,
            "decimal->binary": this.decimalToBinary,
            "decimal->hex": this.decimalToHex,
            "hex->binary": this.hexToBinary,
            "hex->decimal": this.hexToDecimal,
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // setupLeftBaseSelectorEL();
        // setupRightBaseSelectorEL();
        this.setupBaseSelectorListener("left");
        this.setupBaseSelectorListener("right");
        this.setupInputListeners();
    }

    setupBaseSelectorListener(side) {
        const selector =
            side === "left" ? this.leftBaseSelector : this.rightBaseSelector;
        const otherSelector =
            side === "left" ? this.rightBaseSelector : this.leftBaseSelector;

        const input = side === "left" ? this.leftInput : this.rightInput;

        selector.addEventListener("change", () => {
            // If selected base equals the other one, swap
            if (selector.value === otherSelector.value) {
                this.swap();
                this.updateCurrentValuesState();
            } else {
                this.updateCurrentValuesState();
                this.convert(input, otherSelector.value, selector.value);
            }
        });
    }

    setupInputListeners() {
        const handleInput = (fromInput, toInput, fromBaseKey, toBaseKey) => {
            fromInput.addEventListener("input", () => {
                if (this.isUpdating) return;
                this.updateCurrentValuesState();

                const fromBase = this[fromBaseKey];
                const toBase = this[toBaseKey];

                this.isUpdating = true;
                this.convert(toInput, fromBase, toBase);
                this.isUpdating = false;
            });
        };

        handleInput(
            this.leftInput,
            this.rightInput,
            "currentLeftSelectorValue",
            "currentRightSelectorValue"
        );
        handleInput(
            this.rightInput,
            this.leftInput,
            "currentRightSelectorValue",
            "currentLeftSelectorValue"
        );
    }

    convert(toInput, fromBase, toBase) {
        const key = `${fromBase}->${toBase}`;
        const converter = this.conversionMap[key];
        if (converter) {
            toInput.value = converter.call(this);
        }
    }

    binaryToDecimal() {
        let bNum = "";
        let dNum = 0;
        if (this.leftBaseSelector.value === "binary") {
            bNum = this.leftInput.value;
        } else {
            bNum = this.rightInput.value;
        }
        let exp = 0;
        for (let i = bNum.length - 1; i >= 0; i--) {
            if (bNum[i] === "1") {
                dNum += Math.pow(2, exp);
            }
            exp++;
        }
        return dNum;
    }
    binaryToHex() {
        let bNum = "";
        let hexNum = "";

        const binaryHexMap = new Map([
            ["0", "0"],
            ["1", "1"],
            ["10", "2"],
            ["11", "3"],
            ["100", "4"],
            ["101", "5"],
            ["110", "6"],
            ["111", "7"],
            ["1000", "8"],
            ["1001", "9"],
            ["1010", "A"],
            ["1011", "B"],
            ["1100", "C"],
            ["1101", "D"],
            ["1110", "E"],
            ["1111", "F"],
        ]);

        if (this.leftBaseSelector.value === "binary") {
            bNum = this.leftInput.value;
        } else {
            bNum = this.rightInput.value;
        }

        let i = bNum.length - 1;
        let nibble = "";
        while (i >= 0) {
            nibble = bNum[i] + nibble;
            if (i === 0) {
                if (nibble.replace(/^0+/, "") !== "") {
                    hexNum =
                        binaryHexMap.get(nibble.replace(/^0+/, "")) + hexNum;
                }
            } else if (nibble.length === 4) {
                if (nibble.replace(/^0+(?!$)/, "") !== "") {
                    hexNum =
                        binaryHexMap.get(nibble.replace(/^0+(?!$)/, "")) +
                        hexNum;
                }
                nibble = "";
            }
            i--;
        }
        return hexNum.replace(/^0+/, "");
    }
    decimalToBinary() {
        let bNum = "";
        let dNum;

        if (this.leftBaseSelector.value === "decimal") {
            dNum = +this.leftInput.value;
        } else {
            dNum = +this.rightInput.value;
        }
        while (dNum !== 0) {
            let remainder = dNum % 2;
            if (remainder === 1) {
                bNum = 1 + bNum;
            } else {
                bNum = 0 + bNum;
            }
            dNum = Math.floor(dNum / 2);
        }
        return bNum;
    }
    decimalToHex() {
        let hexNum = "";
        let dNum;
        const decimalHexMap = new Map([
            ["0", "0"],
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
            ["10", "A"],
            ["11", "B"],
            ["12", "C"],
            ["13", "D"],
            ["14", "E"],
            ["15", "F"],
        ]);

        if (this.leftBaseSelector.value === "decimal") {
            dNum = +this.leftInput.value;
        } else {
            dNum = +this.rightInput.value;
        }

        while (dNum !== 0) {
            let remainder = dNum % 16;
            hexNum = decimalHexMap.get(remainder.toString()) + hexNum;
            console.log[hexNum];
            dNum = Math.floor(dNum / 16);
        }

        return hexNum;
    }
    hexToBinary() {
        let bNum = "";
        let hexNum;
        let left = true;
        const hexBinaryMap = new Map([
            ["0", "0000"],
            ["1", "0001"],
            ["2", "0010"],
            ["3", "0011"],
            ["4", "0100"],
            ["5", "0101"],
            ["6", "0110"],
            ["7", "0111"],
            ["8", "1000"],
            ["9", "1001"],
            ["A", "1010"],
            ["B", "1011"],
            ["C", "1100"],
            ["D", "1101"],
            ["E", "1110"],
            ["F", "1111"],
        ]);

        if (this.leftBaseSelector.value === "hex") {
            hexNum = this.leftInput.value;
            this.leftInput.style.outline = '';
        } else {
            this.rightInput.style.outline = '';
            hexNum = this.rightInput.value;
            left = false;
        }

        // reverse hex num
        hexNum = hexNum.split("").reverse().join("");

        for (const char of hexNum) {
            const binary = hexBinaryMap.get(char.toUpperCase());
            if (binary === undefined) {
                if (left) {
                    this.leftInput.style.outline = "2px solid red";
                } else {
                    this.rightInput.style.outline = "2px solid red";
                }
                bNum = "Invalid Input";
                break; // stop processing further chars
            } else {
                bNum = binary + bNum;
            }
        }
        return bNum;
    }
    hexToDecimal() {
        let dNum = 0n;
        let hexNum;
        const hexDecimalMap = new Map([
            ["0", 0],
            ["1", 1],
            ["2", 2],
            ["3", 3],
            ["4", 4],
            ["5", 5],
            ["6", 6],
            ["7", 7],
            ["8", 8],
            ["9", 9],
            ["A", 10],
            ["B", 11],
            ["C", 12],
            ["D", 13],
            ["E", 14],
            ["F", 15],
        ]);
        if (this.leftBaseSelector.value === "hex") {
            hexNum = this.leftInput.value.toUpperCase();
        } else {
            hexNum = this.rightInput.value.toUpperCase();
        }

        for (let i = 0; i < hexNum.length; i++) {
            const value = hexDecimalMap.get(hexNum.charAt(i));
            if (value === undefined)
                throw new Error("Invalid hex digit: " + hexNum.charAt(i));
            dNum =
                BigInt(dNum) +
                BigInt(value) * 16n ** BigInt(hexNum.length - 1 - i);
        }

        return dNum; // avoid scientific notation
    }

    swap() {
        let temp = this.currentLeftSelectorValue;
        this.leftBaseSelector.value = this.currentRightSelectorValue;
        this.rightBaseSelector.value = temp;
        this.updateCurrentValuesState();

        //swap input values
        temp = this.leftInput.value;
        this.leftInput.value = this.rightInput.value;
        this.rightInput.value = temp;
    }
    updateCurrentValuesState() {
        // update selector state
        this.currentLeftSelectorValue = this.leftBaseSelector.value;
        this.currentRightSelectorValue = this.rightBaseSelector.value;
    }
}
