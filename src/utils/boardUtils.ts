import { MAX_ROWS, MAX_COLS, BOMS } from "../constants/constants";
import { CellValue, CellState, Cell } from "../types/Cell";

const checkAround = (cells: Cell[][], row: number, col: number): {
    topLeftCell: Cell | null,
    topCell: Cell | null,
    topRightCell: Cell | null,
    rightCell: Cell | null,
    botRightCell: Cell | null,
    botCell: Cell | null,
    botLeftCell: Cell | null,
    leftCell: Cell | null
} => {
    const topLeftCell = row > 0 && col > 0 ? cells[row - 1][col - 1] : null
    const topCell = row > 0 ? cells[row - 1][col] : null
    const topRightCell = row > 0 && col < MAX_COLS - 1 ? cells[row - 1][col + 1] : null
    const rightCell = col < MAX_COLS - 1 ? cells[row][col + 1] : null
    const botRightCell = row < MAX_ROWS - 1 && col < MAX_COLS - 1 ? cells[row + 1][col + 1] : null
    const botCell = row < MAX_ROWS - 1 ? cells[row + 1][col] : null
    const botLeftCell = row < MAX_ROWS - 1 && col > 0 ? cells[row + 1][col - 1] : null
    const leftCell = col > 0 ? cells[row][col - 1] : null
    return {
        topLeftCell,
        topCell,
        topRightCell,
        rightCell,
        botRightCell,
        botCell,
        botLeftCell,
        leftCell,
    }
}
export const generateBoard = (): Cell[][] => {
    const cells: Cell[][] = [];
    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([]);
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.untouched
            })
        }
    }
    let bombsLaid = 0;
    while (bombsLaid < BOMS) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS);
        const randomCol = Math.floor(Math.random() * MAX_COLS);
        if (cells[randomRow][randomCol].value === CellValue.bomb) {
            console.log("Bomba va en " + randomCol + " " + randomRow);
            continue;
        }
        cells[randomRow][randomCol].value = CellValue.bomb;
        bombsLaid++;
    }
    for (let row = 0; row < MAX_ROWS; row++) {
        for (let col = 0; col < MAX_ROWS; col++) {
            const currentCell = cells[row][col];
            if (currentCell.value === CellValue.bomb) {
                continue; // es bomba, no hace falta calculo
            }
            let boms = 0;
            const { topLeftCell,
                topCell,
                topRightCell,
                rightCell,
                botRightCell,
                botCell,
                botLeftCell,
                leftCell } = checkAround(cells, row, col);
            if (topLeftCell?.value === CellValue.bomb) boms++;
            if (topCell?.value === CellValue.bomb) boms++;
            if (topRightCell?.value === CellValue.bomb) boms++;
            if (rightCell?.value === CellValue.bomb) boms++;
            if (botRightCell?.value === CellValue.bomb) boms++;
            if (botCell?.value === CellValue.bomb) boms++;
            if (botLeftCell?.value === CellValue.bomb) boms++;
            if (leftCell?.value === CellValue.bomb) boms++;
            cells[row][col].value = boms;
        }
    };
    return cells;
}
export const chainOpen = (cells: Cell[][], row: number, col: number): Cell[][] => {
    if (cells[row][col].state === CellState.revealed || cells[row][col].state === CellState.flagged) {
        return cells;
    }
    cells[row][col].state = CellState.revealed;
    let newBoard = cells.slice();
    const {
        topLeftCell,
        topCell,
        topRightCell,
        rightCell,
        botRightCell,
        botCell,
        botLeftCell,
        leftCell
    } = checkAround(cells, row, col);
    if (topLeftCell?.state === CellState.untouched && topLeftCell.value !== CellValue.bomb) {
        if (topLeftCell.value === CellValue.none) {
            newBoard = chainOpen(newBoard, row - 1, col - 1);
        } else {
            newBoard[row - 1][col - 1].state = CellState.revealed;
        }
    }
    if (topCell?.state === CellState.untouched && topCell.value !== CellValue.bomb) {
        if (topCell.value === CellValue.none) {
            newBoard = chainOpen(newBoard, row - 1, col);
        } else {
            newBoard[row - 1][col].state = CellState.revealed;
        }
    }
    if (topRightCell?.state === CellState.untouched && topRightCell.value !== CellValue.bomb) {
        if (topRightCell.value === CellValue.none) {
            newBoard = chainOpen(newBoard, row - 1, col + 1);
        } else {
            newBoard[row - 1][col + 1].state = CellState.revealed;
        }
    }
    if (rightCell?.state === CellState.untouched && rightCell.value !== CellValue.bomb) {
        if (rightCell.value === CellValue.none) {
            newBoard = chainOpen(newBoard, row, col + 1);
        } else {
            newBoard[row][col + 1].state = CellState.revealed;
        }
    }
    if (botRightCell?.state === CellState.untouched && botRightCell.value !== CellValue.bomb) {
        if (botRightCell.value === CellValue.none) {
            newBoard = chainOpen(newBoard, row + 1, col + 1);
        } else {
            newBoard[row + 1][col + 1].state = CellState.revealed;
        }
    }
    if (botCell?.state === CellState.untouched && botCell.value !== CellValue.bomb) {
        if (botCell.value === CellValue.none) {
            newBoard = chainOpen(newBoard, row + 1, col);
        } else {
            newBoard[row + 1][col].state = CellState.revealed;
        }
    }
    if (botLeftCell?.state === CellState.untouched && botLeftCell.value !== CellValue.bomb) {
        if (botLeftCell.value === CellValue.none) {
            newBoard = chainOpen(newBoard, row + 1, col - 1);
        } else {
            newBoard[row + 1][col - 1].state = CellState.revealed;
        }
    }
    if (leftCell?.state === CellState.untouched && leftCell.value !== CellValue.bomb) {
        if (leftCell.value === CellValue.none) {
            newBoard = chainOpen(newBoard, row, col - 1);
        } else {
            newBoard[row][col - 1].state = CellState.revealed;
        }
    }
    return newBoard;
}