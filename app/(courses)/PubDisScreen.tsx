import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, FlatList, Pressable, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';

export default function App() {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const filteredData = data.filter(item => item.category_id === 18);

  useEffect(() => {
    axios.get('https://placements.bsms.ac.uk/api/Dissection')
      .then(({ data }) => {
        console.log(data);
        setData(data)
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 15, backgroundColor: '#000' }}>
      <Image source={require('../../assets/images/interfaceIcons_Artboard34.png')} style={{ width: 250, height: 250, justifyContent: 'center' }} />
      <Text style={{ color: '#FFF', fontSize: 20, marginTop: 10, marginBottom:15, textAlign:"center"}}>PUBLIC DISPLAY VIDEOS</Text>
      {isLoading ? <ActivityIndicator /> : (
        <FlatList 
          data={filteredData}
          renderItem={({ item }) => (
            <Pressable onPress={() => WebBrowser.openBrowserAsync(item.video)}>
              <Text style={styles.listItem}>{item.name}</Text>
            </Pressable> 
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listItem: {
    flex: 1,  
    color: '#bcba40',
    backgroundColor: '#000',
    borderColor: '#bcba40',
    borderStyle: 'dotted',
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
    marginHorizontal: 8,
    marginBottom: 5
  },
  Logo: {
    height: 80,
    alignItems: 'center',
  }
});
