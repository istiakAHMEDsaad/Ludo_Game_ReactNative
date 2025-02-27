import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useGame } from '../../context/GameContext';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming, Easing } from 'react-native-reanimated';

const DiceComponent: React.FC = () => {
  const { state, rollDice } = useGame();
  const rotation = useSharedValue(0);
  const DICE_SIZE = 64; // 16 * 4 = 64px (w-16 h-16)
  const DOT_SIZE = 12; // w-3 h-3 = 12px

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const handleRollDice = () => {
    // Animate the dice roll
    rotation.value = withSequence(
      withTiming(rotation.value + 360, { duration: 300, easing: Easing.linear }),
      withTiming(rotation.value + 720, { duration: 300, easing: Easing.linear }),
    );
    
    rollDice();
  };

  const renderDiceFace = () => {
    if (state.diceValue === null) {
      return null;
    }
    
    // Positions as numeric values rather than percentages
    const dotPositions = {
      1: [{ top: DICE_SIZE / 2 - DOT_SIZE / 2, left: DICE_SIZE / 2 - DOT_SIZE / 2 }],
      2: [
        { top: DICE_SIZE * 0.25 - DOT_SIZE / 2, left: DICE_SIZE * 0.25 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.75 - DOT_SIZE / 2, left: DICE_SIZE * 0.75 - DOT_SIZE / 2 }
      ],
      3: [
        { top: DICE_SIZE * 0.25 - DOT_SIZE / 2, left: DICE_SIZE * 0.25 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.5 - DOT_SIZE / 2, left: DICE_SIZE * 0.5 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.75 - DOT_SIZE / 2, left: DICE_SIZE * 0.75 - DOT_SIZE / 2 }
      ],
      4: [
        { top: DICE_SIZE * 0.25 - DOT_SIZE / 2, left: DICE_SIZE * 0.25 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.25 - DOT_SIZE / 2, left: DICE_SIZE * 0.75 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.75 - DOT_SIZE / 2, left: DICE_SIZE * 0.25 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.75 - DOT_SIZE / 2, left: DICE_SIZE * 0.75 - DOT_SIZE / 2 }
      ],
      5: [
        { top: DICE_SIZE * 0.25 - DOT_SIZE / 2, left: DICE_SIZE * 0.25 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.25 - DOT_SIZE / 2, left: DICE_SIZE * 0.75 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.5 - DOT_SIZE / 2, left: DICE_SIZE * 0.5 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.75 - DOT_SIZE / 2, left: DICE_SIZE * 0.25 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.75 - DOT_SIZE / 2, left: DICE_SIZE * 0.75 - DOT_SIZE / 2 }
      ],
      6: [
        { top: DICE_SIZE * 0.25 - DOT_SIZE / 2, left: DICE_SIZE * 0.25 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.25 - DOT_SIZE / 2, left: DICE_SIZE * 0.75 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.5 - DOT_SIZE / 2, left: DICE_SIZE * 0.25 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.5 - DOT_SIZE / 2, left: DICE_SIZE * 0.75 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.75 - DOT_SIZE / 2, left: DICE_SIZE * 0.25 - DOT_SIZE / 2 },
        { top: DICE_SIZE * 0.75 - DOT_SIZE / 2, left: DICE_SIZE * 0.75 - DOT_SIZE / 2 }
      ],
    }[state.diceValue];

    return (
      <>
        {dotPositions?.map((position, index) => (
          <View 
            key={index} 
            className="absolute w-3 h-3 rounded-full bg-black"
            style={{ 
              top: position.top, 
              left: position.left 
            }}
          />
        ))}
      </>
    );
  };

  const currentPlayer = state.players[state.currentPlayerIndex];
  const buttonDisabled = !state.gameStarted || state.diceRolled || state.winner !== null;
  
  return (
    <View className="items-center">
      <Text className="text-lg mb-2 font-bold">
        {currentPlayer ? `${currentPlayer.color.toUpperCase()}'s Turn` : 'Roll the dice'}
      </Text>
      
      <TouchableOpacity 
        onPress={handleRollDice}
        disabled={buttonDisabled}
        className={`mb-4 ${buttonDisabled ? 'opacity-50' : ''}`}
      >
        <Animated.View 
          className="w-16 h-16 bg-white rounded-lg justify-center items-center shadow-md"
          style={[animatedStyle]}
        >
          {renderDiceFace()}
        </Animated.View>
      </TouchableOpacity>
      
      {!state.gameStarted && (
        <Text className="text-lg text-center text-gray-600">
          Press the dice to start the game
        </Text>
      )}
    </View>
  );
};

export default DiceComponent;