import { View } from 'react-native';
import { PlayerColor } from '../../context/GameContext';
import Token from '../players/Token';

interface FinishLaneProps {
  position: { top: number; left: number };
  size: number;
  color: PlayerColor;
  lanePosition: number; // 0-5 (0 being closest to center)
  tokens: {
    id: number;
    position: number;
    isHome: boolean;
    isFinished: boolean;
  }[];
}

const FinishLane: React.FC<FinishLaneProps> = ({
  position,
  size,
  color,
  lanePosition,
  tokens,
}) => {
  // Get background color based on player color
  const getBgColor = () => {
    switch (color) {
      case 'red':
        return 'bg-red-300';
      case 'green':
        return 'bg-green-300';
      case 'yellow':
        return 'bg-yellow-300';
      case 'blue':
        return 'bg-blue-300';
      default:
        return 'bg-gray-300';
    }
  };

  // Calculate the finish position based on lane position (52-57)
  const finishPosition = 52 + lanePosition;

  // Filter tokens in this finish lane position
  const finishTokens = tokens.filter(
    (token) => !token.isHome && token.position === finishPosition
  );

  // Get player ID based on color
  const getPlayerId = () => {
    switch (color) {
      case 'red':
        return 0;
      case 'green':
        return 1;
      case 'yellow':
        return 2;
      case 'blue':
        return 3;
      default:
        return 0;
    }
  };

  const playerId = getPlayerId();

  return (
    <View
      className={`absolute ${getBgColor()} border border-gray-300`}
      style={{
        top: position.top,
        left: position.left,
        width: size,
        height: size,
      }}
    >
      {finishTokens.map((token) => (
        <Token
          key={`finish-token-${token.id}`}
          position={{ top: size * 0.3, left: size * 0.3 }}
          size={size * 0.4}
          color={color}
          playerId={playerId}
          tokenId={token.id}
        />
      ))}
    </View>
  );
};

export default FinishLane;
