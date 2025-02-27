import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Player colors
export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

// Token position can be in home, on board, or in finish area
export interface Token {
  id: number;
  position: number; // -1 for home, 0-51 for board, 52-57 for final stretch
  isHome: boolean;
  isFinished: boolean;
}

export interface Player {
  id: number;
  color: PlayerColor;
  tokens: Token[];
  isActive: boolean;
  isComputer: boolean;
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  diceRolled: boolean;
  gameStarted: boolean;
  winner: Player | null;
}

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'ROLL_DICE' }
  | { type: 'SET_DICE_VALUE'; value: number }
  | { type: 'MOVE_TOKEN'; playerId: number; tokenId: number }
  | { type: 'NEXT_PLAYER' }
  | { type: 'SET_WINNER'; player: Player };

// Initial tokens for a player
const createInitialTokens = (): Token[] => {
  return Array(4)
    .fill(0)
    .map((_, index) => ({
      id: index,
      position: -1,
      isHome: true,
      isFinished: false,
    }));
};

// Initial game state
const initialState: GameState = {
  players: [
    {
      id: 0,
      color: 'red',
      tokens: createInitialTokens(),
      isActive: false,
      isComputer: false,
    },
    {
      id: 1,
      color: 'green',
      tokens: createInitialTokens(),
      isActive: false,
      isComputer: true,
    },
    {
      id: 2,
      color: 'yellow',
      tokens: createInitialTokens(),
      isActive: false,
      isComputer: true,
    },
    {
      id: 3,
      color: 'blue',
      tokens: createInitialTokens(),
      isActive: false,
      isComputer: true,
    },
  ],
  currentPlayerIndex: 0,
  diceValue: null,
  diceRolled: false,
  gameStarted: false,
  winner: null,
};

// Game reducer for state updates
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const players = [...state.players];
      players[0].isActive = true;
      return {
        ...state,
        players,
        gameStarted: true,
      };
    }

    case 'ROLL_DICE':
      return {
        ...state,
        diceRolled: true,
      };

    case 'SET_DICE_VALUE':
      return {
        ...state,
        diceValue: action.value,
      };

    case 'MOVE_TOKEN': {
      const newPlayers = [...state.players];
      const playerIndex = newPlayers.findIndex((p) => p.id === action.playerId);

      if (playerIndex !== -1) {
        const player = newPlayers[playerIndex];
        const tokenIndex = player.tokens.findIndex(
          (t) => t.id === action.tokenId
        );

        if (tokenIndex !== -1 && state.diceValue !== null) {
          const token = player.tokens[tokenIndex];

          // If token is in home and dice value is 6, move to start position
          if (token.isHome && state.diceValue === 6) {
            token.isHome = false;
            token.position = playerIndex * 13; // Each player starts at a different position
          }
          // If token is already on board, move it forward
          else if (!token.isHome && !token.isFinished) {
            const newPosition = token.position + state.diceValue;

            // Check if token has completed a full circuit and is entering finish lane
            if (
              token.position < playerIndex * 13 + 51 &&
              newPosition >= playerIndex * 13 + 51
            ) {
              // Handle entering finish lane
              const finishPosition =
                52 + (newPosition - (playerIndex * 13 + 51));
              if (finishPosition <= 57) {
                token.position = finishPosition;
                if (finishPosition === 57) {
                  token.isFinished = true;
                }
              }
            } else {
              // Normal movement on the board
              token.position = newPosition % 52;
            }

            // Check for token collisions (simplified)
            // In a complete implementation, check if token lands on opponent's token

            // Check if player has won
            if (player.tokens.every((t) => t.isFinished)) {
              return {
                ...state,
                players: newPlayers,
                winner: player,
              };
            }
          }

          player.tokens[tokenIndex] = token;
        }
      }

      return {
        ...state,
        players: newPlayers,
        diceRolled: false,
        diceValue: null,
      };
    }

    case 'NEXT_PLAYER': {
      const newPlayers = state.players.map((player) => ({
        ...player,
        isActive: false,
      }));

      const nextPlayerIndex =
        (state.currentPlayerIndex + 1) % state.players.length;
      newPlayers[nextPlayerIndex].isActive = true;

      return {
        ...state,
        players: newPlayers,
        currentPlayerIndex: nextPlayerIndex,
        diceRolled: false,
        diceValue: null,
      };
    }

    case 'SET_WINNER':
      return {
        ...state,
        winner: action.player,
      };

    default:
      return state;
  }
};

// Create context
interface GameContextType {
  state: GameState;
  startGame: () => void;
  rollDice: () => void;
  moveToken: (playerId: number, tokenId: number) => void;
  nextPlayer: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  const rollDice = () => {
    dispatch({ type: 'ROLL_DICE' });

    // Simulate dice roll
    const value = Math.floor(Math.random() * 6) + 1;
    dispatch({ type: 'SET_DICE_VALUE', value });
  };

  const moveToken = (playerId: number, tokenId: number) => {
    dispatch({ type: 'MOVE_TOKEN', playerId, tokenId });
  };

  const nextPlayer = () => {
    dispatch({ type: 'NEXT_PLAYER' });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        rollDice,
        moveToken,
        nextPlayer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for accessing the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
