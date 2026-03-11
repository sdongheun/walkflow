export type RootStackParamList = {
  Search: undefined;
  Map: {
    destinationName: string;
    destinationCoords?: { latitude: number; longitude: number };
  };
};
