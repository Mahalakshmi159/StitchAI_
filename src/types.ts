export type DifficultyLevel = 'beginner' | 'intermediate' | 'master';

export type FabricType = 'denim' | 'silk' | 'cotton' | 'techwear' | 'smart_textile';

export type CraftStyle = 'embroidery' | 'quilting' | 'upcycling' | 'patchwork';

export type GarmentType = 'jacket' | 'vest' | 'hoodie' | 'kimono' | 'tote';

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type FabricWidth = 44 | 54 | 60;

export interface SeamConfig {
  accentColor: string; // Hex color code
  accentName: string;
  threadType: string;
  stitchLength: number; // in mm, e.g. 1.0 to 5.0
  stitchPattern: 'straight' | 'zigzag' | 'cyber_grid' | 'double_topstitch';
  garmentSize: GarmentSize;
  fabricWidth: FabricWidth;
}

export interface VectorLayer {
  id: string;
  name: string;
  color: string;
  type: 'cut' | 'stitch' | 'fold' | 'led_wire';
  d: string; // SVG path data
}

export interface PatternPiece {
  id: string;
  name: string;
  dimensions: string;
  svgPath: string;
  grainLine: string;
}

export interface AssemblyStep {
  stepNumber: number;
  title: string;
  detail: string;
  techniqueTip: string;
  completed?: boolean;
}

export interface ProjectData {
  id: string;
  title: string;
  tagline: string;
  difficulty: DifficultyLevel;
  difficultyValue: number; // 1 to 3
  fabric: FabricType;
  craftStyle: CraftStyle;
  garmentType: GarmentType;
  estimatedTime: string;
  materials: string[];
  innovationScore: number;
  innovationGrade: string;
  description: string;
  imageSrc?: string;
  patternSpecs: {
    piecesCount: number;
    threadGauge: string;
    seamAllowance: string;
    cutDimensions: string;
    recommendedNeedle: string;
  };
  steps: AssemblyStep[];
  patternPieces: PatternPiece[];
  vectorLayers: VectorLayer[];
  customSeam?: SeamConfig;
}

export interface CommunityPreset {
  id: string;
  title: string;
  author: string;
  downloads: number;
  likes: number;
  tags: string[];
  project: ProjectData;
}

