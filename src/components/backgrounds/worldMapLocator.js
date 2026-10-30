// Resolves a point on /world-map.svg (950x620 viewBox) to a rough place name and coordinates.
// The map is a Miller cylindrical projection; the constants below were fitted against known
// country extents (≈2–3° accuracy), which is fine for a "rough location" readout.

export const MAP_W = 950;
export const MAP_H = 620;

const X_AT_LON0 = 460.3;
const PX_PER_DEG_LON = 2.595;
const Y_AT_EQUATOR = 344.1;
const PX_PER_MILLER_UNIT = 164.8;

export function mapToLonLat(x, y) {
  const lon = (x - X_AT_LON0) / PX_PER_DEG_LON;
  const millerY = (Y_AT_EQUATOR - y) / PX_PER_MILLER_UNIT;
  const lat = (2.5 * Math.atan(Math.exp(0.8 * millerY)) - 0.625 * Math.PI) * (180 / Math.PI);
  return [Math.max(-180, Math.min(180, lon)), Math.max(-90, Math.min(90, lat))];
}

// Map path ids that name an island or region rather than the country
const ALIASES = {
  kalimantan: 'indonesia', sumatra: 'indonesia', java: 'indonesia', sulawesi: 'indonesia', bali: 'indonesia',
  lombok: 'indonesia', sumba: 'indonesia', flores: 'indonesia', maluku: 'indonesia', seram: 'indonesia',
  'irian jaya': 'indonesia', timor: 'timor', 'east malaysia': 'malaysia',
  honshu: 'japan', kyushu: 'japan', shikoku: 'japan', hokkaido: 'japan',
  luzon: 'philippines', mindoro: 'philippines', palawan: 'philippines', negros: 'philippines', cebu: 'philippines', samar: 'philippines',
  usa: 'united states', alaska: 'united states', 'alaska-westcopy': 'united states', hawaii: 'united states', oahu: 'united states', kauai: 'united states', kahului: 'united states',
  britain: 'united kingdom', ulster: 'united kingdom', 'falklands west': 'falkland islands', 'falklands east': 'falkland islands',
  'new zealand north island': 'new zealand', 'new zealand south island': 'new zealand', tasmania: 'australia',
  sicily: 'italy', sardinia: 'italy', corsica: 'france', guyane: 'french guiana', majorca: 'spain', crete: 'greece', thrace: 'turkey',
  sjælland: 'denmark', gotland: 'sweden', hiumaa: 'estonia', saaremaa: 'estonia', spitsbergen: 'svalbard', nordaustlandet: 'svalbard', edgeoya: 'svalbard',
  'east antarctica': 'antarctica', 'antarctic peninsula': 'antarctica', thurston: 'antarctica', alexander: 'antarctica',
  drc: 'dr congo', ivoire: "côte d'ivoire", centrafrique: 'central african rep.', guinee: 'guinea', mauretania: 'mauritania',
  burkina: 'burkina faso', bissau: 'guinea-bissau', casamance: 'senegal', somaliland: 'somalia', soqotra: 'yemen', cabinda: 'angola',
  bioko: 'equatorial guinea', 'domincan republic': 'dominican republic', 'haiti-dominican border': 'hispaniola', kirgizstan: 'kyrgyzstan',
  burma: 'myanmar', saudi: 'saudi arabia', emirates: 'uae', czech: 'czechia', 'tierra del fuego chile': 'chile',
  'tierra del fuego argentina': 'argentina', chiloe: 'chile', disko: 'greenland', milne: 'greenland', 'sri lanka': 'sri lanka',
};

const RUSSIAN_ISLANDS = ['sakhalin', 'iturup', 'urup', 'paramushir', 'onekotan', 'bering island', 'medny', 'chukotka', 'wrangel', 'wrangel-w',
  'novaya zemlya north', 'novaya zemlya south', 'komsomolets', 'october', 'bolshevik', 'kotelny', 'novaya sibir', 'lyakhovsky',
  'prince george', 'salisbury', 'wilczek', 'bell'];
const CANADIAN_ISLANDS = ['banks', 'prince patrick', 'eglinton', 'mackenzie king', 'king christian', 'ellef ringnes', 'amund ringnes',
  'axel heiberg', 'victoria', 'prince of wales', 'prescott', 'cornwallis', 'bathurst', 'devon', 'baffin', 'bylot', 'ellesmere',
  'southhampton', 'newfoundland', 'haida gwaii', 'vancouver'];
RUSSIAN_ISLANDS.forEach((id) => { ALIASES[id] = 'russia'; });
CANADIAN_ISLANDS.forEach((id) => { ALIASES[id] = 'canada'; });

function oceanAt(lon, lat) {
  if (lat > 66) return 'ARCTIC OCEAN';
  if (lat < -60) return 'SOUTHERN OCEAN';
  if (lat > 30 && lat < 46 && lon > -6 && lon < 36) return 'MEDITERRANEAN SEA';
  if (lat > 53 && lat < 66 && lon > 10 && lon < 30) return 'BALTIC SEA';
  if (lon >= 20 && lon < 120 && lat < 25) return 'INDIAN OCEAN';
  if ((lon >= -70 && lon < 20) || (lat > 8 && lon > -98 && lon < -70)) return 'ATLANTIC OCEAN';
  return 'PACIFIC OCEAN';
}

let regionsPromise = null;

// Lazily parses the map's country paths into Path2D shapes for hit-testing
function loadRegions() {
  regionsPromise ??= fetch('/world-map.svg')
    .then((res) => res.text())
    .then((text) => {
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      return [...doc.querySelectorAll('path[id][d]')]
        .filter((el) => !/^path\d+$/.test(el.id))
        .map((el) => ({ name: (ALIASES[el.id] ?? el.id).toUpperCase(), shape: new Path2D(el.getAttribute('d')) }));
    })
    .catch(() => []);
  return regionsPromise;
}

let hitContext = null;

export async function createLocator() {
  const regions = await loadRegions();
  hitContext ??= document.createElement('canvas').getContext('2d');

  return (x, y) => {
    const [lon, lat] = mapToLonLat(x, y);
    const region = regions.find((r) => hitContext.isPointInPath(r.shape, x, y));
    return { name: region ? region.name : oceanAt(lon, lat), lon, lat };
  };
}

export function formatLonLat(lon, lat) {
  const ns = `${Math.abs(Math.round(lat))}°${lat >= 0 ? 'N' : 'S'}`;
  const ew = `${Math.abs(Math.round(lon))}°${lon >= 0 ? 'E' : 'W'}`;
  return `~${ns} ${ew}`;
}
