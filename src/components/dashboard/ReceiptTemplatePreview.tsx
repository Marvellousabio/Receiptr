'use client';

interface ReceiptTemplatePreviewProps {
  templateId: string;
}

export default function ReceiptTemplatePreview({ templateId }: ReceiptTemplatePreviewProps) {
  const baseClasses = "w-full h-20 rounded p-1 text-[8px] overflow-hidden shadow-inner flex flex-col justify-between";

  // --- Classic Template ---
  if (templateId === 'classic') {
    return (
      <div className={`${baseClasses} bg-white border border-gray-300 text-gray-800`}>
        <div className="flex justify-between font-bold border-b border-gray-400 pb-0.5">
          <span className="text-xs">Invoice</span>
          <span className="text-xs">#001</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Item A</span>
          <span className="font-semibold">₦500.00</span>
        </div>
        <div className="flex justify-between">
          <span>Item B</span>
          <span className="font-semibold">₦1,200.00</span>
        </div>
        <div className="border-t border-gray-400 pt-0.5 mt-auto flex justify-between font-extrabold text-xs">
          <span>Total:</span>
          <span>₦1,700.00</span>
        </div>
      </div>
    );
  }

  // --- Modern Template ---
  if (templateId === 'modern') {
    return (
      <div className={`${baseClasses} bg-blue-900 text-white border-2 border-green-400`}>
        <div className="text-center bg-green-400 text-blue-900 font-extrabold p-0.5">
          MODERN RECEIPT
        </div>
        <div className="flex justify-between mt-1 text-gray-200">
          <span>Qty 2 x Item</span>
          <span className="font-semibold">₦1,000</span>
        </div>
        <div className="flex justify-between mt-auto font-bold text-sm">
          <span>TOTAL PAID</span>
          <span className="text-green-400">₦1,000.00</span>
        </div>
      </div>
    );
  }

  // --- Minimal Template ---
  if (templateId === 'minimal') {
    return (
      <div className={`${baseClasses} bg-white border border-dashed border-gray-500 font-sans text-gray-900`}>
        <div className="flex justify-between text-xs mb-1">
          <span className="font-light">Date: 10/25/25</span>
          <span className="font-light">Cash</span>
        </div>
        <p>Description...........................Price</p>
        <p>Services...................................₦900</p>
        <p className="mt-auto text-right font-bold pt-1 border-t border-gray-500 border-dashed">
          Grand Total ₦900.00
        </p>
      </div>
    );
  }

  // --- Corporate Template ---
  if (templateId === 'corporate') {
    return (
      <div className={`${baseClasses} bg-gray-100 border-l-4 border-red-600 text-gray-800`}>
        <div className="font-bold text-red-600 mb-1">
          <span className="text-xs">Company Name</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 text-[7px] text-gray-600">
          <p>Customer: John Doe</p>
          <p className="text-right">Ref: CORP-99</p>
        </div>
        <div className="mt-auto pt-1 border-t border-red-600 flex justify-between font-extrabold text-sm">
          <span>Balance Due:</span>
          <span className="text-red-600">₦2,500.00</span>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-20 bg-secondary rounded flex items-center justify-center">
      <span className="text-2xl font-bold text-primary">{templateId.charAt(0)}</span>
    </div>
  );
}