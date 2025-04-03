import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform, NativeSyntheticEvent, ImageSourcePropType, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroNode,
  ViroMaterials,
  ViroErrorEvent,
  ViroPinchStateTypes,
  ViroRotateStateTypes,
} from '@reactvision/react-viro';
import { useLocalSearchParams, router } from 'expo-router';

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
};

// Material configuration for GLB models
const configureMeshMaterials = () => {
  try {
    if (!ViroMaterials) {
      console.error('ViroMaterials is not defined');
      return false;
    }

    // Create material with PBR properties suitable for GLB
    ViroMaterials.createMaterials({
      modelMaterial: {
        diffuseColor: '#808080',  // Medium gray base color
        lightingModel: 'Blinn',  // Use Blinn lighting model
        blendMode: 'Add'         // Additive blending for better detail
      }
    });

    console.log('GLB material created');
    return true;
  } catch (error) {
    console.error('Error in configureMeshMaterials:', error);
    return false;
  }
};

// Download model to local file system
const downloadModel = async (
  uri: string, 
  onProgress: (progress: number) => void
): Promise<string> => {
  try {
    // Create a unique filename based on the URI
    const filename = `model_${Date.now()}_${uri.split('/').pop() || 'model.glb'}`;
    const modelDir = `${FileSystem.documentDirectory}models/`;
    const localUri = `${modelDir}${filename}`;

    // Create models directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(modelDir);
    if (!dirInfo.exists) {
      console.log('Creating models directory:', modelDir);
      await FileSystem.makeDirectoryAsync(modelDir, { intermediates: true });
    }

    // Check if we already have this model downloaded
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      console.log('Model already exists locally:', localUri);
      return localUri;
    }

    console.log('Downloading model:', uri, 'to', localUri);
    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      localUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        console.log(`Download progress: ${Math.round(progress * 100)}%`);
        onProgress(progress);
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result?.uri) {
      throw new Error('Download failed - no URI in result');
    }

    // Verify the downloaded file
    const downloadedFileInfo = await FileSystem.getInfoAsync(result.uri);
    if (!downloadedFileInfo.exists || downloadedFileInfo.size === 0) {
      throw new Error('Downloaded file is empty or missing');
    }

    console.log('Model downloaded successfully:', result.uri);
    return result.uri;
  } catch (error) {
    console.error('Error downloading model:', error);
    throw error;
  }
};

// Type for ViroARSceneNavigator props
type ViroARSceneNavigatorProps = {
  initialScene: {
    scene: React.ComponentType<SceneProps>;
  };
  viroAppProps: {
    modelUri: string;
  };
  autofocus?: boolean;
  style?: any;
};

// Type for scene props from ViroARSceneNavigator
type SceneProps = {
  sceneNavigator: {
    viroAppProps: {
      modelUri: string;
    };
  };
};

// Type for ARScene props
type ARSceneProps = SceneProps & {
  onError: (error: unknown) => void;
  onLoadStart: () => void;
  onLoadEnd: () => void;
};

// LoadingIndicator component
const LoadingIndicator: React.FC<{ progress?: number; message: string }> = ({ progress, message }) => (
  <View style={styles.loadingBox}>
    <Text style={styles.loadingText}>{message}</Text>
    {progress !== undefined && (
      <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
    )}
  </View>
);

// ARScene component
const ARScene: React.FC<ARSceneProps> = (props) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const mounted = useRef(true);
  
  // Initial scale that matches the larynx model
  const INITIAL_SCALE: [number, number, number] = [0.05, 0.05, 0.05];





  // State for model transformations
  const [scale, setScale] = useState<[number, number, number]>(INITIAL_SCALE);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (modelLoaded) {
      // Materials are loaded from the GLB file
    }
  }, [modelLoaded]);

  const handleError = (event: NativeSyntheticEvent<ViroErrorEvent>) => {
    if (mounted.current) {
      props.onError(event.nativeEvent);
    }
  };

  const handleLoadStart = () => {
    if (mounted.current) {
      props.onLoadStart();
    }
  };

  const handleLoadEnd = () => {
    if (mounted.current) {
      console.log('Model load end triggered');
      
      // Configure materials first
      const materialsConfigured = configureMeshMaterials();
      console.log('Materials configured:', materialsConfigured);
      
      // Reset transformations
      setScale(INITIAL_SCALE);
      setPosition([0, 0, 0]);
      setRotation([0, 0, 0]);
      
      // Set model as loaded
      setModelLoaded(true);
      
      console.log({
        modelUri: props.sceneNavigator.viroAppProps.modelUri,
        materialName: 'modelMaterial',
        scale: INITIAL_SCALE
      });
      
      props.onLoadEnd();
    }
  };

  // Handle pinch to zoom
  const onPinch = (pinchState: ViroPinchStateTypes, scaleFactor: number, source: ImageSourcePropType) => {
    if (pinchState === ViroPinchStateTypes.PINCH_START || pinchState === ViroPinchStateTypes.PINCH_MOVE) {
      // Calculate new scale but maintain aspect ratio
      const newScale: [number, number, number] = [scale[0] * scaleFactor, scale[1] * scaleFactor, scale[2] * scaleFactor];
      
      // Optional: Add min/max scale limits to prevent the model from getting too small or too large
      const MIN_SCALE = 0.01;
      const MAX_SCALE = 0.5;
      
      if (newScale[0] >= MIN_SCALE && newScale[0] <= MAX_SCALE) {
        setScale(newScale);
      }
    }
  };

  // Handle drag to move
  const onDrag = (draggedToPosition: [number, number, number], source: ImageSourcePropType) => {
    if (draggedToPosition) {
      setPosition(draggedToPosition);
    }
  };

  // Handle rotation
  const onRotate = (rotateState: ViroRotateStateTypes, rotationFactor: number, source: ImageSourcePropType) => {
    if (rotateState === ViroRotateStateTypes.ROTATE_START || rotateState === ViroRotateStateTypes.ROTATE_MOVE) {
      const newRotation: [number, number, number] = [rotation[0], rotation[1] + rotationFactor, rotation[2]];
      setRotation(newRotation);
    }
  };

  return (
    <ViroARScene>
      <ViroAmbientLight color="#ffffff" intensity={200} />
      <ViroSpotLight
        position={[0, 3, 0]}
        color="#ffffff"
        direction={[0, -1, 0]}
        attenuationStartDistance={5}
        attenuationEndDistance={10}
        innerAngle={5}
        outerAngle={20}
        castsShadow={true}
      />
      <ViroNode 
        position={[0, -1, -3]}
        onPinch={onPinch}
        onRotate={onRotate}
        dragType="FixedToWorld"
        onDrag={onDrag}
      >
        <ViroAmbientLight color="#ffffff" intensity={200}/>
        <ViroSpotLight
          innerAngle={5}
          outerAngle={25}
          direction={[0, -1, 0]}
          position={[0, 3, 0]}
          color="#ffffff"
          intensity={500}
        />
        <ViroSpotLight
          innerAngle={5}
          outerAngle={25}
          direction={[0, 0, -1]}
          position={[0, 0, 3]}
          color="#ffffff"
          intensity={500}
        />
        <Viro3DObject
          source={{ uri: props.sceneNavigator.viroAppProps.modelUri }}
          type="GLB"
          scale={scale}
          position={position}
          rotation={rotation}
          materials={['modelMaterial']}
          highAccuracyEvents={true}
          onError={(event) => {
            console.log('Model error:', event.nativeEvent);
            handleError(event);
          }}
          onLoadStart={() => {
            console.log('Model load starting');
            handleLoadStart();
          }}
          onLoadEnd={() => {
            console.log('Model load complete');
            handleLoadEnd();
          }}
        />
      </ViroNode>
    </ViroARScene>
  );
};

