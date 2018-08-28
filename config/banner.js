module.exports = function(site, mode) {
  var banner = [
    ' _ _  _',
    '| | || | ' + site.siteName,
    '| | || | ' + site.team,
    '`___\'|_| ' + 'v' + site.version,
  ];

  banner.unshift('');
  banner.push('\n');
  return banner.join('\n');
};
