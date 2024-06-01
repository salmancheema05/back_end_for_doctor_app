import { pool } from "../connections/database.js";
const existsTable = async (tablename) => {
  try {
    const checkTableExistsSql = `
            SELECT EXISTS (
                SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '${tablename}'
            );
        `;
    return await pool.query(checkTableExistsSql);
  } catch (error) {
    console.log(error);
  }
};
export default existsTable;
