//import React from "react";
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, RefreshControl, StyleSheet, Text, SafeAreaView, Button, FlatList, Pressable } from 'react-native';
//import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import {
  Dimensions,
  Image,
  //Slider,
  //SafeAreaView,
  
  Alert,
  TextInput
 
  //VirtualizedList
} from "react-native";
import { Asset } from "expo-asset";
import Constants from 'expo-constants';
import { Audio, Video } from "expo-av";
import * as Font from "expo-font";
//import List from "../components/List2";
import { MaterialIcons } from "@expo/vector-icons";
//import SearchBar from 'react-native-searchbar';
import axios from 'axios';

interface DissectionVideo {
  category_id: number;
  name: string;
  video: string;
}

export default function App() {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<DissectionVideo[]>([]);
  const filteredData = data.filter(item => item.category_id === 31);

  useEffect(() => {
  axios.get('https://placements.bsms.ac.uk/api/Dissection')
    //axios.get('http://192.168.1.20:8000/api/Video')
    //axios.get('http://127.0.0.1:8000/api/placements')
      .then(({ data }) => {
        console.log(data);
        //console.log("defaultApp -> data", data.name)
        setData(data)
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 15, backgroundColor: '#000', }}>
    <Image source={require('../../assets/images/interfaceIcons_Artboard28.png')}style={{ width: 250, height: 250, justifyContent: 'center',}} />
    <Text style={{ color: '#FFF', fontSize: 20, marginTop: 10, marginBottom:15, textAlign:"center"}}>360 DISSECTION VIDEOS</Text>
      {isLoading ? <ActivityIndicator /> : (
        <FlatList 
          data={filteredData}
          renderItem={({ item }) =>  {
            console.log("item", item)
            return ( 
            
                <Pressable onPress = {() => WebBrowser.openBrowserAsync(item.video)}>
               
               <Text style={{ flex: 1,  
              color:'#bcba40',
              backgroundColor: '#000',
                borderColor: '#bcba40',
                borderStyle:'dotted',
                borderRadius: 8,
                borderWidth: 1,
                padding: 8,
                marginVertical: 5,
                marginHorizontal: 8,
                marginBottom: 5
                }}>{item.name}
                </Text>
              
              </Pressable> 
           
            )
          }}
          
        />
      )}
    </View>
   
  );

 


//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
    backgroundColor: '#000',
  },

item: {
  backgroundColor: '#FAD607',
  borderRadius: 20,
  padding: 8,
  marginVertical: 5,
  marginHorizontal: 8,
  marginBottom: 15,
},
Logo: {
  height: 80,
  alignItems: 'center',
},
name: {
  fontFamily: 'Verdana',
  fontSize: 20,
  //fontWeight: "bold",
  color: "#000",

},
button: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 32,
  borderRadius: 20,
  elevation: 3,
  backgroundColor: 'black',
},
/*   listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#bcba40',
  //borderColor: '#FAD607',
  //paddingTop: 5,
  borderRadius: 20,
  padding: 15,
  marginVertical: 5,
  marginHorizontal: 8,
  marginBottom: 15,
  alignItems: 'center', 
  fontWeight: 'bold',
  fontFamily: 'Verdana',
  //fontFamily: 'Roboto-Regular',
  fontSize: 20, 
 }, */
});

}
