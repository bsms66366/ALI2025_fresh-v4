import { ViroMaterials } from '@reactvision/react-viro';

export interface MaterialConfig {
  diffuseColor?: string;
  lightingModel?: 'Blinn' | 'Phong' | 'Lambert' | 'Constant';
  blendMode?: 'Add' | 'Multiply' | 'Screen' | 'None';
  specularColor?: string;
  shininess?: number;
  fresnelExponent?: number;
  opacity?: number;
}

export const MaterialPresets = {
  default: {
    diffuseColor: '#808080',
    lightingModel: 'Blinn',
    blendMode: 'None',
    shininess: 0.5,
    specularColor: '#444444'
  },
  // Specific presets for anatomical models
  muscle: {
    diffuseColor: '#8B0000', // Dark red for muscle tissue
    lightingModel: 'Lambert',
    blendMode: 'None',
    shininess: 0.3,
    specularColor: '#330000'
  },
  cartilage: {
    diffuseColor: '#E6E6FA', // Light purple for cartilage
    lightingModel: 'Blinn',
    blendMode: 'None',
    shininess: 0.7,
    opacity: 0.9,
    specularColor: '#FFFFFF'
  },
  bone: {
    diffuseColor: '#F5F5DC', // Beige for bone
    lightingModel: 'Blinn',
    blendMode: 'None',
    shininess: 0.4,
    specularColor: '#FFFFF0'
  },
  tissue: {
    diffuseColor: '#FFE4E1', // Soft pink for tissue
    lightingModel: 'Lambert',
    blendMode: 'None',
    shininess: 0.2,
    opacity: 0.95
  },
  membrane: {
    diffuseColor: '#FFF5EE', // Light cream for membranes
    lightingModel: 'Lambert',
    blendMode: 'None',
    opacity: 0.85,
    shininess: 0.1
  }
} as const;

export const configureMaterials = (customMaterials?: Record<string, MaterialConfig>) => {
  try {
    if (!ViroMaterials) {
      console.error('ViroMaterials is not defined');
      return false;
    }

    // Create base materials
    const baseMaterials = {
      default: MaterialPresets.default,
      muscle: MaterialPresets.muscle,
      cartilage: MaterialPresets.cartilage,
      bone: MaterialPresets.bone,
      tissue: MaterialPresets.tissue,
      membrane: MaterialPresets.membrane,
      ...customMaterials
    };

    ViroMaterials.createMaterials(baseMaterials);
    console.log('Materials configured successfully');
    return true;
  } catch (error) {
    console.error('Error configuring materials:', error);
    return false;
  }
};

export const getMaterialForType = (type: keyof typeof MaterialPresets) => {
  return MaterialPresets[type];
};

// Default export of the materials configuration system
const MaterialsSystem = {
  MaterialPresets,
  configureMaterials,
  getMaterialForType
};

export default MaterialsSystem;
