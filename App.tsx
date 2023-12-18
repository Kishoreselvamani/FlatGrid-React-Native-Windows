import React, { useState } from 'react';
import { StyleSheet, View, Image, PanResponder, Animated ,Dimensions} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';

const { width } = Dimensions.get('window');
const itemWidth = 200;
const spacing = 10;
const itemsPerRow = Math.floor((width - spacing) / (itemWidth + spacing));

interface Item {
  imgurl: any;
  id: number;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    {
      imgurl: require('./Images/blankpage.jpg'),
      id: 1,
    },
   
    {
      id: 2,
      imgurl: require('./Images/pages.jpg'),
    },
    {
      id: 3,
      imgurl: require('./Images/pages1.jpg'),
    },
    {
      id: 4,
      imgurl: require('./Images/pages2.jpg'),
    },
    {
      id: 5,
      imgurl: require('./Images/pages3.jpg'),
    },
    {
      id: 7,
      imgurl: require('./Images/pages.jpg'),
    },
    {
      id: 8,
      imgurl: require('./Images/pages1.jpg'),
    },
    {
      id: 9,
      imgurl: require('./Images/pages2.jpg'),
    },
    {
      id: 10,
      imgurl: require('./Images/pages3.jpg'),
    },
  ]);

  const handlePanResponderMove = (index: number, pan: Animated.ValueXY) => (
    event: any,
    gestureState: any
  ) => {
    pan.setValue({ x: gestureState.dx, y: gestureState.dy });
  };

  const handlePanResponderRelease = (index: number, pan: Animated.ValueXY) => (
    event: any,
    gestureState: any
  ) => {
    const targetIndex = findTargetIndex(gestureState);
    if (targetIndex !== null && targetIndex !== index) {
      const updatedItems = [...items];
      [updatedItems[index], updatedItems[targetIndex]] = [
        updatedItems[targetIndex],
        updatedItems[index],
      ];
      setItems(updatedItems);
    }
  };

  const findTargetIndex = (gestureState: any) => {
    const x = gestureState.moveX;
    const y = gestureState.moveY;

    const columnWidth = itemWidth + spacing;
    const columnIndex = Math.floor(x / columnWidth);

    const rowIndex = Math.floor(y / (itemWidth + spacing));

    const targetIndex = rowIndex * itemsPerRow + columnIndex;

    return targetIndex >= 0 && targetIndex < items.length ? targetIndex : null;
  };

  const renderDraggableItem = (item: Item, index: number) => {
    const pan = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: handlePanResponderMove(index, pan),
      onPanResponderRelease: handlePanResponderRelease(index, pan),
    });

    const animatedStyle = {
      transform: [{ translateX: pan.x }, { translateY: pan.y }],
    };

    return (
      <Animated.View
        key={item.id}
        style={[styles.itemContainer, animatedStyle]}
        {...panResponder.panHandlers}
      >
        <Image source={item.imgurl} style={{ width: itemWidth, height: itemWidth }} />
      </Animated.View>
    );
  };

  return (
    <FlatGrid
      data={items}
      itemDimension={itemWidth}
      spacing={spacing}
      renderItem={({ item, index }) => renderDraggableItem(item, index)}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'flex-end',
    marginBottom: spacing,
  },
});

export default App;