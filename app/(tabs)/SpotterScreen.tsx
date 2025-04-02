import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';

interface SpotterItem {
  id: number;
  name: string;
  link: string;
}

export default function SpotterScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<SpotterItem[]>([]);

  useEffect(() => {
    axios.get('https://placements.bsms.ac.uk/api/spotters')
      .then(({ data }) => {
        console.log(data);
        setData(data)
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handlePress = async (link: string) => {
    try {
      await WebBrowser.openBrowserAsync(link);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.rowContainer}>
          {data.map(item => (
            <View key={item.id} style={styles.spotterContainer}>
              <Pressable onPress={() => handlePress(item.link)}>
                <Image source={require('../../assets/images/interfaceIcons_Artboard36.png')} style={styles.image} />
                <Text style={styles.titleText}>{item.name}</Text>
                <Text>ID: {item.id}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  spotterContainer: {
    marginTop: 8,
    width: 250,
    height: 250,
    borderColor: '#bcba40',
    borderStyle: 'dotted',
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  titleText: {
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bcba40',
    textAlign: 'center',
    marginRight: 4,
    paddingLeft: 30,
  },
});
