import { View } from 'react-native';
import { PlayerColor } from '../../context/GameContext';
import Token from '../players/Token';

interface BoardCellProps {
    position: { top: number; left: number };
    size: number;
    index: number;
    color?: PlayerColor;
    tokens: Array<{
      token: {
        id: number;
        position: number;
      };
      playerId: number;
      color: PlayerColor;
    }>;
  }
  
  const BoardCell: React.FC<BoardCellProps> = ({ position, size, index, color, tokens }) => {
    // Get background color based on cell type
    const getBgColor = () => {
      if (color) {
        switch (color) {
          case 'red': return 'bg-red-200';
          case 'green': return 'bg-green-200';
          case 'yellow': return 'bg-yellow-200';
          case 'blue': return 'bg-blue-200';
          default: return 'bg-white';
        }
      }
      return 'bg-white';
    };
    
    // Calculate positions for multiple tokens in one cell
    const getTokenPosition = (index: number, total: number) => {
      const positions = [
        { top: size * 0.25, left: size * 0.25 },
        { top: size * 0.25, left: size * 0.65 },
        { top: size * 0.65, left: size * 0.25 },
        { top: size * 0.65, left: size * 0.65 },
      ];
      
      if (total === 1) {
        return { top: size * 0.45, left: size * 0.45 };
      }
      
      return positions[index % 4];
    };
    
    return (
      <View 
        className={`absolute border border-gray-300 ${getBgColor()}`}
        style={{
          top: position.top,
          left: position.left,
          width: size,
          height: size,
        }}
      >
        {tokens.map((token, idx) => {
          const tokenPos = getTokenPosition(idx, tokens.length);
          return (
            <Token
              key={`token-${token.playerId}-${token.token.id}`}
              position={{ top: tokenPos.top, left: tokenPos.left }}
              size={size * 0.4}
              color={token.color}
              playerId={token.playerId}
              tokenId={token.token.id}
            />
          );
        })}
      </View>
    );
  };
  
  export default BoardCell;