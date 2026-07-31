import { ProjectData, DifficultyLevel, FabricType, CraftStyle } from '../types';
import cyberJacketImg from '../assets/images/cyber_jacket_render_1785491647325.jpg';
import upcycledDenimImg from '../assets/images/upcycled_denim_render_1785491663229.jpg';

export const INITIAL_PROJECT: ProjectData = {
  id: 'proj-cyber-techwear-01',
  title: 'Neon-Grid Techwear Parka',
  tagline: 'Gore-Tex outer shell with fiber-optic cyber stitches and dynamic thermal baffles.',
  difficulty: 'intermediate',
  difficultyValue: 2,
  fabric: 'techwear',
  craftStyle: 'embroidery',
  garmentType: 'jacket',
  estimatedTime: '3.5 hrs',
  materials: [
    '1.8m Waterproof Ripstop / Gore-Tex',
    '30m Conductive & Neon Cyan Thread',
    'YKK Aquaguard Neon Zipper (60cm)',
    'Fusible Interface Stabilizer',
    '3mm Reflective Webbing Trim'
  ],
  innovationScore: 94,
  innovationGrade: 'Cyber-Grade A+',
  description: 'An advanced weather-resistant utility outerwear piece blending laser-guided embroidery with high-visibility reflective stitch grids and ergonomic raglan sleeve articulation.',
  imageSrc: cyberJacketImg,
  patternSpecs: {
    piecesCount: 7,
    threadGauge: '40wt High-Tenacity Polyester & Fiber-Optic Core',
    seamAllowance: '1.2cm (1/2 in) Flat-Felled Seams',
    cutDimensions: '140cm x 220cm Fabric Layout',
    recommendedNeedle: 'Microtex 90/14 Sharp'
  },
  patternPieces: [
    { id: 'p1', name: 'Front Torso Panels (L/R)', dimensions: '48 x 68 cm', svgPath: 'M10,10 L90,10 L85,90 L15,90 Z', grainLine: 'Vertical' },
    { id: 'p2', name: 'Articulated Raglan Sleeves', dimensions: '32 x 75 cm', svgPath: 'M20,10 L80,10 L95,90 L5,90 Z', grainLine: '45-deg Bias' },
    { id: 'p3', name: 'High-Collar Wind Baffle', dimensions: '52 x 18 cm', svgPath: 'M10,20 L90,20 L90,80 L10,80 Z', grainLine: 'Horizontal' },
    { id: 'p4', name: 'Back Structural Yoke', dimensions: '54 x 42 cm', svgPath: 'M15,10 L85,10 L95,70 L5,70 Z', grainLine: 'Vertical' }
  ],
  steps: [
    {
      stepNumber: 1,
      title: 'Precision Fabric Cutting & Thermal Edge Seal',
      detail: 'Lay raw ripstop on cutting mat. Cut main torso panels following the 1.2cm seam allowance guide lines.',
      techniqueTip: 'Use a rotary cutter and hot-seal edges to prevent synthetic fraying.'
    },
    {
      stepNumber: 2,
      title: 'Neon Cyan Fiber-Optic Stitching',
      detail: 'Thread machine with 40wt high-tenacity neon cyan thread in needle and conductive thread in bobbin. Stitch along circuit grid channels.',
      techniqueTip: 'Reduce upper thread tension to 3.0 for smooth, non-puckering decorative lines.'
    },
    {
      stepNumber: 3,
      title: 'Raglan Sleeve & Side Gusset Assembly',
      detail: 'Pin sleeves to front and back yoke matching alignment notches. Sew using flat-felled seam construction for complete water-tight seams.',
      techniqueTip: 'Press seams toward sleeves using a pressing cloth on medium heat.'
    },
    {
      stepNumber: 4,
      title: 'Aquaguard Zipper & Collar Attachment',
      detail: 'Align the waterproof YKK neon zipper along front center edges. Stitch with zipper foot 2mm from zipper teeth.',
      techniqueTip: 'Apply seam-sealing tape with a tailor’s clapper on the interior zip seam.'
    }
  ],
  vectorLayers: [
    { id: 'v1', name: 'Main Cut Line', color: '#00F0FF', type: 'cut', d: 'M 20 20 L 180 20 L 160 180 L 40 180 Z' },
    { id: 'v2', name: 'Neon Stitch Grid', color: '#FF007A', type: 'stitch', d: 'M 40 50 L 160 50 M 50 90 L 150 90 M 60 130 L 140 130' },
    { id: 'v3', name: 'Thermal Baffle Fold', color: '#38BDF8', type: 'fold', d: 'M 30 20 L 30 180 M 170 20 L 170 180' },
    { id: 'v4', name: 'LED Wire Channel', color: '#F43F5E', type: 'led_wire', d: 'M 100 20 C 120 70, 80 130, 100 180' }
  ]
};

