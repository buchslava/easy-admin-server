module.exports = {
  menu: [
    {
      id: `category`,
      label: `Category`,
      columns: [
        {
          id: "name",
          label: "Name",
          type: "text",
          rules: [{ required: true, message: "Please input a name!", whitespace: true }],
        }
      ],
      createSQL: () => `CREATE TABLE category(name TEXT)`,
      insertSQL: (p) => `INSERT INTO category VALUES ('${p.name}')`,
      selectSQL: (p) => `SELECT rowid, name FROM category ORDER BY rowid`,
      relateSQL: (p) => `SELECT rowid, name FROM category ORDER BY rowid`,
      recordSQL: (p) => `SELECT rowid, name FROM category WHERE rowid=${p.rowid}`,
      updateSQL: (p) => `UPDATE category SET name='${p.name}' WHERE rowid=${p.rowid}`,
      deleteSQL: (p) => `DELETE FROM category WHERE rowid=${p.rowid}`,
      initData: [{ name: "Electronics" }, { name: "Furniture" }, { name: "Clothes" }],
      updates: []
    },
    {
      id: `goods`,
      label: `Goods`,
      columns: [
        {
          id: "name",
          label: "Name",
          type: "text",
          rules: [{ required: true, message: "Please input a name!", whitespace: true }],
        },
        {
          id: "price",
          label: "Price",
          type: "numeric"
        },
        {
          id: "categoryId",
          label: "Category",
          type: "dropdown",
          relation: `category`
        }
      ],
      createSQL: () => `CREATE TABLE goods(name TEXT, price NUMERIC(10,2), categoryId INT)`,
      insertSQL: (p) => `INSERT INTO goods VALUES ('${p.name}', ${p.price}, ${p.categoryId})`,
      selectSQL: (p) => `SELECT goods.rowid, goods.name, price, category.rowid, categoryId FROM goods, category WHERE category.rowid = categoryId`,
      recordSQL: (p) => `SELECT goods.rowid, goods.name, price, category.rowid, categoryId FROM goods, category WHERE category.rowid = categoryId AND goods.rowid=${p.rowid}`,
      updateSQL: (p) => `UPDATE goods SET name='${p.name}', price=${p.price}, category=${p.category} WHERE rowid=${p.rowid}`,
      deleteSQL: (p) => `DELETE FROM goods WHERE rowid=${p.rowid}`,
      initData: [],
      updates: []
    }
  ],
}
