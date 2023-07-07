var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_mtr) {
      const result = await asyncMTR();
      res.send(result);
    }

  });

  async function asyncMTR() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "SELECT `id_mtr`, `name`, `id_mtrvid`, `color`, `status`, `description`,  `property`, `equipment`, `price`, `size`, "+
        "`count`, `date_purchase`, `date_issue`, `tabel_number`, `invent_number`, `serial_number`, `barcode`, `invoice`, "+
        "`delivery_contract`, `id_organization`, `id_object` FROM mtr";

        const resMTR = await conn.query(sQuery);
        return JSON.stringify(resMTR);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

module.exports = router;