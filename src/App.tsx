import { useState } from 'react';
import styled from 'styled-components';

// Types
type Cell = null | 'T';
type Grid = Cell[][];
type Rotation = 0 | 90 | 180 | 270;

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
  flex-wrap: wrap;
  justify-content: center;
`;

const RotationControls = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const App = () => {
  const [grid, setGrid] = useState<Grid>(() => 
    Array(8).fill(null).map(() => Array(8).fill(null))
  );
  const [history, setHistory] = useState<Grid[]>([Array(8).fill(null).map(() => Array(8).fill(null))]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentRotation, setCurrentRotation] = useState<Rotation>(0);

  const getTetrominoCells = (row: number, col: number, rotation: Rotation): [number, number][] => {
    switch (rotation) {
      case 0: // ⊤
        return [
          [row, col],
          [row + 1, col],
          [row + 1, col - 1],
          [row + 1, col + 1]
        ];
      case 90: // ⊣
        return [
          [row, col],
          [row - 1, col],
          [row + 1, col],
          [row, col - 1]
        ];
      case 180: // ⊥
        return [
          [row + 1, col],
          [row, col],
          [row, col - 1],
          [row, col + 1]
        ];
      case 270: // ⊢
        return [
          [row, col],
          [row - 1, col],
          [row + 1, col],
          [row, col + 1]
        ];
    }
  };

  const isValidPlacement = (row: number, col: number, rotation: Rotation): boolean => {
    const cells = getTetrominoCells(row, col, rotation);
    
    // Check if all required cells are within bounds and empty
    return cells.every(([r, c]) => {
      return r >= 0 && r < 8 && c >= 0 && c < 8 && !grid[r][c];
    });
  };

  const placeTetromino = (row: number, col: number) => {
    if (!isValidPlacement(row, col, currentRotation)) return;

    const newGrid = grid.map(row => [...row]);
    const cells = getTetrominoCells(row, col, currentRotation);
    
    cells.forEach(([r, c]) => {
      newGrid[r][c] = 'T';
    });

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

  const rotateShape = (rotation: Rotation) => {
    setCurrentRotation(rotation);
  };

  return (
    <Container>
      <h1>T-Tetromino Puzzle</h1>
      <RotationControls>
        <Button 
          onClick={() => rotateShape(0)} 
          style={{ backgroundColor: currentRotation === 0 ? '#2ecc71' : undefined }}
        >
          Rotation 0° (⊤)
        </Button>
        <Button 
          onClick={() => rotateShape(90)} 
          style={{ backgroundColor: currentRotation === 90 ? '#2ecc71' : undefined }}
        >
          Rotation 90° (⊣)
        </Button>
        <Button 
          onClick={() => rotateShape(180)} 
          style={{ backgroundColor: currentRotation === 180 ? '#2ecc71' : undefined }}
        >
          Rotation 180° (⊥)
        </Button>
        <Button 
          onClick={() => rotateShape(270)} 
          style={{ backgroundColor: currentRotation === 270 ? '#2ecc71' : undefined }}
        >
          Rotation 270° (⊢)
        </Button>
      </RotationControls>
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