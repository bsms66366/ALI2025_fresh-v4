// Types
export type LightingModel = 'Blinn' | 'Lambert' | 'Phong' | 'Constant';

export type MaterialConfig = {
  lightingModel: LightingModel;
  diffuseColor: string;
  shininess: number;
};

export type ModelScale = [number, number, number];

// Material definitions for anatomical models
export const AnatomyMaterials: Record<string, MaterialConfig> = {
  default: {
    lightingModel: 'Blinn',
    diffuseColor: '#FFFFFF',
    shininess: 0.5,
  },
  muscleMaterial: {
    lightingModel: 'Lambert',
    diffuseColor: '#8B0000',
    shininess: 0.3,
  },
  cartilageMaterial: {
    lightingModel: 'Blinn',
    diffuseColor: '#E6E6FA',
    shininess: 0.7,
  },
  tissueMaterial: {
    lightingModel: 'Lambert',
    diffuseColor: '#FFE4E1',
    shininess: 0.2,
  },
};

// Scale mapping for different models
export const MODEL_SCALES: Record<string, ModelScale> = {
  'larynx_with_muscles_and_ligaments.glb': [0.05, 0.05, 0.05],
  'default': [0.4, 0.4, 0.4],
};

// Helper function to get scale for a model
export const getModelScale = (uri: string): ModelScale => {
  const filename = uri.split('/').pop() || '';
  return MODEL_SCALES[filename] || MODEL_SCALES.default;
};

// Mapping of mesh names to materials
export const MeshMaterialMap: Record<string, string> = {
  // Default mappings - update these based on your model's actual mesh names
  'muscle': 'muscleMaterial',
  'cartilage': 'cartilageMaterial',
  'tissue': 'tissueMaterial',
  // Add more mappings as needed
};
