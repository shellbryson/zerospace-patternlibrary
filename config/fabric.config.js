var coloursPattern = [
  './src/build/assets/styles/config/_colors.scss'
];
var iconsPattern = ['./src/build/assets/icons/svg/', './src/build/assets/icons/fonts/selection.json'];

/*
  use this to specify a specific page to render.

  prefix an item with a bang ('!') to stop it being rendered.
 */
var renderList = [
  'color.one',
  '!thisItemWouldntRender'
];

/*
  use this to add data to the outputes "model" (data.json)
 */
var buildData = [
  {
    prop: 'color',
    value: coloursPattern,
    processors: ['getDirectoryTree', 'readFiles', 'sassVariables']
  },
  {
    prop: 'headScripts',
    value: ['/build/dist/scripts/modernizr.custom.js']
  },
  {
    prop: 'icons',
    value: iconsPattern,
    processors: ['icons']
  },
  {
    prop: 'bodyScripts',
    value: ['/build/dist/scripts/build.js']
  }
];

/*
  configure parchment level watch subtasks
 */
var watch = {
  colors: {
    files: coloursPattern,
    tasks: ['rebuildParchment']
  }
};

module.exports = {
  renderList: renderList,
  buildData: buildData,
  watch: watch
};
