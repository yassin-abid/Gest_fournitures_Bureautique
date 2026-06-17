/**
 * Main Layout Component
 */

import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background text-on-surface font-body-md text-body-md antialiased">
      <Sidebar />
      <Header />
      {/* marginLeft = sidebar width, paddingTop = header height */}
      <main style={{ marginLeft: '80px', paddingTop: '72px', minHeight: '100vh' }} className="p-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};

MainLayout.displayName = 'MainLayout';

/**
 * Auth Layout Component
 */

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background min-h-screen flex flex-col relative overflow-hidden font-body-lg text-body-lg text-on-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Professional office environment" 
          className="w-full h-full object-cover" 
          src="/bg-login.png"
        />
        {/* Overlay to ensure readability */}
        <div className="absolute inset-0 bg-primary-container/20 backdrop-blur-[2px]"></div>
      </div>
      
      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop">
        {children}
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-10 w-full py-6 text-center">
        <p className="font-label-md text-label-md text-surface-bright/80 tracking-widest uppercase shadow-sm">
          © 2024 Groupe Hammemi - Sfax. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};

AuthLayout.displayName = 'AuthLayout';
