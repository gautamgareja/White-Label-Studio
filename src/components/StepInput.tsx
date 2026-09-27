import React, { useState } from 'react';
import { Globe, ShieldCheck, Upload, AlertCircle, Sparkles, Check, ArrowRight, Image as ImageIcon, X, FileText, Lock } from 'lucide-react';
import { PRESET_DEMOS } from '../mockData';
import { PresetDemo } from '../types';

interface StepInputProps {
  url: string;
  setUrl: (url: string) => void;
  ownershipConfirmed: boolean;
  setOwnershipConfirmed: (confirmed: boolean) => void;
  onAnalyze: (options: { screenshots?: Array<{ mimeType: string; data: string }>; manualNotes?: string }) => void;
  onLoadPreset: (preset: PresetDemo) => void;
  isLoading: boolean;
  errorMessage: string | null;
  canUseScreenshotFallback: boolean;
}

export const StepInput: React.FC<StepInputProps> = ({
  url,
  setUrl,
  ownershipConfirmed,
  setOwnershipConfirmed,
  onAnalyze,
  onLoadPreset,
  isLoading,
  errorMessage,
  canUseScreenshotFallback,
}) => {
  const [urlTouched, setUrlTouched] = useState(false);
  const [screenshots, setScreenshots] = useState<Array<{ mimeType: string; data: string; preview: string; name: string }>>([]);
  const [manualNotes, setManualNotes] = useState('');
  const [showScreenshotDropzone, setShowScreenshotDropzone] = useState(false);

  // Validate URL format
  const isValidUrl = (val: string) => {
    if (!val.trim()) return false;
    try {
      const formatted = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`;
      const parsed = new URL(formatted);
      return parsed.hostname.includes('.');
    } catch {
      return false;
    }
  };

  const isUrlValid = isValidUrl(url);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const [header, base64Data] = result.split(',');
          const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
          setScreenshots((prev) => [
            ...prev,
            { mimeType, data: base64Data, preview: result, name: file.name },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlTouched(true);

    if (!ownershipConfirmed) {
      return;
    }

    if (!isUrlValid && screenshots.length === 0) {
      return;
    }

    onAnalyze({
      screenshots: screenshots.map((s) => ({ mimeType: s.mimeType, data: s.data })),
      manualNotes: manualNotes.trim() || undefined,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 animate-fadeIn">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161f2e] border border-[#23354d] text-[#4cd7f6] text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#4edea3]" />
          <span>Automated Architectural Analysis & White-Label Rebranding</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          Review any web application and generate its <span className="bg-gradient-to-r from-[#4cd7f6] via-[#606be5] to-[#4edea3] bg-clip-text text-transparent">white-label clone</span>
        </h1>
        <p className="text-sm sm:text-base text-[#9ba3af] leading-relaxed">
          Provide any web app URL. Our engine inspects its page structure, UX patterns, and UI primitives using Gemini AI, then synthesizes a pristine white-label version with your custom branding — eliminating 100% of original copyright and trademarks.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-[#10141e] border border-[#1f2637] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#3131c0]/15 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
          {/* URL Input Group */}
          <div className="flex flex-col gap-2">
            <label htmlFor="app-url-input" className="text-xs font-mono uppercase tracking-wider text-[#9ba3af] flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <Globe className="w-3.5 h-3.5 text-[#4cd7f6]" /> Target Application URL
              </span>
              <span className="text-[11px] text-[#869397]">
                Analyzed via Gemini Server-Side URL Context
              </span>
            </label>

            <div className="relative flex items-center">
              <input
                id="app-url-input"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setUrlTouched(true);
                }}
                placeholder="https://linear.app/features or https://example.com"
                disabled={isLoading}
                className={`w-full bg-[#090c13] text-white font-mono text-sm px-4 py-3.5 pl-11 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  urlTouched && !isUrlValid && url.length > 0 && screenshots.length === 0
                    ? 'border-[#ffb4ab] focus:ring-[#ffb4ab]/30'
                    : isUrlValid
                    ? 'border-[#4cd7f6]/60 focus:ring-[#4cd7f6]/40'
                    : 'border-[#262f43] focus:border-[#4cd7f6] focus:ring-[#4cd7f6]/20'
                }`}
              />
              <Globe className="w-5 h-5 text-[#869397] absolute left-3.5 pointer-events-none" />

              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute right-3.5 text-[#869397] hover:text-white p-1 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {urlTouched && url.length > 0 && !isUrlValid && screenshots.length === 0 && (
              <p className="text-xs text-[#ffb4ab] flex items-center gap-1 font-mono mt-0.5">
                <AlertCircle className="w-3 h-3" /> Please enter a valid URL with a domain (e.g., https://app.example.com)
              </p>
            )}
          </div>

          {/* Legal Ownership & Authorization Confirmation (Required) */}
          <div className="bg-[#0c1018] p-4 rounded-xl border border-[#1f2637] flex flex-col gap-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ownershipConfirmed}
                onChange={(e) => setOwnershipConfirmed(e.target.checked)}
                disabled={isLoading}
                className="mt-1 w-4 h-4 rounded bg-[#161c28] border-[#313c54] text-[#4cd7f6] focus:ring-[#4cd7f6] focus:ring-offset-0 transition-colors"
              />
              <div className="flex flex-col text-xs leading-relaxed">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
                  Ownership & Rights Confirmation <span className="text-[#ffb4ab]">*</span>
                </span>
                <span className="text-[#9ba3af] mt-0.5">
                  I confirm that I own this web application, have licensed it, or possess the express legal rights to white-label and generate a rebranded version of its architecture.
                </span>
              </div>
            </label>
            {!ownershipConfirmed && urlTouched && (
              <p className="text-[11px] text-[#ffb4ab] flex items-center gap-1 font-mono pl-7">
                <AlertCircle className="w-3 h-3 shrink-0" /> You must confirm authorization to proceed.
              </p>
            )}
          </div>

          {/* Screenshot Upload Fallback Option */}
          <div className="flex flex-col gap-2 border-t border-[#1e2535] pt-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowScreenshotDropzone(!showScreenshotDropzone)}
                className="text-xs font-mono text-[#4cd7f6] hover:text-[#7ce5fb] flex items-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>
                  {showScreenshotDropzone
                    ? 'Hide Screenshot Fallback'
                    : 'Page behind login or JS-heavy? Upload Screenshots'}
                </span>
              </button>
              {screenshots.length > 0 && (
                <span className="text-[11px] font-mono text-[#4edea3]">
                  {screenshots.length} screenshot(s) attached
                </span>
              )}
            </div>

            {(showScreenshotDropzone || canUseScreenshotFallback || screenshots.length > 0) && (
              <div className="bg-[#0a0d14] rounded-xl p-4 border border-dashed border-[#2b354c] flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9ba3af]">
                  <div>
                    <p className="font-semibold text-white">Visual Screenshot Teardown Fallback</p>
                    <p className="text-[11px] text-[#869397]">
                      Upload 1 to 4 images. Gemini vision will inspect the layout, components, and colors directly.
                    </p>
                  </div>
                  <label className="px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202a40] text-[#4cd7f6] font-mono cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {screenshots.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {screenshots.map((s, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden border border-[#232d42] bg-[#121622] group">
                        <img src={s.preview} alt={`Screenshot ${idx + 1}`} className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:text-[#ffb4ab] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 right-1 truncate text-[10px] font-mono bg-black/60 px-1 py-0.5 rounded text-[#9ba3af]">
                          {s.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Banner with Immediate Recovery Actions */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-[#241318] border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex flex-col gap-3 animate-fadeIn shadow-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-[#ffb4ab] mt-0.5" />
                <div className="flex flex-col gap-1 flex-1">
                  <span className="font-semibold text-white text-sm">Analysis Optimization Recommended</span>
                  <p className="leading-relaxed text-[#ffdad6]">{errorMessage}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#ffb4ab]/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowScreenshotDropzone(true);
                    onAnalyze({
                      manualNotes: 'Analyze this web application architecture and design patterns based on domain profile and standard SaaS components.',
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#4cd7f6] hover:bg-[#7ce5fb] text-[#003640] font-mono font-semibold text-xs transition-colors flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze via Domain Intelligence (1-Click)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowScreenshotDropzone(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202a40] text-[#dfe2ee] font-mono text-xs transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-[#4edea3]" />
                  <span>Attach Screenshots</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#869397] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              <span>All original brand names removed during synthesis</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !ownershipConfirmed || (!isUrlValid && screenshots.length === 0)}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                isLoading || !ownershipConfirmed || (!isUrlValid && screenshots.length === 0)
                  ? 'bg-[#182030] text-[#556377] cursor-not-allowed border border-[#232d40]'
                  : 'bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] text-[#003640] hover:brightness-110 active:scale-95 shadow-[#4cd7f6]/20'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#003640] border-t-transparent rounded-full animate-spin"></div>
                  <span>Performing Architectural Audit...</span>
                </>
              ) : (
                <>
                  <span>Begin Application Review</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preset 1-Click Demos */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-[#869397] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#4edea3]" /> Instant Demo Presets (Test without URL)
          </span>
          <span className="text-xs text-[#869397] font-mono">1-Click Full Flow</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_DEMOS.map((demo) => (
            <button
              key={demo.id}
              type="button"
              onClick={() => onLoadPreset(demo)}
              disabled={isLoading}
              className="text-left p-4 rounded-xl bg-[#0f1420] hover:bg-[#141b2b] border border-[#1e2638] hover:border-[#4cd7f6]/40 transition-all flex flex-col justify-between gap-3 group shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-white group-hover:text-[#4cd7f6] transition-colors text-sm">
                    {demo.title}
                  </span>
                  <span className="font-mono text-xs text-[#869397] truncate">{demo.url}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#182236] text-[#4cd7f6] border border-[#233552] shrink-0">
                  {demo.tag}
                </span>
              </div>
              <p className="text-xs text-[#9ba3af] line-clamp-2 leading-relaxed">
                {demo.review.purpose}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#182030] text-[11px] font-mono text-[#869397]">
                <span className="text-[#4edea3] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready for Rebrand
                </span>
                <span className="group-hover:translate-x-1 transition-transform text-[#4cd7f6] flex items-center gap-1">
                  Load Audit <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
