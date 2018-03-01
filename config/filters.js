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
    }
  };
};
