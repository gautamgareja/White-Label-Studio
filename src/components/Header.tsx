import React from 'react';
import { StudioStep } from '../types';
import { Sparkles, Layers, ShieldCheck, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentStep: StudioStep;
  onSelectStep: (step: StudioStep) => void;
  canNavigateTo: (step: StudioStep) => boolean;
  onReset: () => void;
}

const STEPS: { id: StudioStep; label: string; number: string; icon: string }[] = [
  { id: 'input', label: 'Target URL', number: '01', icon: 'link' },
  { id: 'review', label: 'Architecture Review', number: '02', icon: 'schema' },
  { id: 'branding', label: 'Brand Studio', number: '03', icon: 'palette' },
  { id: 'preview', label: 'Preview & Export', number: '04', icon: 'rocket' },
];

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  canNavigateTo,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0d14]/90 backdrop-blur-md border-b border-[#1e2433] px-4 lg:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
      {/* Brand & Title */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4cd7f6] via-[#06b6d4] to-[#3131c0] p-0.5 flex items-center justify-center shadow-md shadow-[#06b6d4]/20">
            <div className="w-full h-full bg-[#080b11] rounded-[6px] flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#4cd7f6]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                White Label Studio
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase tracking-wider bg-[#06b6d4]/15 text-[#4cd7f6] border border-[#06b6d4]/30 font-semibold">
                v2.4 AST
              </span>
            </div>
            <p className="text-[11px] text-[#869397] hidden sm:block">
              Architectural Review & White-Label Rebranding Engine
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="md:hidden p-1.5 rounded bg-[#161c28] text-[#869397] hover:text-white transition-colors"
          title="Start New Project"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Centered Step Progress Bar */}
      <nav className="flex items-center gap-1 bg-[#0f1420] p-1 rounded-xl border border-[#1e2433] max-w-full overflow-x-auto text-xs font-mono">
        {STEPS.map((s, idx) => {
          const isCurrent = currentStep === s.id;
          const isEnabled = canNavigateTo(s.id);

          return (
            <React.Fragment key={s.id}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-[#3d494c] shrink-0" />}
              <button
                type="button"
                onClick={() => isEnabled && onSelectStep(s.id)}
                disabled={!isEnabled}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all select-none whitespace-nowrap ${
                  isCurrent
                    ? 'bg-[#1e2538] text-[#4cd7f6] font-semibold shadow-sm border border-[#4cd7f6]/40'
                    : isEnabled
                    ? 'text-[#dfe2ee] hover:bg-[#161c28] hover:text-white cursor-pointer'
                    : 'text-[#4e5960] cursor-not-allowed opacity-60'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                    isCurrent
                      ? 'bg-[#4cd7f6] text-[#003640]'
                      : isEnabled
                      ? 'bg-[#262e40] text-[#93a1ad]'
                      : 'bg-[#151922] text-[#4e5960]'
                  }`}
                >
                  {s.number}
                </span>
                <span>{s.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Right Telemetry Badge & Quick Restart */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#111624] border border-[#1e2638] text-[11px] font-mono text-[#869397]">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
          <span>Zero Trademark Risk</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161c28] hover:bg-[#202738] border border-[#273044] text-[#dfe2ee] hover:text-white text-xs font-mono transition-colors"
          title="Reset and start new analysis"
        >
          <RefreshCw className="w-3 h-3 text-[#4cd7f6]" />
          <span>New Session</span>
        </button>
      </div>
    </header>
  );
};
