
var sqlStringBadge = 
"select so.id_staff, group_concat( "+
"case "+
"   WHEN DATE_ADD(DateBegin, INTERVAL g.period YEAR) > now() THEN CONCAT('<span class=\"badge text-bg-success\">', g.name, '</span>') "+
"   WHEN DATE_ADD(DateBegin, INTERVAL g.period YEAR) < now() THEN CONCAT('<span class=\"badge text-bg-danger\">', g.name, ' ','</span>') "+
"   WHEN g.period=0 THEN CONCAT('<span class=\"badge text-bg-secondary\">', g.name, '</span>') "+
"   else CONCAT('<span class=\"badge text-bg-light\">', g.name, ' ','</span>') "+
"   end SEPARATOR '') as Color "+   
"from guide_ollr g, staff_ollr so "+
"where g.id_ollr = so.id_ollr and so.bitClose=0 and so.bitDelete=0 "+
"group by so.id_staff";
    
module.exports = sqlStringBadge;



