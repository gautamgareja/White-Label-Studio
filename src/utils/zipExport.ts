import JSZip from 'jszip';
import { AppReviewData, BrandDetails } from '../types';

export async function createWhiteLabelZip(
  appHtml: string,
  review: AppReviewData,
  branding: BrandDetails,
  sections: Record<string, string>
): Promise<Blob> {
  const zip = new JSZip();

  // 1. Root index.html
  zip.file('index.html', appHtml);

  // 2. brand-spec.json
  const brandSpec = {
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
        text: branding.textColor,
      },
      typography: {
        fontFamily: branding.fontChoice,
      },
    },
    architectureAudit: {
      sourceAppOriginal: review.appName,
      purpose: review.purpose,
      targetUsers: review.targetUsers,
      keyFeatures: review.keyFeatures,
      uxRemediationsApplied: review.uxAndAccessibilityIssues,
      sections: review.pageStructure.sections,
    },
    generatedAt: new Date().toISOString(),
    generator: 'White Label Studio Pro',
  };
  zip.file('brand-spec.json', JSON.stringify(brandSpec, null, 2));

  // 3. tailwind.config.js
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
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
};
`;
  zip.file('tailwind.config.js', tailwindConfig);

  // 4. README.md
  const readme = `# ${branding.productName} — White-Label Application

> ${branding.tagline}

Generated automatically by **White Label Studio**.
This repository contains a 100% white-labeled, production-ready web application built from the architectural review of **${review.appName}**, with all original brand marks, copyrighted texts, and assets replaced with custom branding for **${branding.productName}**.

---

## 🎨 Brand Design System Tokens

- **Brand Name**: \`${branding.productName}\`
- **Tone of Voice**: \`${branding.toneOfVoice}\`
- **Primary Color**: \`${branding.primaryColor}\`
- **Secondary Color**: \`${branding.secondaryColor}\`
- **Accent Color**: \`${branding.accentColor}\`
- **Background Color**: \`${branding.backgroundColor}\`
- **Surface Color**: \`${branding.surfaceColor}\`
- **Font Stack**: \`${branding.fontChoice}\`

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Run
Double-click \`index.html\` or open it in any web browser. It is fully self-contained with Tailwind CSS loaded via CDN and Google Fonts.

### Option 2: Local HTTP Server
\`\`\`bash
# Using npx serve
npx serve .

# Or using Python 3
python3 -m http.server 3000
\`\`\`
Visit \`http://localhost:3000\`.

---

## 🌐 Deploy to Production

- **Vercel**: Run \`vercel\` in this directory or drag-and-drop the unzipped folder into your Vercel dashboard.
- **Netlify**: Drag and drop the folder into the Netlify Drop app.
- **GitHub Pages**: Push this directory to your \`gh-pages\` branch.

---

## 🛡️ License & Compliance
This white-label package contains original copy and custom tokens created specifically for ${branding.companyName || branding.productName}.
`;
  zip.file('README.md', readme);

  // 5. Modular section files
  const sectionsFolder = zip.folder('sections');
  if (sectionsFolder) {
    for (const [sectionKey, sectionHtml] of Object.entries(sections)) {
      sectionsFolder.file(`${sectionKey}.html`, sectionHtml);
    }
  }

  // Generate and return Blob
  return await zip.generateAsync({ type: 'blob' });
}
