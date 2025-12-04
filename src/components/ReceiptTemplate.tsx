'use client';

import React from 'react';
import QRCode from 'qrcode';

interface User {
  selectedTemplate: string;
  customTemplate: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    font: string;
    layout: {
      showLogo: boolean;
      showQr: boolean;
      compactMode: boolean;
    };
  };
  businessName: string;
  address: string;
  phone: string;
  logoUrl: string;
}

interface Receipt {
  _id: string;
  receiptNumber: string;
  customerName: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  vat: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
}

interface ReceiptTemplateProps {
  receipt: Receipt;
  user: User;
  children: React.ReactNode;
}

const fonts = [
  { id: 'inter', name: 'Inter', family: 'Inter, sans-serif' },
  { id: 'roboto', name: 'Roboto', family: 'Roboto, sans-serif' },
  { id: 'opensans', name: 'Open Sans', family: 'Open Sans, sans-serif' },
  { id: 'lato', name: 'Lato', family: 'Lato, sans-serif' },
  { id: 'playfair', name: 'Playfair Display', family: 'Playfair Display, serif' },
  { id: 'merriweather', name: 'Merriweather', family: 'Merriweather, serif' }
];

export default function ReceiptTemplate({ receipt, user, children }: ReceiptTemplateProps) {
  const { selectedTemplate, customTemplate } = user;

  const getFontFamily = (fontId: string) => {
    const font = fonts.find(f => f.id === fontId);
    return font ? font.family : 'Inter, sans-serif';
  };

  const getTemplateStyles = () => {
    const baseStyles = {
      fontFamily: getFontFamily(customTemplate.font),
      '--primary-color': customTemplate.colors.primary,
      '--secondary-color': customTemplate.colors.secondary,
      '--accent-color': customTemplate.colors.accent,
    } as React.CSSProperties;

    // Apply template-specific overrides
    switch (selectedTemplate) {
      case 'modern':
        return {
          ...baseStyles,
          backgroundColor: customTemplate.colors.primary,
          color: customTemplate.colors.secondary,
          border: `2px solid ${customTemplate.colors.accent}`,
        };
      case 'minimal':
        return {
          ...baseStyles,
          backgroundColor: customTemplate.colors.secondary,
          border: `1px dashed ${customTemplate.colors.primary}`,
        };
      case 'corporate':
        return {
          ...baseStyles,
          backgroundColor: customTemplate.colors.secondary,
          borderLeft: `4px solid ${customTemplate.colors.accent}`,
        };
      default: // classic
        return {
          ...baseStyles,
          backgroundColor: customTemplate.colors.secondary,
          border: `1px solid ${customTemplate.colors.primary}`,
        };
    }
  };

  const templateClasses = [
    'receipt-template',
    `${selectedTemplate}-template`,
    customTemplate.layout.compactMode ? 'compact' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={templateClasses} style={getTemplateStyles()}>
      {customTemplate.layout.showLogo && user.logoUrl && (
        <div className="text-center mb-4">
          <img
            src={user.logoUrl}
            alt="Business Logo"
            className="w-16 h-16 mx-auto object-contain"
          />
        </div>
      )}
      {children}
      {customTemplate.layout.showQr && (
        <div className="text-center mt-4">
          <QRCodeComponent url={window.location.href} />
        </div>
      )}
    </div>
  );
}

function QRCodeComponent({ url }: { url: string }) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState('');

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
          width: 64,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrCodeDataUrl);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    };
    generateQR();
  }, [url]);

  if (!qrCodeUrl) return null;

  return (
    <div>
      <p className="text-xs mb-1">Scan to view online:</p>
      <img
        src={qrCodeUrl}
        alt="QR Code"
        className="w-12 h-12 mx-auto"
      />
    </div>
  );
}