export const PRESET_PROJECTS: Record<string, ProjectData> = {
  'denim-upcycling-intermediate': {
    id: 'proj-denim-upcycle-02',
    title: 'Selvedge Cyber-Denim Jacket',
    tagline: 'Deconstructed vintage indigo selvedge with laser-etched geometric quilting and neon pink embroidery.',
    difficulty: 'intermediate',
    difficultyValue: 2,
    fabric: 'denim',
    craftStyle: 'upcycling',
    garmentType: 'jacket',
    estimatedTime: '4.2 hrs',
    materials: [
      '1x Upcycled Pair of Heavyweight Selvedge Jeans',
      '25m Neon Pink Heavy-Duty Denim Thread',
      'Copper Rivets & Shank Buttons',
      '0.5m Contrast Japanese Sashiko Cotton'
    ],
    innovationScore: 91,
    innovationGrade: 'Circular Craft A',
    description: 'A striking upcycled masterpiece transforming discarded vintage denim into a structured high-street outerwear piece featuring geometric laser-line accents and contrast neon pink edge stitching.',
    imageSrc: upcycledDenimImg,
    patternSpecs: {
      piecesCount: 9,
      threadGauge: '30wt Extra-Heavy Denim Topstitch',
      seamAllowance: '1.5cm Heavy Duty Allowance',
      cutDimensions: 'Reclaimed Denim Strips & Panels',
      recommendedNeedle: 'Jeans/Denim 100/16'
    },
    patternPieces: [
      { id: 'dp1', name: 'Deconstructed Leg-Panel Fronts', dimensions: '45 x 65 cm', svgPath: 'M15,15 L85,10 L80,85 L20,85 Z', grainLine: 'Straight Grain' },
      { id: 'dp2', name: 'Upcycled Waistband Collar', dimensions: '50 x 12 cm', svgPath: 'M10,25 L90,25 L90,75 L10,75 Z', grainLine: 'Horizontal' },
      { id: 'dp3', name: 'Contrast Sashiko Back Yoke', dimensions: '52 x 35 cm', svgPath: 'M10,10 L90,10 L95,80 L5,80 Z', grainLine: 'Cross Grain' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Deconstruction & Steam Pressing',
        detail: 'Unpick inseams of donor denim using seam ripper. Press flat with high-pressure steam.',
        techniqueTip: 'Keep original belt loops and coin pocket for modular chest accent details.'
      },
      {
        stepNumber: 2,
        title: 'Geometric Laser-Line Quilting',
        detail: 'Baste reclaimed panels onto cotton backing. Topstitch parallel neon pink lines at 1.5cm increments.',
        techniqueTip: 'Use a walking foot to prevent heavy denim layers from shifting.'
      },
      {
        stepNumber: 3,
        title: 'Structural Flat-Felled Assembly',
        detail: 'Join front and back yoke using double-row neon topstitching.',
        techniqueTip: 'Use jeans needle 100/16 and increase stitch length to 3.5mm.'
      }
    ],
    vectorLayers: [
      { id: 'dv1', name: 'Denim Reclaim Contour', color: '#00F0FF', type: 'cut', d: 'M 15 15 L 185 15 L 170 185 L 30 185 Z' },
      { id: 'dv2', name: 'Neon Sashiko Grid', color: '#FF007A', type: 'stitch', d: 'M 30 30 L 170 170 M 170 30 L 30 170' }
    ]
  }
};

