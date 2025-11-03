const oracledb = require('oracledb');
const dotenv = require('dotenv');

dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const oracleConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
};

async function connectOracle() {
  let connection;
  try {
    connection = await oracledb.getConnection(oracleConfig);
    console.log('Oracle DB connected successfully');
    return connection;
  } catch (err) {
    console.error('Oracle connection error:', err);
    throw err;
  }
}

module.exports = { connectOracle, oracledb };
