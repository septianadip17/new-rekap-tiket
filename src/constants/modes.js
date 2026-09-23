export const MODES = {
  ALFA: 'ALFA',
  INDOMARCO: 'INDOMARCO',
  PUBLIK: 'PUBLIK',
};

export const MODE_OPTIONS = [
  { id: MODES.ALFA, label: 'ALFA' },
  { id: MODES.INDOMARCO, label: 'INDOMARCO' },
  { id: MODES.PUBLIK, label: 'PUBLIK' },
];

export const SHIFTS = {
  PAGI: 'pagi',
  SIANG: 'siang',
  MALAM: 'malam',
};

export const SHIFT_OPTIONS = [
  { id: SHIFTS.PAGI, label: 'Pagi' },
  { id: SHIFTS.SIANG, label: 'Siang' },
  { id: SHIFTS.MALAM, label: 'Malam' },
];

export const DEFAULT_MODE = MODES.ALFA;
export const DEFAULT_SHIFT = SHIFTS.SIANG;
