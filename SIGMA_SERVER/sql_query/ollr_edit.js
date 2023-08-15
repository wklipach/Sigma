
var sqlStringOllrEdit = 

"select s.id, s.id_staff, s.id_ollr, s.DateBegin, g.period, s.bitClose, g.name as gname, "+
"case "+
"   WHEN DATE_ADD(s.DateBegin, INTERVAL g.period YEAR) > now() THEN 'green' "+
"   WHEN DATE_ADD(s.DateBegin, INTERVAL g.period YEAR) < now() THEN 'red' "+
"   WHEN g.period=0 THEN 'white' "+
"   WHEN s.bitClose=1 THEN 'crossed_out' "+
"else 'gray' "+
"end as Color "+
"from staff_ollr s "+
"left join guide_ollr g on g.id_ollr=s.id_ollr "+ 
"where s.id_staff = ? and s.bitDelete=0 "+
"order by s.DateBegin desc"

module.exports = sqlStringOllrEdit;     