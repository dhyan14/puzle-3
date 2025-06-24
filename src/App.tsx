import { useState, useCallback } from 'react';
import styled from 'styled-components';

// Types
type Cell = null | 'T';
type Grid = Cell[][];
type Move = { row: number; col: number };

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f0f0;
  min-height: 100vh;
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 50px);
  gap: 2px;
  background-color: #333;
  padding: 10px;
  border-radius: 8px;
`;

const Cell = styled.div<{ isOccupied: boolean }>`
  width: 50px;
  height: 50px;
  background-color: ${props => props.isOccupied ? '#9b59b6' : '#fff'};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.isOccupied ? '#9b59b6' : '#e8e8e8'};
  }
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const App = () => {
  const [grid, setGrid] = useState<Grid>(() => 
    Array(8).fill(null).map(() => Array(8).fill(null))
  );
  const [history, setHistory] = useState<Grid[]>([Array(8).fill(null).map(() => Array(8).fill(null))]);
  const [currentStep, setCurrentStep] = useState(0);

  const isValidPlacement = (row: number, col: number): boolean => {
    if (row < 0 || row >= 7 || col < 0 || col >= 8) return false;
    
    // Check if all cells for T-shape are empty
    return (
      !grid[row][col] &&
      !grid[row + 1][col] &&
      !grid[row + 1][col - 1] &&
      !grid[row + 1][col + 1] &&
      col > 0 &&
      col < 7
    );
  };

  const placeTetromino = (row: number, col: number) => {
    if (!isValidPlacement(row, col)) return;

    const newGrid = grid.map(row => [...row]);
    newGrid[row][col] = 'T';
    newGrid[row + 1][col] = 'T';
    newGrid[row + 1][col - 1] = 'T';
    newGrid[row + 1][col + 1] = 'T';

    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(newGrid);
    
    setGrid(newGrid);
    setHistory(newHistory);
    setCurrentStep(currentStep + 1);
  };

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setGrid(history[currentStep - 1]);
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      setGrid(history[currentStep + 1]);
    }
  };

  const reset = () => {
    const emptyGrid = Array(8).fill(null).map(() => Array(8).fill(null));
    setGrid(emptyGrid);
    setHistory([emptyGrid]);
    setCurrentStep(0);
  };

  return (
    <Container>
      <h1>T-Tetromino Puzzle</h1>
      <GameBoard>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              isOccupied={cell === 'T'}
              onClick={() => placeTetromino(rowIndex, colIndex)}
            />
          ))
        )}
      </GameBoard>
      <ButtonContainer>
        <Button onClick={undo} disabled={currentStep === 0}>
          Undo
        </Button>
        <Button onClick={redo} disabled={currentStep === history.length - 1}>
          Redo
        </Button>
        <Button onClick={reset}>
          Reset
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default App; 