import { MAX_ROWS, MAX_COLS, BOMS } from "../constants/constants";
import { CellValue, CellState, Cell } from "../types/Cell";

const checkAround = (cells: Cell[][], row: number, col: number): {
    topLeftBomb: Cell | null,
    topBomb: Cell | null,
    topRightBomb: Cell | null,
    rightBomb: Cell | null,
    botRightBomb: Cell | null,
    botBomb: Cell | null,
    botLeftBomb: Cell | null,
    leftBomb: Cell | null
} => {
    const topLeftBomb = row > 0 && col > 0 ? cells[row - 1][col - 1] : null
    const topBomb = row > 0 ? cells[row - 1][col] : null
    const topRightBomb = row > 0 && col < MAX_COLS - 1 ? cells[row - 1][col + 1] : null
    const rightBomb = col < MAX_COLS - 1 ? cells[row][col + 1] : null
    const botRightBomb = row < MAX_ROWS - 1 && col < MAX_COLS - 1 ? cells[row + 1][col + 1] : null
    const botBomb = row < MAX_ROWS - 1 ? cells[row + 1][col] : null
    const botLeftBomb = row < MAX_ROWS - 1 && col > 0 ? cells[row + 1][col - 1] : null
    const leftBomb = col > 0 ? cells[row][col - 1] : null
    return {
        topLeftBomb,
        topBomb,
        topRightBomb,
        rightBomb,
        botRightBomb,
        botBomb,
        botLeftBomb,
        leftBomb,
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
            const { topLeftBomb,
                topBomb,
                topRightBomb,
                rightBomb,
                botRightBomb,
                botBomb,
                botLeftBomb,
                leftBomb } = checkAround(cells, row, col);
            if (topLeftBomb?.value === CellValue.bomb) boms++;
            if (topBomb?.value === CellValue.bomb) boms++;
            if (topRightBomb?.value === CellValue.bomb) boms++;
            if (rightBomb?.value === CellValue.bomb) boms++;
            if (botRightBomb?.value === CellValue.bomb) boms++;
            if (botBomb?.value === CellValue.bomb) boms++;
            if (botLeftBomb?.value === CellValue.bomb) boms++;
            if (leftBomb?.value === CellValue.bomb) boms++;
            cells[row][col].value = boms;
        }
    };
    return cells;
}
export const chainOpen = (cells: Cell[][], row: number, col: number): Cell[][] => {
    let newBoard = cells.slice();
    return newBoard;
}