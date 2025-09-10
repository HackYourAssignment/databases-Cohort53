import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Client } = pg;

const db = new Client({
host: process.env.PGHOST,
port: process.env.PGPORT,
user: process.env.PGUSER,
password: process.env.PGPASSWORD,
database: "world" // ← world DB with country table
});

async function vulnerableGetPopulation(name, code) {
// ❌ Vulnerable: direct string interpolation
const sql = `SELECT population FROM country WHERE name = '${name}' AND code = '${code}'`;
const res = await db.query(sql);
return res.rows;
}

async function safeGetPopulation(name, code) {
// Safe: parameterized query
const sql = `SELECT population FROM country WHERE name = $1 AND code = $2`;
const res = await db.query(sql, [name, code]);
return res.rows;
}

async function demo() {
await db.connect();

// Example of SQL injection
const hacked = await vulnerableGetPopulation(`' OR '1'='1`, `' OR '1'='1`);
console.log(" Injection result (all rows):", hacked.length);

// Safe version
const normal = await safeGetPopulation("Netherlands", "NLD");
console.log(" Safe query result:", normal);

await db.end();
}

demo().catch(e => {
console.error(e);
process.exit(1);
});
