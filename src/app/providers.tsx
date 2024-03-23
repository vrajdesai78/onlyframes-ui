'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
          logo: '/onlyframes.png',
        },
        loginMethods: ['farcaster'],
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}