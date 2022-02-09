const { DateTime } = require('luxon');

console.logCopy = console.log.bind(console);

console.log = function(data)
{
  const currentDate = DateTime.now();
  const currentDateStringFormatted = '[' + currentDate.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS) + '] ';
  this.logCopy(currentDateStringFormatted, data);
};
