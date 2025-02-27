import { View, Dimensions } from 'react-native';
import { useGame, PlayerColor } from '../../context/GameContext';
import BoardCell from './BoardCell';
import HomeBase from './HomeBase';
import FinishLane from './FinishLane';

const BOARD_SIZE = Math.min(Dimensions.get('window').width - 32, 350);
const CELL_SIZE = BOARD_SIZE / 15; // 15x15 grid

const Board: React.FC = () => {
  const { state } = useGame();

  // Generate coordinates for each cell on the board
  const generateBoardCells = () => {
    const cells = [];
    const playerColors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];

    // Helper to compute position on board
    const getPositionIndex = (row: number, col: number): number | null => {
      // Top row (excluding corners)
      if (row === 0 && col > 0 && col < 6) return 50 - col;
      if (row === 0 && col > 8 && col < 14) return 38 + col - 9;

      // Bottom row (excluding corners)
      if (row === 14 && col > 0 && col < 6) return 25 + col - 1;
      if (row === 14 && col > 8 && col < 14) return 25 - (col - 9);

      // Left column (excluding corners)
      if (col === 0 && row > 0 && row < 6) return 38 + row;
      if (col === 0 && row > 8 && row < 14) return 12 - (row - 9);

      // Right column (excluding corners)
      if (col === 14 && row > 0 && row < 6) return 51 - row;
      if (col === 14 && row > 8 && row < 14) return 12 + row - 8;

      return null;
    };

    // Create the board cells
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        const position = getPositionIndex(row, col);

        // Skip the center of the board
        if (row > 5 && row < 9 && col > 5 && col < 9) {
          continue;
        }

        // Skip the home bases (corners)
        if (
          (row < 6 && col < 6) ||
          (row < 6 && col > 8) ||
          (row > 8 && col < 6) ||
          (row > 8 && col > 8)
        ) {
          // Add home bases
          if (row === 2 && col === 2) {
            cells.push(
              <HomeBase
                key={`home-red`}
                color='red'
                position={{ top: CELL_SIZE * 2, left: CELL_SIZE * 2 }}
                size={CELL_SIZE * 3}
                tokens={state.players[0].tokens}
              />
            );
          } else if (row === 2 && col === 12) {
            cells.push(
              <HomeBase
                key={`home-green`}
                color='green'
                position={{ top: CELL_SIZE * 2, left: CELL_SIZE * 12 }}
                size={CELL_SIZE * 3}
                tokens={state.players[1].tokens}
              />
            );
          } else if (row === 12 && col === 2) {
            cells.push(
              <HomeBase
                key={`home-blue`}
                color='blue'
                position={{ top: CELL_SIZE * 12, left: CELL_SIZE * 2 }}
                size={CELL_SIZE * 3}
                tokens={state.players[3].tokens}
              />
            );
          } else if (row === 12 && col === 12) {
            cells.push(
              <HomeBase
                key={`home-yellow`}
                color='yellow'
                position={{ top: CELL_SIZE * 12, left: CELL_SIZE * 12 }}
                size={CELL_SIZE * 3}
                tokens={state.players[2].tokens}
              />
            );
          }

          continue;
        }

        // Add finish lanes
        if (row === 7 && col < 6) {
          cells.push(
            <FinishLane
              key={`finish-blue`}
              color='blue'
              position={{ top: CELL_SIZE * 7, left: CELL_SIZE * col }}
              size={CELL_SIZE}
              lanePosition={5 - col}
              tokens={state.players[3].tokens}
            />
          );
        } else if (row === 7 && col > 8) {
          cells.push(
            <FinishLane
              key={`finish-green`}
              color='green'
              position={{ top: CELL_SIZE * 7, left: CELL_SIZE * col }}
              size={CELL_SIZE}
              lanePosition={col - 9}
              tokens={state.players[1].tokens}
            />
          );
        } else if (col === 7 && row < 6) {
          cells.push(
            <FinishLane
              key={`finish-red`}
              color='red'
              position={{ top: CELL_SIZE * row, left: CELL_SIZE * 7 }}
              size={CELL_SIZE}
              lanePosition={5 - row}
              tokens={state.players[0].tokens}
            />
          );
        } else if (col === 7 && row > 8) {
          cells.push(
            <FinishLane
              key={`finish-yellow`}
              color='yellow'
              position={{ top: CELL_SIZE * row, left: CELL_SIZE * 7 }}
              size={CELL_SIZE}
              lanePosition={row - 9}
              tokens={state.players[2].tokens}
            />
          );
        }

        // Add regular cells on the main path
        if (position !== null) {
          // Determine cell color
          let cellColor: PlayerColor | undefined;

          // Safe spots
          if (
            position === 0 ||
            position === 13 ||
            position === 26 ||
            position === 39
          ) {
            cellColor = playerColors[Math.floor(position / 13)];
          }

          cells.push(
            <BoardCell
              key={`cell-${row}-${col}`}
              position={{ top: CELL_SIZE * row, left: CELL_SIZE * col }}
              size={CELL_SIZE}
              index={position}
              color={cellColor}
              tokens={state.players.flatMap((player) =>
                player.tokens
                  .filter(
                    (token) =>
                      !token.isHome &&
                      !token.isFinished &&
                      token.position === position
                  )
                  .map((token) => ({
                    token,
                    playerId: player.id,
                    color: player.color,
                  }))
              )}
            />
          );
        }
      }
    }

    return cells;
  };

  return (
    <View
      className='relative bg-gray-200 shadow-lg rounded-lg overflow-hidden'
      style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
    >
      {generateBoardCells()}
    </View>
  );
};

export default Board;
