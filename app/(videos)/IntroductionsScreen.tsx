import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, FlatList, Pressable, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';

// Define the type for our video data
interface VideoItem {
  id: number;
  name: string;
  video: string;
  category_id: number;
}

export default function Page() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<VideoItem[]>([]);
  const filteredData = data.filter(item => item.category_id === 30);

  useEffect(() => {
    axios.get('https://placements.bsms.ac.uk/api/Dissection')
      .then(({ data }) => {
        console.log('API Response:', data);
        setData(data)
      })
      .catch((error) => {
        console.error('API Error:', error);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const keyExtractor = (item: VideoItem) => item.id.toString();
  
  const renderEmptyList = () => (
    <Text style={styles.emptyText}>No videos available</Text>
  );

  const renderItem = ({ item }: { item: VideoItem }) => (
    <Pressable onPress={() => WebBrowser.openBrowserAsync(item.video)}>
      <Text style={styles.listItem}>{item.name}</Text>
    </Pressable> 
  );

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/interfaceIcons_Artboard25.png')}
        style={styles.headerImage} 
      />

      <Text style={styles.headerText}>
        INTRODUCTION TO DISSECTION VIDEOS
      </Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#bcba40" />
      ) : (
        <FlatList 
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
        />
      )}
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
    alignItems: 'center',
  },
  headerImage: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  headerText: {
    color: '#FFF',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  list: {
    width: '100%',
  },
  listContainer: {
    flexGrow: 1,
    width: '100%',
  },
  listItem: {
    color: '#bcba40',
    backgroundColor: '#000',
    borderColor: '#bcba40',
    borderStyle: 'dotted',
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    marginVertical: 5,
    width: '100%',
  },
  emptyText: {
    color: '#bcba40',
    textAlign: 'center',
    marginTop: 20,
  }
});
