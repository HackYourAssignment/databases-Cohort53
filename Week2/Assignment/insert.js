const {client}=require('./connection');
async function runQuery(){
    try{
        await client.query(`INSERT INTO author(author_name, university, date_of_birth, h_index, gender)
VALUES
('Alice Smith', 'MIT', '1980-03-15', 35, 'F'),
('Bob Johnson', 'Stanford', '1975-07-22', 40, 'M'),
('Carol Williams', 'Harvard', '1982-11-05', 28, 'F'),
('David Brown', 'Oxford', '1978-01-17', 45, 'M'),
('Emma Davis', 'Cambridge', '1985-09-10', 30, 'F'),
('Frank Miller', 'UCLA', '1979-12-03', 50, 'M'),
('Grace Wilson', 'Yale', '1983-05-25', 33, 'F'),
('Henry Moore', 'Princeton', '1981-08-12', 38, 'M'),
('Ivy Taylor', 'Columbia', '1986-02-20', 27, 'F'),
('Jack Anderson', 'Caltech', '1977-06-30', 42, 'M'),
('Karen Thomas', 'Imperial College', '1984-10-15', 31, 'F'),
('Leo Jackson', 'ETH Zurich', '1980-04-01', 36, 'M'),
('Mia White', 'Sorbonne', '1987-01-11', 29, 'F'),
('Nick Harris', 'Tokyo University', '1976-03-22', 47, 'M'),
('Olivia Martin', 'Seoul National University', '1982-07-18', 34, 'F');`);

    }
    catch(err){
        console.error('Connection error',err.stack);
    }

    }