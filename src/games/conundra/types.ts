export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert"

export interface GameState {
    target: number
    numbers: number[]
    history: number[][]
    expression: string
}

export interface Operation {
    operator: "+" | "-" | "*" | "/"
    symbol: string
    apply: (a: number, b: number) => number
}
