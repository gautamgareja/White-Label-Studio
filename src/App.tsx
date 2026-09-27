import React, { useState } from 'react';
import { StudioStep, AppReviewData, BrandDetails, PresetDemo } from './types';
import { Header } from './components/Header';
import { StepInput } from './components/StepInput';
import { StepReview } from './components/StepReview';
import { StepBranding } from './components/StepBranding';
import { StepPreviewExport } from './components/StepPreviewExport';
import { PRESET_DEMOS } from './mockData';

export default function App() {
  const [currentStep, setCurrentStep] = useState<StudioStep>('input');

  // Step 1: Input State
  const [url, setUrl] = useState('');
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [canUseScreenshotFallback, setCanUseScreenshotFallback] = useState(false);

  // Step 2: Review State
  const [review, setReview] = useState<AppReviewData | null>(null);

  // Step 3: Branding State
  const [branding, setBranding] = useState<BrandDetails>({
    productName: 'ApexFlow Studio',
    tagline: 'High-velocity directional execution for modern software engineering',
    primaryColor: '#06b6d4',
    secondaryColor: '#5e6ad2',
    accentColor: '#4edea3',
    backgroundColor: '#080b11',
    surfaceColor: '#121622',
    textColor: '#dfe2ee',
    fontChoice: 'Geist',
    toneOfVoice: 'Developer-First & High Velocity',
    logoType: 'monogram',
    contactEmail: 'support@apexflow.dev',
    companyName: 'ApexFlow Technologies Inc.',
  });

  // Step 4: Generated Output State
  const [isGeneratingApp, setIsGeneratingApp] = useState(false);
  const [appHtml, setAppHtml] = useState<string>('');
  const [sections, setSections] = useState<Record<string, string>>({});
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // 1. Analyze URL / Screenshots Handler
  const handleAnalyze = async (options: {
    screenshots?: Array<{ mimeType: string; data: string }>;
    manualNotes?: string;
  }) => {
    setIsAnalyzing(true);
    setInputError(null);
    setCanUseScreenshotFallback(false);

    try {
      const response = await fetch('/api/analyze-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          ownershipConfirmed,
          screenshots: options.screenshots,
          manualContext: options.manualNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setInputError(data.error || 'Failed to analyze application. Please verify the URL or try uploading screenshots.');
        setCanUseScreenshotFallback(Boolean(data.canUseScreenshotFallback));
        return;
      }

      setReview(data.review);

      // Pre-fill branding with sensible defaults based on analysis
      if (data.review) {
        const brandName = `${data.review.appName} Pro WhiteLabel`;
        setBranding((prev) => ({
          ...prev,
          productName: prev.productName || brandName,
          tagline: prev.tagline || data.review.brandElements.tagline,
          primaryColor: data.review.colorPalette.primary || prev.primaryColor,
          secondaryColor: data.review.colorPalette.secondary || prev.secondaryColor,
          backgroundColor: data.review.colorPalette.background || prev.backgroundColor,
          surfaceColor: data.review.colorPalette.surface || prev.surfaceColor,
        }));
      }

      setCurrentStep('review');
    } catch (err: any) {
      console.error('Analysis request error:', err);
      setInputError(err?.message || 'Network error communicating with analysis engine.');
      setCanUseScreenshotFallback(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Load Preset Demo Handler
  const handleLoadPreset = (preset: PresetDemo) => {
    setUrl(preset.url);
    setOwnershipConfirmed(true);
    setReview(preset.review);
    setBranding(preset.recommendedBrand);
    setCurrentStep('review');
  };

  // 3. Generate White-Label Application Code Handler
  const handleGenerateApp = async () => {
    if (!review) return;
    setIsGeneratingApp(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate-whitelabel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review,
          branding,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setGenerationError(data.error || 'Failed to synthesize white-label application code. Please try again.');
        return;
      }

      setAppHtml(data.appHtml);
      setSections(data.sections || {});
      setCurrentStep('preview');
    } catch (err: any) {
      console.error('Generation request error:', err);
      setGenerationError(err?.message || 'Error communicating with generation engine.');
    } finally {
      setIsGeneratingApp(false);
    }
  };

  const handleResetConfirm = () => {
    setUrl('');
    setOwnershipConfirmed(false);
    setReview(null);
    setAppHtml('');
    setSections({});
    setShowResetModal(false);
    setCurrentStep('input');
  };

  const canNavigateTo = (step: StudioStep): boolean => {
    switch (step) {
      case 'input':
        return true;
      case 'review':
        return review !== null;
      case 'branding':
        return review !== null;
      case 'preview':
        return appHtml !== '';
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#dfe2ee] flex flex-col font-sans selection:bg-[#4cd7f6]/30 selection:text-[#4cd7f6]">
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        canNavigateTo={canNavigateTo}
        onReset={() => setShowResetModal(true)}
      />

      {/* Generation Error Banner */}
      {generationError && (
        <div className="w-full max-w-4xl mx-auto px-4 mt-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-[#241318] border border-[#ffb4ab]/40 flex items-start justify-between gap-3 text-xs font-mono text-[#ffb4ab]">
            <div className="flex items-center gap-2">
              <span className="font-bold">Generation Error:</span>
              <span>{generationError}</span>
            </div>
            <button
              type="button"
              onClick={() => setGenerationError(null)}
              className="text-[#ffb4ab] hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Viewport */}
      <main className="flex-1 flex flex-col">
        {currentStep === 'input' && (
          <StepInput
            url={url}
            setUrl={setUrl}
            ownershipConfirmed={ownershipConfirmed}
            setOwnershipConfirmed={setOwnershipConfirmed}
            onAnalyze={handleAnalyze}
            onLoadPreset={handleLoadPreset}
            isLoading={isAnalyzing}
            errorMessage={inputError}
            canUseScreenshotFallback={canUseScreenshotFallback}
          />
        )}

        {currentStep === 'review' && review && (
          <StepReview
            review={review}
            onUpdateReview={setReview}
            onProceedToBranding={() => setCurrentStep('branding')}
            onBackToInput={() => setCurrentStep('input')}
          />
        )}

        {currentStep === 'branding' && review && (
          <StepBranding
            branding={branding}
            onUpdateBranding={setBranding}
            review={review}
            onGenerateApp={handleGenerateApp}
            onBackToReview={() => setCurrentStep('review')}
            isGenerating={isGeneratingApp}
          />
        )}

        {currentStep === 'preview' && review && (
          <StepPreviewExport
            appHtml={appHtml}
            sections={sections}
            onUpdateAppHtml={(updatedHtml, updatedSections) => {
              setAppHtml(updatedHtml);
              setSections(updatedSections);
            }}
            review={review}
            branding={branding}
            onBackToBranding={() => setCurrentStep('branding')}
            onReset={() => setShowResetModal(true)}
          />
        )}
      </main>

      {/* Non-blocking Reset Confirmation Dialog */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#10141e] border border-[#273248] rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white">Start New White-Label Session?</h3>
            <p className="text-xs text-[#9ba3af] leading-relaxed">
              This will clear the current analysis and white-labeled app. You can always restart or load one of the quick presets (Linear, Notion) at any time.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-[#161c28] hover:bg-[#202738] text-xs font-mono text-[#dfe2ee] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetConfirm}
                className="px-4 py-2 rounded-xl bg-[#ffb4ab]/20 hover:bg-[#ffb4ab]/30 border border-[#ffb4ab]/40 text-xs font-mono text-[#ffb4ab] transition-colors font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
