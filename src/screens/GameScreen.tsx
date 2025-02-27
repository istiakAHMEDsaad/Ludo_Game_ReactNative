import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useGame } from '../context/GameContext';
import Board from '../components/board/Board';
import DiceComponent from '../components/common/Dice';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const GameScreen: React.FC = () => {
    const { state, startGame, nextPlayer } = useGame();
    
    // Start the game when component mounts
    useEffect(() => {
      if (!state.gameStarted) {
        startGame();
      }
    }, []);
    
    // Get the current player
    const currentPlayer = state.players[state.currentPlayerIndex];
    
    // Get color for the gradient based on current player
    const getGradientColors = () => {
      switch (currentPlayer?.color) {
        case 'red': return ['#fee2e2', '#fecaca', '#fca5a5'];
        case 'green': return ['#dcfce7', '#bbf7d0', '#86efac'];
        case 'yellow': return ['#fef9c3', '#fef08a', '#fde047'];
        case 'blue': return ['#dbeafe', '#bfdbfe', '#93c5fd'];
        default: return ['#f9fafb', '#f3f4f6', '#e5e7eb'];
      }
    };
    
    // Handle next turn
    const handleNextTurn = () => {
      nextPlayer();
    };
    
    // Render winner message
    const renderWinnerMessage = () => {
      if (state.winner) {
        return (
          <View className="mb-4 p-4 bg-white rounded-lg shadow-md">
            <Text className="text-2xl font-bold text-center">
              {state.winner.color.toUpperCase()} Player Wins!
            </Text>
            <TouchableOpacity 
              className="mt-4 bg-blue-500 p-3 rounded-lg"
              onPress={() => {
                // Ideally this would reset the game, but would require a reset function in context
                // For now, we could reload the app
                console.log('Game should reset here');
              }}
            >
              <Text className="text-white text-center font-bold">New Game</Text>
            </TouchableOpacity>
          </View>
        );
      }
      return null;
    };
    
    return (
        <LinearGradient
          colors={getGradientColors()}
          className="flex-1"
        >
          <StatusBar style="auto" />
          <SafeAreaView className="flex-1">
            <ScrollView contentContainerClassName="flex-grow items-center justify-center py-8">
              <Text className="text-3xl font-bold mb-6 text-center">Ludo Game</Text>
              
              {renderWinnerMessage()}
              
              <View className="items-center justify-center mb-6">
                <Board />
              </View>
              
              <View className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mx-4">
                <DiceComponent />
                
                {state.diceRolled && state.diceValue !== 6 && (
                  <TouchableOpacity 
                    className="mt-4 bg-blue-500 p-3 rounded-lg"
                    onPress={handleNextTurn}
                  >
                    <Text className="text-white text-center font-bold">Next Turn</Text>
                  </TouchableOpacity>
                )}
                
                <View className="mt-4">
                  <Text className="text-lg font-bold">Players:</Text>
                  {state.players.map((player) => (
                    <View 
                      key={player.id}
                      className={`flex-row items-center mt-2 p-2 rounded-md ${
                        player.isActive ? 'bg-gray-200' : ''
                      }`}
                    >
                      <View 
                        className={`w-4 h-4 rounded-full mr-2`}
                        style={{
                          backgroundColor: 
                            player.color === 'red' ? '#dc2626' :
                            player.color === 'green' ? '#16a34a' :
                            player.color === 'yellow' ? '#ca8a04' :
                            player.color === 'blue' ? '#2563eb' : '#000',
                        }}
                      />
                      <Text>
                        {player.color.toUpperCase()} Player
                        {player.isActive ? ' (Current)' : ''}
                        {player.isComputer ? ' (Computer)' : ' (You)'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      );
    };
    
    export default GameScreen;