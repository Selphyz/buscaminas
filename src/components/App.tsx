import React, { useState, useEffect } from 'react';
import { NumberDisplay } from './NumberDisplay/NumberDisplay';
import { Button } from './Button/Button';
import { generateBoard, chainOpen } from '../utils/boardUtils';
import { Face } from '../types/Icons';
import { Cell, CellState, CellValue } from '../types/Cell';
import './App.scss';

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateBoard);
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [flags, setFlags] = useState<number>(10);
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
    const handleFaceClick = (): void => {
        if (live) {
            setLive(false);
            setTime(0);
            setFlags(10);
            setCells(generateBoard());
        }
    }
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

        } else if (currentCell.value === CellValue.none) {
            newBoard = chainOpen(newBoard, row, col);
        } else {
            newBoard[row][col].state = CellState.revealed;
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
            row.map((cell, colIndex) => <Button key={`${rowIndex}-${colIndex}`}
                state={cell.state} value={cell.value}
                onClick={handleCellClick} onContext={handleFlags}
                row={rowIndex} col={colIndex} />)
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
