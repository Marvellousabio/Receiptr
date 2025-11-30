'use client';

import { ChartBarIcon, DocumentTextIcon, CogIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarExpanded,
  setSidebarExpanded,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}: SidebarProps) {
  return (
    <div
      className={`bg-primary shadow-sm transition-all duration-300 fixed inset-y-0 left-0 z-50 md:relative md:min-h-screen ${
        mobileSidebarOpen ? 'w-64' : 'w-0 md:w-16'
      } ${sidebarExpanded ? 'md:w-64' : 'md:w-16'}`}
    >
      <div className={`p-4 ${mobileSidebarOpen ? 'block' : 'hidden md:block'}`}>
        {(sidebarExpanded || mobileSidebarOpen) && (
          <h2 className="text-lg font-semibold text-primary mb-4">Dashboard</h2>
        )}
        <nav className="space-y-2">
          <button
            onClick={() => {
              setActiveTab('overview');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'overview'
                ? 'bg-accent text-white'
                : 'text-secondary hover:bg-secondary'
            } ${((sidebarExpanded && !mobileSidebarOpen) || mobileSidebarOpen) ? 'justify-start' : 'justify-center'}`}
          >
            <ChartBarIcon className="w-4 h-4 flex-shrink-0" />
            {((sidebarExpanded && !mobileSidebarOpen) || mobileSidebarOpen) && <span className="ml-2 truncate">Overview</span>}
          </button>
          <button
            onClick={() => {
              setActiveTab('receipts');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'receipts'
                ? 'bg-accent text-white'
                : 'text-secondary hover:bg-secondary'
            } ${((sidebarExpanded && !mobileSidebarOpen) || mobileSidebarOpen) ? 'justify-start' : 'justify-center'}`}
          >
            <DocumentTextIcon className="w-4 h-4 flex-shrink-0" />
            {((sidebarExpanded && !mobileSidebarOpen) || mobileSidebarOpen) && <span className="ml-2 truncate">Receipts</span>}
          </button>
          <button
            onClick={() => {
              setActiveTab('templates');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'templates'
                ? 'bg-accent text-white'
                : 'text-secondary hover:bg-secondary'
            } ${((sidebarExpanded && !mobileSidebarOpen) || mobileSidebarOpen) ? 'justify-start' : 'justify-center'}`}
          >
            <DocumentTextIcon className="w-4 h-4 flex-shrink-0" />
            {((sidebarExpanded && !mobileSidebarOpen) || mobileSidebarOpen) && <span className="ml-2 truncate">Templates</span>}
          </button>
          <button
            onClick={() => {
              setActiveTab('settings');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'settings'
                ? 'bg-accent text-white'
                : 'text-secondary hover:bg-secondary'
            } ${((sidebarExpanded && !mobileSidebarOpen) || mobileSidebarOpen) ? 'justify-start' : 'justify-center'}`}
          >
            <CogIcon className="w-4 h-4 flex-shrink-0" />
            {((sidebarExpanded && !mobileSidebarOpen) || mobileSidebarOpen) && <span className="ml-2 truncate">Business Settings</span>}
          </button>
        </nav>
      </div>
    </div>
  );
}