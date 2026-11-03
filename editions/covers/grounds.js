// The colour each cover's resting ground reads as (sRGB hex), apart from covers.js so the project page and
// the no-WebGL shelf can take it without loading the cover module or three.js. covers.js designs each cover
// on these grounds; a name without its own cover takes Xactions' (covers.js designFor).
export const GROUNDS = {
  Mirra: '#8BB7E7',
  stet: '#072327',
  'Social Hook': '#427FED',   // its field's mean blue, without the letters and the mark
  Clauded: '#0F5B62',
  LikeWiki: '#1B3930',   // its green field
  Topshine: '#D3D0F9',   // the lavender room, without the star, orbs and type
  Scorecard: '#101D37',   // its navy field
  Xactions: '#080D28',
  'Stellar Explorer': '#0B0E1C',
  Chairtax: '#140F0B',
  Stats: '#E3E9F0',
  'About Neil': '#EFE2CC',
};
export const coverGround = entry => GROUNDS[entry.name] ?? GROUNDS.Xactions;
