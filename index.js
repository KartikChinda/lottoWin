// Steps on what to do in the application
// 1. Take in the amount from the user 
// 2. Ask the user how many rows do they want to bet on? 
// 3. How much is the user willing to bet on for each row? 
// 4. Spin the lotto
// 5. Check if the user won? And subsequently add the profit or subtract the loss. 
// 6. Ask if the user wants to/can play again. 

const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;

const symbolValMapping = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
}

const symbolPriceMapping = {
    A: 5,
    B: 4,
    C: 2,
    D: 1,
}

const SYMBOLS = [];
for (const [symb, count] of Object.entries(symbolValMapping)) {
    for (let i = 0; i < count; i++) {
        // console.log(symb);
        SYMBOLS.push(symb);
    }
}

const askForAmount = () => {
    while (true) {
        const amount = prompt("Drop in the dinero you got: ");
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            console.log(amount + " is not a valid amount. You have to try again, like you do, with most things.\n");
        } else {
            return numAmount;
        }
    }
}

const askForRows = () => {
    while (true) {
        const rows = prompt("Select the number of rows to bet on (1-3): ");
        const numRows = parseFloat(rows);
        if (isNaN(numRows) || numRows <= 0 || numRows > 3) {
            console.log(rows + " is not a valid number of rows.\nYou have to try again, like you do, with most things.\n");
        } else {
            return numRows;
        }
    }
}

const askForBets = (amount, rowsToBetOn) => {
    while (true) {
        const bet = prompt("How lucky are you feeling? Select the bet per row: ");
        const numBet = parseFloat(bet);
        if (isNaN(numBet) || numBet <= 0 || numBet > amount / rowsToBetOn) {
            console.log("Feeling too optimistic, are we? You dont have enough money to bet " + numBet + " per row. Try again. \n");
        } else {
            return numBet;
        }
    }
}

const letItSpin = () => {

    const slotMachine = [];

    for (let c = 0; c < COLS; c++) {
        slotMachine.push([]);
        const currSymbols = [...SYMBOLS];
        // console.log(currSymbols);
        for (let r = 0; r < ROWS; r++) {
            const randomIndex = Math.floor(Math.random() * currSymbols.length);
            // console.log(currSymbols[randomIndex])
            slotMachine[c].push(currSymbols[randomIndex]);
            currSymbols.splice(randomIndex, 1);
        }
    }

    return slotMachine;
}

const transpose = (finalSpin) => {
    const sm = [];
    for (let c = 0; c < COLS; c++) {
        sm.push([]);
        for (let r = 0; r < ROWS; r++) {
            sm[c].push(finalSpin[r][c]);
        }
    }

    return sm;
}

const results = (rowsToBetOn, betPerRow, finalSlotMachine) => {
    let winnings = 0;
    for (let i = 0; i < rowsToBetOn; i++) {
        let wonCurrentRow = true;
        for (let j = 0; j < COLS; j++) {
            if (finalSlotMachine[i][j] != finalSlotMachine[i][0]) {
                wonCurrentRow = false;
                break;
            }
        }
        if (wonCurrentRow) {
            winnings += betPerRow * symbolPriceMapping[finalSlotMachine[i][0]];
        }
    }
    console.log("You won $" + winnings);
    return winnings;
}


const printMachine = (finalSlotMachine) => {
    for (let r = 0; r < ROWS; r++) {
        let res = "";
        for (let c = 0; c < COLS; c++) {
            if (c == COLS - 1) {
                res += " " + finalSlotMachine[r][c];
            } else {
                res += " " + finalSlotMachine[r][c] + " |";
            }
        }
        console.log(res);
    }
}






const playGame = () => {
    let amount = askForAmount();
    while (true) {
        const rowsToBetOn = askForRows();
        const betPerRow = askForBets(amount, rowsToBetOn);
        amount -= rowsToBetOn * betPerRow;

        const finalSpin = letItSpin();
        const finalSlotMachine = transpose(finalSpin);
        console.log("\nThe machine shows:");
        printMachine(finalSlotMachine);
        const amountWon = results(rowsToBetOn, betPerRow, finalSlotMachine);
        amount += amountWon;
        console.log("\nAmount left: " + amount);
        const ask = prompt("Want to try your luck again? (y/n): ");
        if (ask != 'y') break;
        if (amount <= 0) {
            console.log("Are you a student? Coz you got no money left. Bye. ");
            break;
        }
    }


}

playGame();



