// import db from "../connections/database.js";
// import existsTable from "./existsTable.js";

// const createtokenTable = async () => {
//   try {
//     const createTableQuery = `CREATE TABLE  IF NOT EXISTS token(
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         user_id INT,
//         token text,
//         FOREIGN KEY (user_id) REFERENCES users(id)
//     )`;
//     await db.promise().query(createTableQuery);
//     console.log("token table has been created");
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default createtokenTable;
