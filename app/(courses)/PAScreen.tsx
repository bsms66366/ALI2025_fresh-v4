import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Pressable, FlatList } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import axios from 'axios';

interface Note {
  category_id: number;
  name: string;
  urlCode: string;
}

export default function PAScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Note[]>([]);
  const filteredData = data.filter(item => item.category_id === 2);

  useEffect(() => {
    axios
      .get<Note[]>('https://placements.bsms.ac.uk/api/Notes')
      .then(({ data }) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#000' }}>
      <Text style={{ color: '#FFF', fontSize: 20, marginTop: 10, marginBottom: 15, textAlign: 'center' }}>
        PHYSICIANS ASSOCIATES PROGRAM
      </Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <Pressable onPress={() => WebBrowser.openBrowserAsync(item.urlCode)}>
              <Text
                style={{
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
                }}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}
