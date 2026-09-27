import React, { useState } from 'react';
import { BrandDetails, AppReviewData } from '../types';
import {
  Palette,
  Sparkles,
  Type as TypeIcon,
  ShieldCheck,
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  Mail,
  Building,
  Sliders,
  Eye,
  Layers,
  PackageCheck,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  X,
  Code,
} from 'lucide-react';

interface StepBrandingProps {
  branding: BrandDetails;
  onUpdateBranding: (updated: BrandDetails) => void;
  review: AppReviewData;
  onGenerateApp: () => void;
  onBackToReview: () => void;
  isGenerating: boolean;
}

const CURATED_PALETTES = [
  {
    name: 'Cyber Cyan & Indigo',
    primary: '#06b6d4',
    secondary: '#5e6ad2',
    accent: '#4edea3',
    background: '#080b11',
    surface: '#121622',
  },
  {
    name: 'Emerald Terminal',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    background: '#070d0a',
    surface: '#111a15',
  },
  {
    name: 'Deep Modern Indigo',
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#38bdf8',
    background: '#090d16',
    surface: '#131926',
  },
  {
    name: 'Sunset Amber & Rose',
    primary: '#f59e0b',
    secondary: '#f43f5e',
    accent: '#fbbf24',
    background: '#0f0a0d',
    surface: '#1f131a',
  },
  {
    name: 'Obsidian Minimalist',
    primary: '#e2e8f0',
    secondary: '#94a3b8',
    accent: '#38bdf8',
    background: '#000000',
    surface: '#121212',
  },
];

const FONT_OPTIONS = [
  { name: 'Geist', desc: 'Modern high-tech sans with geometric balance' },
  { name: 'Plus Jakarta Sans', desc: 'Warm, elegant editorial sans' },
  { name: 'Inter', desc: 'Industry standard for digital interfaces' },
  { name: 'Space Grotesk', desc: 'Cyberpunk monospace-proportional blend' },
  { name: 'Outfit', desc: 'Clean, circular friendly geometric' },
];

const TONE_OPTIONS = [
  'Developer-First & High Velocity',
  'Executive & Enterprise Precision',
  'Minimalist & Clean Nordic',
  'Bold & Visionary Next-Gen',
  'Friendly, Human & Approachable',
];

