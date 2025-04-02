import { StyleSheet, Text, View, Image, Pressable, ViewStyle, TextStyle, ImageStyle, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

export default function ModulesScreen() {
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
          <Pressable onPress={() => router.push("/(modules)/Module102Screen")}>
            <Image 
              source={require('../../assets/images/interfaceIcons_Artboard1.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Module 102</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => router.push('/(modules)/Module103Screen')}>
            <Image 
              source={require('../../assets/images/interfaceIcons_Artboard2.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Module 103</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => router.push('/(modules)/Module104Screen')}>
            <Image 
              source={require('../../assets/images/interfaceIcons_Artboard3.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Module 104</Text>
          </Pressable>
        </View>
      </View>

      {/* Second Row */}
      <View style={styles.row}>
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => router.push('/(modules)/Module202Screen')}>
            <Image 
              source={require('../../assets/images/interfaceIcons_Artboard4.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Module 202</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => router.push('/(modules)/Module203Screen')}>
            <Image 
              source={require('../../assets/images/interfaceIcons_Artboard5.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Module 203</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => router.push('/(modules)/Module204Screen')}>
            <Image 
              source={require('../../assets/images/interfaceIcons_Artboard6.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Module 204</Text>
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