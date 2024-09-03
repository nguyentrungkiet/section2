import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Button, Text, Modal, TextInput, Pressable } from 'react-native';

export default function App() {
  const [courseGoals, setCourseGoals] = useState<string[]>([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [enteredGoal, setEnteredGoal] = useState('');

  const addGoalHandler = () => {
    if (enteredGoal.trim().length === 0) {
      return;
    }
    setCourseGoals(currentGoals => [...currentGoals, enteredGoal]);
    setEnteredGoal('');
    setIsAddMode(false);
  };

  const removeGoalHandler = (index: number) => {
    setCourseGoals(currentGoals => currentGoals.filter((_, idx) => idx !== index));
  };

  const cancelAddGoalHandler = () => {
    setIsAddMode(false);
    setEnteredGoal('');
  };

  return (
    <View style={styles.screen}>
      <Button title="Thêm mục tiêu mới" onPress={() => setIsAddMode(true)} />
      <Modal visible={isAddMode} animationType="slide">
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nhập mục tiêu của bạn"
            style={styles.input}
            onChangeText={setEnteredGoal}
            value={enteredGoal}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="HỦY" color="red" onPress={cancelAddGoalHandler} />
            </View>
            <View style={styles.button}>
              <Button title="THÊM" onPress={addGoalHandler} />
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={courseGoals}
        renderItem={itemData => (
          <Pressable
            android_ripple={{ color: '#dddddd' }}
            onPress={() => removeGoalHandler(itemData.index)}
            style={({ pressed }) => pressed && styles.pressedItem}
          >
            <View style={styles.listItem}>
              <Text>{itemData.item}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 50,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  button: {
    width: '40%',
  },
  listItem: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#ccc',
    borderColor: 'black',
    borderWidth: 1,
  },
  pressedItem: {
    opacity: 0.5,
  },
});