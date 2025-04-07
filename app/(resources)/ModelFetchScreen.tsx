import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, Dimensions, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { Ionicons } from '@expo/vector-icons';

// Define model types
interface Model {
  id: string;
  question: string;
  url: string;
  description: string;
  category_id: number;
}

const { width } = Dimensions.get('window');

const ModelFetchScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  // QR Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  
  // Camera permission and device
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  
  // Code scanner setup with debounce
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !scanned && !scanLoading && codes[0].value) {
        handleBarCodeScanned(codes[0].value);
      }
    }
  });

  // Handle QR code scanning with debounce
  const handleBarCodeScanned = async (data: string) => {
    if (scanned || scanLoading) {
      console.log('Scan blocked - already processing');
      return;
    }
    
    try {
      setScanned(true);
      setScanLoading(true);
      setScanError(null);
      
      console.log('QR code scanned:', data);
      
      // Simple validation - ensure it's a URL
      if (!data.startsWith('https')) {
        throw new Error('Invalid QR code. Please scan a QR code with a valid model URL.');
      }
      
      // Extract model URL from QR code
      const modelUrl = data.trim();
      console.log('Model URL from QR code:', modelUrl);
      
      // Check if the URL ends with a valid 3D model extension
      const validExtensions = ['.glb', '.gltf', '.obj', '.fbx'];
      const hasValidExtension = validExtensions.some(ext => modelUrl.toLowerCase().endsWith(ext));
      
      if (!hasValidExtension) {
        throw new Error('Invalid model format. Please scan a QR code with a valid 3D model URL.');
      }
      
      // Prepare to download the model
      const filename = modelUrl.split('/').pop() || 'model.glb';
      const localUri = `${FileSystem.documentDirectory}models/${filename}`;
      
      // Create the models directory if it doesn't exist
      const modelDir = `${FileSystem.documentDirectory}models/`;
      const dirInfo = await FileSystem.getInfoAsync(modelDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(modelDir, { intermediates: true });
      }
      
      // Check if model already exists
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      
      if (fileInfo.exists) {
        // Model already downloaded
        setShowScanner(false);
        await navigateToARScreen(localUri, 'qr_scan');
      } else {
        // Download the model with progress tracking
        console.log('Downloading model from URL:', modelUrl);
        
        const downloadResumable = FileSystem.createDownloadResumable(
          modelUrl,
          localUri,
          {},
          (downloadProgress) => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            setDownloadProgress(progress);
          }
        );
        
        const result = await downloadResumable.downloadAsync();
        if (result) {
          setShowScanner(false);
          await navigateToARScreen(result.uri, 'qr_scan');
        } else {
          throw new Error('Failed to download model');
        }
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      setScanError(error instanceof Error ? error.message : 'Failed to process QR code');
      // Don't reset scanned here to prevent rapid re-scanning
      setTimeout(() => {
        setScanned(false);
      }, 2000); // Add 2-second delay before allowing next scan
    } finally {
      setScanLoading(false);
    }
  };

  // Navigate to AR screen with the downloaded model with error handling
  const navigateToARScreen = async (modelUri: string, source: string) => {
    try {
      // Store the model URI in AsyncStorage
      await AsyncStorage.setItem('currentModelUri', modelUri);
      
      // Get the stored models and add this one if not present
      const storedModels = await AsyncStorage.getItem('downloadedModels');
      const models = storedModels ? JSON.parse(storedModels) : [];
      if (!models.includes(modelUri)) {
        models.push(modelUri);
        await AsyncStorage.setItem('downloadedModels', JSON.stringify(models));
      }

      // Navigate to AR screen with replace to prevent going back to scanner
      router.push({
        pathname: "./ViroARScreen",
        params: { 
          modelUri,
          source,
          timestamp: Date.now() // Add timestamp to force new instance
        }
      });
    } catch (error) {
      console.error('Error storing model URI:', error);
      Alert.alert('Error', 'Failed to prepare model for AR view');
      // Reset scanning state on error
      setScanned(false);
      setScanLoading(false);
    }
  };

  // API URLs
  const API_URL = 'https://placements.bsms.ac.uk/api/physquiz';

  // Fetch available models from server
  const fetchAvailableModels = async () => {
    setIsLoading(true);
    try {
      // Fetch models from the API
      const response = await axios.get(API_URL);

      // Debug: Log the raw API response
      console.log('API Response:', JSON.stringify(response.data).substring(0, 500));

      // Process the API response to extract model information
      const fetchedModels: Model[] = response.data.map((item: any) => {
        // Log each item to see its structure
        console.log('Raw item data:', JSON.stringify(item));

        // Extract the ID
        const id = item.id || String(Math.random());

        // Extract the question from the question field in the database
        let question = 'Unknown Model';
        if (item.question && typeof item.question === 'string' && item.question.trim() !== '') {
          question = item.question;
          console.log(`Model ${id}: Using question field: ${question}`);
        } else if (item.name && typeof item.name === 'string' && item.name.trim() !== '') {
          question = item.name;
          console.log(`Model ${id}: Using name as question: ${question}`);
        } else if (item.title && typeof item.title === 'string' && item.title.trim() !== '') {
          question = item.title;
          console.log(`Model ${id}: Using title as question: ${question}`);
        } else if (item.filename && typeof item.filename === 'string' && item.filename.trim() !== '') {
          question = item.filename;
          console.log(`Model ${id}: Using filename as question: ${question}`);
        }

        // Extract description directly from the database
        const description = item.description || 'No description available';

        // Extract category ID
        const category_id = item.category_id || 0;

        // Get the URL directly from the urlCode field in the database - use it as is
        let modelUrl = '';
        if (item.urlCode && typeof item.urlCode === 'string' && item.urlCode.trim() !== '') {
          // Use the urlCode directly as it's already a complete URL
          modelUrl = item.urlCode;
          console.log(`Model ${id} (${question}): Using URL from urlCode: ${modelUrl}`);
        }

        return {
          id,
          question,
          url: modelUrl,
          description,
          category_id
        };
      });

      console.log('Processed models:', fetchedModels);

      // Store all fetched models
      setModels(fetchedModels);

      // Filter models to only show those with category_id 58 (3D models)
      const filtered = fetchedModels.filter(item => item.category_id === 58);
      console.log('Filtered models count:', filtered.length);
      console.log('First filtered model:', filtered.length > 0 ? filtered[0] : 'None');

      setFilteredModels(filtered);
    } catch (error) {
      console.error('Error fetching models:', error);
      Alert.alert('Error', 'Failed to fetch available models');

      // Fallback to empty array if the API call fails
      setModels([]);
      setFilteredModels([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Download the selected model
  const downloadModel = async () => {
    if (!selectedModel) {
      Alert.alert('Error', 'Please select a model first');
      return;
    }

    setIsLoading(true);
    setDownloadProgress(0);

    try {
      // Create directory for models if it doesn't exist
      const modelDir = `${FileSystem.documentDirectory}models/`;
      const dirInfo = await FileSystem.getInfoAsync(modelDir);

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(modelDir, { intermediates: true });
      }

      // Extract the original filename from the URL or use the question field
      let originalFilename = selectedModel.question;

      // If the URL contains a filename, extract it
      if (selectedModel.url) {
        const urlParts = selectedModel.url.split('/');
        const urlFilename = urlParts[urlParts.length - 1];
        if (urlFilename && urlFilename.includes('.')) {
          originalFilename = urlFilename;
        }
      }

      // Ensure the filename ends with .glb
      if (!originalFilename.toLowerCase().endsWith('.glb')) {
        originalFilename = `${originalFilename}.glb`;
      }

      // Local path to save the model with original filename
      const localUri = `${modelDir}${originalFilename}`;

      // Store model metadata for reference
      await AsyncStorage.setItem('currentModelMetadata', JSON.stringify({
        id: selectedModel.id,
        name: selectedModel.question,
        filename: originalFilename,
        description: selectedModel.description
      }));

      // Check if model already exists
      const fileInfo = await FileSystem.getInfoAsync(localUri);

      if (fileInfo.exists) {
        // Model already downloaded
        navigateToARScreen(localUri, 'model_fetch');
      } else {
        // Download the model with progress tracking
        console.log('Downloading model from URL:', selectedModel.url);

        const downloadResumable = FileSystem.createDownloadResumable(
          selectedModel.url,
          localUri,
          {},
          (downloadProgress) => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            setDownloadProgress(progress);
          }
        );

        const result = await downloadResumable.downloadAsync();
        if (result) {
          navigateToARScreen(result.uri, 'model_fetch');
        } else {
          throw new Error('Download failed');
        }
      }
    } catch (error) {
      console.error('Error downloading model:', error);
      Alert.alert('Error', 'Failed to download the model');
    } finally {
      setIsLoading(false);
    }
  };

  // Open QR Scanner
  const openQRScanner = async () => {
    try {
      // Request camera permission if not already granted
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert('Permission Required', 'Camera permission is needed to scan QR codes');
          return;
        }
      }
      
      setShowScanner(true);
      setScanned(false);
      setScanError(null);
      setDownloadProgress(0);
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      Alert.alert('Error', 'Failed to access camera');
    }
  };

  // QR Scanner Component
  const renderQRScanner = () => {
    return (
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowScanner(false)}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Scan Model QR Code</Text>
          </View>
          
          {scanLoading ? (
            <View style={styles.scannerLoading}>
              <ActivityIndicator size="large" color="#bcba40" />
              <Text style={styles.scannerLoadingText}>Processing QR code...</Text>
            </View>
          ) : !device || !hasPermission ? (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>
                Camera permission is required to scan QR codes
              </Text>
              <TouchableOpacity 
                style={styles.permissionButton}
                onPress={requestPermission}
              >
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Camera
              style={StyleSheet.absoluteFillObject}
              device={device}
              isActive={showScanner && !scanned}
              codeScanner={codeScanner}
            />
          )}
          
          <View style={styles.scannerOverlay}>
            <View style={styles.scanFrame} />
          </View>
          
          <View style={styles.scannerInstructions}>
            <Text style={styles.instructionText}>
              Position QR code within the frame
            </Text>
            {scanError && (
              <Text style={styles.errorText}>{scanError}</Text>
            )}
          </View>
          
          {scanned && !scanLoading && (
            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.downloadProgress}>
            {downloadProgress > 0 && downloadProgress < 1 && (
              <>
                <Text style={styles.downloadText}>
                  Downloading model: {Math.round(downloadProgress * 100)}%
                </Text>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${downloadProgress * 100}%` }
                    ]} 
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Load models when the screen mounts
  useEffect(() => {
    fetchAvailableModels();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>3D Model Selector</Text>
      
      {/* Scan QR Code Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={openQRScanner}
      >
        <Ionicons name="qr-code" size={24} color="white" />
        <Text style={styles.scanButtonText}>Scan QR Code</Text>
      </TouchableOpacity>
      
      {/* Model Selection */}
      <View style={styles.modelSelectionContainer}>
        <Text style={styles.sectionTitle}>Available 3D Models</Text>
        
        {isLoading && filteredModels.length === 0 ? (
          <ActivityIndicator size="large" color="#bcba40" />
        ) : filteredModels.length > 0 ? (
          <ScrollView style={styles.modelList}>
            {filteredModels.map((model) => (
              <TouchableOpacity
                key={model.id}
                style={[
                  styles.modelItem,
                  selectedModel?.id === model.id && styles.selectedModelItem
                ]}
                onPress={() => setSelectedModel(model)}
              >
                <Text style={styles.modelTitle}>{model.question}</Text>
                <Text style={styles.modelDescription}>{model.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noModelsText}>No 3D models available</Text>
        )}
      </View>
      
      {/* Download Progress */}
      {isLoading && downloadProgress > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Downloading: {Math.round(downloadProgress * 100)}%
          </Text>
        </View>
      )}
      
      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, (!selectedModel || isLoading) && styles.disabledButton]}
          onPress={downloadModel}
          disabled={!selectedModel || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Load Selected Model'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
      
      {renderQRScanner()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#bcba40',
    textAlign: 'center',
    marginTop: 20,
  },
  modelSelectionContainer: {
    flex: 1,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#bcba40',
    marginBottom: 10,
  },
  modelList: {
    flex: 1,
  },
  modelItem: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedModelItem: {
    borderColor: '#bcba40',
    backgroundColor: '#2a2a2a',
  },
  modelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bcba40',
    marginBottom: 5,
  },
  modelDescription: {
    fontSize: 14,
    color: '#9D9D9C',
  },
  noModelsText: {
    color: '#9D9D9C',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#bcba40',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#4a4a4a',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  progressText: {
    color: '#bcba40',
    fontSize: 14,
  },
  scanButton: {
    backgroundColor: '#bcba40',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    left: 15,
    padding: 5,
  },
  scannerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: width * 0.35, // Reduced from 70% to 35% for better focus
    height: width * 0.35,
    borderWidth: 2,
    borderColor: '#bcba40',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  scannerInstructions: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 15,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#bcba40',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scannerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  scannerLoadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
  },
  downloadProgress: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  downloadText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  progressBarContainer: {
    width: '80%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#bcba40',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: '#bcba40',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ModelFetchScreen;
