module.exports = function() {
  return {
    capitalize: function(str) {
      return str
        .replace(/-/g, ' ')
        .replace(/(?:^|\s)\S/g, function(w) {
          return w.toUpperCase();
        });
    },

    withCommas: function(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    nl2br: function(str) {
      return str.replace(/(?:\r\n|\r|\n)/gm, '<br>');
    },

    truncate: function(str, max, ellipsis) {
      var ellipsis = ellipsis ||'\u22EF';

      if (str.length > max) {
        str = str.substr(0, max - ellipsis.length) + ellipsis;
      }

      return str.toString();
    },

    serialize: function(obj) {
      var toDash = function(str) {
        return str.replace(/([A-Z])/g, function($1) {
          return '-' + $1.toLowerCase();
        });
      };

      var str = [];
      var pushData;

      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          pushData = toDash(encodeURIComponent(p));
          pushData += obj[p] ? '=' + encodeURIComponent(obj[p]) : '';
          str.push(pushData);
        }
      }

      return str.join(', ');
    },

    date: function(date, mask, utc) {
      var dateFormat = function() {
        var token = /d{1,5}|D{1,2}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
        var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
        var timezoneClip = /[^-+\dA-Z]/g;

        var pad = function(val, len) {
          val = String(val);
          len = len || 2;

          while (val.length < len) {
            val = '0' + val;
          }

          return val;
        };

        // Regexes and supporting functions are cached through closure
        return function(date, mask, utc) {
          var dF = dateFormat;

          // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
          if (arguments.length === 1 && Object.prototype.toString.call(date) === '[object String]' && !/\d/.test(date)) {
            mask = date;
            date = undefined;
          }

          // Passing date through Date applies Date.parse, if necessary
          date = date ? new Date(date) : new Date();

          if (isNaN(date)) {
            throw SyntaxError('invalid date');
          }

          mask = String(dF.masks[mask] || mask || dF.masks['default']);

          // Allow setting the utc argument via the mask
          if (mask.slice(0, 4) === 'UTC:') {
            mask = mask.slice(4);
            utc = true;
          }

          var _ = utc ? 'getUTC' : 'get';
          var d = date[_ + 'Date']();
          var D = date[_ + 'Day']();
          var m = date[_ + 'Month']();
          var y = date[_ + 'FullYear']();
          var H = date[_ + 'Hours']();
          var M = date[_ + 'Minutes']();
          var s = date[_ + 'Seconds']();
          var L = date[_ + 'Milliseconds']();
          var o = utc ? 0 : date.getTimezoneOffset();

          flags = {
            d: d,
            dd: pad(d),
            ddd: dF.i18n.dayNames[D],
            dddd: dF.i18n.dayNames[D + 7],
            D: dF.i18n.dayNames[D + 14],
            DD: dF.i18n.dayNames[D + 21],
            m: m + 1,
            mm: pad(m + 1),
            mmm: dF.i18n.monthNames[m],
            mmmm: dF.i18n.monthNames[m + 12],
            yy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: pad(H % 12 || 12),
            H: H,
            HH: pad(H),
            M: M,
            MM: pad(M),
            s: s,
            ss: pad(s),
            l: pad(L, 3),
            L: pad(L > 99 ? Math.round(L / 10) : L),
            t: H < 12 ? 'a' : 'p',
            tt: H < 12 ? 'am' : 'pm',
            T: H < 12 ? 'A' : 'P',
            TT: H < 12 ? 'AM' : 'PM',
            Z: utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
            o: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
          };

          return mask.replace(token, function($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
          });
        };
      }();

      // Some common format strings
      dateFormat.masks = {
        'default': 'yyyy"년" m"월" d"일" h"시" m"분" s"초"',
        withSlash: 'yyyy/mm/dd',
        withDash: 'yyyy-mm-dd',
        withDot: 'yyyy.mm.dd',
        shortDate: 'yy/m/d',
        mediumDate: 'yyyy mmm d',
        longDate: 'mmmm d, yyyy',
        fullDate: 'dddd, mmmm d, yyyy',
        shortTime: 'h:MM TT',
        mediumTime: 'h:MM:ss TT',
        longTime: 'h:MM:ss TT Z',
        isoDate: 'yyyy-mm-dd',
        isoTime: 'HH:MM:ss',
        isoDateTime: 'yyyy-mm-dd"T"HH:MM:ss',
        isoUtcDateTime: 'UTC:yyyy-mm-dd"T"HH:MM:ss"Z"'
      };

      // Internationalization strings
      dateFormat.i18n = {
        dayNames: [
          'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
          '일', '월', '화', '수', '목', '금', '토',
          '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'
        ],
        monthNames: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ]
      };

      return dateFormat(date, mask, utc);
    }
  };
};
