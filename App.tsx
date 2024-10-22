import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import RootNavigator from "./app/navigation/AppRoute";
//import RootNavigator from "./app/navigation/AppTabs";
import ProviderContainer from "./app/ProviderContainer";

// Create a client
const queryClient = new QueryClient()

export default function App(): React.JSX.Element {
  return (
    <ProviderContainer>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </ProviderContainer>
  );
}