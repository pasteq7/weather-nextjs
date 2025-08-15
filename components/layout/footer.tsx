// components/layout/footer.tsx
'use client';

import Link from 'next/link';
import { Github, Cloud } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAppContext, ApiStatus } from '@/app/context/AppContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function Footer() {
  const t = useTranslations('Footer');
  const { apiStatus } = useAppContext();

  // Determines the overall system status based on individual API statuses
  const getGeneralStatus = (): ApiStatus => {
    const statuses = [apiStatus.geolocation, apiStatus.openMeteo, apiStatus.reverseGeo];
    if (statuses.some(s => s.status === 'outage')) {
      return { status: 'outage' };
    }
    if (statuses.some(s => s.status === 'pending')) {
      return { status: 'pending' };
    }
    return { status: 'operational' };
  };

  const generalStatus = getGeneralStatus();

  // A small component for displaying individual API statuses within the tooltip
  const DetailedStatus = ({ status, label }: { status: ApiStatus, label: string }) => (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={cn(
          "h-2 w-2 rounded-full",
          status.status === 'operational' && 'bg-green-500',
          status.status === 'outage' && 'bg-red-500',
          status.status === 'pending' && 'bg-gray-400'
        )} />
        <span className="text-sm capitalize text-muted-foreground">{t(status.status)}</span>
      </div>
    </div>
  );

  return (
    <Card className="p-4 w-full">
      <div className="flex justify-between items-center gap-2 min-w-0">
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <Cloud className="h-4 w-4 md:h-5 md:w-5" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5 flex-shrink-0 cursor-help">
                <span className="text-xs hidden sm:inline whitespace-nowrap">{t('apiStatus')}</span>
                 <span className={cn(
                  "h-1.5 w-1.5 rounded-full flex-shrink-0",
                  generalStatus.status === 'operational' && 'bg-green-500',
                  generalStatus.status === 'outage' && 'bg-red-500 animate-pulse',
                  generalStatus.status === 'pending' && 'bg-gray-400' 
                )} />
              </TooltipTrigger>
              <TooltipContent className="p-3">
                <div className="flex flex-col gap-2">
                  <DetailedStatus status={apiStatus.geolocation} label={t('geolocationApi')} />
                  <DetailedStatus status={apiStatus.openMeteo} label={t('weatherApi')} />
                  <DetailedStatus status={apiStatus.reverseGeo} label={t('geocodingApi')} />
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-xs text-muted-foreground flex-shrink-0">
          <p className="hidden md:block whitespace-nowrap">
            <span className="hidden lg:inline">{t('dataBy')} </span>
            <Link 
              href="https://open-meteo.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-primary"
            >
              Open-Meteo
            </Link>
          </p>
          
          <p className="hidden xl:block whitespace-nowrap">
            {t('madeBy')} 
            <Link 
              href="https://sylvainbrehaut.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-primary ml-1"
            >
              sB
            </Link>
          </p>
          
          <Link 
            href="https://github.com/pasteq7/weather-nextjs" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary flex-shrink-0" 
            aria-label={t('githubAria')}
          >
            <Github className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}