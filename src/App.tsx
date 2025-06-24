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
  padding: 10px;
  background-color: #f0f0f0;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
`;

const GameBoard = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, minmax(30px, 50px));
  gap: 2px;
  background-color: #333;
  padding: 10px;
  border-radius: 8px;
  width: fit-content;
  max-width: 95vw;
  margin: 10px 0;
`;

const Cell = styled.div<{ isOccupied: boolean }>`
  width: minmax(30px, 50px);
  aspect-ratio: 1;
  background-color: ${props => props.isOccupied ? '#9b59b6' : '#fff'};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.isOccupied ? '#9b59b6' : '#e8e8e8'};
  }
`;

const Button = styled.button`
  margin: 5px;
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
  }

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
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 95vw;
  padding: 0 10px;
`;

const RotationControls = styled.div`
  display: flex;
  gap: 8px;
  margin: 15px 0;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 95vw;
  padding: 0 10px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 10px 0;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Divider = styled.div`
  width: 80%;
  height: 2px;
  background-color: #bdc3c7;
  margin: 20px 0;
`;

const PasswordInput = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 2px solid #bdc3c7;
  border-radius: 4px;
  width: 120px;
  text-align: center;
  margin: 10px;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin: 5px 0;
  font-size: 14px;
`;

const PuzzleGame = ({ size }: { size: number }) => {
  const [grid, setGrid] = useState<Grid>(() => 
    Array(size).fill(null).map(() => Array(size).fill(null))
  );
  const [history, setHistory] = useState<Grid[]>([Array(size).fill(null).map(() => Array(size).fill(null))]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentRotation, setCurrentRotation] = useState<Rotation>(0);

  const getTetrominoCells = (row: number, col: number, rotation: Rotation): [number, number][] => {
    switch (rotation) {
      case 0: // ⊤
        return [
          [row + 1, col],
          [row, col],
          [row, col - 1],
          [row, col + 1]
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
          [row, col],
          [row + 1, col],
          [row + 1, col - 1],
          [row + 1, col + 1]
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
    return cells.every(([r, c]) => {
      return r >= 0 && r < size && c >= 0 && c < size && !grid[r][c];
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
    const emptyGrid = Array(size).fill(null).map(() => Array(size).fill(null));
    setGrid(emptyGrid);
    setHistory([emptyGrid]);
    setCurrentStep(0);
  };

  const rotateShape = (rotation: Rotation) => {
    setCurrentRotation(rotation);
  };

  return (
    <>
      <Title>{size}x{size} T-Tetromino Puzzle</Title>
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
      <GameBoard size={size}>
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
    </>
  );
};

const App = () => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = () => {
    if (password === '1618') {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <Container>
      <PuzzleGame size={8} />
      <Divider />
      {!isUnlocked ? (
        <>
          <Title>Enter Password to Unlock 6x6 Puzzle</Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PasswordInput
              type="password"
              maxLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="****"
            />
            <Button onClick={handlePasswordSubmit}>
              Unlock
            </Button>
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </>
      ) : (
        <PuzzleGame size={6} />
      )}
    </Container>
  );
};

export default App;