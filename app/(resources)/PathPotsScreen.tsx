import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, SafeAreaView, FlatList, Pressable, TextInput } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';

interface PathPot {
  name: string;
  urlCode: string;
  category_id: number;
}

export default function PathPotsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<PathPot[]>([]);
  const [searchText, setSearchText] = useState('');

  const searchFunction = (text: string) => {
    setSearchText(text);
  };

  const filteredData = searchText
    ? data.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  useEffect(() => {
    axios.get('https://placements.bsms.ac.uk/api/PathPots')
      .then(({ data }) => {
        console.log("Received data length:", data.length);
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, padding: 24 }}>   
        <Text style={styles.title}>
          ANATOMY PATHOLOGY POTS
        </Text>
        
        <TextInput 
          style={styles.searchBar}
          placeholderTextColor="#000"
          placeholder="Search available pathology pots"
          value={searchText}
          onChangeText={searchFunction}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#bcba40" /> 
        ) : (
          <FlatList 
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Pressable onPress={() => WebBrowser.openBrowserAsync(item.urlCode)}>
                <Text style={styles.itemText}>
                  {item.name}
                </Text>
              </Pressable> 
            )}
            ListEmptyComponent={() => (
              <Text style={{ color: '#FFF', textAlign: 'center' }}>No items found</Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#FFF',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center"
  },
  searchBar: {
    backgroundColor: '#FAD607',
    padding: 12,
    borderRadius: 20,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  itemText: {
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
    marginBottom: 5,
  }
});
