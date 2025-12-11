import { Cell } from "./cell"
import { GamePhase } from "../use-memory-game"

interface GridProps {
    gridSize: number
    sequence: number[]
    playerInput: number[]
    phase: GamePhase
    onCellClick: (index: number) => void
}

export function Grid({ gridSize, sequence, playerInput, phase, onCellClick }: GridProps) {
    const totalCells = gridSize * gridSize

    return (
        <div
            className="grid gap-3 w-full max-w-md aspect-square mx-auto p-6 bg-background/30 backdrop-blur-md rounded-none border border-foreground/10 shadow-2xl"
            style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
        >
            {Array.from({ length: totalCells }).map((_, index) => {
                const isLit = phase === "SHOWING" && sequence.includes(index)
                const isSelected = playerInput.includes(index)
                const isCorrect = isSelected && sequence.includes(index)
                // We don't track "wrong" clicks in playerInput permanently in the current logic (it just subtracts a life),
                // but we could add visual feedback if we wanted. 
                // For now, let's just show correct ones.

                const isDisabled = phase !== "INPUT" || isSelected

                return (
                    <Cell
                        key={index}
                        isLit={isLit}
                        isSelected={isSelected}
                        isCorrect={isCorrect}
                        isWrong={false} // Logic for wrong feedback handled via toast for now
                        onClick={() => onCellClick(index)}
                        disabled={isDisabled}
                    />
                )
            })}
        </div>
    )
}
