import { StyleSheet } from 'react-native';
import { View } from '../../components/Themed';
import SearchScreen from '../screens/SearchScreen';

export default function TabSearchScreen() {
  return (
    <View style={styles.container}>
      <SearchScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
