console.logCopy = console.log.bind(console);

console.log = function(data)
{
  const currentDate = '[' + new Date().toUTCString() + '] ';
  this.logCopy(currentDate, data);
};
