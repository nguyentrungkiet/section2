import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Text, 
  Modal, 
  TextInput, 
  Pressable, 
  Alert, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GoalItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function App() {
  const [courseGoals, setCourseGoals] = useState<GoalItem[]>([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [enteredGoal, setEnteredGoal] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const addGoalHandler = () => {
    if (enteredGoal.trim().length === 0) {
      return;
    }
    setCourseGoals(currentGoals => [...currentGoals, { id: Math.random().toString(), text: enteredGoal, completed: false }]);
    setEnteredGoal('');
    setIsAddMode(false);
  };

  const removeGoalHandler = (id: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa mục tiêu này không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: () => {
          setCourseGoals(currentGoals => currentGoals.filter(goal => goal.id !== id));
        }}
      ]
    );
  };

  const toggleGoalCompletion = (id: string) => {
    setCourseGoals(currentGoals =>
      currentGoals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const cancelAddGoalHandler = () => {
    setIsAddMode(false);
    setEnteredGoal('');
  };

  const renderGoalItem = useCallback(({ item }: { item: GoalItem }) => {
    return (
      <View style={styles.goalItem}>
        <View style={styles.goalTextContainer}>
          <Pressable
            onPress={() => toggleGoalCompletion(item.id)}
            style={({ pressed }) => pressed && styles.pressedItem}
          >
            <View style={[styles.listItem, item.completed && styles.completedItem]}>
              <Text style={[styles.goalText, item.completed && styles.completedText]}>{item.text}</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, item.completed ? styles.completedButton : styles.incompleteButton]}
            onPress={() => toggleGoalCompletion(item.id)}
          >
            <Ionicons name={item.completed ? "checkmark-circle" : "ellipse-outline"} size={24} color="white" />
            <Text style={styles.buttonText}>{item.completed ? "Hoàn thành" : "Chưa hoàn thành"}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => removeGoalHandler(item.id)}
          >
            <Ionicons name="trash-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [toggleGoalCompletion, removeGoalHandler]);

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddMode(true)}>
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.addButtonText}>Thêm mục tiêu mới</Text>
      </TouchableOpacity>
      <Modal visible={isAddMode} animationType="slide">
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nhập mục tiêu của bạn"
            style={styles.input}
            onChangeText={setEnteredGoal}
            value={enteredGoal}
          />
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cancelAddGoalHandler}>
              <Text style={styles.buttonText}>HỦY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.addModalButton]} onPress={addGoalHandler}>
              <Text style={styles.buttonText}>THÊM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        keyExtractor={(item) => item.id}
        data={courseGoals}
        renderItem={renderGoalItem}
      />
      <View style={styles.copyrightContainer}>
        <Text style={styles.copyrightText}>Kiệt NoPro</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 50,
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  addModalButton: {
    backgroundColor: '#4CAF50',
  },
  goalItem: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  goalTextContainer: {
    padding: 15,
  },
  listItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  completedItem: {
    backgroundColor: '#e0e0e0',
  },
  goalText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  incompleteButton: {
    backgroundColor: '#2196F3',
  },
  completedButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  pressedItem: {
    opacity: 0.7,
  },
  copyrightContainer: {
    padding: 10,
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});