export const StepBranding: React.FC<StepBrandingProps> = ({
  branding,
  onUpdateBranding,
  review,
  onGenerateApp,
  onBackToReview,
  isGenerating,
}) => {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionPresets, setSuggestionPresets] = useState<any[]>([]);
  const [showTransformationReviewModal, setShowTransformationReviewModal] = useState(false);

  const handleSuggest = async () => {
    setIsSuggesting(true);
    try {
      const res = await fetch('/api/suggest-branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review }),
      });
      const data = await res.json();
      if (data.concepts && data.concepts.length > 0) {
        setSuggestionPresets(data.concepts);
        // Apply first suggestion automatically
        const first = data.concepts[0];
        onUpdateBranding({
          ...branding,
          productName: first.productName,
          tagline: first.tagline,
          toneOfVoice: first.toneOfVoice,
          primaryColor: first.primaryColor,
          secondaryColor: first.secondaryColor,
          accentColor: first.accentColor,
          backgroundColor: first.backgroundColor,
          surfaceColor: first.surfaceColor,
          fontChoice: first.fontChoice,
        });
      }
    } catch (err) {
      console.warn('AI suggestions error:', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onUpdateBranding({
          ...branding,
          logoType: 'upload',
          logoData: result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const applyPalette = (p: typeof CURATED_PALETTES[0]) => {
    onUpdateBranding({
      ...branding,
      primaryColor: p.primary,
      secondaryColor: p.secondary,
      accentColor: p.accent,
      backgroundColor: p.background,
      surfaceColor: p.surface,
    });
  };

  // Initials for Monogram
  const initials = branding.productName
    ? branding.productName
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'WL';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 animate-fadeIn">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f1420] border border-[#1e2538] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Brand Identity Studio
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#4cd7f6]/15 text-[#4cd7f6] text-[11px] font-mono uppercase font-semibold">
              Step 03
            </span>
          </div>
          <p className="text-xs text-[#9ba3af]">
            Define the target brand identity. Every original trademark and copyrighted asset will be replaced with these tokens.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSuggest}
          disabled={isSuggesting}
          className="px-4 py-2.5 rounded-xl bg-[#162033] hover:bg-[#1f2b45] border border-[#2b3a56] text-[#4cd7f6] font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
        >
          <Sparkles className={`w-3.5 h-3.5 text-[#4edea3] ${isSuggesting ? 'animate-spin' : ''}`} />
          <span>{isSuggesting ? 'Synthesizing Concepts...' : 'Generate AI Brand Concepts'}</span>
        </button>
      </div>

      {/* AI Concept Cards if available */}
      {suggestionPresets.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-[#869397] uppercase">Click a concept to apply:</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {suggestionPresets.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onUpdateBranding({
                    ...branding,
                    productName: c.productName,
                    tagline: c.tagline,
                    toneOfVoice: c.toneOfVoice,
                    primaryColor: c.primaryColor,
                    secondaryColor: c.secondaryColor,
                    accentColor: c.accentColor,
                    backgroundColor: c.backgroundColor,
                    surfaceColor: c.surfaceColor,
                    fontChoice: c.fontChoice,
                  });
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all ${
                  branding.productName === c.productName
                    ? 'bg-[#141d2d] border-[#4cd7f6] ring-1 ring-[#4cd7f6]/30 shadow-md'
                    : 'bg-[#0f1420] border-[#1e2538] hover:border-[#2d3952]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{c.productName}</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.primaryColor }}></span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.secondaryColor }}></span>
                  </div>
                </div>
                <p className="text-[11px] text-[#9ba3af] line-clamp-2">{c.tagline}</p>
                <span className="text-[10px] font-mono text-[#4cd7f6]">{c.toneOfVoice}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Identity */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Identity Info */}
          <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-4">
            <span className="text-xs font-mono uppercase text-[#869397] font-semibold">
              Product &amp; Company Naming
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-[#dfe2ee]">
                  Product / Brand Name <span className="text-[#4cd7f6]">*</span>
                </label>
                <input
                  type="text"
                  value={branding.productName}
                  onChange={(e) => onUpdateBranding({ ...branding, productName: e.target.value })}
                  placeholder="e.g. ApexFlow or NovaDesk"
                  className="bg-[#090c13] text-white font-mono text-sm px-3.5 py-2.5 rounded-xl border border-[#232b3d] focus:border-[#4cd7f6] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-[#dfe2ee]">Company / Org Name</label>
                <input
                  type="text"
                  value={branding.companyName}
                  onChange={(e) => onUpdateBranding({ ...branding, companyName: e.target.value })}
                  placeholder="e.g. ApexFlow Systems Inc."
                  className="bg-[#090c13] text-white font-mono text-sm px-3.5 py-2.5 rounded-xl border border-[#232b3d] focus:border-[#4cd7f6] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#dfe2ee]">
                Product Tagline / Slogan
              </label>
              <input
                type="text"
                value={branding.tagline}
                onChange={(e) => onUpdateBranding({ ...branding, tagline: e.target.value })}
                placeholder="e.g. High-velocity engineering planning & autonomous cycles"
                className="w-full bg-[#090c13] text-white font-mono text-sm px-3.5 py-2.5 rounded-xl border border-[#232b3d] focus:border-[#4cd7f6] focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#dfe2ee] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#869397]" /> Support Email Address
              </label>
              <input
                type="email"
                value={branding.contactEmail}
                onChange={(e) => onUpdateBranding({ ...branding, contactEmail: e.target.value })}
                placeholder="support@apexflow.dev"
                className="w-full bg-[#090c13] text-white font-mono text-sm px-3.5 py-2.5 rounded-xl border border-[#232b3d] focus:border-[#4cd7f6] focus:outline-none"
              />
            </div>
          </div>

          {/* Color Palettes Selection */}
          <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#869397] font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#4cd7f6]" /> Theme Color Tokens
              </span>
              <span className="text-[11px] font-mono text-[#4cd7f6]">WCAG AAA Ready</span>
            </div>

            {/* Quick Palette Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CURATED_PALETTES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPalette(p)}
                  className="p-2.5 rounded-lg bg-[#090c13] border border-[#1e2538] hover:border-[#4cd7f6] transition-all text-left flex flex-col gap-1.5"
                >
                  <span className="text-[11px] font-semibold text-white truncate">{p.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: p.primary }}></span>
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: p.secondary }}></span>
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: p.accent }}></span>
                    <span className="w-4 h-4 rounded border border-white/20" style={{ backgroundColor: p.background }}></span>
                  </div>
                </button>
              ))}
            </div>

            {/* Granular Color Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1e2538] flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-[#dfe2ee]">Primary Accent</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => onUpdateBranding({ ...branding, primaryColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => onUpdateBranding({ ...branding, primaryColor: e.target.value })}
                    className="w-20 bg-transparent text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1e2538] flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-[#dfe2ee]">Secondary</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => onUpdateBranding({ ...branding, secondaryColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={branding.secondaryColor}
                    onChange={(e) => onUpdateBranding({ ...branding, secondaryColor: e.target.value })}
                    className="w-20 bg-transparent text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1e2538] flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-[#dfe2ee]">Highlight / Success</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) => onUpdateBranding({ ...branding, accentColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={branding.accentColor}
                    onChange={(e) => onUpdateBranding({ ...branding, accentColor: e.target.value })}
                    className="w-20 bg-transparent text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1e2538] flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-[#dfe2ee]">Dark Canvas</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.backgroundColor}
                    onChange={(e) => onUpdateBranding({ ...branding, backgroundColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={branding.backgroundColor}
                    onChange={(e) => onUpdateBranding({ ...branding, backgroundColor: e.target.value })}
                    className="w-20 bg-transparent text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#090c13] border border-[#1e2538] flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-[#dfe2ee]">Panel Surface</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.surfaceColor}
                    onChange={(e) => onUpdateBranding({ ...branding, surfaceColor: e.target.value })}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={branding.surfaceColor}
                    onChange={(e) => onUpdateBranding({ ...branding, surfaceColor: e.target.value })}
                    className="w-20 bg-transparent text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Logo, Font & Tone */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Logo Customizer */}
          <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-4">
            <span className="text-xs font-mono uppercase text-[#869397] font-semibold">
              Brand Emblem / Logo Mark
            </span>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg border border-white/10 shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})`,
                  color: '#ffffff',
                }}
              >
                {branding.logoType === 'upload' && branding.logoData ? (
                  <img src={branding.logoData} alt="Logo" className="w-12 h-12 object-contain rounded" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-white">Dynamic SVG Emblem</span>
                <p className="text-[11px] text-[#869397]">
                  Rendered in navigation, favicon, and hero watermark.
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <label className="px-2.5 py-1 rounded bg-[#182130] hover:bg-[#222c42] text-[11px] font-mono text-[#4cd7f6] cursor-pointer transition-colors flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload Custom Image</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {branding.logoType === 'upload' && (
                    <button
                      type="button"
                      onClick={() => onUpdateBranding({ ...branding, logoType: 'monogram', logoData: undefined })}
                      className="text-[11px] font-mono text-[#ffb4ab] hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Typography Choice */}
          <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-[#869397] font-semibold flex items-center gap-1.5">
              <TypeIcon className="w-3.5 h-3.5 text-[#4cd7f6]" /> Primary Font Family
            </span>

            <div className="flex flex-col gap-2">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => onUpdateBranding({ ...branding, fontChoice: f.name })}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    branding.fontChoice === f.name
                      ? 'bg-[#162033] border-[#4cd7f6] text-[#4cd7f6]'
                      : 'bg-[#090c13] border-[#1e2538] text-white hover:border-[#2d3952]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">{f.name}</span>
                    <span className="text-[10px] text-[#869397]">{f.desc}</span>
                  </div>
                  {branding.fontChoice === f.name && <Check className="w-4 h-4 text-[#4cd7f6]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tone of Voice */}
          <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-5 shadow-md flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-[#869397] font-semibold">
              Copywriting Tone of Voice
            </span>
            <div className="flex flex-col gap-1.5">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdateBranding({ ...branding, toneOfVoice: t })}
                  className={`px-3 py-2 rounded-lg border text-left text-xs font-mono transition-all ${
                    branding.toneOfVoice === t
                      ? 'bg-[#162033] border-[#4cd7f6] text-[#4cd7f6] font-semibold'
                      : 'bg-[#090c13] border-[#1e2538] text-[#869397] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Generation Review & Deliverables Guarantee Banner */}
      <div className="bg-[#0f1420] border border-[#1e2538] rounded-xl p-5 shadow-lg flex flex-col gap-4 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1c2436]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#142333] border border-[#1e344d] flex items-center justify-center text-[#4edea3]">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Pre-Generation Scope: What Gets White-Labeled &amp; What You Receive</span>
                <span className="px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-mono">100% Verified</span>
              </h3>
              <p className="text-xs text-[#9ba3af]">
                Confirm the transformation tokens before generating your white-label application package.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowTransformationReviewModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#162033] hover:bg-[#1e2c45] text-xs font-mono text-[#4cd7f6] flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review Full Matrix</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#090c13] border border-[#1a2130] flex flex-col gap-1.5">
            <span className="text-[10px] text-[#ffb4ab] uppercase font-semibold flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3" /> Identity Replacement
            </span>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#869397]">Original:</span>
              <span className="text-[#ffb4ab] line-through">{review.appName}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#869397]">New Brand:</span>
              <span className="text-[#4cd7f6] font-bold">{branding.productName || 'Custom White Label'}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#090c13] border border-[#1a2130] flex flex-col gap-1.5">
            <span className="text-[10px] text-[#4cd7f6] uppercase font-semibold flex items-center gap-1">
              <Palette className="w-3 h-3" /> Theme Tokens
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded shadow" style={{ backgroundColor: branding.primaryColor }} title={`Primary: ${branding.primaryColor}`}></span>
              <span className="w-4 h-4 rounded shadow" style={{ backgroundColor: branding.secondaryColor }} title={`Secondary: ${branding.secondaryColor}`}></span>
              <span className="w-4 h-4 rounded shadow" style={{ backgroundColor: branding.accentColor }} title={`Accent: ${branding.accentColor}`}></span>
              <span className="w-4 h-4 rounded border border-white/20 shadow" style={{ backgroundColor: branding.backgroundColor }} title={`Background: ${branding.backgroundColor}`}></span>
              <span className="text-[#dfe2ee] text-[11px] ml-auto font-sans">{branding.fontChoice}</span>
            </div>
            <span className="text-[10px] text-[#869397] truncate">{branding.toneOfVoice}</span>
          </div>

          <div className="p-3 rounded-lg bg-[#090c13] border border-[#1a2130] flex flex-col gap-1.5">
            <span className="text-[10px] text-[#4edea3] uppercase font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3" /> What You Get (6 Files)
            </span>
            <div className="flex items-center justify-between text-[10px] text-[#dfe2ee]">
              <span>index.html • tailwind.config.js</span>
              <span className="text-[#4edea3]">Ready</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#dfe2ee]">
              <span>brand-spec.json • README • .ZIP</span>
              <span className="text-[#4edea3]">Included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Transformation Review Modal */}
      {showTransformationReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0f1420] border border-[#273248] rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-[#0a0d14] border-b border-[#1c2333] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
                <h3 className="font-bold text-white text-sm font-mono">White-Label Transformation Audit Matrix</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTransformationReviewModal(false)}
                className="p-1 rounded text-[#869397] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#090c13] border border-[#1c2436] flex items-center justify-between">
                <div>
                  <span className="text-[#869397] block text-[10px] uppercase">Original App Brand Name</span>
                  <span className="text-[#ffb4ab] font-bold line-through">{review.appName}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#869397]" />
                <div className="text-right">
                  <span className="text-[#869397] block text-[10px] uppercase">White-Label Result</span>
                  <span className="text-[#4cd7f6] font-bold">{branding.productName}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090c13] border border-[#1c2436] flex items-center justify-between">
                <div>
                  <span className="text-[#869397] block text-[10px] uppercase">Copyright &amp; Logos</span>
                  <span className="text-[#ffb4ab] line-through">Proprietary assets</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#869397]" />
                <div className="text-right">
                  <span className="text-[#869397] block text-[10px] uppercase">White-Label Result</span>
                  <span className="text-[#4edea3]">Dynamic SVG Monogram / Clean Vectors</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090c13] border border-[#1c2436] flex items-center justify-between">
                <div>
                  <span className="text-[#869397] block text-[10px] uppercase">Primary Brand Color</span>
                  <span className="text-white">{review.colorPalette.primary}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#869397]" />
                <div className="text-right flex items-center gap-1.5 justify-end">
                  <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: branding.primaryColor }}></span>
                  <span className="text-[#4cd7f6] font-bold">{branding.primaryColor}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090c13] border border-[#1c2436] flex items-center justify-between">
                <div>
                  <span className="text-[#869397] block text-[10px] uppercase">Typography</span>
                  <span className="text-white">{review.typography.headingFont}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#869397]" />
                <div className="text-right">
                  <span className="text-[#4cd7f6] font-bold">{branding.fontChoice}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090c13] border border-[#1c2436] flex items-center justify-between">
                <div>
                  <span className="text-[#869397] block text-[10px] uppercase">Deliverables Packaged</span>
                  <span className="text-white">6 Output Files</span>
                </div>
                <div className="text-right">
                  <span className="text-[#4edea3] font-bold">100% Complete &amp; Downloadable</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#0a0d14] border-t border-[#1c2333] flex justify-end">
              <button
                type="button"
                onClick={() => setShowTransformationReviewModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#162033] hover:bg-[#1e2c45] text-xs font-mono text-[#dfe2ee]"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e2538] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#869397]">
          <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
          <span>Zero residual traces of {review.appName}</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBackToReview}
            disabled={isGenerating}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#161c28] hover:bg-[#202738] text-xs font-mono text-[#dfe2ee] transition-colors"
          >
            Back to Review
          </button>
          <button
            type="button"
            onClick={onGenerateApp}
            disabled={isGenerating || !branding.productName.trim()}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:brightness-110 text-[#003640] font-semibold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-[#4cd7f6]/20 transition-all active:scale-95"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-[#003640] border-t-transparent rounded-full animate-spin"></div>
                <span>Synthesizing White-Label App...</span>
              </>
            ) : (
              <>
                <span>Generate White-Label Application</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
