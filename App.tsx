import React from 'react';
import RootNavigator from "./app/navigation/AppRoute";
//import RootNavigator from "./app/navigation/AppTabs";
import ProviderContainer from "./app/ProviderContainer";

export default function App() : React.JSX.Element {
  return (
    <ProviderContainer>
      <RootNavigator/>
    </ProviderContainer>
  );
}