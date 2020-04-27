export function htmlFont () {
  let deviceWidth = window.innerWidth;
  deviceWidth = deviceWidth > 750 ? 750 : deviceWidth < 375 ? 375 : deviceWidth;
  document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
}
