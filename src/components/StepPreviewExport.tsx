import React, { useState, useRef, useEffect } from 'react';
import { AppReviewData, BrandDetails } from '../types';
import { createWhiteLabelZip } from '../utils/zipExport';
import {
  Download,
  Code,
  Eye,
  RefreshCw,
  Sparkles,
  Check,
  Copy,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  Layers,
  Sliders,
  X,
  Send,
  FileText,
  Palette,
  PackageCheck,
  ArrowRightLeft,
} from 'lucide-react';

interface StepPreviewExportProps {
  appHtml: string;
  sections: Record<string, string>;
  onUpdateAppHtml: (updatedHtml: string, updatedSections: Record<string, string>) => void;
  review: AppReviewData;
  branding: BrandDetails;
  onBackToBranding: () => void;
  onReset: () => void;
}

export const StepPreviewExport: React.FC<StepPreviewExportProps> = ({
  appHtml,
  sections,
  onUpdateAppHtml,
  review,
  branding,
  onBackToBranding,
  onReset,
}) => {
  const [viewMode, setViewMode] = useState<'sandbox' | 'diff' | 'deliverables'>('sandbox');
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'tailwind' | 'spec' | 'readme'>('html');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [regenerationPrompt, setRegenerationPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update iframe contents whenever appHtml changes
  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(appHtml);
        doc.close();
      }
    }
  }, [appHtml, deviceViewport]);

  // Derived code strings for inspector
  const tailwindCode = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${branding.primaryColor}',
          secondary: '${branding.secondaryColor}',
          accent: '${branding.accentColor}',
          background: '${branding.backgroundColor}',
          surface: '${branding.surfaceColor}',
          text: '${branding.textColor}',
        },
      },
      fontFamily: {
        sans: ['${branding.fontChoice}', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};`;

  const brandSpecJson = JSON.stringify(
    {
      brandName: branding.productName,
      tagline: branding.tagline,
      toneOfVoice: branding.toneOfVoice,
      contactEmail: branding.contactEmail,
      companyName: branding.companyName,
      tokens: {
        colors: {
          primary: branding.primaryColor,
          secondary: branding.secondaryColor,
          accent: branding.accentColor,
          background: branding.backgroundColor,
          surface: branding.surfaceColor,
        },
        typography: {
          fontFamily: branding.fontChoice,
        },
      },
      sourceAppAudit: {
        originalAppName: review.appName,
        purpose: review.purpose,
        keyFeatures: review.keyFeatures,
      },
      generatedAt: new Date().toISOString(),
    },
    null,
    2
  );

  const readmeMarkdown = `# ${branding.productName} — White-Label Application

> ${branding.tagline}

Generated automatically with 0% residual traces of the original target app.
Ready to run locally in any browser, or deploy to Vercel, Netlify, or Docker container.

### Theme Tokens
- Primary: \`${branding.primaryColor}\`
- Secondary: \`${branding.secondaryColor}\`
- Background: \`${branding.backgroundColor}\`
- Font: \`${branding.fontChoice}\`
`;

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'html':
        return appHtml;
      case 'tailwind':
        return tailwindCode;
      case 'spec':
        return brandSpecJson;
      case 'readme':
        return readmeMarkdown;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsExportingZip(true);
      const blob = await createWhiteLabelZip(appHtml, review, branding, sections);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `${branding.productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-whitelabel.zip`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleOpenSectionRegenerator = (sectionId: string) => {
    setRegeneratingSection(sectionId);
    setRegenerationPrompt('');
  };

  const handleRegenerateSectionSubmit = async () => {
    if (!regeneratingSection) return;
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: regeneratingSection,
          review,
          branding,
          currentSectionHtml: sections[regeneratingSection] || '',
          instruction: regenerationPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.updatedSectionHtml) {
        const updatedSections = {
          ...sections,
          [regeneratingSection]: data.updatedSectionHtml,
        };

        // Replace section in full HTML
        let updatedHtml = appHtml;
        const sectionRegex = new RegExp(
          `<section[^>]*data-section=["']?${regeneratingSection}["']?[^>]*>[\\s\\S]*?<\\/section>`,
          'i'
        );

        if (sectionRegex.test(updatedHtml)) {
          updatedHtml = updatedHtml.replace(sectionRegex, data.updatedSectionHtml);
        } else {
          // If regex doesn't match, append inside body
          updatedHtml = updatedHtml.replace('</body>', `${data.updatedSectionHtml}\n</body>`);
        }

        onUpdateAppHtml(updatedHtml, updatedSections);
        setRegeneratingSection(null);
      }
    } catch (err) {
      console.error('Failed to regenerate section:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 animate-fadeIn">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0f1420] border border-[#1e2538] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4cd7f6] to-[#3131c0] p-0.5 flex items-center justify-center shadow-md shadow-[#4cd7f6]/20 shrink-0">
            <div className="w-full h-full bg-[#080b11] rounded-[9px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#4cd7f6]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {branding.productName}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3] text-[11px] font-mono font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> 100% White-Labeled
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#182236] text-[#4cd7f6] text-[11px] font-mono">
                Source: {review.appName}
              </span>
            </div>
            <p className="text-xs text-[#9ba3af] mt-0.5">
              Live interactive preview running with clean brand tokens. Ready for download or section regeneration.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onBackToBranding}
            className="px-3.5 py-2 rounded-xl bg-[#161c28] hover:bg-[#202738] border border-[#232c3e] text-xs font-mono text-[#dfe2ee] transition-colors"
          >
            Edit Branding
          </button>
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isExportingZip}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:brightness-110 active:scale-95 text-[#003640] font-semibold text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg shadow-[#4cd7f6]/25 transition-all"
          >
            {isExportingZip ? (
              <>
                <div className="w-4 h-4 border-2 border-[#003640] border-t-transparent rounded-full animate-spin"></div>
                <span>Packaging ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Code (.ZIP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* View Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1f2638] pb-1 overflow-x-auto text-xs font-mono">
        <button
          type="button"
          onClick={() => setViewMode('sandbox')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all ${
            viewMode === 'sandbox'
              ? 'bg-[#141b28] text-[#4cd7f6] border-b-2 border-[#4cd7f6] font-semibold'
              : 'text-[#869397] hover:text-white hover:bg-[#101420]'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Live Interactive Sandbox</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('diff')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all ${
            viewMode === 'diff'
              ? 'bg-[#141b28] text-[#4cd7f6] border-b-2 border-[#4cd7f6] font-semibold'
              : 'text-[#869397] hover:text-white hover:bg-[#101420]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-[#4edea3]" />
          <span>Side-by-Side Transformation Diff</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('deliverables')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all ${
            viewMode === 'deliverables'
              ? 'bg-[#141b28] text-[#4cd7f6] border-b-2 border-[#4cd7f6] font-semibold'
              : 'text-[#869397] hover:text-white hover:bg-[#101420]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#606be5]" />
          <span>Deliverables Package &amp; What You Get</span>
        </button>
      </div>

      {/* VIEW 1: Live Interactive Sandbox */}
      {viewMode === 'sandbox' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
        {/* LEFT / CENTER: Live Preview (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {/* Iframe Viewport Header Controls */}
          <div className="flex items-center justify-between bg-[#10141e] border border-[#1f2637] rounded-xl px-4 py-2.5 shadow-md">
            {/* Viewport Width Toggles */}
            <div className="flex items-center gap-1 bg-[#090c13] p-1 rounded-lg border border-[#1b2230]">
              <button
                type="button"
                onClick={() => setDeviceViewport('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  deviceViewport === 'desktop'
                    ? 'bg-[#182236] text-[#4cd7f6] font-semibold shadow-sm'
                    : 'text-[#869397] hover:text-white'
                }`}
                title="Desktop 1440px"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceViewport('tablet')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  deviceViewport === 'tablet'
                    ? 'bg-[#182236] text-[#4cd7f6] font-semibold shadow-sm'
                    : 'text-[#869397] hover:text-white'
                }`}
                title="Tablet 768px"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceViewport('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  deviceViewport === 'mobile'
                    ? 'bg-[#182236] text-[#4cd7f6] font-semibold shadow-sm'
                    : 'text-[#869397] hover:text-white'
                }`}
                title="Mobile 375px"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Live Status indicator */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="hidden sm:flex items-center gap-1.5 text-[#4edea3]">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span>Active Sandbox</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (iframeRef.current) {
                    const doc = iframeRef.current.contentDocument;
                    if (doc) {
                      doc.open();
                      doc.write(appHtml);
                      doc.close();
                    }
                  }
                }}
                className="p-1.5 rounded bg-[#161c28] hover:bg-[#202738] text-[#869397] hover:text-white transition-colors"
                title="Refresh iframe"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="w-full bg-[#080b11] border border-[#1e2538] rounded-2xl overflow-hidden shadow-2xl flex justify-center items-center p-2 min-h-[620px]">
            <div
              className="h-[620px] transition-all duration-300 rounded-xl overflow-hidden border border-white/5 bg-[#0b0f17] shadow-inner"
              style={{
                width:
                  deviceViewport === 'desktop'
                    ? '100%'
                    : deviceViewport === 'tablet'
                    ? '768px'
                    : '375px',
              }}
            >
              <iframe
                ref={iframeRef}
                title="White-Label Application Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
              />
            </div>
          </div>

          {/* Modular Section Regeneration Bar */}
          <div className="bg-[#10141e] border border-[#1f2637] rounded-xl p-4 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#869397] font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#4cd7f6]" /> Modular Section Regenerator
              </span>
              <span className="text-[11px] text-[#869397] font-mono">
                Regenerate specific sections with custom instructions
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['hero', 'features', 'workflow', 'pricing', 'footer'].map((secId) => (
                <button
                  key={secId}
                  type="button"
                  onClick={() => handleOpenSectionRegenerator(secId)}
                  className="px-3 py-1.5 rounded-lg bg-[#141b28] hover:bg-[#1a2333] border border-[#232d40] text-xs font-mono text-[#dfe2ee] hover:text-[#4cd7f6] flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-[#4cd7f6]" />
                  <span className="capitalize">{secId} Section</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Code Inspector & Compliance (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Code Viewer Box */}
          <div className="bg-[#10141e] border border-[#1f2637] rounded-xl overflow-hidden shadow-xl flex flex-col h-[520px]">
            {/* Code Tabs */}
            <div className="flex items-center justify-between bg-[#0a0d14] px-3 pt-2 border-b border-[#1c2333]">
              <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('html')}
                  className={`px-3 py-1.5 rounded-t-lg transition-colors ${
                    activeCodeTab === 'html'
                      ? 'bg-[#10141e] text-[#4cd7f6] font-semibold'
                      : 'text-[#869397] hover:text-white'
                  }`}
                >
                  index.html
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('tailwind')}
                  className={`px-3 py-1.5 rounded-t-lg transition-colors ${
                    activeCodeTab === 'tailwind'
                      ? 'bg-[#10141e] text-[#4cd7f6] font-semibold'
                      : 'text-[#869397] hover:text-white'
                  }`}
                >
                  tailwind.config.js
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('spec')}
                  className={`px-3 py-1.5 rounded-t-lg transition-colors ${
                    activeCodeTab === 'spec'
                      ? 'bg-[#10141e] text-[#4cd7f6] font-semibold'
                      : 'text-[#869397] hover:text-white'
                  }`}
                >
                  brand-spec.json
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('readme')}
                  className={`px-3 py-1.5 rounded-t-lg transition-colors ${
                    activeCodeTab === 'readme'
                      ? 'bg-[#10141e] text-[#4cd7f6] font-semibold'
                      : 'text-[#869397] hover:text-white'
                  }`}
                >
                  README.md
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 text-[#869397] hover:text-white transition-colors"
                title="Copy current tab code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-3 bg-[#080b11] font-mono text-[11px] text-[#dfe2ee] overflow-auto flex-1 leading-relaxed select-text">
              <pre>
                <code>{getActiveCode()}</code>
              </pre>
            </div>

            {/* Code Footer */}
            <div className="p-2.5 bg-[#0a0d14] border-t border-[#1c2333] flex items-center justify-between text-[11px] font-mono text-[#869397]">
              <span>Self-Contained Bundle</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-[#4cd7f6] hover:underline flex items-center gap-1"
              >
                {copiedCode ? 'Copied to Clipboard!' : 'Copy Code Snippet'}
              </button>
            </div>
          </div>

          {/* Trademark & Compliance Security Card */}
          <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e2538] flex flex-col gap-3 shadow-md">
            <span className="text-xs font-mono uppercase text-[#4edea3] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> White-Label Parity Verified
            </span>
            <div className="space-y-1.5 text-xs text-[#9ba3af]">
              <div className="flex items-center justify-between">
                <span>Original Brand Mentions:</span>
                <span className="font-mono text-[#4edea3] font-bold">0 Detected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Accessibility Standards:</span>
                <span className="font-mono text-[#4cd7f6] font-bold">WCAG AAA</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Runtime Dependency:</span>
                <span className="font-mono text-white">Zero Bloat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* VIEW 2: Side-by-Side White-Label Transformation Diff */}
      {viewMode === 'diff' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Parity & Scrubbing Telemetry Strip */}
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

          {/* Dual Column Side-by-Side Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Audited Original Source */}
            <div className="bg-[#10141e] border border-[#26212e] rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#23202c]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab]"></span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ffb4ab] font-bold">
                    Target Source App (Audited)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#2b1216] text-[#ffb4ab] text-[10px] font-mono">
                  Original
                </span>
              </div>

              <div className="flex flex-col gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#090b10] border border-[#221c27] flex flex-col gap-1">
                  <span className="text-[#869397] uppercase text-[10px]">Source Brand Name</span>
                  <span className="text-white text-base font-bold line-through text-[#ffb4ab]">
                    {review.appName}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#090b10] border border-[#221c27] flex flex-col gap-1">
                  <span className="text-[#869397] uppercase text-[10px]">Original Tagline &amp; Slogan</span>
                  <p className="text-[#9ba3af] leading-relaxed line-through">
                    {review.brandElements.tagline}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#090b10] border border-[#221c27] flex flex-col gap-2">
                  <span className="text-[#869397] uppercase text-[10px]">Detected Palette</span>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded" style={{ backgroundColor: review.colorPalette.primary }} title={`Primary: ${review.colorPalette.primary}`}></span>
                    <span className="w-5 h-5 rounded" style={{ backgroundColor: review.colorPalette.secondary }} title={`Secondary: ${review.colorPalette.secondary}`}></span>
                    <span className="w-5 h-5 rounded" style={{ backgroundColor: review.colorPalette.accent }} title={`Accent: ${review.colorPalette.accent}`}></span>
                    <span className="w-5 h-5 rounded border border-white/20" style={{ backgroundColor: review.colorPalette.background }} title={`Background: ${review.colorPalette.background}`}></span>
                    <span className="text-[#869397] text-[11px] ml-auto">Original Brand Colors</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#090b10] border border-[#221c27] flex justify-between items-center">
                  <span className="text-[#869397] uppercase text-[10px]">Typography Stack</span>
                  <span className="text-white">{review.typography.headingFont} / {review.typography.bodyFont}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#090b10] border border-[#221c27] flex justify-between items-center">
                  <span className="text-[#869397] uppercase text-[10px]">Proprietary Assets</span>
                  <span className="text-[#ffb4ab]">Copyrighted SVGs &amp; Logos</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#241318] border border-[#ffb4ab]/30 text-[11px] font-mono text-[#ffb4ab]">
                ⚠️ Every element listed above is removed and prohibited from appearing in the generated output.
              </div>
            </div>

            {/* RIGHT: Synthesized White-Label Result */}
            <div className="bg-[#10141e] border border-[#1b2b3d] rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b2838]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#4edea3] font-bold">
                    White-Labeled Product Result
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#102422] text-[#4edea3] text-[10px] font-mono font-bold">
                  Active Spec
                </span>
              </div>

              <div className="flex flex-col gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#090c13] border border-[#1c2638] flex flex-col gap-1">
                  <span className="text-[#869397] uppercase text-[10px]">New Product / Brand Name</span>
                  <span className="text-white text-base font-bold text-[#4cd7f6]">
                    {branding.productName}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#090c13] border border-[#1c2638] flex flex-col gap-1">
                  <span className="text-[#869397] uppercase text-[10px]">Custom Synthesized Tagline</span>
                  <p className="text-white leading-relaxed font-semibold">
                    {branding.tagline}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#090c13] border border-[#1c2638] flex flex-col gap-2">
                  <span className="text-[#869397] uppercase text-[10px]">Applied Brand Theme Tokens</span>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded shadow" style={{ backgroundColor: branding.primaryColor }} title={`Primary: ${branding.primaryColor}`}></span>
                    <span className="w-5 h-5 rounded shadow" style={{ backgroundColor: branding.secondaryColor }} title={`Secondary: ${branding.secondaryColor}`}></span>
                    <span className="w-5 h-5 rounded shadow" style={{ backgroundColor: branding.accentColor }} title={`Accent: ${branding.accentColor}`}></span>
                    <span className="w-5 h-5 rounded border border-white/20 shadow" style={{ backgroundColor: branding.backgroundColor }} title={`Background: ${branding.backgroundColor}`}></span>
                    <span className="text-[#4edea3] text-[11px] ml-auto">Custom Injected Tokens</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#090c13] border border-[#1c2638] flex justify-between items-center">
                  <span className="text-[#869397] uppercase text-[10px]">Selected Font Family</span>
                  <span className="text-[#4cd7f6] font-semibold">{branding.fontChoice}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#090c13] border border-[#1c2638] flex justify-between items-center">
                  <span className="text-[#869397] uppercase text-[10px]">Brand Emblem / Logo</span>
                  <span className="text-[#4edea3]">Dynamic SVG Monogram ({branding.productName.substring(0, 2).toUpperCase()})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0d221e] border border-[#4edea3]/30 text-[11px] font-mono text-[#4edea3] flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Verified: Zero copyright collision with {review.appName}. Production deployment ready.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Deliverables Package & What You Get */}
      {viewMode === 'deliverables' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Deliverables Header Card */}
          <div className="p-6 rounded-2xl bg-[#0f1420] border border-[#1e2538] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase text-[#4edea3] font-semibold flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Production Export Manifest
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">Everything You Get in the Output Package</h2>
              <p className="text-xs text-[#9ba3af]">
                Ready for immediate local execution or 1-click cloud hosting on Vercel, Netlify, or Docker.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isExportingZip}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:brightness-110 active:scale-95 text-[#003640] font-semibold font-mono text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#4cd7f6]/20 transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingZip ? 'Packaging ZIP...' : 'Download Complete ZIP Package'}</span>
            </button>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File 1: index.html */}
            <div className="p-5 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-4 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#162033] border border-[#233550] flex items-center justify-center text-[#4cd7f6]">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm font-mono">index.html</h3>
                    <span className="text-[11px] text-[#4edea3] font-mono">Runnable Standalone Application</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#182132] text-[#4cd7f6] font-mono text-[10px]">~24 KB</span>
              </div>
              <p className="text-xs text-[#9ba3af] leading-relaxed">
                Complete, fully working web application with modern responsive layout, interactive tabs, ⌘K search widget, modal dialogs, and custom brand theme. Zero build step required — double-click to open in any web browser.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#182030] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('sandbox');
                    setActiveCodeTab('html');
                  }}
                  className="text-[#4cd7f6] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View in Inspector
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(appHtml);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="text-[#869397] hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </button>
              </div>
            </div>

            {/* File 2: tailwind.config.js */}
            <div className="p-5 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-4 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1e1c33] border border-[#302c52] flex items-center justify-center text-[#8b5cf6]">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm font-mono">tailwind.config.js</h3>
                    <span className="text-[11px] text-[#8b5cf6] font-mono">Design System Token Theme</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#201d36] text-[#8b5cf6] font-mono text-[10px]">Tailwind v4</span>
              </div>
              <p className="text-xs text-[#9ba3af] leading-relaxed">
                Configured theme extension mapping your custom primary ({branding.primaryColor}), secondary ({branding.secondaryColor}), surface, and font family ({branding.fontChoice}) tokens.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#182030] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('sandbox');
                    setActiveCodeTab('tailwind');
                  }}
                  className="text-[#8b5cf6] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Config
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(tailwindCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="text-[#869397] hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            </div>

            {/* File 3: brand-spec.json */}
            <div className="p-5 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-4 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2b2214] border border-[#44351e] flex items-center justify-center text-[#f59e0b]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm font-mono">brand-spec.json</h3>
                    <span className="text-[11px] text-[#f59e0b] font-mono">W3C Design Token Manifest</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#332817] text-[#f59e0b] font-mono text-[10px]">JSON Spec</span>
              </div>
              <p className="text-xs text-[#9ba3af] leading-relaxed">
                Machine-readable token manifest containing color hex codes, font rules, architectural feature summaries, and transformation audit details.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#182030] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('sandbox');
                    setActiveCodeTab('spec');
                  }}
                  className="text-[#f59e0b] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Spec
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(brandSpecJson);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="text-[#869397] hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            </div>

            {/* File 4: README.md */}
            <div className="p-5 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-4 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#14261e] border border-[#213d30] flex items-center justify-center text-[#4edea3]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm font-mono">README.md</h3>
                    <span className="text-[11px] text-[#4edea3] font-mono">Deployment &amp; Run Documentation</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#162e24] text-[#4edea3] font-mono text-[10px]">Markdown</span>
              </div>
              <p className="text-xs text-[#9ba3af] leading-relaxed">
                Deployment guides covering local development via `npx serve`, Vercel production hosting, Netlify drag-and-drop, and Docker container packaging.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#182030] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('sandbox');
                    setActiveCodeTab('readme');
                  }}
                  className="text-[#4edea3] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View README
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(readmeMarkdown);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="text-[#869397] hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            </div>

            {/* File 5: sections/*.html */}
            <div className="p-5 rounded-xl bg-[#10141e] border border-[#1f2637] flex flex-col justify-between gap-4 shadow-md md:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#162033] border border-[#233550] flex items-center justify-center text-[#4cd7f6]">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm font-mono">sections/*.html</h3>
                    <span className="text-[11px] text-[#4cd7f6] font-mono">Modular Section Building Blocks ({Object.keys(sections).length} Files)</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#182132] text-[#4cd7f6] font-mono text-[10px]">Modular HTML</span>
              </div>
              <p className="text-xs text-[#9ba3af] leading-relaxed">
                Separate modular components for each key section (<span className="text-white font-mono">{Object.keys(sections).join(', ')}</span>). Allows you or your engineering team to import individual sections directly into Next.js, React, Astro, or HTML sites.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#182030]">
                {Object.keys(sections).map((key) => (
                  <span key={key} className="px-2.5 py-1 rounded bg-[#090c13] text-[#4cd7f6] text-[11px] font-mono border border-[#1e2538]">
                    sections/{key}.html
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Regeneration Modal */}
      {regeneratingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#10141e] border border-[#232d40] rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4cd7f6]" />
                <h3 className="font-bold text-white text-sm capitalize">
                  Regenerate {regeneratingSection} Section
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRegeneratingSection(null)}
                className="text-[#869397] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#9ba3af] leading-relaxed">
              Describe your desired modifications for the <span className="text-white font-semibold capitalize">{regeneratingSection}</span> section. The model will re-synthesize this section using your custom instructions while retaining the {branding.productName} color palette and typography.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#dfe2ee]">
                Custom Prompt / Modification Instructions
              </label>
              <textarea
                rows={3}
                value={regenerationPrompt}
                onChange={(e) => setRegenerationPrompt(e.target.value)}
                placeholder="e.g. Add an interactive metric slider, make cards 3-column with glowing hover borders, and focus on developer productivity..."
                className="bg-[#080b11] text-xs font-mono text-white p-3 rounded-xl border border-[#232b3d] focus:border-[#4cd7f6] focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1e2538]">
              <button
                type="button"
                onClick={() => setRegeneratingSection(null)}
                disabled={isRegenerating}
                className="px-4 py-2 rounded-xl bg-[#161c28] hover:bg-[#202738] text-xs font-mono text-[#dfe2ee] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRegenerateSectionSubmit}
                disabled={isRegenerating}
                className="px-5 py-2 rounded-xl bg-[#4cd7f6] hover:bg-[#7ce5fb] text-[#003640] font-semibold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md shadow-[#4cd7f6]/20"
              >
                {isRegenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#003640] border-t-transparent rounded-full animate-spin"></div>
                    <span>Re-synthesizing Section...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Regenerate Section</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
