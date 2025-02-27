import { View } from 'react-native';
import { PlayerColor } from '../../context/GameContext';
import Token from '../players/Token';

interface HomeBaseProps {
  position: { top: number; left: number };
  size: number;
  color: PlayerColor;
  tokens: {
    id: number;
    isHome: boolean;
  }[];
}

const HomeBase: React.FC<HomeBaseProps> = ({
  position,
  size,
  color,
  tokens,
}) => {
  // Get background color based on player color
  const getBgColor = () => {
    switch (color) {
      case 'red':
        return 'bg-red-500';
      case 'green':
        return 'bg-green-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'blue':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Filter for home tokens only
  const homeTokens = tokens.filter((token) => token.isHome);

  // Token positions in home base
  const tokenPositions = [
    { top: size * 0.2, left: size * 0.2 },
    { top: size * 0.2, left: size * 0.6 },
    { top: size * 0.6, left: size * 0.2 },
    { top: size * 0.6, left: size * 0.6 },
  ];

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
      className={`absolute rounded-xl ${getBgColor()}`}
      style={{
        top: position.top,
        left: position.left,
        width: size,
        height: size,
      }}
    >
      <View className='w-full h-full p-2'>
        <View className='w-full h-full bg-white rounded-lg items-center justify-center'>
          {homeTokens.map((token, index) => (
            <Token
              key={`home-token-${token.id}`}
              position={tokenPositions[token.id]}
              size={size * 0.25}
              color={color}
              playerId={playerId}
              tokenId={token.id}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default HomeBase;
