var sqlStringTask = 

"select t.id as id_task, "+
"t.id_department, "+
"t.note, "+
"gd.name as department_name, "+
"t.date_begin, "+
"t.date_end, "+
"t.bitSuccess, "+
"gnt.name as name_task, "+
"case "+
"when s.fio is null then u.login "+
"else s.fio "+
"end as RESFIO, "+
"s2.fio as Acceptor, "+
"case "+
"when ifnull(s2.fio, '') = '' then false "+
"else true "+
"end as bitAccept "+
"from task t "+
"left join staff s on t.id_user = s.id_staff "+
"left join tuser u on t.id_user = u.id "+
"left join staff s2 on s2.id_staff = t.id_user_accept "+
"inner join guide_department gd on gd.id=t.id_department "+
"inner join guide_name_task gnt on gnt.id=t.id_name_task "+
"where t.bitDelete = 0 and "+
"( "+
"t.id_department in (select id_department from staff where id_staff=?) "+
"or "+
"t.id_user=? "+
"or "+
"t.id_user_accept =? "+
") "+
"order by t.date_begin";

module.exports = sqlStringTask;