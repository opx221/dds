import qrcode from 'qrcode';
import { authenticator } from 'otplib';
import { randomInt } from 'node:crypto';

const SERVICES = [
  'Runescape',
  'Brazzers',
  'Pornhub',
  'XXX.com',
  'Google',
  'Minecraft',
  'Yandex',
  'Roblox',
  'Microsoft',
];
const getService = () => SERVICES[randomInt(0, SERVICES.length)];

const NAMES = [
  'RabbiReason',
  'PointedSense',
  'LingeringOutfit',
  'PrimeViolent',
  'LatexClimate',
  'AnalogWilling',
  'TotalAbsolute',
  'DictatorTackle',
  'UnleashCabinet',
  'LancerVacation',
  'LoopyMellow',
  'DinosaurIntern',
  'CheerfulLikely',
  'PatrioticExport',
  'GrowthWing',
  'DreamOffense',
  'InfinityDodge',
  'FragrantSteady',
  'GooeyAffection',
  'HyperDiversity',
  'MassiveProperty',
  'FlippyCarpet',
  'TrustyBlend',
  'ChaoticJudge',
];
const getName = () => NAMES[randomInt(0, NAMES.length)];

const totpKeyToDataURL = async (totpKey) => {
  const user = getName();
  const service = getService();
  const otpauth = authenticator.keyuri(user, service, totpKey);

  return qrcode.toDataURL(otpauth, { margin: 0 });
};

export default totpKeyToDataURL;
