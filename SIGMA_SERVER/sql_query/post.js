var sqlStringPost = 
" select p.`id`, "+
" p.`id_object`, "+
" po.name as object_name, "+
" po.address as object_address, "+
" p.`name` as post_name, "+
" p.`number` as post_number, "+
" p.`label`, "+
" p.`id_post_routine`, "+
" pr.name as post_routine, "+
" p.`TimeBegin`, "+
" p.`TimeEnd`, "+
" p.`DateBegin`, "+
" p.`DateEnd`, "+
" p.`camera_link`, "+
" p.`id_dress`, "+
" d.`name` as dress, "+
" p.`photo_name` "+
" from posts p "+
" left join guide_post_routine pr on pr.id=p.id_post_routine "+
" left join mtr d on d.id_mtr=p.id_dress "+
" left join protected_object po on po.id_object = p.id_object  "+
" where p.bitDelete = 0 and p.id = ? ";



module.exports = sqlStringPost;  