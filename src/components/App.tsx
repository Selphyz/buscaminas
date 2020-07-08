import React, { useState, useEffect } from 'react';
import { NumberDisplay } from './NumberDisplay/NumberDisplay';
import { Button } from './Button/Button';
import { generateBoard, chainOpen } from '../utils/boardUtils';
import { Face } from '../types/Icons';
import { Cell, CellState, CellValue } from '../types/Cell';
import './App.scss';
import { MAX_ROWS, MAX_COLS } from '../constants/constants';

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateBoard);
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [flags, setFlags] = useState<number>(10);
    const [hasLost, setHasLost] = useState<boolean>(false);
    const [hasWon, setHasWon] = useState<boolean>(false);
    useEffect(() => {
        const handleMouseDown = (): void => {
            setFace(Face.gasp);
        };
        const handleMouseUp = (): void => {
            setFace(Face.smile);
        };
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);
    useEffect(() => {
        if (live && time < 999) {
            const timer = setInterval(() => {
                setTime(time + 1);
            }, 1000);
            return () => {
                clearInterval(timer);
            };
        }
    }, [live, time]);
    useEffect(() => {
        if (hasLost) {
            setFace(Face.dead);
            setLive(false);
        }
    }, [hasLost]);
    useEffect(() => {
        if (hasWon) {
            setFace(Face.clear);
            setLive(false);
        }
    }, [hasWon]);
    const showBombs = (): Cell[][] => {
        const currentBoard = cells.slice();
        return currentBoard.map(row => row.map(cell => {
            if (cell.value === CellValue.bomb) {
                return {
                    ...cell,
                    state: CellState.revealed
                };
            }
            return cell;
        })
        );
    };
    const handleFaceClick = (): void => {
        setCells(generateBoard());
        setTime(0);
        setLive(false);
        setFlags(10);
        setHasLost(false);
    };
    const handleCellClick = (row: number, col: number) => (): void => {
        if (!live) {
            setLive(true);
        }
        if (cells[row][col].state !== CellState.untouched) {
            return;
        }
        let currentCell = cells[row][col];
        let newBoard = cells.slice();
        if (currentCell.value === CellValue.bomb) {
            setHasLost(true);
            newBoard = showBombs();
            newBoard[row][col].red = true;
            setCells(newBoard);
            return;
        } if (currentCell.value === CellValue.none) {
            newBoard = chainOpen(newBoard, row, col);
            setCells(newBoard);
        } else {
            newBoard[row][col].state = CellState.revealed;
            setCells(newBoard);
        }
        let safeSpaces = false;
        for (let row = 0; row < MAX_ROWS; row++) {
            for (let col = 0; col < MAX_COLS; col++) {
                const currentCell = newBoard[row][col];
                if (currentCell.value !== CellValue.bomb && currentCell.state === CellState.untouched
                ) {
                    safeSpaces = true;
                    break;
                }
            }
        }
        if (!safeSpaces) {
            newBoard = newBoard.map(row => row.map(cell => {
                if (cell.value === CellValue.bomb) {
                    return {
                        ...cell,
                        state: CellState.flagged
                    };
                }
                setHasWon(true);
                return cell;
            }))
            setCells(newBoard);
        }
    };
    const handleFlags = (row: number, col: number) =>
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
            e.preventDefault();
            if (!live) {
                return;
            }
            let currentCells = cells;
            const cell = currentCells[row][col];
            if (flags > 0 && cell.state === CellState.untouched) {
                currentCells[row][col].state = CellState.flagged;
                setFlags(flags - 1);
            } else if (cell.state === CellState.flagged) {
                currentCells[row][col].state = CellState.untouched
                setFlags(flags + 1);
            } else {
                return;
            }
            setCells(currentCells);
            console.log("right click");
        };
    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) =>
            row.map((cell, colIndex) =>
                <Button key={`${rowIndex}-${colIndex}`}
                    state={cell.state} value={cell.value}
                    onClick={handleCellClick} onContext={handleFlags}
                    row={rowIndex} col={colIndex} red={cell.red} />)
        );
    };
    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={flags}></NumberDisplay>
                <div className="Face">
                    <span role="img" aria-label="face" onClick={handleFaceClick}>{face}</span>
                </div>
                <NumberDisplay value={time}></NumberDisplay>
            </div>
            <div className="Body">{renderCells()}</div>
        </div>
    );
};

export default App;
