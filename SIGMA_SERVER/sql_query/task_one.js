var sqlStringTaskOne = 

"select t.id as id_task, "+
"t.id_department, "+
"t.note, "+
"gd.name as department_name, "+
"t.date_begin, "+
"t.date_end, "+
"t.bitSuccess, "+
"t.name_task, "+
"case "+
"when s.fio is null then u.login "+
"else s.fio "+
"end as RESFIO, "+
"s2.fio as Acceptor, "+
"t.id_object, "+
"po.name as object_name, "+
"case "+
"when ifnull(s2.fio, '') = '' then false "+
"else true "+
"end as bitAccept "+
"from task t "+
"left join staff s on t.id_user = s.id_staff "+
"left join tuser u on t.id_user = u.id "+
"left join staff s2 on s2.id_staff = t.id_user_accept "+
"left join protected_object po on po.id_object = t.id_object "+
"inner join guide_department gd on gd.id=t.id_department "+
"where t.id=?";

module.exports = sqlStringTaskOne;