var sqlStringSettings = 

"select "+
"s.id_staff,  "+
"s.fio, "+
"s.phone,  "+
"s.phone2,  "+
"s.DateBirth,  "+
"s.height, "+
"s.weight, "+
"s.date_interview, "+
"s.`rank`, "+
"s.id_organization, "+
"go.name as `organization`, "+
"gd.name as `department`, "+
"sss.fio as `senjor_guard`, "+
"gp.name as `position`, "+
"gg.name as `gender`, "+
"gt.name as `type`, "+
"sms.name as sms, "+
"st.name as `status`, "+
"s.`comment` "+
"from staff s "+
"left join guide_organization go on go.id = s.id_organization "+
"left join guide_department gd on gd.id = s.id_department "+
"left join staff sss on sss.id_staff = s.id_senjor_guard "+
"left join guide_position gp on gp.id = s.id_position "+
"left join guide_gender gg on gg.id = s.id_gender "+
"left join guide_typeperson gt on gt.id = s.id_typeperson "+
"left join guide_sms sms on sms.id = s.id_sms "+
"left join guide_status st on st.id = s.id_status "+
"where s.id_staff=?";

module.exports = sqlStringSettings;
