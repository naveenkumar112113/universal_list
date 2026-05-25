import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdSettings } from '../../services/api';
import { Info, Sparkles } from 'lucide-react';

interface AdComponentProps {
  slotKey: 'home_top' | 'home_mid' | 'sidebar' | 'in_list';
  className?: string;
  previewName?: string;
  previewDescription?: string;
  previewGradient?: string;
}

export function AdComponent({ 
  slotKey, 
  className = '', 
  previewName = 'Makund Mobile Premium Parts',
  previewDescription = 'Get 15% off on your first bulk order of premium VIVO and Realme displays. Code: MAKUND15',
  previewGradient = 'from-blue-600/10 via-indigo-600/5 to-purple-600/10'
}: AdComponentProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adBlocked, setAdBlocked] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const { data: settingsData } = useQuery({
    queryKey: ['ad-settings'],
    queryFn: getAdSettings,
    staleTime: 60000, // cache for 1 minute
  });

  const adConfig = settingsData?.data?.[slotKey];

  useEffect(() => {
    if (!adConfig?.isActive) return;

    // Dynamically inject the Google AdSense script if not already present
    const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adConfig.adClient}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => setAdBlocked(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, [adConfig]);

  useEffect(() => {
    if (!adConfig?.isActive || !scriptLoaded) return;

    try {
      // Initialize the ad
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      console.warn('AdSense push error (might be blocked by adblocker):', e);
      setAdBlocked(true);
    }
  }, [adConfig, scriptLoaded]);

  if (!adConfig?.isActive) {
    return null;
  }

  // Determine standard ad sizes for styles
  const getAdDimensions = () => {
    switch (slotKey) {
      case 'home_top':
        return { height: '90px', label: 'Leaderboard (728x90)' };
      case 'home_mid':
        return { height: '110px', label: 'Mid Banner (Fluid)' };
      case 'sidebar':
        return { height: '250px', label: 'Medium Rectangle (300x250)' };
      case 'in_list':
        return { height: '80px', label: 'In-Feed Banner' };
    }
  };

  const dimensions = getAdDimensions();

  // If adblocker is active or AdSense fails to load, render a gorgeous premium sponsored card
  // This satisfies "not breaking the layout" and "WOWing the user"
  const isSidebar = slotKey === 'sidebar';

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {adBlocked || !scriptLoaded ? (
        // Premium Fallback Sponsored Card
        <div 
          className={`relative w-full rounded-2xl border border-blue-500/20 dark:border-blue-500/10 bg-gradient-to-r ${previewGradient} flex ${isSidebar ? 'flex-col p-5 space-y-4' : 'items-center justify-between p-4 sm:p-5 gap-4'} transition-all hover:border-blue-500/30 dark:hover:border-blue-500/25 group shadow-sm`}
          style={{ minHeight: dimensions.height }}
        >
          {/* Subtle grid background for high tech look */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none rounded-2xl"></div>
          
          <div className={`flex ${isSidebar ? 'flex-col items-center text-center space-y-3' : 'items-center space-x-4'}`}>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            
            <div className={isSidebar ? 'text-center' : 'text-left'}>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 rounded-full">
                  Sponsored
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center font-medium">
                  <Info className="w-3 h-3 mr-0.5" /> Ad
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {previewName}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl leading-relaxed">
                {previewDescription}
              </p>
            </div>
          </div>

          <div className={`flex ${isSidebar ? 'w-full pt-1' : 'shrink-0'}`}>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className={`text-center py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 ${isSidebar ? 'w-full' : ''}`}
            >
              Learn More
            </a>
          </div>
        </div>
      ) : (
        // Actual Google AdSense element
        <div className="flex flex-col items-center w-full">
          <div className="w-full flex items-center space-x-1.5 justify-start text-[10px] text-gray-400 dark:text-gray-500 mb-1 px-1 font-semibold">
            <span className="uppercase tracking-wider">Advertisement</span>
            <span>•</span>
            <span>Google AdSense</span>
          </div>
          <div className="w-full border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 p-2 overflow-hidden shadow-sm flex items-center justify-center">
            <ins
              ref={adRef}
              className="adsbygoogle w-full"
              style={{ 
                display: 'block', 
                minHeight: dimensions.height,
                maxHeight: dimensions.height,
                width: '100%' 
              }}
              data-ad-client={adConfig.adClient}
              data-ad-slot={adConfig.adSlot}
              data-ad-format={slotKey === 'sidebar' ? 'vertical' : 'horizontal'}
              data-full-width-responsive="true"
            />
          </div>
        </div>
      )}
    </div>
  );
}