// Main ViroARScreen component
const ViroARScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [localModelUri, setLocalModelUri] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const modelUri = params.modelUri as string;
  const mounted = useRef(true);

  useEffect(() => {
    // Cleanup function
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const initializeModel = async () => {
      if (!modelUri) {
        setError('No model URI provided');
        return;
      }

      try {
        setIsDownloading(true);
        setError(null);

        // Validate the model URI
        if (!modelUri.startsWith('file://') && !modelUri.startsWith('https://')) {
          throw new Error('Invalid model URI format');
        }

        // If the URI is already a local file, use it directly
        if (modelUri.startsWith('file://')) {
          const fileInfo = await FileSystem.getInfoAsync(modelUri);
          if (!fileInfo.exists) {
            throw new Error('Local model file not found');
          }
          if (mounted.current) {
            setLocalModelUri(modelUri);
          }
          return;
        }

        // Download the model if it's a remote URL
        const localUri = await downloadModel(modelUri, (progress) => {
          if (mounted.current) {
            setDownloadProgress(progress);
          }
        });

        if (mounted.current) {
          setLocalModelUri(localUri);
        }
      } catch (error) {
        console.error('Error initializing model:', error);
        if (mounted.current) {
          setError(getErrorMessage(error));
        }
      } finally {
        if (mounted.current) {
          setIsDownloading(false);
        }
      }
    };

    initializeModel();
  }, [modelUri]);

  const handleLoadStart = () => {
    if (mounted.current) {
      setIsLoading(true);
      setError(null);
    }
  };

  const handleLoadEnd = () => {
    if (mounted.current) {
      setIsLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    console.error('AR Scene error:', error);
    if (mounted.current) {
      setError(getErrorMessage(error));
      setIsLoading(false);
    }
  };

  const handleResourcesNav = () => {
    // Clean up and navigate to resources screen
    setLocalModelUri(null);
    setError(null);
    router.push("/(resources)/ModelFetchScreen");
  };

  if (!localModelUri && !isDownloading && !error) {
    return (
      <View style={styles.container}>
        <LoadingIndicator message="Initializing AR..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 }]}>
          <Pressable style={[styles.button, { backgroundColor: '#fff' }]} onPress={handleResourcesNav}>
            <FontAwesome name="book" size={18} color="#25292e" style={styles.buttonIcon} />
            <Text style={[styles.buttonLabel, { color: '#25292e' }]}>Resources</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {localModelUri && (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: () => (
              <ARScene
                sceneNavigator={{ viroAppProps: { modelUri: localModelUri || '' } }}
                onError={handleError}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
              />
            ),
          }}
          viroAppProps={{
            modelUri: localModelUri,
          }}
          style={styles.arView}
        />
      )}

      {(isLoading || isDownloading) && (
        <LoadingIndicator
          progress={isDownloading ? downloadProgress : undefined}
          message={isDownloading ? "Downloading model..." : "Loading model..."}
        />
      )}

      <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 }]}>
        <Pressable 
          style={[styles.button, { backgroundColor: '#fff' }]} 
          onPress={() => router.replace('/(resources)/ModelFetchScreen')}
        >
          <FontAwesome name="book" size={18} color="#25292e" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>Resources</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ViroARScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  arView: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8,
    maxWidth: 300,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  errorContainer: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8,
    maxWidth: 300,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    width: 120,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
