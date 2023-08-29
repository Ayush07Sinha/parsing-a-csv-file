const fs = require('fs');
const csvParser = require('csv-parser');
const mysql = require('mysql2/promise');

// Replace these with your actual MySQL database credentials
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'ayush',
  database: 'credentials',
};

const tableName = 'test';
const csvFilePath = 'C:/Users/send2/Desktop/test.csv';

async function createConnection() {
  return await mysql.createConnection(dbConfig);
}

async function insertDataIntoMysql(connection, data) {
  const columns = Object.keys(data[0]).join(', ');
  const values = data.map((row) => Object.values(row));
  const placeholders = values.map(() => '(' + Array(values[0].length).fill('?').join(', ') + ')');
  const sql = `INSERT INTO ${tableName} (${columns}) VALUES ${placeholders.join(', ')}`;
  await connection.query(sql, values.flat());
}

async function main() {
  try {
    // Read CSV file and parse its data
    const data = [];
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => data.push(row))
      .on('end', async () => {
        // Create a connection to the MySQL database
        const connection = await createConnection();

        // Insert data into MySQL table
        await insertDataIntoMysql(connection, data);

        // Close the connection
        await connection.end();

        console.log('Data inserted successfully!');
      });
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
