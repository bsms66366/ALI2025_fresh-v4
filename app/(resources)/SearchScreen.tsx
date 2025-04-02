import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, TextInput } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';

interface PathPot {
  name: string;
  urlCode: string;
  id: number;
}

const SearchableDropdown = () => {
  const [searchQuery, setSearchQuery] = useState<string>('Search for Pots here...');
  const [data, setData] = useState<PathPot[]>([]);
  const [filteredData, setFilteredData] = useState<PathPot[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<PathPot[]>('https://placements.bsms.ac.uk/api/PathPots');
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const renderListItem = ({ item }: { item: PathPot }) => (
    <Pressable onPress={() => openUrl(item.urlCode)}>
      <Text style={{ 
        flex: 1,  
        color: '#bcba3e',
        backgroundColor: '#000000',
        borderColor: '#bcba40',
        borderStyle: 'dashed',
        borderRadius: 8,
        borderWidth: 1,
        padding: 8,
        marginVertical: 5,
        marginHorizontal: 8,
        marginBottom: 15
      }}>
        {item.name}
      </Text>
    </Pressable>
  );
  
  const openUrl = async (urlCode: string) => {
    try {
      await WebBrowser.openBrowserAsync(urlCode);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: '#FFF', fontSize: 20, marginTop: 10, marginBottom: 15, textAlign: 'center' }}>
        PATHOLOGY POT CATALOGUE
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Search for Pots here..."
        placeholderTextColor="#666666"
        value={searchQuery}
        onChangeText={handleSearch}
      />
    
      <FlatList
        data={filteredData}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#000000',
  },
  dropdown: {
    borderColor: '#bcba40',
    borderStyle: 'dashed',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  textItem: {
    color: '#FAD607',
    fontSize: 20,
  },
  input: {
    color: "#bcba40",
    borderColor: "#bcba40",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 20
  },
});

export default SearchableDropdown;