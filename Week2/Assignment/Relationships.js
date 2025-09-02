const {Client}=require ('pg');
async function main(){
try{
    await client.connect();
const creatTableResearch_Papers = `
CREATE TABLE IF NOT EXISTS research_papers(
    paper_id SERIAL PRIMARY KEY,
    paper_title VARCHAR(200) NOT NULL,
    conference VARCHAR(100) NOT NULL,
    publish_date DATE NOT NULL
);`;

 const creatPapers_authors=`CREATE TABLE IF NOT EXISTS papers_authors(
 paper_id INT REFERENCES research_papers(paper_id),
 author_id INT REFERENCES author(author_id),
 PRIMARY KEY (paper_id, author_id)
 );`;
await client.query(creatTableResearch_Papers);
console.log('Table created successfully');


}
catch(err){
    console.error('Connection error',err.stack);
}
finally{
    await client.end();
}
}
main();