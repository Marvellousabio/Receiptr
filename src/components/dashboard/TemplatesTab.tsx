'use client';

import ReceiptTemplatePreview from './ReceiptTemplatePreview';

interface TemplatesTabProps {
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  setCustomColors: (colors: { primary: string; secondary: string; accent: string }) => void;
  customFont: string;
  setCustomFont: (font: string) => void;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  handleTemplateSubmit: () => void;
  saving: boolean;
  error: string;
  success: string;
}

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean and professional design',
    preview: 'Simple layout with standard styling'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold colors',
    preview: 'Modern layout with accent colors'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant',
    preview: 'Minimalist design with subtle styling'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Formal business template',
    preview: 'Professional corporate styling'
  }
];

const fonts = [
  { id: 'inter', name: 'Inter', family: 'Inter, sans-serif' },
  { id: 'roboto', name: 'Roboto', family: 'Roboto, sans-serif' },
  { id: 'opensans', name: 'Open Sans', family: 'Open Sans, sans-serif' },
  { id: 'lato', name: 'Lato', family: 'Lato, sans-serif' },
  { id: 'playfair', name: 'Playfair Display', family: 'Playfair Display, serif' },
  { id: 'merriweather', name: 'Merriweather', family: 'Merriweather, serif' }
];

export default function TemplatesTab({
  selectedTemplate,
  setSelectedTemplate,
  customColors,
  setCustomColors,
  customFont,
  setCustomFont,
  showAdvanced,
  setShowAdvanced,
  handleTemplateSubmit,
  saving,
  error,
  success,
}: TemplatesTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-primary p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-primary mb-4">Choose Receipt Template</h2>
        <p className="text-secondary mb-6">Select a template for your receipts. This will be applied to all new receipts.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`cursor-pointer border-2 rounded-lg p-4 transition-colors ${
                selectedTemplate === template.id
                  ? 'border-accent bg-accent bg-opacity-10'
                  : 'border-color hover:border-accent'
              }`}
            >
              <div className="text-center">
                <div className="w-full h-20 mb-3 bg-secondary rounded flex items-center justify-center">
                  <ReceiptTemplatePreview templateId={template.id} />
                </div>
                <h3 className="font-semibold text-primary">{template.name}</h3>
                <p className="text-sm text-secondary mt-1">{template.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleTemplateSubmit}
            disabled={saving}
            className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-accent text-white focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>

      <div className="bg-primary p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-primary">Advanced Customization</h2>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-secondary text-primary hover:bg-accent hover:text-white focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-primary mb-3">Color Scheme</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-secondary mb-1">Primary Color</label>
                    <input
                      id="primaryColor"
                      type="color"
                      value={customColors.primary}
                      onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
                      className="w-full h-10 rounded border border-color"
                      title="Primary Color"
                    />
                  </div>
                  <div>
                    <label htmlFor="secondaryColor" className="block text-sm font-medium text-secondary mb-1">Secondary Color</label>
                    <input
                      id="secondaryColor"
                      type="color"
                      value={customColors.secondary}
                      onChange={(e) => setCustomColors({...customColors, secondary: e.target.value})}
                      className="w-full h-10 rounded border border-color"
                      title="Secondary Color"
                    />
                  </div>
                  <div>
                    <label htmlFor="accentColor" className="block text-sm font-medium text-secondary mb-1">Accent Color</label>
                    <input
                      id="accentColor"
                      type="color"
                      value={customColors.accent}
                      onChange={(e) => setCustomColors({...customColors, accent: e.target.value})}
                      className="w-full h-10 rounded border border-color"
                      title="Accent Color"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-primary mb-3">Typography</h3>
                <div>
                  <label htmlFor="fontFamily" className="block text-sm font-medium text-secondary mb-1">Font Family</label>
                  <select
                    id="fontFamily"
                    value={customFont}
                    onChange={(e) => setCustomFont(e.target.value)}
                    className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    title="Font Family"
                  >
                    {fonts.map((font) => (
                      <option key={font.id} value={font.id} style={{ fontFamily: font.family }}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-secondary mb-2">Preview</h4>
                  <div
                    className="p-3 bg-secondary rounded border"
                    style={{ fontFamily: fonts.find(f => f.id === customFont)?.family }}
                  >
                    <p className="text-sm">Sample receipt text with selected font</p>
                    <p className="text-xs text-secondary">₦1,250.00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-md font-medium text-primary mb-3">Layout Options</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showLogo"
                    className="h-4 w-4 text-accent focus:ring-accent border-color rounded"
                    defaultChecked
                  />
                  <label htmlFor="showLogo" className="ml-2 text-sm text-secondary">
                    Show business logo
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showQr"
                    className="h-4 w-4 text-accent focus:ring-accent border-color rounded"
                    defaultChecked
                  />
                  <label htmlFor="showQr" className="ml-2 text-sm text-secondary">
                    Include QR code
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="compactMode"
                    className="h-4 w-4 text-accent focus:ring-accent border-color rounded"
                  />
                  <label htmlFor="compactMode" className="ml-2 text-sm text-secondary">
                    Compact layout
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-accent text-white focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                Save Customizations
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-primary p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-primary mb-4">Custom Templates</h2>
        <p className="text-secondary mb-4">Create your own custom receipt template with personalized styling.</p>
        <button
          className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-primary text-primary hover:bg-secondary focus:ring-2 focus:ring-accent focus:ring-offset-2 border border-color"
        >
          Create Custom Template
        </button>
      </div>
    </div>
  );
}