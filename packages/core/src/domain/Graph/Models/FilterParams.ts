export interface FilterParams {
  name: {
    values: string[];
    maxDistance: number;
  };
  minWeight: number;
}

export const defaultFilterParams = (): FilterParams => ({
  name: { values: [], maxDistance: 0 },
  minWeight: 0,
});
