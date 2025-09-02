const {client} = require('./connection');
async function runQuery() {
    try {
        await client.query(`SELECT a.author_name,a2.author_name AS mentor_name FROM author a INNER JOIN author a2 ON a2.author_id=a.mentor`);
        await client.query(`SELECT A.*,RP.paper_title FROM author A LEFT JOIN papers_authors PA ON A.author_id=PA.author_id  LEFT JOIN research_papers RP ON PA.paper_id=RP.paper_id);`);
 
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}