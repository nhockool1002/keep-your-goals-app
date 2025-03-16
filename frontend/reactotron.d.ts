declare global {
    interface Console {
      tron: typeof import('reactotron-react-native').default;
    }
  }
  
  export {};
  