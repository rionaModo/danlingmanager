class Loading {
  constructor (props) {
    this.installed = false;
    this.isCreat = false;
    this.el = null;
  }
  // 移除loading
  hide () {
    if (this.el) {
      // this.installed = false;
      document.body.removeChild(this.el);
    } else {
    }
  }
  // 添加loading
  show () {
    // 判断dom是否存在 避免重复添加
    if (!this.installed && !this.el) {
      let tpl = '<div class="wmask"></div>' +
        '<div class="wloading-con">' +
        '<div class="spinner">\n' +
        '  <div class="spinner-container container1">\n' +
        '    <div class="circle1"></div>\n' +
        '    <div class="circle2"></div>\n' +
        '    <div class="circle3"></div>\n' +
        '    <div class="circle4"></div>\n' +
        '  </div>\n' +
        '  <div class="spinner-container container2">\n' +
        '    <div class="circle1"></div>\n' +
        '    <div class="circle2"></div>\n' +
        '    <div class="circle3"></div>\n' +
        '    <div class="circle4"></div>\n' +
        '  </div>\n' +
        '  <div class="spinner-container container3">\n' +
        '    <div class="circle1"></div>\n' +
        '    <div class="circle2"></div>\n' +
        '    <div class="circle3"></div>\n' +
        '    <div class="circle4"></div>\n' +
        '  </div>\n' +
        '</div>' +
        '</div>';
      const dom = document.createElement('div');
      dom.id = 'wloading';
      dom.innerHTML = tpl;
      this.el = dom;
      this.el.addEventListener('touchmove', function (e) {
        e.stopPropagation();
        e.preventDefault();
      });
    }
    document.body.appendChild(this.el);
    this.installed = true;
  }
}
const $wLoading = new Loading();
window.Loading = Loading;
export default $wLoading;
