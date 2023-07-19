;(function() {
  var select = (function(e) {
    var _this = this;
    var callback = {};
    var activeClassName = ' open';
    var sto;
    var el = e;
    var front = el.querySelector('.viewPoint');
    var ul = el.querySelector('ul');
    var option = ul.querySelectorAll('li');
    var length = option.length;

    var _click = function(a) {
      if (a.target.classList.contains('disabled')) {
        return false;
      }
      callback.value = this.innerText === undefined ? a.srcElement.outerText:this.innerText;
      front.innerText = callback.value;
      // console.log(_this.callback());
    };

    var optionClick = function(b) {
      for (var i = 0; i < length; i++) {
        if (b) {
          _this.addEvnt(option[i], _click);
        } else {
          _this.removeEvnt(option[i], _click);
        }
      }
    };
    this.addEvnt = function(e, f) {
      if (e.addEventListener) {
        e.addEventListener('click', f, false);
      } else {
        e.attachEvent('onclick', f);
      }
    };
    this.removeEvnt = function(e, f) {
      if (e.removeEventListener) {
        e.removeEventListener('click', f, false);
      } else {
        e.detachEvent('onclick', f);
      }
    };
    this.open = function() {
      optionClick(true);
      el.setAttribute('data-open', 'true');
      el.setAttribute('class', el.getAttribute('class') + activeClassName);
      clearTimeout(sto);
      sto = setTimeout(function() {
        _this.addEvnt(document.body, _this.close);
      }, 5);
      //viewPoint와 같은 li에 active 클래스 추가
      for (var i = 0; i < option.length; i++) {
        var item = option.item(i);
        if (front.innerText === item.innerText) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      };
    };
    this.close = function() {
      optionClick(false);
      el.removeAttribute('data-open');
      el.setAttribute('class', el.getAttribute('class').replace(activeClassName, ''));
      clearTimeout(sto);
      sto = setTimeout(function() {
        _this.removeEvnt(document.body, _this.close);
      }, 5);
    };
    this.callback = function() {
      callback.id = e.getAttribute('id');
      return callback;
    };
    if (el.getAttribute('data-open') === null) {
      _this.open();
    }
  });
  (window.select === undefined) && (window.select = select);
})();
