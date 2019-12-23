const config = require("./config");
const Database = require('sqlite-async');

(async () => {
  try {
    db = await Database.open("test.db");
    for (const menu of config.menu) {
      await db.run(menu.createSQL());
      if (!!menu.initData) {
        for (const record of menu.initData) {
          console.log(menu.insertSQL(record));
          await db.run(menu.insertSQL(record));
        }
      }
    }
  } catch (error) {
    throw Error('can not access sqlite database');
  }
})();

