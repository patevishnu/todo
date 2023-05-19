


module.exports.getDate=getDate;
module.exports.getDay=getDay;

function getDate()
{
  var today=new Date();
  var options={
    weekday:"long",
    day:"numeric",
    month:"long",
    year:"numeric"
  }
  var day=today.toLocaleDateString("hi-in",options);
  return day;
}

function getDay()
{
  var today=new Date();
  var options={
    weekday:"long"
  }
  var week=today.toLocaleDateString("en-us",options);
  return week;
}
