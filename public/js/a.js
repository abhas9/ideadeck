(function() {
  var btn = '',
    a = document;

  function s() {
    var b, c;
    if (a.readyState != 'interactive' || !a.getElementsByClassName || !window
      .XMLHttpRequest) {
      console.log('returning');
      return;
    }
    a.forms[0].onsubmit = d;
    b = a.getElementsByClassName('s')
    for (c = 0; c < b.length; c++) {
      b[c].onclick = function(evt) {
        btn = this;
      }
    }
  }

  function d(e) {
    if (!btn) {
      return;
    }
    var b, c, f, i, m, p = {},
      x;
    b = btn.getAttribute('data-field');
    if (b) {
      c = a.forms[0][b];
      c = c ? (!c.length ? [c] : c) : [];
      p[b] = [];
      for (i = 0; i < c.length; i++) {
        f = c[i].type === 'checkbox' ? (c[i].checked ? c[i].value : '') : c[i]
          .value;
        if (f) {
          p[b].push(f);
        }
        if (b === 'i10_l') { /*err!*/
          c[i].value = parseInt(c[i].value) + 1;
        }
      }
    }
    p[btn.name] = btn.name;
    c = btn;
    x = new XMLHttpRequest
    x.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        if (this.getResponseHeader('Content-Type').split(';')[0] ===
          'text/html') {
          b = a.getElementById(c.getAttribute('data-target'));
          m = c.getAttribute('data-method');
          b = b ? b : c.parentNode;
          if (m === 'apnd') {
            var elem = document.createElement('div');
            elem.innerHTML = this.responseText + '<br/>';
            b.insertBefore(elem, c);
            console.log(elem.childNodes);
          } else {
            b.innerHTML = this.responseText;
          }

        } else {
          var ej = JSON.parse(this.responseText).error,
            el, iel, i;
          for (var e in ej) {
            el = document.getElementById('e' + e);
            (el != null) ? el.innerHTML = ' (' + ej[e] + ')': 0;
            iel = document.getElementsByClassName(e);
            for (i = 0; i < iel.length; i++) {
              iel[i].setAttribute('area-invalid', 'true');
            }
          }
          console.log('ignoring json response over ajax:::\n', this.responseText);
        }
      }
    };
    x.open('POST', 'try', true);
    x.setRequestHeader("Content-type", "application/json");
    x.send(JSON.stringify(p));

    btn = undefined;
    e.preventDefault();
  }
  a.onreadystatechange = s;
})();
