import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, ViewStyle, TextStyle, ImageStyle, useWindowDimensions } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

export default function RegionsScreen({ navigation }: { navigation: NavigationProp<ParamListBase, string> }) {
  const { width, height } = useWindowDimensions();
  
  const itemWidth = (width / 3) - 45;
  const imageSize = itemWidth * 0.55;

  const boxBorderStyle: ViewStyle = {
    width: itemWidth,
    aspectRatio: 1,
    borderColor: '#bcba40',
    borderStyle: 'dotted' as const,
    borderRadius: 8,
    borderWidth: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  };

  return (
    <View style={styles.container}>
      {/* First Row */}
      <View style={styles.row}>
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => navigation.navigate('CortexScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard19.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Cortex</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => navigation.navigate('BasalGangliaScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard20.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Basal Ganglia</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => navigation.navigate('HippocampusScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard21.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Hippocampus</Text>
          </Pressable>
        </View>
      </View>

      {/* Second Row */}
      <View style={styles.row}>
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => navigation.navigate('ThalamusScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard22.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Thalamus</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => navigation.navigate('HypothalamusScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard23.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Hypothalamus</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => navigation.navigate('AmygdalaScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard24.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Amygdala</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type Styles = {
  container: ViewStyle;
  row: ViewStyle;
  IconStyle: ImageStyle;
  titleText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  
  IconStyle: {
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  titleText: {
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#bcba40',
    textAlign: 'center',
    marginTop: 8,
  },
});