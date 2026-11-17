declare module 'expo-linear-gradient' {
    import { ViewProps } from 'react-native';
    import React from 'react';
  
    interface LinearGradientProps extends ViewProps {
      colors: string[];
      locations?: number[];
      start?: { x: number; y: number };
      end?: { x: number; y: number };
    }
  
    export class LinearGradient extends React.Component<LinearGradientProps> {}
  }