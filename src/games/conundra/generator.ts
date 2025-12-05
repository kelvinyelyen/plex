import { Difficulty } from "./types"

export const generateTarget = (difficulty: Difficulty): { target: number; numbers: number[] } => {
    let count = 4
    let range = 10

    switch (difficulty) {
        case "Easy":
            count = 4
            range = 10
            break
        case "Medium":
            count = 5
            range = 15
            break
        case "Hard":
            count = 6
            range = 25
            break
        case "Expert":
            count = 6
            range = 50
            break
    }

    // Generate random numbers
    const numbers = Array.from({ length: count }, () => Math.floor(Math.random() * range) + 1)

    // Generate a reachable target by simulating operations
    const current = [...numbers]
    while (current.length > 1) {
        const idx1 = Math.floor(Math.random() * current.length)
        const val1 = current[idx1]
        current.splice(idx1, 1)

        const idx2 = Math.floor(Math.random() * current.length)
        const val2 = current[idx2]
        current.splice(idx2, 1)

        const ops = ["+", "-", "*"]
        if (val2 !== 0 && val1 % val2 === 0) ops.push("/")

        const op = ops[Math.floor(Math.random() * ops.length)]
        let res = 0
        if (op === "+") res = val1 + val2
        else if (op === "-") res = Math.abs(val1 - val2)
        else if (op === "*") res = val1 * val2
        else if (op === "/") res = val1 / val2 // Simplified, usually we want integer division

        current.push(res)
    }

    // Ensure target is positive and reasonable
    const target = Math.max(1, Math.abs(current[0]))

    return { target, numbers }
}
