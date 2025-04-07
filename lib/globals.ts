// import localFont from 'next/font/local';

const INITIAL_NUMBER: number = 3;
const MAX_WORDS = 100;
const SOUND_VOLUME = 0.25;

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 23;
const PWD_MIN_LENGTH = 8;
const PWD_MAX_LENGTH = 20;

const clickSound = '/audio/click.mp3';
const successSound = '/audio/success.mp3';
const errorSound = '/audio/error.mp3';
const muteSound = '/audio/mute.mp3';
const unmuteSound = '/audio/unmute.mp3';

// const arialRounded = localFont({ src: '../public/fonts/arial-rounded-mt.woff2', adjustFontFallback: 'Arial'});
// const atma = localFont({src: '../public/fonts/atma-semibold.woff2', adjustFontFallback: 'Arial'});

const specialSymbols = {
  FRA: ['à', 'â', 'é', 'è', 'ê', 'ç', 'î', 'ô', 'ù', 'ë', 'ï', 'œ', 'æ'],
  GER: ['ä', 'ö', 'ü', 'ß', 'é'],
  SPA: ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡']
}

export {
  INITIAL_NUMBER, 
  MAX_WORDS,
  SOUND_VOLUME,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PWD_MAX_LENGTH,
  PWD_MIN_LENGTH,
  // atma, 
  // arialRounded,
  clickSound,
  successSound,
  errorSound,
  muteSound,
  unmuteSound,
  specialSymbols
};