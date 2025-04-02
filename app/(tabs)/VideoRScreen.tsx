import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, ViewStyle } from 'react-native';
import { router } from 'expo-router';

const createBoxBorderStyle = (height: number, width: number): ViewStyle => ({
    marginTop: 30,
    width: (width / 3) - 10,
    height: '40%',
    borderColor: '#bcba40',
    borderStyle: 'dotted',
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
});

export default function VideoRScreen() {
    const { height, width } = Dimensions.get('window');
    return (
        <View style={styles.v_container}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                <View style={createBoxBorderStyle(height, width)}>
                    <TouchableOpacity onPress={() => router.push('/(videos)/IntroductionsScreen')}>
                        <Image source={require('../../assets/images/interfaceIcons_Artboard25.png')} style={styles.IconStyle} />
                        <Text style={styles.titleText}>INTRODUCTION TO...</Text>
                    </TouchableOpacity>
                </View>
                <View style={createBoxBorderStyle(height, width)}>
                    <TouchableOpacity onPress={() => router.push('/(videos)/HeadNeckScreen')}>
                        <Image source={require('../../assets/images/interfaceIcons_Artboard4.png')} style={styles.IconStyle} />
                        <Text style={styles.titleText}>HEAD AND NECK</Text>
                    </TouchableOpacity>
                </View>
                <View style={createBoxBorderStyle(height, width)}>
                    <TouchableOpacity onPress={() => router.push('/(videos)/ENTScreen')}>
                        <Image source={require('../../assets/images/interfaceIcons_Artboard35.png')} style={styles.IconStyle} />
                        <Text style={styles.titleText}>EAR NOSE AND THROAT</Text>
                    </TouchableOpacity>
                </View>
                <View style={createBoxBorderStyle(height, width)}>
                    <TouchableOpacity onPress={() => router.push('/(videos)/ThoraxScreen')}>
                        <Image source={require('../../assets/images/interfaceIcons_Artboard2.png')} style={styles.IconStyle} />
                        <Text style={styles.titleText}>THORAX</Text>
                    </TouchableOpacity>
                </View>
                <View style={createBoxBorderStyle(height, width)}>
                    <TouchableOpacity onPress={() => router.push('/(videos)/AbdoPelvisScreen')}>
                        <Image source={require('../../assets/images/interfaceIcons_Artboard24.png')} style={styles.IconStyle} />
                        <Text style={styles.titleText}>ABDOMEN AND PELVIS</Text>
                    </TouchableOpacity>
                </View>
                <View style={createBoxBorderStyle(height, width)}>
                    <TouchableOpacity onPress={() => router.push('/(videos)/BackLimbsScreen')}>
                        <Image source={require('../../assets/images/interfaceIcons_Artboard6.png')} style={styles.IconStyle} />
                        <Text style={styles.titleText}>BACK AND LIMBS</Text>
                    </TouchableOpacity>
                </View>
                <View style={createBoxBorderStyle(height, width)}>
                    <TouchableOpacity onPress={() => router.push('/(videos)/EmbryologyScreen')}>
                        <Image source={require('../../assets/images/interfaceIcons_Artboard1.png')} style={styles.IconStyle} />
                        <Text style={styles.titleText}>EMBRYOLOGY</Text>
                    </TouchableOpacity>
                </View>
                <View style={createBoxBorderStyle(height, width)}>
                    <TouchableOpacity onPress={() => router.push('/(videos)/Video360Screen')}>
                        <Image source={require('../../assets/images/interfaceIcons_Artboard28.png')} style={styles.IconStyle} />
                        <Text style={styles.titleText}>360 VIDEO</Text>
                    </TouchableOpacity>
                </View>
                <View style={createBoxBorderStyle(height, width)}>
                    <TouchableOpacity onPress={() => router.push('/(courses)/PubDisScreen')}>
                        <Image source={require('../../assets/images/interfaceIcons_Artboard34.png')} style={styles.IconStyle} />
                        <Text style={styles.titleText}>PUBLIC DISPLAY</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        width: 950,
        paddingTop: 60,
        paddingLeft: 20,
        justifyContent: 'center',
    },
    Logo: {
        height: 80,
        alignItems: 'center',
    },
    IconStyle: {
        width: 110,
        height: 110,
        alignItems: 'center',
        justifyContent: 'center',
    },
    v_container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 5,
        backgroundColor: '#000000',
    },
    titleText: {
        fontFamily: 'Helvetica',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#bcba40',
        justifyContent: 'center',
        paddingLeft: 30,
    },
});