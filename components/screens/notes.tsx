import { StyleSheet } from 'react-native';
import { View } from '../../components/Themed';
import NotesScreen from '../screens/NotesScreen';

export default function TabNotesScreen() {
  return (
    <View style={styles.container}>
      <NotesScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
