/**
 *
 * @param {String} content toast提示的内容
 * @param {Boolean} autoClose 是否自动关闭 默认true
 * @param {Number} deley 延迟时间，默认3秒，传入单位为秒
 *
 */
export default function Toast (content, autoClose = true, deley = 2) {
  if (Object.prototype.toString.call(autoClose) === '[object Number]') {
    deley = autoClose;
    autoClose = true;
  }
  deley = deley * 1000;
  return new Toast.fn._init(content, autoClose, deley);
}

let fn = Toast.fn = Toast.prototype;
let init = Toast.prototype._init = function (content, autoClose, deley) {
  this._zIndex++;
  this.create(content, this._zIndex);
  autoClose && this._createtimer(this.close, deley);
};
init.prototype = Toast.fn;
Toast.prototype.close = function () {
  clearTimeout(fn._timer);
  fn._dom.style.display = 'none';
};
Toast.prototype._zIndex = 100;
Toast.prototype.create = function (content, zIndex = 999) {
  clearTimeout(fn._timer);
  let dom = fn._dom;
  if (!dom) {
    dom = fn._dom = document.createElement('div');
    document.body.appendChild(dom);
  }
  let messge = `<div class="w-toast" style="z-index: ${zIndex}">
    <div class="w-toast-content">
        ${content}
    </div>
  </div>`;
  dom.innerHTML = messge;
  dom.style.display = 'block';
};

Toast.prototype._createtimer = function (call, deley) {
  clearTimeout(fn._timer);
  fn._timer = setTimeout(() => {
    call.call(this);
  }, deley);
};
