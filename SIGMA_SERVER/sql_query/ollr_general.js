var sqlStringOllrGeneral = 
"SELECT so.id_ollr, go.name, so.DateBegin, go.period, "+ 
"case "+
"   WHEN DATE_ADD(DateBegin, INTERVAL go.period YEAR) > now() THEN CONCAT('<span class=\"badge text-bg-success\">', go.name, '</span>') "+ 
"   WHEN DATE_ADD(DateBegin, INTERVAL go.period YEAR) < now() THEN CONCAT('<span class=\"badge text-bg-danger\">', go.name, ' ','</span>') "+ 
"   WHEN go.period=0 THEN CONCAT('<span class=\"badge text-bg-secondary\">', go.name, '</span>') "+ 
"   else CONCAT('<span class=\"badge text-bg-light\">', go.name, ' ','</span>') "+ 
"   end as Color "+ 
"from staff_ollr so "+ 
"        LEFT join guide_ollr go ON go.id_ollr=so.id_ollr "+ 
"        WHERE so.id_staff=?  and so.bitDelete=0 and so.bitClose=0 "+
"        ORDER BY go.`name` asc ";



module.exports = sqlStringOllrGeneral;        