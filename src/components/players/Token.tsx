import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { PlayerColor, useGame } from '../../context/GameContext';

interface TokenProps {
  position: { top: number; left: number };
  size: number;
  color: PlayerColor;
  playerId: number;
  tokenId: number;
}

const Token: React.FC<TokenProps> = ({
  position,
  size,
  color,
  playerId,
  tokenId,
}) => {
  const { state, moveToken } = useGame();

  // Determine if token is movable
  const isCurrentPlayerToken =
    state.players[state.currentPlayerIndex].id === playerId;
  const diceValue = state.diceValue;
  const canMove =
    isCurrentPlayerToken && state.diceRolled && diceValue !== null;

  // Get token color
  const getTokenColor = () => {
    switch (color) {
      case 'red':
        return 'bg-red-600';
      case 'green':
        return 'bg-green-600';
      case 'yellow':
        return 'bg-yellow-600';
      case 'blue':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  // Get border color for active token
  const getBorderColor = () => {
    if (canMove) {
      return 'border-2 border-white';
    }
    return '';
  };

  // Handle token click
  const handleTokenPress = () => {
    if (canMove) {
      moveToken(playerId, tokenId);
    }
  };

  // Return the JSX element
  return (
    <TouchableOpacity
      onPress={handleTokenPress}
      disabled={!canMove}
      className={`absolute ${getTokenColor()} ${getBorderColor()} rounded-full`}
      style={{
        top: position.top,
        left: position.left,
        width: size,
        height: size,
      }}
    >
      <View className='w-full h-full items-center justify-center'>
        {/* Optional: Add inner circle or token number */}
        {canMove && (
          <View className='w-1/2 h-1/2 rounded-full bg-white opacity-30' />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Token;
