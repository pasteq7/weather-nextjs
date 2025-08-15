// components/layout/footer.tsx
'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAppContext, ApiStatus } from '@/app/context/AppContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function Footer() {
  const t = useTranslations('Footer');
  const { apiStatus } = useAppContext();

  const StatusIndicator = ({ status, label }: { status: ApiStatus, label: string }) => (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1.5 flex-shrink-0">
        <span className={cn(
          "h-2 w-2 rounded-full flex-shrink-0",
          status.status === 'operational' && 'bg-green-500',
          status.status === 'outage' && 'bg-red-500 animate-pulse',
          status.status === 'pending' && 'bg-gray-400' 
        )} />
        <span className="text-xs text-muted-foreground hidden sm:inline whitespace-nowrap">{label}</span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-1 text-center">
          <p>{label}: <span className="capitalize font-semibold">{t(status.status)}</span></p>
        </div>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <Card className="p-4 w-full">
      <div className="flex justify-between items-center gap-2 min-w-0">
        
        <TooltipProvider>
          <div className="flex items-center gap-2 md:gap-4 flex-shrink min-w-0">
            <p className="text-xs font-semibold text-muted-foreground hidden lg:block flex-shrink-0 whitespace-nowrap">
              {t('apiStatus')}
            </p>
            <div className="flex items-center gap-2 md:gap-3 flex-shrink min-w-0">
              <StatusIndicator status={apiStatus.geolocation} label={t('geolocationApi')} />
              <StatusIndicator status={apiStatus.openMeteo} label={t('weatherApi')} />
              <StatusIndicator status={apiStatus.reverseGeo} label={t('geocodingApi')} />
            </div>
          </div>
        </TooltipProvider>

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