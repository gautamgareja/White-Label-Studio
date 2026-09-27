export interface KeyFeature {
  title: string;
  description: string;
  category?: string;
}

export interface PageSection {
  id: string;
  name: string;
  purpose: string;
  layoutType: string;
}

export interface UIComponentItem {
  name: string;
  type: string;
  variants?: string[];
  description: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
  themeType: 'dark' | 'light' | 'hybrid';
}

export interface TypographySpec {
  headingFont: string;
  bodyFont: string;
  codeFont?: string;
  fontCharacteristics: string;
}

export interface BrandElements {
  brandName: string;
  tagline: string;
  visualStyle: string;
  iconographyStyle: string;
  notableElements: string[];
}

export interface UxIssue {
  issue: string;
  impact: 'high' | 'medium' | 'low';
  suggestedImprovement: string;
  appliedInGeneration?: boolean;
}

export interface AppReviewData {
  appName: string;
  purpose: string;
  targetUsers: string[];
  keyFeatures: KeyFeature[];
  pageStructure: {
    navigationItems: string[];
    sections: PageSection[];
    hasAuthentication: boolean;
    primaryAction: string;
  };
  mainUIComponents: UIComponentItem[];
  colorPalette: ColorPalette;
  typography: TypographySpec;
  brandElements: BrandElements;
  technologyHints: string[];
  uxAndAccessibilityIssues: UxIssue[];
  confidenceScore: number;
}

export interface BrandDetails {
  productName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  fontChoice: string;
  toneOfVoice: string;
  logoType: 'text' | 'monogram' | 'upload';
  logoData?: string; // custom SVG or image URL/base64
  contactEmail: string;
  companyName: string;
}

export type StudioStep = 'input' | 'review' | 'branding' | 'preview';

export interface PresetDemo {
  id: string;
  title: string;
  url: string;
  tag: string;
  review: AppReviewData;
  recommendedBrand: BrandDetails;
}
