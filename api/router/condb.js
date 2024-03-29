const mysql = require('mssql')
const express = require('express')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const req = require('express/lib/request')
const config = {
    user: 'sa',
    password: 'scitsigol',
    server: '127.0.0.1', // e.g., localhost
    database: 'bu',
    options: {
        "encrypt": false // Disable encryption
    }
};
//listen port 4200
app.listen(4200,(err,result)=>{
    if(err) throw err;
});

app.use(bodyParser.json()); 

async function connectDB() {
    try {
        await mysql.connect(config);
        console.log('Connected to the database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}
//connect sql server
connectDB();
//insert table user master
app.post('/api/router/user', async (req,res)=>{
    try {
            await mysql.connect(config);
            // Extract data from request body
            const { fullname, username, upassword } = req.body;
            // SQL query with parameters to prevent SQL injection
            const q1 = 'INSERT INTO tbusers (fullname,username,upassword) VALUES (@fullname,@username,@upassword)';
            // Prepare the request
            const req1 = new mysql.Request();
            req1.input('fullname', mysql.NVarChar, fullname);
            req1.input('username', mysql.NVarChar, username);
            req1.input('upassword', mysql.NVarChar, upassword);
            // Execute the query
            const result = await req1.query(q1);
            res.status(200).json({ success: true, message: result });
    } catch(error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ success: false, message: 'An error occurred while inserting data.' });
    } finally {
        //exit
    }
})
//insert table supplier master
app.post('/api/router/supplier', async (req,res)=>{
    try {
            await mysql.connect(config);
            // Extract data from request body
            const { suppname, suppaddress, suppphone } = req.body;
            // SQL query with parameters to prevent SQL injection
            const q1 = 'INSERT INTO tbsupplier (suppname,suppaddress,suppphone) VALUES (@suppname,@suppaddress,@suppphone)';
            // Prepare the request
            const req1 = new mysql.Request();
            req1.input('suppname', mysql.NVarChar, suppname);
            req1.input('suppaddress', mysql.NVarChar, suppaddress);
            req1.input('suppphone', mysql.NVarChar, suppphone);
            // Execute the query
            const result = await req1.query(q1);
            res.status(200).json({ success: true, message: result });
    } catch(error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ success: false, message: 'An error occurred while inserting data.' });
    } finally {
        //exit
    }
})
//insert table reason master
app.post('/api/router/reason', async (req,res)=>{
    try {
            await mysql.connect(config);
            // Extract data from request body
            const { reasonname } = req.body;
            if(!reasonname) {
                res.status(400).json({ success: false, message: 'Please check reason name.' });
            }
            // SQL query with parameters to prevent SQL injection
            const q1 = 'INSERT INTO tbreason (reasonname) VALUES (@reasonname)';
            // Prepare the request
            const req1 = new mysql.Request();
            req1.input('reasonname', mysql.NVarChar, reasonname);
            // Execute the query
            const result = await req1.query(q1);
            res.status(200).json({ success: true, message: result });
    } catch(error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ success: false, message: 'An error occurred while inserting data.' });
    } finally {
        //exit
    }
})