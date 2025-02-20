import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Cell = 'black' | 'white' | null;

const GRID_SIZE = 6;
const LEVELS = { easy: 13, hard: 10 }; // The difficulty doesn't depend on the number of cells, but works as an initial parameter


// The fixed initial cells are randomly generated so that there is NO REPETITION LEVEL
const generateFixedCells = (level: 'easy' | 'hard') => {
    const fixedCount = LEVELS[level];
    const fixedCells: { row: number; col: number; value: Cell }[] = [];
    const usedPositions = new Set<string>();

    while (fixedCells.length < fixedCount) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        const positionKey = `${row}-${col}`;

        if (!usedPositions.has(positionKey)) {
            fixedCells.push({ row, col, value: Math.random() > 0.5 ? 'black' : 'white' });
            usedPositions.add(positionKey);
        }
    }

    return fixedCells;
};

const GameScreen: React.FC<{ level: 'easy' | 'hard'; onGoBack: (time: number, gameWon: boolean) => void }> = ({ level, onGoBack }) => {
    const [fixedCells, setFixedCells] = useState<{ row: number; col: number; value: Cell }[]>([]);
    const [grid, setGrid] = useState<Cell[][]>(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)));
    const [invalidRows, setInvalidRows] = useState<number[]>([]);
    const [invalidCols, setInvalidCols] = useState<number[]>([]);
    const [isGameWon, setIsGameWon] = useState(false);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [timeFinal, setTimeFinal] = useState(0);

    useEffect(() => {
        const newFixedCells = generateFixedCells(level);
        setFixedCells(newFixedCells);
    }, [level]);

    useEffect(() => {
        const newGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
        fixedCells.forEach(({ row, col, value }) => {
            newGrid[row][col] = value;
        });
        setGrid(newGrid);
    }, [fixedCells]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning) {
            timer = setInterval(() => setTime(prevTime => prevTime + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    const handleCellPress = (row: number, col: number) => {
        if (fixedCells.some(cell => cell.row === row && cell.col === col)) return;

        setGrid(prevGrid => {
            const newGrid = prevGrid.map(rowArray => [...rowArray]);
            const currentValue = newGrid[row][col];

            newGrid[row][col] = currentValue === null ? 'black' : currentValue === 'black' ? 'white' : null;

            validateGrid(newGrid);
            return newGrid;
        });
    };

    const validateGrid = (grid: Cell[][]) => {
        let invalidRowsSet = new Set<number>();
        let invalidColsSet = new Set<number>();

        const isBalanced = (arr: Cell[]) => arr.filter(x => x === 'black').length === arr.filter(x => x === 'white').length;
        const hasNoTriples = (arr: Cell[]) => !arr.some((_, i) => i > 1 && arr[i] === arr[i - 1] && arr[i] === arr[i - 2]);

        const columns: Cell[][] = Array.from({ length: GRID_SIZE }, () => []);

        // Validates that there are no more than two consecutive cells of the same color 
        for (let i = 0; i < GRID_SIZE; i++) {
            if (grid[i].every(cell => cell !== null)) {
                if (!isBalanced(grid[i]) || !hasNoTriples(grid[i])) invalidRowsSet.add(i);
            }
            for (let j = 0; j < GRID_SIZE; j++) {
                columns[j].push(grid[i][j]);
            }
        }

        for (let j = 0; j < GRID_SIZE; j++) {
            if (columns[j].every(cell => cell !== null)) {
                if (!isBalanced(columns[j]) || !hasNoTriples(columns[j])) invalidColsSet.add(j);
            }
        }

        setInvalidRows(Array.from(invalidRowsSet));
        setInvalidCols(Array.from(invalidColsSet));

        const isGameComplete = grid.every(row => row.every(cell => cell !== null));
        if (isGameComplete && invalidRowsSet.size === 0 && invalidColsSet.size === 0) {
            setIsGameWon(true);
            setIsRunning(false); // Stop time
            setTimeFinal(time);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Binairo Game</Text>
            <Text style={styles.timerText}>🕒 Tiempo: {formatTime(time)}</Text>
            {isGameWon && <Text style={styles.winMessage}>¡Ganaste!</Text>}

            <View style={styles.grid}>
                {grid.map((row, rowIndex) => (
                    <View key={rowIndex} style={[styles.row, invalidRows.includes(rowIndex) ? styles.invalidRow : {}]}>
                        {row.map((cell, colIndex) => {
                            const isFixed = fixedCells.some(c => c.row === rowIndex && c.col === colIndex);
                            const isInvalidCol = invalidCols.includes(colIndex);
                            return (
                                <TouchableOpacity key={colIndex} onPress={() => handleCellPress(rowIndex, colIndex)} disabled={isFixed}>
                                    <View style={[styles.cell, cell === 'black' ? styles.blackCell : cell === 'white' ? styles.whiteCell : {}, isFixed ? styles.fixedCell : {}, isInvalidCol ? styles.invalidCol : {}]}>
                                        <Text style={styles.cellText}>{cell ? (cell === 'black' ? '⬛' : '⬜') : ''}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>

            <LinearGradient
                colors={['#000000', '#ffffff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBorder}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => onGoBack(timeFinal, false)}>
                        <Text style={styles.buttonText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};




const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    timerText: { fontSize: 18, marginBottom: 10, color: '#333' },
    grid: { marginVertical: 20 },
    row: { flexDirection: 'row' },
    cell: { width: 40, height: 40, borderWidth: 1, justifyContent: 'center', alignItems: 'center', margin: 2, backgroundColor: 'white' },
    blackCell: { backgroundColor: 'black' },
    whiteCell: { backgroundColor: 'white' },
    fixedCell: { borderWidth: 2, borderColor: '#333' },
    invalidRow: { backgroundColor: 'rgba(255, 0, 0, 0.3)' },
    invalidCol: { backgroundColor: 'rgba(255, 0, 0, 0.3)' },
    cellText: { fontSize: 24 },
    gradientBorder: { padding: 2, borderRadius: 10, marginVertical: 5, },
    buttonContainer: { backgroundColor: 'black', borderRadius: 10, alignItems: 'center', justifyContent: 'center', },
    button: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, },
    buttonText: { fontSize: 18, fontWeight: 'bold', color: 'white', },
    winMessage: { fontSize: 24, fontWeight: 'bold', color: 'green', marginVertical: 20 },
});

export default GameScreen;
