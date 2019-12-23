module.exports = {
  menu: [
    {
      id: `category`,
      label: `Category`,
      columns: [
        {
          id: "name",
          label: "Name"
        }
      ],
      createSQL: () => `CREATE TABLE category(name TEXT)`,
      insertSQL: (p) => `INSERT INTO category VALUES ('${p.name}')`,
      selectSQL: (p) => `SELECT rowid, name FROM category`,
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
          label: "Name"
        },
        {
          id: "price",
          label: "Price",
          type: "numeric"
        },
        {
          id: "categoryId",
          label: "Category",
          relation: `category`
        }
      ],
      createSQL: () => `CREATE TABLE goods(name TEXT, price NUMERIC(10,2), categoryId INT)`,
      insertSQL: (p) => `INSERT INTO goods VALUES ('${p.name}', ${p.price}, ${p.categoryId})`,
      selectSQL: (p) => `SELECT goods.rowid, name, price, category.rowid, categoryId FROM goods, category WHERE category.rowid = categoryId`,
      updateSQL: (p) => `UPDATE goods SET name='${p.name}', price=${p.price}, category=${p.category} WHERE rowid=${p.rowid}`,
      deleteSQL: (p) => `DELETE FROM goods WHERE rowid=${p.rowid}`,
      initData: [],
      updates: []
    }
  ],
}
