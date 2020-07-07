import React from "react";
import "./Button.scss";
import { CellIcon } from "../../types/Icons";
import { CellState, CellValue } from "../../types/Cell";

interface ButtonProps {
    row: number;
    col: number;
    state: CellState;
    value: CellValue;
    onClick(row: number, col: number): (...args: any[]) => void;
    onContext(row: number, col: number): (...args: any[]) => void;
}

export const Button: React.FC<ButtonProps> = ({ row, col, onClick, onContext, state, value }) => {
    const renderContent = (): React.ReactNode => {
        if (state === CellState.revealed) {
            if (value === CellValue.bomb) {
                return (
                    <span role="img" aria-label="bomb">{CellIcon.bomb}</span>
                );
            }
            return value;
        } else if (state === CellState.flagged) {
            return (
                <span role="img" aria-label="bomb">{CellIcon.flag}</span>
            );
        }
    }
    return (<div className={`Button ${state === CellState.untouched ? "untouched" : ""} value-${value}`}
        onClick={onClick(row, col)} onContextMenu={onContext(row, col)}>{renderContent()}</div>)
}