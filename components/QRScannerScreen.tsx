import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, Animated, Button, Dimensions } from "react-native";
import { Camera, useCameraDevice, useCodeScanner, Code } from 'react-native-vision-camera';
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function QRScannerScreen() {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Progress bar animation
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'granted');
    })();
  }, []);

  // Code scanner setup
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !scanned && codes[0].value) {
        handleBarCodeScanned(codes[0]);
      }
    }
  });

  // Start progress animation when loading
  useEffect(() => {
    if (loading) {
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }
  }, [loading]);

  // Function to validate if a URL points to a 3D model
  const isValidModelUrl = (url: string): boolean => {
    if (url.match(/\.(glb|gltf|obj|fbx)$/i)) {
      return true;
    }
    if (url.includes('model=') || url.includes('modelUrl=')) {
      return true;
    }
    return false;
  };

  // Extract model URL from QR code data
  const extractModelUrl = (data: string): string => {
    if (data.startsWith('http://') || data.startsWith('https://')) {
      return data;
    }
    const urlMatch = data.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      return urlMatch[0];
    }
    return data;
  };

  // Save model URL to AsyncStorage
  const saveModelUrl = async (modelUrl: string) => {
    try {
      await AsyncStorage.removeItem('currentModelUri');
      await AsyncStorage.removeItem('currentModelMetadata');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await AsyncStorage.setItem('currentModelUri', modelUrl);
      await AsyncStorage.setItem('currentModelMetadata', JSON.stringify({
        source: 'qr',
        timestamp: new Date().toISOString()
      }));
      
      return true;
    } catch (error) {
      console.error('Error saving model URL:', error);
      return false;
    }
  };

  const handleBarCodeScanned = async (code: Code) => {
    if (scanned || !code.value) return;
    
    setScanned(true);
    setLoading(true);
    setError(null);

    try {
      const modelUrl = extractModelUrl(code.value);
      
      if (!isValidModelUrl(modelUrl)) {
        throw new Error('Invalid model URL format');
      }

      const saved = await saveModelUrl(modelUrl);
      if (!saved) {
        throw new Error('Failed to save model URL');
      }

      // Add a small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to AR view
      router.replace({
        pathname: '/(ar)/ViroARScreen',
        params: {
          modelUri: modelUrl,
          source: 'qr_scan',
          timestamp: Date.now()
        }
      });
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process QR code');
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission denied</Text>
        <Button title="Request Permission" onPress={() => Camera.requestCameraPermission()} />
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!scanned}
        codeScanner={codeScanner}
      />
      
      {/* Scanning overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          {loading && (
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          )}
        </View>
      </View>

      {/* Status messages */}
      <View style={styles.messageContainer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text style={styles.text}>
            {loading ? 'Processing...' : 'Position QR code in the center'}
          </Text>
        )}
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const scanAreaSize = width * 0.35; // Reduced scan area size to 35% of screen width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: scanAreaSize,
    height: scanAreaSize,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  messageContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
  },
  progressBar: {
    height: 2,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    bottom: -2,
    left: 0,
  },
});