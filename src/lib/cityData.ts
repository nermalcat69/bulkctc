import citiesData from "@/content/cities.json";

export type CityData = {
  city: string;
  state: string;
  nearbyAreas: string[];
  industries: string[];
  transitDays: string;
  cityContext: string;
  usageFocus: string;
  faqs: { question: string; answer: string }[];
  supplyChain: { source: string; moq: string; packagingSizes: string[] };
  localContext: { coordinates: { lat: number; lng: number } };
};

export type AllCitiesData = Record<string, Record<string, CityData>>;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAllCities(): AllCitiesData {
  return citiesData as AllCitiesData;
}

export function getCityInfoFromSlugs(
  stateSlug: string,
  citySlug: string
): CityData | null {
  const allCities = getAllCities();
  const stateEntry = Object.entries(allCities).find(
    ([state]) => slugify(state) === stateSlug
  );
  if (!stateEntry) return null;
  const [, cities] = stateEntry;
  const cityEntry = Object.entries(cities).find(
    ([city]) => slugify(city) === citySlug
  );
  if (!cityEntry) return null;
  return cityEntry[1];
}

export function getStateNameFromSlug(stateSlug: string): string | null {
  const allCities = getAllCities();
  const stateEntry = Object.entries(allCities).find(
    ([state]) => slugify(state) === stateSlug
  );
  return stateEntry ? stateEntry[0] : null;
}

export function getCitiesForState(stateSlug: string): CityData[] {
  const allCities = getAllCities();
  const stateEntry = Object.entries(allCities).find(
    ([state]) => slugify(state) === stateSlug
  );
  if (!stateEntry) return [];
  return Object.values(stateEntry[1]);
}

export function getRelatedCities(
  currentCitySlug: string,
  stateSlug: string
): CityData[] {
  const allCities = getAllCities();
  const stateEntry = Object.entries(allCities).find(
    ([state]) => slugify(state) === stateSlug
  );
  if (!stateEntry) return [];
  return Object.entries(stateEntry[1])
    .filter(([city]) => slugify(city) !== currentCitySlug)
    .map(([, data]) => data);
}

export function getAllCityPages(): { state: string; city: string }[] {
  const allCities = getAllCities();
  const pages: { state: string; city: string }[] = [];
  for (const [state, cities] of Object.entries(allCities)) {
    for (const city of Object.keys(cities)) {
      pages.push({ state: slugify(state), city: slugify(city) });
    }
  }
  return pages;
}

export function getAllStatePages(): { state: string; stateName: string }[] {
  const allCities = getAllCities();
  return Object.keys(allCities).map((state) => ({
    state: slugify(state),
    stateName: state,
  }));
}
