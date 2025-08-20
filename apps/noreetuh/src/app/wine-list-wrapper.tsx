'use client';

import dynamic from 'next/dynamic';

const WineList = dynamic(() => import('@/components/WineList'), {
  ssr: false,
});

export default function WineListWrapper() {
  return <WineList />;
}