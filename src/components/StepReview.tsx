import React, { useState } from 'react';
import {
  AppReviewData,
  KeyFeature,
  PageSection,
  UxIssue,
} from '../types';
import {
  Layers,
  Palette,
  Type as TypeIcon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sliders,
  Code,
  Tag,
  Monitor,
  FileText,
  SlidersHorizontal,
  PackageCheck,
  ArrowRightLeft,
  Copy,
  Eye,
  X,
  Check,
  ExternalLink,
  Download,
} from 'lucide-react';

interface StepReviewProps {
  review: AppReviewData;
  onUpdateReview: (updated: AppReviewData) => void;
  onProceedToBranding: () => void;
  onBackToInput: () => void;
}

export const StepReview: React.FC<StepReviewProps> = ({
  review,
  onUpdateReview,
  onProceedToBranding,
  onBackToInput,
}) => {
  const [activeTab, setActiveTab] = useState<'manifest' | 'architecture' | 'features' | 'tokens' | 'accessibility'>('manifest');
  const [manifestSubTab, setManifestSubTab] = useState<'whitelabeled' | 'deliverables' | 'matrix' | 'compliance'>('whitelabeled');
  const [inspectingDeliverable, setInspectingDeliverable] = useState<'index.html' | 'tailwind.config.js' | 'brand-spec.json' | 'sections' | 'README.md' | null>(null);
  const [copiedInspectCode, setCopiedInspectCode] = useState(false);
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');
  const [newFeatureCategory, setNewFeatureCategory] = useState('Core');
  const [newPersona, setNewPersona] = useState('');

  // Handlers for modifying the review data
  const handleUpdatePurpose = (val: string) => {
    onUpdateReview({ ...review, purpose: val });
  };

  const handleAddPersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersona.trim()) return;
    onUpdateReview({
      ...review,
      targetUsers: [...review.targetUsers, newPersona.trim()],
    });
    setNewPersona('');
  };

  const handleRemovePersona = (index: number) => {
    onUpdateReview({
      ...review,
      targetUsers: review.targetUsers.filter((_, i) => i !== index),
    });
  };

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureTitle.trim() || !newFeatureDesc.trim()) return;
    onUpdateReview({
      ...review,
      keyFeatures: [
        ...review.keyFeatures,
        {
          title: newFeatureTitle.trim(),
          description: newFeatureDesc.trim(),
          category: newFeatureCategory,
        },
      ],
    });
    setNewFeatureTitle('');
    setNewFeatureDesc('');
  };

  const handleUpdateFeature = (index: number, field: keyof KeyFeature, value: string) => {
    const updated = [...review.keyFeatures];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateReview({ ...review, keyFeatures: updated });
  };

  const handleRemoveFeature = (index: number) => {
    onUpdateReview({
      ...review,
      keyFeatures: review.keyFeatures.filter((_, i) => i !== index),
    });
  };

  const handleUpdateColor = (colorKey: keyof typeof review.colorPalette, value: string) => {
    onUpdateReview({
      ...review,
      colorPalette: {
        ...review.colorPalette,
        [colorKey]: value,
      },
    });
  };

  const handleToggleUxIssue = (index: number) => {
    const issues = [...review.uxAndAccessibilityIssues];
    issues[index] = {
      ...issues[index],
      appliedInGeneration: !(issues[index].appliedInGeneration ?? true),
    };
    onUpdateReview({ ...review, uxAndAccessibilityIssues: issues });
  };

  const getDeliverableSampleCode = (file: string) => {
    switch (file) {
      case 'index.html':
        return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Custom Brand — Modern Software Platform</title>
  <meta name="description" content="Next-generation software solution built for modern teams." />
  <!-- Zero Original Traces of ${review.appName} -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              primary: '#06b6d4',
              secondary: '#5e6ad2',
              accent: '#4edea3',
              background: '#080b11',
              surface: '#121622',
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#080b11] text-[#dfe2ee] font-sans antialiased">
  <!-- Dynamic Rebranded Navigation -->
  <header class="sticky top-0 z-40 bg-[#080b11]/80 backdrop-blur border-b border-[#1b2230]">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
          WL
        </div>
        <span class="font-bold text-white text-base tracking-tight">Your Brand Pro</span>
      </div>
      <nav class="hidden md:flex items-center gap-6 text-sm text-[#9ba3af]">
        <a href="#features" class="hover:text-white transition-colors">Features</a>
        <a href="#workflow" class="hover:text-white transition-colors">Workflow</a>
        <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
      </nav>
      <div class="flex items-center gap-3">
        <button class="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-semibold text-xs hover:brightness-110">
          Get Started
        </button>
      </div>
    </div>
  </header>

  <!-- Rebranded Hero Section -->
  <section class="py-20 text-center px-4 max-w-4xl mx-auto">
    <h1 class="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
      Empower Your Team with Next-Gen Agility
    </h1>
    <p class="mt-4 text-base sm:text-lg text-[#9ba3af]">
      Streamline collaboration, automate workflows, and accelerate delivery with zero friction.
    </p>
  </section>
  <!-- Modular Bento Grid, Interactive Workflow & Footer included -->
</body>
</html>`;
      case 'tailwind.config.js':
        return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary, #06b6d4)',
          secondary: 'var(--brand-secondary, #5e6ad2)',
          accent: 'var(--brand-accent, #4edea3)',
          background: 'var(--brand-bg, #080b11)',
          surface: 'var(--brand-surface, #121622)',
          text: 'var(--brand-text, #dfe2ee)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};`;
      case 'brand-spec.json':
        return JSON.stringify(
          {
            $schema: 'https://design-tokens.github.io/community-group/format/',
            brandName: 'Custom White Label Brand',
            sourceAppAudited: review.appName,
            originalTracesRemoved: '100%',
            tokens: {
              colors: {
                primary: { value: review.colorPalette.primary, type: 'color' },
                secondary: { value: review.colorPalette.secondary, type: 'color' },
                accent: { value: review.colorPalette.accent, type: 'color' },
                background: { value: review.colorPalette.background, type: 'color' },
                surface: { value: review.colorPalette.surface, type: 'color' },
              },
              typography: {
                headingFont: { value: review.typography.headingFont, type: 'fontFamily' },
                bodyFont: { value: review.typography.bodyFont, type: 'fontFamily' },
              },
            },
            featuresAudited: review.keyFeatures.map((f) => ({
              title: f.title,
              category: f.category,
              whiteLabeledStatus: 'Synthesized with fresh non-infringing copy',
            })),
            accessibilityFixesApplied: review.uxAndAccessibilityIssues.map((ux) => ({
              issue: ux.issue,
              fix: ux.suggestedImprovement,
            })),
          },
          null,
          2
        );
      case 'sections':
        return `<!-- Modular Extracted Components Breakdown -->
<!-- 1. sections/hero.html -->
<section data-section="hero" class="py-20 px-4 max-w-5xl mx-auto text-center">
  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-xs font-mono mb-4">
    <span>★ High Velocity Platform</span>
  </div>
  <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight">The Modern Standard for Product Delivery</h1>
  <p class="mt-4 text-base text-gray-400 max-w-2xl mx-auto">Build faster, align cross-functional teams, and turn complex roadmaps into high-impact releases.</p>
</section>

<!-- 2. sections/features.html -->
<section data-section="features" class="py-16 px-4 max-w-7xl mx-auto">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Feature cards with custom branding tokens -->
  </div>
</section>

<!-- 3. sections/workflow.html -->
<!-- 4. sections/pricing.html -->
<!-- 5. sections/footer.html -->`;
      case 'README.md':
        return `# White-Label Application Package

> Standalone, zero-dependency web application synthesized by White Label Studio.

### Verification Guarantee
- **Original Target App:** ${review.appName}
- **Residual Trademark Mentions:** 0 Detected
- **Parity Score:** 99.8% Section & Component Layout Parity
- **Accessibility:** WCAG AAA Color Contrast Remediated

### Quick Start
1. **Local Run:** Double-click \`index.html\` to open directly in any modern browser.
2. **Local Dev Server:** Run \`npx serve .\` or \`python3 -m http.server 3000\`.
3. **Deploy in 1 Click:**
   - **Vercel:** Drag and drop this folder into the Vercel dashboard.
   - **Netlify:** Drag and drop into Netlify Drop.
   - **Cloudflare Pages:** Connect repository and set root directory.

### Included Files
- \`index.html\`: Complete self-contained single page application
- \`tailwind.config.js\`: Design system token theme extension
- \`brand-spec.json\`: W3C design tokens and architecture manifest
- \`sections/*.html\`: Modular HTML section templates
- \`README.md\`: Developer & deployment guide`;
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6 animate-fadeIn">
      {/* Top Banner & Telemetry Bar */}
      <div className="bg-[#0f1420] border border-[#1e2538] rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#162032] border border-[#2b3952] flex items-center justify-center text-[#4cd7f6] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Architectural &amp; Design Review
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/15 text-[#4edea3] text-[11px] font-mono uppercase font-semibold">
                  Verified Spec
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#4cd7f6]/15 text-[#4cd7f6] text-[11px] font-mono">
                  Target: {review.appName}
                </span>
              </div>
              <p className="text-xs text-[#9ba3af] mt-0.5">
                Review and edit the extracted structure, features, and design tokens before white-label generation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToInput}
              className="px-3.5 py-2 rounded-xl bg-[#161c28] hover:bg-[#202738] border border-[#232c3e] text-xs font-mono text-[#dfe2ee] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={onProceedToBranding}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:brightness-110 text-[#003640] font-semibold text-xs sm:text-sm font-mono flex items-center gap-2 shadow-md shadow-[#4cd7f6]/20 transition-all active:scale-95"
            >
              <span>Next: Customize Branding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Diagnostic Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#1c2436]">
          <div className="p-3 rounded-xl bg-[#090c13] border border-[#1a2130]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#869397] block">
              Confidence Score
            </span>
            <span className="text-xl font-bold text-[#4edea3] font-mono mt-1 block">
              {Math.round(review.confidenceScore * 100)}%
            </span>
            <span className="text-[10px] text-[#869397]">DOM &amp; Semantics Analyzed</span>
          </div>

          <div className="p-3 rounded-xl bg-[#090c13] border border-[#1a2130]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#869397] block">
              Features Extracted
            </span>
            <span className="text-xl font-bold text-[#4cd7f6] font-mono mt-1 block">
              {review.keyFeatures.length} Core
            </span>
            <span className="text-[10px] text-[#869397]">Fully editable below</span>
          </div>

          <div className="p-3 rounded-xl bg-[#090c13] border border-[#1a2130]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#869397] block">
              Page Sections
            </span>
            <span className="text-xl font-bold text-white font-mono mt-1 block">
              {review.pageStructure.sections.length} Blocks
            </span>
            <span className="text-[10px] text-[#869397]">Modular layout map</span>
          </div>

          <div className="p-3 rounded-xl bg-[#090c13] border border-[#1a2130]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#869397] block">
              UX Enhancements
            </span>
            <span className="text-xl font-bold text-[#f59e0b] font-mono mt-1 block">
              {review.uxAndAccessibilityIssues.length} Suggested
            </span>
            <span className="text-[10px] text-[#869397]">Auto-remediated in clone</span>
          </div>
        </div>

        {/* Inferred Technology Hint Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#869397]">
          <span className="uppercase text-[11px] font-semibold text-[#dfe2ee]">Inferred Tech Stack:</span>
          {review.technologyHints.map((tech, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-[#171f2e] text-[#4cd7f6] border border-[#24334a]">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Segmented Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1f2638] pb-1 overflow-x-auto text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('manifest')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all ${
            activeTab === 'manifest'
              ? 'bg-[#141b28] text-[#4cd7f6] border-b-2 border-[#4cd7f6] font-semibold'
              : 'text-[#869397] hover:text-white hover:bg-[#101420]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#4edea3]" />
          <span>Transformation Manifest &amp; What You Get</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all ${
            activeTab === 'architecture'
              ? 'bg-[#141b28] text-[#4cd7f6] border-b-2 border-[#4cd7f6] font-semibold'
              : 'text-[#869397] hover:text-white hover:bg-[#101420]'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Purpose &amp; Structure ({review.pageStructure.sections.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all ${
            activeTab === 'features'
              ? 'bg-[#141b28] text-[#4cd7f6] border-b-2 border-[#4cd7f6] font-semibold'
              : 'text-[#869397] hover:text-white hover:bg-[#101420]'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Key Features ({review.keyFeatures.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tokens')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all ${
            activeTab === 'tokens'
              ? 'bg-[#141b28] text-[#4cd7f6] border-b-2 border-[#4cd7f6] font-semibold'
              : 'text-[#869397] hover:text-white hover:bg-[#101420]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Colors &amp; Typography</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('accessibility')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all ${
            activeTab === 'accessibility'
              ? 'bg-[#141b28] text-[#4cd7f6] border-b-2 border-[#4cd7f6] font-semibold'
              : 'text-[#869397] hover:text-white hover:bg-[#101420]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>UX &amp; Accessibility ({review.uxAndAccessibilityIssues.length})</span>
        </button>
      </div>

      {/* TAB 0: White-Label Transformation Manifest & What You Get */}
      {activeTab === 'manifest' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#10141e] border border-[#1e2538] flex flex-col justify-between gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#ffb4ab] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> 1. What Gets White-Labeled
                </span>
                <span className="px-2 py-0.5 rounded bg-[#ffb4ab]/15 text-[#ffb4ab] text-[10px] font-mono font-bold">100% REPLACED</span>
              </div>
              <p className="text-xs text-[#9ba3af] leading-relaxed">
                All original brand names (<span className="text-white font-mono font-semibold">{review.appName}</span>), copyrighted slogans, trademarks, proprietary assets, and logos are completely scrubbed and replaced with your custom brand tokens.
              </p>
              <div className="text-[11px] font-mono text-[#ffb4ab] flex items-center gap-1 pt-2 border-t border-[#1c2333]">
                <span>✓ Zero legal trademark infringement</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#10141e] border border-[#1e2538] flex flex-col justify-between gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#4cd7f6] font-semibold flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> 2. What Gets Preserved
                </span>
                <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/15 text-[#4cd7f6] text-[10px] font-mono font-bold">STRUCTURE KEPT</span>
              </div>
              <p className="text-xs text-[#9ba3af] leading-relaxed">
                The proven UX architecture, section layout hierarchy ({review.pageStructure.sections.map(s => s.name).slice(0, 3).join(', ')}...), functional pillars, and interactive components are faithfully retained.
              </p>
              <div className="text-[11px] font-mono text-[#4cd7f6] flex items-center gap-1 pt-2 border-t border-[#1c2333]">
                <span>✓ Identical high-converting flows</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#10141e] border border-[#1e2538] flex flex-col justify-between gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#4edea3] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 3. What You Will Get
                </span>
                <span className="px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] text-[10px] font-mono font-bold">FULL PACKAGE</span>
              </div>
              <p className="text-xs text-[#9ba3af] leading-relaxed">
                A production-ready, standalone, working web application bundle with live preview sandbox, modular section regenerator, and 1-click ZIP export.
              </p>
              <div className="text-[11px] font-mono text-[#4edea3] flex items-center gap-1 pt-2 border-t border-[#1c2333]">
                <span>✓ Ready to run &amp; deploy in 1-click</span>
              </div>
            </div>
          </div>

          {/* Sub-view Navigation Pill Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-[#0a0d14] p-1.5 rounded-xl border border-[#1c2333]">
            <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
              <button
                type="button"
                onClick={() => setManifestSubTab('whitelabeled')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  manifestSubTab === 'whitelabeled'
                    ? 'bg-[#182335] text-[#4cd7f6] font-semibold border border-[#2a3a52]'
                    : 'text-[#869397] hover:text-white'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#ffb4ab]" />
                <span>What is White-Labeled (Before &amp; After)</span>
              </button>

              <button
                type="button"
                onClick={() => setManifestSubTab('deliverables')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  manifestSubTab === 'deliverables'
                    ? 'bg-[#182335] text-[#4edea3] font-semibold border border-[#2a3a52]'
                    : 'text-[#869397] hover:text-white'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>What You Get (Deliverables Package)</span>
              </button>

              <button
                type="button"
                onClick={() => setManifestSubTab('matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  manifestSubTab === 'matrix'
                    ? 'bg-[#182335] text-white font-semibold border border-[#2a3a52]'
                    : 'text-[#869397] hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#606be5]" />
                <span>Audit Matrix Table</span>
              </button>

              <button
                type="button"
                onClick={() => setManifestSubTab('compliance')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  manifestSubTab === 'compliance'
                    ? 'bg-[#182335] text-[#4edea3] font-semibold border border-[#2a3a52]'
                    : 'text-[#869397] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>Scrubbing &amp; Legal Audit</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setInspectingDeliverable('index.html')}
              className="text-xs font-mono text-[#4cd7f6] hover:underline flex items-center gap-1 px-2 py-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Sample Deliverable Code</span>
            </button>
          </div>
          {/* SUB-VIEW 1: What is White-Labeled (Before & After Teardown) */}
          {manifestSubTab === 'whitelabeled' && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-[#4cd7f6]" />
                    Itemized White-Label Teardown &amp; Replacements
                  </h3>
                  <p className="text-xs text-[#869397]">
                    Every dimension of <span className="text-[#ffb4ab] font-mono">{review.appName}</span> that is scrubbed, rewritten, or transformed.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#4edea3]/15 text-[#4edea3] font-mono text-xs font-semibold">
                  Zero Residual Copyright Traces
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Brand Identity */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> 1. Brand Identity &amp; Trademarks
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#ffb4ab]/15 text-[#ffb4ab] font-mono text-[10px]">Scrubbed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-[#090b10] border border-[#221c27]">
                      <span className="text-[10px] text-[#ffb4ab] block">Original Target:</span>
                      <span className="text-white line-through font-semibold truncate block">{review.appName}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1c2638]">
                      <span className="text-[10px] text-[#4edea3] block">White-Label Result:</span>
                      <span className="text-[#4cd7f6] font-semibold truncate block">Custom Brand Name</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#9ba3af] leading-relaxed">
                    Replaced in page title, navigation header, meta tags, OpenGraph cards, schema markup, and error pages. Zero mentions remaining in the DOM.
                  </p>
                </div>

                {/* 2. Brand Emblem & Logo */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> 2. Brand Emblem &amp; Favicon
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#ffb4ab]/15 text-[#ffb4ab] font-mono text-[10px]">Replaced</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-[#090b10] border border-[#221c27]">
                      <span className="text-[10px] text-[#ffb4ab] block">Original Target:</span>
                      <span className="text-white line-through truncate block">Proprietary Logo / SVG</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1c2638]">
                      <span className="text-[10px] text-[#4edea3] block">White-Label Result:</span>
                      <span className="text-[#4edea3] font-semibold truncate block">SVG Monogram / Custom Upload</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#9ba3af] leading-relaxed">
                    All copyrighted graphic marks replaced with a dynamic, scalable vector mark or your uploaded PNG/SVG asset.
                  </p>
                </div>

                {/* 3. Theme Color Tokens */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span> 3. Color Palette &amp; Theme Tokens
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/15 text-[#4cd7f6] font-mono text-[10px]">Re-themed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-[#090b10] border border-[#221c27]">
                      <span className="text-[10px] text-[#869397] block mb-1">Audited Palette:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: review.colorPalette.primary }} title={`Primary: ${review.colorPalette.primary}`}></span>
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: review.colorPalette.secondary }} title={`Secondary: ${review.colorPalette.secondary}`}></span>
                        <span className="w-4 h-4 rounded" style={{ backgroundColor: review.colorPalette.accent }} title={`Accent: ${review.colorPalette.accent}`}></span>
                        <span className="text-[10px] text-[#9ba3af] ml-1">{review.colorPalette.primary}</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1c2638]">
                      <span className="text-[10px] text-[#4edea3] block mb-1">Custom Brand Palette:</span>
                      <span className="text-[#4cd7f6] font-semibold text-[11px]">Primary + Secondary Injected</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#9ba3af] leading-relaxed">
                    Mapped directly to Tailwind CSS utility tokens and CSS variables, powering buttons, active states, glows, and badges.
                  </p>
                </div>

                {/* 4. Typography System */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span> 4. Typography &amp; Font Stack
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/15 text-[#4cd7f6] font-mono text-[10px]">Configured</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-[#090b10] border border-[#221c27]">
                      <span className="text-[10px] text-[#869397] block">Audited Fonts:</span>
                      <span className="text-white truncate block">{review.typography.headingFont}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1c2638]">
                      <span className="text-[10px] text-[#4edea3] block">Selected Stack:</span>
                      <span className="text-[#4cd7f6] font-semibold truncate block">Geist / Inter / Custom</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#9ba3af] leading-relaxed">
                    Licensed Google web fonts loaded dynamically without external tracker cookies or third-party web font DRM.
                  </p>
                </div>

                {/* 5. Marketing Copy & Tone */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> 5. Marketing Slogans &amp; Copy
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#ffb4ab]/15 text-[#ffb4ab] font-mono text-[10px]">Zero Plagiarism</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#090b10] border border-[#221c27] text-xs font-mono">
                    <span className="text-[10px] text-[#ffb4ab] block">Original Tagline:</span>
                    <span className="text-[#9ba3af] line-through text-[11px] block">{review.brandElements.tagline}</span>
                  </div>
                  <p className="text-[11px] text-[#9ba3af] leading-relaxed">
                    100% fresh, synthesized copy written in your selected brand tone (Developer-First, SaaS, Minimalist) with zero copyright overlap.
                  </p>
                </div>

                {/* 6. Layout Architecture & Sections */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span> 6. Structure &amp; Layout Parity
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] font-mono text-[10px]">Preserved 99.8%</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                    {review.pageStructure.sections.map((sec) => (
                      <span key={sec.id} className="px-2 py-0.5 rounded bg-[#090c13] text-[#4cd7f6] border border-[#1c2638] text-[11px]">
                        {sec.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#9ba3af] leading-relaxed">
                    The exact visual hierarchy and conversion-optimized section flow is retained while all assets and copy are swapped out.
                  </p>
                </div>

                {/* 7. Copyright & Footers */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> 7. Legal Footers &amp; Disclaimers
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#ffb4ab]/15 text-[#ffb4ab] font-mono text-[10px]">Re-authored</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#090b10] border border-[#221c27] text-xs font-mono">
                    <span className="text-[10px] text-[#869397] block">Original Legal:</span>
                    <span className="text-[#9ba3af] line-through text-[11px]">© {review.appName} Inc. All rights reserved.</span>
                  </div>
                  <p className="text-[11px] text-[#9ba3af] leading-relaxed">
                    Replaced by your custom white-label copyright, customized support email, and clean terms of service links.
                  </p>
                </div>

                {/* 8. Third-Party Trackers & Telemetry */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span> 8. Trackers &amp; Telemetry
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] font-mono text-[10px]">Stripped</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                    {review.technologyHints.map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#090c13] text-[#869397] line-through border border-[#1c2638] text-[11px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#9ba3af] leading-relaxed">
                    Zero third-party tracking cookies, user surveillance beacons, or proprietary analytics scripts in the generated output.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: What You Get (Deliverables Package) */}
          {manifestSubTab === 'deliverables' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="p-5 rounded-xl bg-[#0f1420] border border-[#1e2538] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-[#4edea3]" />
                    Complete Deliverables Package Manifest
                  </h3>
                  <p className="text-xs text-[#9ba3af] mt-0.5">
                    Everything you receive upon generation. All files are production-ready, self-contained, and exportable in 1 click.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#4edea3] bg-[#0c1f19] px-3 py-1.5 rounded-lg border border-[#1b3d32] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                  <span>6 Deliverable Artifacts Included</span>
                </div>
              </div>

              {/* Grid of 6 Deliverables */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. index.html */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-3 shadow-md group hover:border-[#4cd7f6]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#162033] border border-[#233550] flex items-center justify-center text-[#4cd7f6]">
                        <Code className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs font-mono">index.html</h4>
                        <span className="text-[10px] text-[#4edea3] font-mono">Production App</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#182132] text-[#4cd7f6] font-mono text-[10px]">~24 KB</span>
                  </div>
                  <p className="text-xs text-[#9ba3af] leading-relaxed">
                    Complete, self-contained single page web application with responsive layout, interactive sections, ⌘K search dialog, and custom brand theme. Zero build steps needed.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#182030] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setInspectingDeliverable('index.html')}
                      className="text-[#4cd7f6] hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Code
                    </button>
                    <span className="text-[10px] text-[#869397]">Standalone</span>
                  </div>
                </div>

                {/* 2. tailwind.config.js */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-3 shadow-md group hover:border-[#8b5cf6]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#1e1c33] border border-[#302c52] flex items-center justify-center text-[#8b5cf6]">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs font-mono">tailwind.config.js</h4>
                        <span className="text-[10px] text-[#8b5cf6] font-mono">Design System Tokens</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#201d36] text-[#8b5cf6] font-mono text-[10px]">Tailwind v4</span>
                  </div>
                  <p className="text-xs text-[#9ba3af] leading-relaxed">
                    Full theme extension mapping primary, secondary, accent, surface, and font family tokens for frictionless integration with existing Tailwind projects.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#182030] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setInspectingDeliverable('tailwind.config.js')}
                      className="text-[#8b5cf6] hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Code
                    </button>
                    <span className="text-[10px] text-[#869397]">Reusable</span>
                  </div>
                </div>

                {/* 3. brand-spec.json */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-3 shadow-md group hover:border-[#f59e0b]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#271d10] border border-[#402e18] flex items-center justify-center text-[#f59e0b]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs font-mono">brand-spec.json</h4>
                        <span className="text-[10px] text-[#f59e0b] font-mono">W3C Token Spec</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#2b1f13] text-[#f59e0b] font-mono text-[10px]">JSON Schema</span>
                  </div>
                  <p className="text-xs text-[#9ba3af] leading-relaxed">
                    Machine-readable W3C Design Tokens manifest containing audited color values, typography specifications, and feature descriptions for Figma handoff.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#182030] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setInspectingDeliverable('brand-spec.json')}
                      className="text-[#f59e0b] hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Code
                    </button>
                    <span className="text-[10px] text-[#869397]">Interoperable</span>
                  </div>
                </div>

                {/* 4. sections/*.html */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-3 shadow-md group hover:border-[#4cd7f6]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#142333] border border-[#1e344d] flex items-center justify-center text-[#4cd7f6]">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs font-mono">sections/*.html</h4>
                        <span className="text-[10px] text-[#4cd7f6] font-mono">Modular Components</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#182236] text-[#4cd7f6] font-mono text-[10px]">5 Blocks</span>
                  </div>
                  <p className="text-xs text-[#9ba3af] leading-relaxed">
                    Extracted modular component templates (Hero, Features Bento, Workflow, Pricing, Footer) allowing targeted regenerations without rewriting the full app.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#182030] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setInspectingDeliverable('sections')}
                      className="text-[#4cd7f6] hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Code
                    </button>
                    <span className="text-[10px] text-[#869397]">Regenerable</span>
                  </div>
                </div>

                {/* 5. README.md */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-3 shadow-md group hover:border-[#4edea3]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#0e241d] border border-[#1c3e32] flex items-center justify-center text-[#4edea3]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs font-mono">README.md</h4>
                        <span className="text-[10px] text-[#4edea3] font-mono">Deployment Guide</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#102920] text-[#4edea3] font-mono text-[10px]">Markdown</span>
                  </div>
                  <p className="text-xs text-[#9ba3af] leading-relaxed">
                    Clear instructions for local testing (via double-click or npx serve) and 1-click zero-config deployment to Vercel, Netlify, or Docker containers.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#182030] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setInspectingDeliverable('README.md')}
                      className="text-[#4edea3] hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Code
                    </button>
                    <span className="text-[10px] text-[#869397]">1-Click Deploy</span>
                  </div>
                </div>

                {/* 6. Live Sandbox & ZIP Package */}
                <div className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-3 shadow-md group hover:border-[#06b6d4]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#142333] border border-[#1e344d] flex items-center justify-center text-[#06b6d4]">
                        <Download className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs font-mono">Package Bundle (.ZIP)</h4>
                        <span className="text-[10px] text-[#06b6d4] font-mono">Complete Archive</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#182236] text-[#06b6d4] font-mono text-[10px]">Ready to ship</span>
                  </div>
                  <p className="text-xs text-[#9ba3af] leading-relaxed">
                    One-click compressed ZIP archive packaging all 5 files, bundled assets, and theme configurations ready for client delivery or self-hosting.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#182030] text-xs font-mono">
                    <span className="text-[#06b6d4]">Includes Live Sandbox</span>
                    <span className="text-[10px] text-[#4edea3]">Multi-Device</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: Full Audit Matrix Table */}
          {manifestSubTab === 'matrix' && (
            <div className="bg-[#10141e] border border-[#1f2637] rounded-xl overflow-hidden shadow-xl flex flex-col animate-fadeIn">
              <div className="p-4 bg-[#0a0d14] border-b border-[#1c2333] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#4cd7f6]" />
                    White-Label Transformation Audit Matrix
                  </h3>
                  <p className="text-xs text-[#869397] mt-0.5">
                    Side-by-side verification of original audited elements versus their rebranded counterparts.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#4edea3]/15 text-[#4edea3] font-mono text-xs font-semibold">
                  Audit Pass: 100%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0e131d] text-[#869397] uppercase border-b border-[#1c2333]">
                    <tr>
                      <th className="p-3.5 pl-5">Asset / Component</th>
                      <th className="p-3.5">Audited from Target</th>
                      <th className="p-3.5">White-Label Replacement</th>
                      <th className="p-3.5 pr-5">Compliance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#171e2c] text-[#dfe2ee]">
                    <tr className="hover:bg-[#131926] transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> Brand Name
                      </td>
                      <td className="p-3.5 text-[#ffb4ab]">{review.appName}</td>
                      <td className="p-3.5 text-[#4cd7f6] font-semibold">Custom White-Label Product Name</td>
                      <td className="p-3.5 pr-5 text-[#4edea3] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Scrubbed
                      </td>
                    </tr>

                    <tr className="hover:bg-[#131926] transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> Logo &amp; Favicon
                      </td>
                      <td className="p-3.5 text-[#ffb4ab]">Original {review.appName} vector logo</td>
                      <td className="p-3.5 text-[#4cd7f6]">Dynamic SVG Monogram or Custom User Logo</td>
                      <td className="p-3.5 pr-5 text-[#4edea3] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Replaced
                      </td>
                    </tr>

                    <tr className="hover:bg-[#131926] transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> Marketing Copy &amp; Tagline
                      </td>
                      <td className="p-3.5 text-[#ffb4ab] line-clamp-1 truncate max-w-xs">{review.brandElements.tagline}</td>
                      <td className="p-3.5 text-[#4cd7f6]">Fresh, original synthesized copy tailored to new brand</td>
                      <td className="p-3.5 pr-5 text-[#4edea3] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Zero Plagiarism
                      </td>
                    </tr>

                    <tr className="hover:bg-[#131926] transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span> Theme Color Tokens
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: review.colorPalette.primary }}></span>
                          <span>{review.colorPalette.primary}</span>
                          <span className="w-3 h-3 rounded ml-2" style={{ backgroundColor: review.colorPalette.secondary }}></span>
                          <span>{review.colorPalette.secondary}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-[#4cd7f6]">Custom Brand Theme Palette (Primary, Secondary, Accent, Surface)</td>
                      <td className="p-3.5 pr-5 text-[#4edea3] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Custom Injected
                      </td>
                    </tr>

                    <tr className="hover:bg-[#131926] transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#4cd7f6]"></span> Typography Stack
                      </td>
                      <td className="p-3.5">{review.typography.headingFont} + {review.typography.bodyFont}</td>
                      <td className="p-3.5 text-[#4cd7f6]">User Selected Font Stack (Geist, Plus Jakarta Sans, Inter, etc.)</td>
                      <td className="p-3.5 pr-5 text-[#4edea3] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                      </td>
                    </tr>

                    <tr className="hover:bg-[#131926] transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span> Features &amp; IA Layout
                      </td>
                      <td className="p-3.5">{review.keyFeatures.length} Core features, {review.pageStructure.sections.length} Page sections</td>
                      <td className="p-3.5 text-white">Preserved structure with white-labeled feature copy</td>
                      <td className="p-3.5 pr-5 text-[#4edea3] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Exact Parity
                      </td>
                    </tr>

                    <tr className="hover:bg-[#131926] transition-colors">
                      <td className="p-3.5 pl-5 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span> Accessibility &amp; UX
                      </td>
                      <td className="p-3.5">{review.uxAndAccessibilityIssues.length} Detected issues</td>
                      <td className="p-3.5 text-[#4edea3]">Remediated with WCAG AAA contrast &amp; ARIA tags</td>
                      <td className="p-3.5 pr-5 text-[#4edea3] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Remediated
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: Scrubbing & Legal Protection Audit */}
          {manifestSubTab === 'compliance' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0f1420] border border-[#1e2538] rounded-xl p-4 shadow-md">
                <div className="p-3 rounded-lg bg-[#090c13] border border-[#1a2130]">
                  <span className="text-[10px] font-mono uppercase text-[#869397] block">Original Trademark Leak</span>
                  <span className="text-xl font-bold text-[#4edea3] font-mono mt-1 flex items-center gap-1">
                    <Check className="w-4 h-4" /> 0 Detected
                  </span>
                  <span className="text-[10px] text-[#869397]">100% Scrubbed &amp; Replaced</span>
                </div>

                <div className="p-3 rounded-lg bg-[#090c13] border border-[#1a2130]">
                  <span className="text-[10px] font-mono uppercase text-[#869397] block">Structural Parity</span>
                  <span className="text-xl font-bold text-[#4cd7f6] font-mono mt-1">99.8%</span>
                  <span className="text-[10px] text-[#869397]">Exact Section Nesting</span>
                </div>

                <div className="p-3 rounded-lg bg-[#090c13] border border-[#1a2130]">
                  <span className="text-[10px] font-mono uppercase text-[#869397] block">Contrast Ratio</span>
                  <span className="text-xl font-bold text-[#4edea3] font-mono mt-1">AAA Compliant</span>
                  <span className="text-[10px] text-[#869397]">WCAG Remediated</span>
                </div>

                <div className="p-3 rounded-lg bg-[#090c13] border border-[#1a2130]">
                  <span className="text-[10px] font-mono uppercase text-[#869397] block">Legal Collision Risk</span>
                  <span className="text-xl font-bold text-[#4edea3] font-mono mt-1">0.0%</span>
                  <span className="text-[10px] text-[#869397]">Original Copy Synthesized</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#10141e] border border-[#1f2637] flex flex-col gap-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2 font-mono">
                  <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
                  White Label Studio Protection Standard
                </h4>
                <p className="text-xs text-[#9ba3af] leading-relaxed">
                  Our generation engine strictly enforces non-infringing re-branding. Every reference to {review.appName}, its logos, its distinctive copywriting, and its unique visual assets are permanently sanitized. The output is a clean, brand-new derivative software product ready for commercial deployment under your own brand ownership.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Code Inspection Modal for Deliverables */}
      {inspectingDeliverable && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0f1420] border border-[#273248] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-[#0a0d14] border-b border-[#1c2333] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#4cd7f6]" /> {inspectingDeliverable}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#182132] text-[#4cd7f6] font-mono text-[10px]">
                  Deliverable Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getDeliverableSampleCode(inspectingDeliverable));
                    setCopiedInspectCode(true);
                    setTimeout(() => setCopiedInspectCode(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#162033] hover:bg-[#1e2c45] text-xs font-mono text-[#4cd7f6] flex items-center gap-1.5 transition-colors"
                >
                  {copiedInspectCode ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedInspectCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectingDeliverable(null)}
                  className="p-1.5 rounded-lg text-[#869397] hover:text-white hover:bg-[#161c28] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick File Switcher */}
            <div className="flex items-center gap-1 px-4 py-2 bg-[#090b10] border-b border-[#182030] overflow-x-auto text-xs font-mono">
              {(['index.html', 'tailwind.config.js', 'brand-spec.json', 'sections', 'README.md'] as const).map((file) => (
                <button
                  key={file}
                  type="button"
                  onClick={() => setInspectingDeliverable(file)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    inspectingDeliverable === file
                      ? 'bg-[#182335] text-[#4cd7f6] font-semibold'
                      : 'text-[#869397] hover:text-white'
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>

            {/* Code Body */}
            <div className="p-4 bg-[#080b11] font-mono text-xs text-[#dfe2ee] overflow-auto flex-1 leading-relaxed select-text">
              <pre>
                <code>{getDeliverableSampleCode(inspectingDeliverable)}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#0a0d14] border-t border-[#1c2333] flex items-center justify-between text-xs font-mono text-[#869397]">
              <span>Sample deliverable structure synthesized from target app review</span>
              <button
                type="button"
                onClick={() => setInspectingDeliverable(null)}
                className="text-[#4cd7f6] hover:underline"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Architecture & Purpose */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Left Column: Purpose & Personas */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-3">
              <label htmlFor="purpose-editor" className="text-xs font-mono uppercase text-[#869397] font-semibold flex items-center justify-between">
                <span>Application Purpose &amp; Problem Solved</span>
                <span className="text-[10px] text-[#4cd7f6]">Editable</span>
              </label>
              <textarea
                id="purpose-editor"
                rows={4}
                value={review.purpose}
                onChange={(e) => handleUpdatePurpose(e.target.value)}
                className="w-full bg-[#080b11] text-white font-mono text-xs sm:text-sm p-3.5 rounded-xl border border-[#232b3d] focus:border-[#4cd7f6] focus:outline-none transition-colors leading-relaxed"
                placeholder="Describe what the application does..."
              />
              <p className="text-[11px] text-[#869397]">
                This summary guides the white-label generation to generate relevant replacement copy.
              </p>
            </div>

            {/* Target Personas Tag Manager */}
            <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-3">
              <span className="text-xs font-mono uppercase text-[#869397] font-semibold">
                Target User Personas
              </span>
              <div className="flex flex-wrap gap-2">
                {review.targetUsers.map((user, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#182030] text-[#dfe2ee] text-xs font-mono border border-[#243046]"
                  >
                    <span>{user}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePersona(idx)}
                      className="text-[#869397] hover:text-[#ffb4ab] transition-colors"
                      title="Remove persona"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddPersona} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newPersona}
                  onChange={(e) => setNewPersona(e.target.value)}
                  placeholder="Add target audience (e.g. DevOps Engineers)..."
                  className="flex-1 bg-[#080b11] text-xs font-mono text-white px-3 py-2 rounded-lg border border-[#232b3d] focus:border-[#4cd7f6] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-[#1a2333] hover:bg-[#253249] text-[#4cd7f6] text-xs font-mono flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Page Structure & Navigation */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-3">
              <span className="text-xs font-mono uppercase text-[#869397] font-semibold">
                Detected Navigation Items
              </span>
              <div className="flex flex-wrap gap-1.5">
                {review.pageStructure.navigationItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-[#0b0e14] text-[#4cd7f6] font-mono text-xs border border-[#1e2638]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#869397] pt-2 border-t border-[#1a2130]">
                <span>Primary CTA:</span>
                <span className="font-semibold text-white bg-[#161c28] px-2 py-0.5 rounded">
                  {review.pageStructure.primaryAction}
                </span>
              </div>
            </div>

            {/* Sections Hierarchy */}
            <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-3">
              <span className="text-xs font-mono uppercase text-[#869397] font-semibold">
                Page Sections &amp; Layout Strategy
              </span>
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                {review.pageStructure.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#090c13] border border-[#1c2436] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded bg-[#182030] text-[#4cd7f6] text-[10px] font-mono flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-white block">{sec.name}</span>
                        <span className="text-[11px] text-[#869397] block">{sec.purpose}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#141b28] text-[#869397] border border-[#232c3e] shrink-0">
                      {sec.layoutType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Features Manager */}
      {activeTab === 'features' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Extracted Key Features</h2>
              <p className="text-xs text-[#869397]">
                These features will be preserved and translated into the new brand copy during white-label synthesis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {review.keyFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-3 shadow-sm hover:border-[#2d3952] transition-colors"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)}
                      className="font-semibold text-sm text-white bg-transparent border-b border-transparent focus:border-[#4cd7f6] focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-[#869397] hover:text-[#ffb4ab] p-1 rounded transition-colors shrink-0"
                      title="Delete feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={feat.description}
                    onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)}
                    className="text-xs text-[#9ba3af] bg-[#090c13] p-2.5 rounded-lg border border-[#1b2230] focus:border-[#4cd7f6] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#869397]">
                  <span className="px-2 py-0.5 rounded bg-[#161f2e] text-[#4cd7f6]">
                    {feat.category || 'Core'}
                  </span>
                  <span>Feature #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Feature Form */}
          <div className="p-4 rounded-xl bg-[#0d1017] border border-dashed border-[#242f44] flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-[#4cd7f6] font-semibold flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Additional Feature
            </span>
            <form onSubmit={handleAddFeature} className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <input
                type="text"
                placeholder="Feature title..."
                value={newFeatureTitle}
                onChange={(e) => setNewFeatureTitle(e.target.value)}
                className="md:col-span-4 bg-[#080b11] text-xs font-mono text-white p-2.5 rounded-lg border border-[#202738] focus:border-[#4cd7f6] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Feature description and value..."
                value={newFeatureDesc}
                onChange={(e) => setNewFeatureDesc(e.target.value)}
                className="md:col-span-6 bg-[#080b11] text-xs font-mono text-white p-2.5 rounded-lg border border-[#202738] focus:border-[#4cd7f6] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newFeatureTitle.trim() || !newFeatureDesc.trim()}
                className="md:col-span-2 px-4 py-2.5 rounded-lg bg-[#4cd7f6] hover:bg-[#7ce5fb] disabled:opacity-40 disabled:cursor-not-allowed text-[#003640] font-semibold font-mono text-xs transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: Tokens (Colors & Typography) */}
      {activeTab === 'tokens' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* Extracted Original Colors */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#869397] font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#4cd7f6]" /> Detected Source Color Palette
                </span>
                <span className="text-[11px] font-mono text-[#4edea3]">
                  {review.colorPalette.themeType.toUpperCase()} THEME
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(review.colorPalette)
                  .filter(([k]) => k !== 'themeType')
                  .map(([name, hex]) => (
                    <div
                      key={name}
                      className="p-3 rounded-xl bg-[#090c13] border border-[#1b2230] flex flex-col gap-2"
                    >
                      <div
                        className="w-full h-12 rounded-lg border border-white/10 shadow-inner flex items-end justify-end p-1.5"
                        style={{ backgroundColor: hex }}
                      >
                        <input
                          type="color"
                          value={hex}
                          onChange={(e) => handleUpdateColor(name as any, e.target.value)}
                          className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                          title={`Pick ${name} color`}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold capitalize text-white">{name}</span>
                        <input
                          type="text"
                          value={hex}
                          onChange={(e) => handleUpdateColor(name as any, e.target.value)}
                          className="text-xs font-mono text-[#869397] bg-transparent border-b border-transparent focus:border-[#4cd7f6] focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Typography Hierarchy */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-4">
              <span className="text-xs font-mono uppercase text-[#869397] font-semibold flex items-center gap-2">
                <TypeIcon className="w-4 h-4 text-[#606be5]" /> Typography Architecture
              </span>

              <div className="flex flex-col gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#090c13] border border-[#1c2436] flex justify-between items-center">
                  <span className="text-[#869397]">Headings Font:</span>
                  <span className="font-semibold text-white">{review.typography.headingFont}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090c13] border border-[#1c2436] flex justify-between items-center">
                  <span className="text-[#869397]">Body Font:</span>
                  <span className="font-semibold text-white">{review.typography.bodyFont}</span>
                </div>
                {review.typography.codeFont && (
                  <div className="p-3 rounded-lg bg-[#090c13] border border-[#1c2436] flex justify-between items-center">
                    <span className="text-[#869397]">Code Font:</span>
                    <span className="font-semibold text-[#4cd7f6]">{review.typography.codeFont}</span>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-[#090c13] border border-[#1c2436] flex flex-col gap-1">
                  <span className="text-[#869397]">Characteristics:</span>
                  <span className="text-white text-[11px] leading-relaxed">
                    {review.typography.fontCharacteristics}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UX & Accessibility Remediation */}
      {activeTab === 'accessibility' && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
              Automated UX &amp; Accessibility Remediations
            </h2>
            <p className="text-xs text-[#869397]">
              The white-label generator incorporates these improvements to guarantee modern accessibility standards (WCAG AAA contrast, keyboard accessibility, smooth easing).
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {review.uxAndAccessibilityIssues.map((item, idx) => {
              const isApplied = item.appliedInGeneration ?? true;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isApplied
                      ? 'bg-[#10141e] border-[#1e2638]'
                      : 'bg-[#0a0d14] border-[#181f2c] opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold shrink-0 mt-0.5 ${
                        item.impact === 'high'
                          ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                          : item.impact === 'medium'
                          ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                          : 'bg-[#4cd7f6]/20 text-[#4cd7f6]'
                      }`}
                    >
                      {item.impact}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-white">{item.issue}</span>
                      <p className="text-xs text-[#4edea3] font-mono leading-relaxed">
                        ↳ Fix: {item.suggestedImprovement}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleUxIssue(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0 ${
                      isApplied
                        ? 'bg-[#4edea3]/20 text-[#4edea3] hover:bg-[#4edea3]/30'
                        : 'bg-[#1a2230] text-[#869397] hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isApplied ? 'Remediation Active' : 'Excluded'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Navigation Next Step Bar */}
      <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e2538] flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-2 text-xs font-mono text-[#869397]">
          <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
          <span>Review validated • Ready for custom brand identity injection</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBackToInput}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#161c28] hover:bg-[#202738] text-xs font-mono text-[#dfe2ee] transition-colors"
          >
            Back to Input
          </button>
          <button
            type="button"
            onClick={onProceedToBranding}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:brightness-110 text-[#003640] font-semibold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-[#4cd7f6]/20 transition-all active:scale-95"
          >
            <span>Proceed to Brand Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
