import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, ViewStyle, TextStyle, ImageStyle, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';

export default function CoursesScreen() {
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
          <Pressable onPress={() => router.push("/(courses)/PAScreen")}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard7.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Physicians Associates</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => router.push('/(courses)/MedNeuroScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard30.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Medical Neuroscience</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => router.push('/(courses)/BioMedScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard31.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Biomedical Science</Text>
          </Pressable>
        </View>
      </View>

      {/* Second Row */}
      <View style={styles.row}>
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => router.push('/(courses)/PostGradScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard32.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Post Graduate</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => router.push('/(courses)/HealthProfScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard22.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Health Professionals</Text>
          </Pressable>
        </View>
  
        <View style={[boxBorderStyle]}>
          <Pressable onPress={() => router.push('/(courses)/PubDisScreen')}>
            <Image 
              source={require('@/assets/images/interfaceIcons_Artboard24.png')} 
              style={[styles.IconStyle, { width: imageSize, height: imageSize }]} 
            />
            <Text style={styles.titleText}>Public Display</Text>
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