const {client}=require('./connection');
async function runQuery(){
    try{
     await client.query(`INSERT INTO author(author_name, university, date_of_birth, h_index, gender, mentor)
VALUES
('Alice Smith', 'MIT', '1980-03-15', 35, 'F', NULL),
('Bob Johnson', 'Stanford', '1975-07-22', 40, 'M', 1),      
('Carol Williams', 'Harvard', '1982-11-05', 28, 'F', NULL),
('David Brown', 'Oxford', '1978-01-17', 45, 'M', 3),         
('Emma Davis', 'Cambridge', '1985-09-10', 30, 'F', NULL),
('Frank Miller', 'UCLA', '1979-12-03', 50, 'M', 2),           
('Grace Wilson', 'Yale', '1983-05-25', 33, 'F', NULL),
('Henry Moore', 'Princeton', '1981-08-12', 38, 'M', 5),       
('Ivy Taylor', 'Columbia', '1986-02-20', 27, 'F', NULL),
('Jack Anderson', 'Caltech', '1977-06-30', 42, 'M', 4),       
('Karen Thomas', 'Imperial College', '1984-10-15', 31, 'F', NULL),
('Leo Jackson', 'ETH Zurich', '1980-04-01', 36, 'M', 7),       
('Mia White', 'Sorbonne', '1987-01-11', 29, 'F', NULL),
('Nick Harris', 'Tokyo University', '1976-03-22', 47, 'M', 10),
('Olivia Martin', 'Seoul National University', '1982-07-18', 34, 'F', NULL);
`);
    console.log('Data inserted successfully');
    await client.query(`INSERT INTO research_papers(paper_title, conference, publish_date)
VALUES
('AI in Healthcare', 'NeurIPS', '2020-06-15'),
('Quantum Computing Basics', 'QIP', '2019-05-10'),
('Machine Learning Algorithms', 'ICML', '2021-07-20'),
('Robotics Advances', 'ICRA', '2018-04-12'),
('Data Privacy Techniques', 'USENIX', '2020-11-05'),
('Blockchain in Finance', 'IEEE Blockchain', '2019-09-15'),
('Natural Language Processing', 'ACL', '2021-08-01'),
('Computer Vision Trends', 'CVPR', '2020-06-22'),
('Cybersecurity Methods', 'Black Hat', '2021-02-10'),
('Cloud Computing Models', 'IEEE Cloud', '2019-12-05'),
('Deep Learning Optimization', 'NeurIPS', '2020-12-12'),
('IoT Security Challenges', 'IoTDI', '2018-10-20'),
('Augmented Reality Systems', 'ISMAR', '2019-09-30'),
('Reinforcement Learning', 'ICML', '2020-05-18'),
('Edge Computing Applications', 'IEEE Edge', '2021-03-10'),
('Genomics Data Analysis', 'Bioinformatics', '2018-07-12'),
('Smart Cities Research', 'IEEE SmartCity', '2020-01-25'),
('Big Data Analytics', 'KDD', '2019-08-22'),
('Autonomous Vehicles', 'IV', '2021-04-05'),
('Renewable Energy Systems', 'IEEE PES', '2020-03-30'),
('Graph Neural Networks', 'NeurIPS', '2021-06-12'),
('Human-Computer Interaction', 'CHI', '2019-05-18'),
('Sentiment Analysis', 'ACL', '2020-09-20'),
('Protein Folding Prediction', 'ICML', '2021-02-14'),
('Virtual Reality Education', 'VRST', '2018-11-01'),
('Social Network Analysis', 'WWW', '2019-03-12'),
('Medical Imaging', 'MICCAI', '2020-07-15'),
('Autonomous Drones', 'ICRA', '2021-05-20'),
('Smart Home IoT', 'IEEE IoT', '2019-12-08'),
('Energy Efficient Computing', 'ISCA', '2020-10-25');`);
    console.log('Data inserted successfully');

    await client.query(`INSERT INTO papers_authors(paper_id, author_id)
VALUES
(1,1),(1,2),(2,3),(2,4),(3,5),(3,6),(4,7),(4,8),
(5,9),(5,10),(6,11),(6,12),(7,13),(7,14),(8,15),
(9,1),(10,2),(11,3),(12,4),(13,5),(14,6),(15,7),
(16,8),(17,9),(18,10),(19,11),(20,12),(21,13),
(22,14),(23,15),(24,1),(25,2),(26,3),(27,4),
(28,5),(29,6),(30,7);`)



    }
    catch(err){
        console.error('Connection error',err.stack);
    }

    }