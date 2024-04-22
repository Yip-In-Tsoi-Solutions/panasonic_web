const mysql = require('mssql')
const express = require('express')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const req = require('express/lib/request')
const { contains } = require('jquery')
const config = {
    user: 'sa',
    password: 'scitsigol',
    server: '127.0.0.1', // e.g., localhost
    database: 'bu',
    options: {
        "encrypt": false // Disable encryption
    }
};
var jsx = require('react-jsx');
mysql.connect(config,(err)=>{
if(err) {
    throw err;
}
else{
    //console.log('connected');
    app.listen(4200, () => console.log("Server started on port : 4200"))
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
    //rendering eva91.ejs 
    //eva91 = การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ
    
    // Route to fetch data and render the page
    app.get('/views/f', (req, res) => 
    {
      mysql.query('select distinct rtrim(ltrim(Vendor)) as vendora from tbsupplier_m')
      .then(result => {
        res.render('eva91', { data: result.recordset });
      })
      .catch(err => {
        console.error('Error executing query: ', err);
        res.status(500).send('Error fetching data from database');
      });
    });

    // Route to handle form submission
    app.post('/eva91/create', async (req, res) => {
        try 
        {
            const fixdepartname = req.body.fixdepartname;
            //select vendor | supplier name
            const selectedItem = req.body.dept;
            //monthly name 
            const rptmonthname = req.body.monthlyname

            //คุณภาพการบรรจุหีบห่อ
            const topic_q1= req.body.Q11;   
            const sc_q11= req.body.ws11;    
            const topic_q12= req.body.Q21;  
            const sc_q12= req.body.ws21;    
            const topic_q13= req.body.Q31;  
            const sc_q13= req.body.ws31;    
            const topic_q41= req.body.Q41;  
            const sc_q14= req.body.ws41;    
            const topic_q51= req.body.Q51;  
            const sc_q15= req.body.ws51;    
            const topic_q61= req.body.Q61;  
            const sc_q16= req.body.ws61;    
            //service
            const topic_qs11= req.body.QS11;
            const sc_qs11= req.body.qws11;
            const topic_qs12= req.body.QS21;
            const sc_qs12= req.body.qws21;
            //marketing
            const topic_qs31= req.body.QM31;
            const sc_qs31= req.body.qws31;
            const topic_qs32= req.body.QM32;
            const sc_qs32= req.body.qws32;
            const topic_qs33= req.body.QM33;
            const sc_qs33= req.body.qws33;
            //เอกสารต่าง ๆ ที่เกี่ยวข้อง 
            const topic_qs41= req.body.QM41;
            const sc_qs41= req.body.qws41;
            const topic_qs42= req.body.QM42;
            const sc_qs42= req.body.qws42;
            const topic_qs43= req.body.QM43;
            const sc_qs43= req.body.qws43;

            //ข้อเสนอแนะ
            const reviewdata= req.body.wreview;

            var sql1="insert into tb_eva91detail (eva91_deptname,eva91_sender_name,report_name"
            sql1+=",topic11"
            if(parseInt(sc_q11)==1){
                sql1+=",sc11"
            }else if(parseInt(sc_q11)==2){ 
                sql1+=",sc12"
            }else if(parseInt(sc_q11)==3){ 
                sql1+=",sc13"
            }else if(parseInt(sc_q11)==4){ 
                sql1+=",sc14"
            }else if(parseInt(sc_q11)==5){ 
                sql1+=",sc15"
            }
            sql1+=",topic12"
            if(parseInt(sc_q12)==1){
                sql1+=",sc21"
            }else if(parseInt(sc_q12)==2){
                sql1+=",sc22"
            }else if(parseInt(sc_q12)==3){
                sql1+=",sc23"
            }else if(parseInt(sc_q12)==4){
                sql1+=",sc24"
            }else if(parseInt(sc_q12)==5){
                sql1+=",sc25"
            }
            sql1+=",topic13"
            if(parseInt(sc_q13)==1){
                sql1+=",sc31"
            }else if(parseInt(sc_q13)==2){
                sql1+=",sc32"
            }else if(parseInt(sc_q13)==3){
                sql1+=",sc33"
            }else if(parseInt(sc_q13)==4){
                sql1+=",sc34"
            }else if(parseInt(sc_q13)==5){
                sql1+=",sc35"
            }
            sql1+=",topic14"
            if(parseInt(sc_q14)==1){
                sql1+=",sc41"
            }else if(parseInt(sc_q14)==2){
                sql1+=",sc42"
            }else if(parseInt(sc_q14)==3){
                sql1+=",sc43"
            }else if(parseInt(sc_q14)==4){
                sql1+=",sc44"
            }else if(parseInt(sc_q14)==5){
                sql1+=",sc45"
            }
            sql1+=",topic15"
            if(parseInt(sc_q15)==1){
                sql1+=",sc51"
            }else if(parseInt(sc_q15)==2){
                sql1+=",sc52"
            }else if(parseInt(sc_q15)==3){
                sql1+=",sc53"
            }else if(parseInt(sc_q15)==4){
                sql1+=",sc54"
            }else if(parseInt(sc_q15)==5){
                sql1+=",sc55"
            }
            sql1+=",topic16"
            if(parseInt(sc_q16)==1){
                sql1+=",sc61"
            }else if(parseInt(sc_q16)==2) {
                sql1+=",sc62"
            }else if(parseInt(sc_q16)==3) {
                sql1+=",sc63"
            }else if(parseInt(sc_q16)==4) {
                sql1+=",sc64"
            }else if(parseInt(sc_q16)==5) {
                sql1+=",sc65"
            }
            //service
            sql1+=",topic_qs11"
            if(parseInt(sc_qs11)==1){
                sql1+=",sqs11"
            }else if(parseInt(sc_qs11)==2){
                sql1+=",sqs12"
            }else if(parseInt(sc_qs11)==3){
                sql1+=",sqs13"
            }else if(parseInt(sc_qs11)==4){
                sql1+=",sqs14"
            }else if(parseInt(sc_qs11)==5){
                sql1+=",sqs15"
            }

            sql1+=",topic_qs12" //topic_qs12
            if(parseInt(sc_qs12)==1){
                sql1+=",sqs21"
            }else if(parseInt(sc_qs12)==2){
                sql1+=",sqs22"
            }else if(parseInt(sc_qs12)==3){
                sql1+=",sqs23"
            }else if(parseInt(sc_qs12)==4){
                sql1+=",sqs24"
            }else if(parseInt(sc_qs12)==5){
                sql1+=",sqs25"
            }
            //marketing
            sql1+=",topic_qs31"
            if(parseInt(sc_qs31)==1){
                sql1+=",sqs31"
            }else if(parseInt(sc_qs31)==2){
                sql1+=",sqs32"
            }else if(parseInt(sc_qs31)==3){
                sql1+=",sqs33"
            }else if(parseInt(sc_qs31)==4){
                sql1+=",sqs34"
            }else if(parseInt(sc_qs31)==5){
                sql1+=",sqs35"
            }
            sql1+=",topic_qs32"
            if(parseInt(sc_qs32)==1){
                sql1+=",sqs321"
            }else if(parseInt(sc_qs32)==2){
                sql1+=",sqs322"
            }else if(parseInt(sc_qs32)==3){
                sql1+=",sqs323"
            }else if(parseInt(sc_qs32)==4){
                sql1+=",sqs324"
            }else if(parseInt(sc_qs32)==5){
                sql1+=",sqs325"
            }
            sql1+=",topic_qs33"
            if(parseInt(sc_qs33)==1){
                sql1+=",sqs331"
            }else if(parseInt(sc_qs33)==2){
                sql1+=",sqs332"
            }else if(parseInt(sc_qs33)==3){
                sql1+=",sqs333"
            }else if(parseInt(sc_qs33)==4){
                sql1+=",sqs334"
            }else if(parseInt(sc_qs33)==5){
                sql1+=",sqs335"
            }
            //เอกสารต่าง ๆ ที่เกี่ยวข้อง 
            sql1+=",topic_qs41"
            if(parseInt(sc_qs41)==1) {
                sql1+=",sqs411"
            }else if(parseInt(sc_qs41)==2) {
                sql1+=",sqs412"
            }else if(parseInt(sc_qs41)==3) {
                sql1+=",sqs413"
            }else if(parseInt(sc_qs41)==4) {
                sql1+=",sqs414"
            }else if(parseInt(sc_qs41)==5) {
                sql1+=",sqs415"
            }
            sql1+=",topic_qs42"
            if(parseInt(sc_qs42)==1){
                sql1+=",sqs421"
            }else if(parseInt(sc_qs42)==2){
                sql1+=",sqs422"
            }else if(parseInt(sc_qs42)==3){
                sql1+=",sqs423"
            }else if(parseInt(sc_qs42)==4){
                sql1+=",sqs424"
            }else if(parseInt(sc_qs42)==5){
                sql1+=",sqs425"
            }
            sql1+=",topic_qs43"
            if(parseInt(sc_qs43)==1){
                sql1+=",sqs431"
            }else if(parseInt(sc_qs43)==2){
                sql1+=",sqs432"
            }else if(parseInt(sc_qs43)==3){
                sql1+=",sqs433"
            }else if(parseInt(sc_qs43)==4){
                sql1+=",sqs434"
            }else if(parseInt(sc_qs43)==5){
                sql1+=",sqs435"
            }
            
            var va1=",evacreatedate,evacomment) values ("
            va1+="'"+fixdepartname+"','"+selectedItem+"','"+rptmonthname+"','"+topic_q1.trim()+"',"+sc_q11+""
            va1+=",'"+topic_q12.trim()+"',"+sc_q12+",'"+topic_q13.trim()+"',"+sc_q13+""
            va1+=",'"+topic_q41.trim()+"',"+sc_q14+""
            va1+=",'"+topic_q51.trim()+"',"+sc_q15+""
            va1+=",'"+topic_q61.trim()+"',"+sc_q16+""
            va1+=",'"+topic_qs11.trim()+"',"+sc_qs11+""
            va1+=",'"+topic_qs12.trim()+"',"+sc_qs12+""
            va1+=",'"+topic_qs31.trim()+"',"+sc_qs31+""
            va1+=",'"+topic_qs32.trim()+"',"+sc_qs32+""
            va1+=",'"+topic_qs33.trim()+"',"+sc_qs33+""
            va1+=",'"+topic_qs41.trim()+"',"+sc_qs41+""
            va1+=",'"+topic_qs42.trim()+"',"+sc_qs42+""
            va1+=",'"+topic_qs43.trim()+"',"+sc_qs43+",getdate(),'"+reviewdata.trim()+"'"
            va1+=")" 
            //insert evaluate 9.1
            await mysql.connect(config);
            const result = await mysql.query(sql1+va1);
            res.status(200).json({ success: true, message: result });
            

        } catch (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ success: false, message: 'An error occurred while inserting data.' });
        } finally {
            //exit
        }

  });
}
})

app.get('/views/f/calculate', async (req, res) => {
    // Perform calculation here
    var sql2="select * from vwsummary91"
    await mysql.connect(config);
    const result = await mysql.query(sql2);
    //console.log(result.recordset)
    res.json(result.recordset);
});