// Procedural AI project generator for custom combinations
export function generateDynamicProject(
  difficulty: DifficultyLevel,
  difficultyValue: number,
  fabric: FabricType,
  craftStyle: CraftStyle
): ProjectData {
  const fabricNames: Record<FabricType, string> = {
    denim: 'Indigo Selvedge Denim',
    silk: 'Mulberry Silk Satin',
    cotton: 'Organic Heavy Canvas',
    techwear: 'Gore-Tex Ripstop',
    smart_textile: 'Conductive E-Textile'
  };

  const styleTitles: Record<CraftStyle, string> = {
    embroidery: 'Cyber-Stitch',
    quilting: 'Baffle-Quilted',
    upcycling: 'Deconstructed',
    patchwork: 'Modular Block'
  };

  const garmentNames = ['Outerwear Shell', 'Tactical Vest', 'Utility Parka', 'Structured Overshirt', 'Cyber Kimono'];
  const garmentIndex = (difficultyValue + fabric.length + craftStyle.length) % garmentNames.length;
  const selectedGarment = garmentNames[garmentIndex];

  const title = `${styleTitles[craftStyle]} ${fabricNames[fabric]} ${selectedGarment}`;
  
  const estimatedTimeMap: Record<number, string> = {
    1: '1.5 - 2 hrs',
    2: '3.5 - 4.5 hrs',
    3: '6.0 - 8.0 hrs'
  };

  const innovationBase = 85 + (difficultyValue * 4) + (fabric === 'smart_textile' || fabric === 'techwear' ? 5 : 2);
  const innovationScore = Math.min(99, innovationBase);

  const materialsList: Record<FabricType, string[]> = {
    denim: ['1.8m 14oz Raw Selvedge Denim', 'Neon Pink Heavy Thread', 'Copper Hardware', 'Fusible Stabilizer'],
    silk: ['1.5m Pure Silk Satin', 'Fine Silk Embroidery Thread', 'Organza Interfacing', 'Invisible Zipper'],
    cotton: ['2.0m Heavy Duck Canvas', 'Neon Cyan Topstitch Thread', 'Brass Grommets', 'Cotton Webbing'],
    techwear: ['1.8m Waterproof Gore-Tex', 'Conductive Thread Core', 'YKK Aquaguard Zippers', 'Seam Seal Tape'],
    smart_textile: ['1.5m Conductive Silver Mesh', 'Neon Fiber Optic Thread', 'Micro-LED Controller Pocket', 'Insulating Coating']
  };

  const needleMap: Record<FabricType, string> = {
    denim: 'Jeans 100/16 Heavy',
    silk: 'Microtex 70/10 Ultra Fine',
    cotton: 'Universal 90/14',
    techwear: 'Microtex 90/14 Sharp',
    smart_textile: 'Stretch / Jersey 80/12'
  };

  // Select photo asset based on fabric/craft style
  const img = (fabric === 'denim' || craftStyle === 'upcycling') ? upcycledDenimImg : cyberJacketImg;

  return {
    id: `dynamic-${Date.now()}`,
    title,
    tagline: `Engineered using ${fabricNames[fabric]} with customized ${craftStyle} algorithms and precision seam geometry.`,
    difficulty,
    difficultyValue,
    fabric,
    craftStyle,
    garmentType: 'jacket',
    estimatedTime: estimatedTimeMap[difficultyValue] || '3.5 hrs',
    materials: materialsList[fabric],
    innovationScore,
    innovationGrade: difficultyValue === 3 ? 'Master Spec S+' : difficultyValue === 2 ? 'Pro-Grade A+' : 'Genesis Spec A',
    description: `A custom-generated ${fabricNames[fabric]} pattern utilizing advanced ${craftStyle} techniques. Optimized for zero-waste cut layouts and high visual impact.`,
    imageSrc: img,
    patternSpecs: {
      piecesCount: difficultyValue === 1 ? 4 : difficultyValue === 2 ? 7 : 12,
      threadGauge: difficultyValue === 3 ? '20wt High-Spec Fiber Core' : '40wt Polyester',
      seamAllowance: '1.2cm (1/2 in) Seam Allowance',
      cutDimensions: '140cm x 200cm Grid',
      recommendedNeedle: needleMap[fabric]
    },
    patternPieces: [
      { id: 'dp1', name: 'Main Front Panel (Left & Right)', dimensions: '45 x 65 cm', svgPath: 'M15,15 L85,10 L80,85 L20,85 Z', grainLine: 'Lengthwise Grain' },
      { id: 'dp2', name: 'Ergonomic Sleeves', dimensions: '35 x 72 cm', svgPath: 'M20,10 L80,10 L90,85 L10,85 Z', grainLine: 'Bias Grain 45°' },
      { id: 'dp3', name: 'High-Tech Collar & Facings', dimensions: '50 x 16 cm', svgPath: 'M10,20 L90,20 L90,80 L10,80 Z', grainLine: 'Crosswise Grain' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Precision Fabric Layout & Laser Marking',
        detail: `Spread out the ${fabricNames[fabric]} flat on cutting mat. Align template lines with fabric grain.`,
        techniqueTip: 'Use tailor chalk or washable marker for ultra-clean seam lines.'
      },
      {
        stepNumber: 2,
        title: `${craftStyle.toUpperCase()} Application & Detail Work`,
        detail: `Apply the ${craftStyle} design across front panels prior to assembling main body seams.`,
        techniqueTip: 'Back fabric with tear-away stabilizer to prevent distortion.'
      },
      {
        stepNumber: 3,
        title: 'Structural Seam Joining & Edge Finishing',
        detail: 'Stitch shoulder and side seams together. Press seams open using tailor ham.',
        techniqueTip: `Use ${needleMap[fabric]} needle for smooth non-puckered stitches.`
      },
      {
        stepNumber: 4,
        title: 'Hardware & Final Pressing',
        detail: 'Attach zippers, snaps, or webbing trims. Give final crisp press with steam iron.',
        techniqueTip: 'Apply protective press cloth to avoid synthetic shine.'
      }
    ],
    vectorLayers: [
      { id: 'v1', name: 'Outer Cut Line', color: '#00F0FF', type: 'cut', d: 'M 20 20 L 180 20 L 160 180 L 40 180 Z' },
      { id: 'v2', name: 'Neon Accent Seams', color: '#FF007A', type: 'stitch', d: 'M 40 60 L 160 60 M 50 100 L 150 100 M 60 140 L 140 140' },
      { id: 'v3', name: 'Fold Lines', color: '#38BDF8', type: 'fold', d: 'M 30 20 L 30 180 M 170 20 L 170 180' }
    ]
  };
}
