const express = require('express')
const cors = require('cors')
const xlsx = require('xlsx');

const app = express();



app.use(cors({origin: 'http://localhost:4200'}));



app.get('/data', (req, res) => {

    var workbook = xlsx.readFile('D:\\Projects\\Angular\\my-app\\src\\data\\PTTMgmtMetricsData.xlsx');
    var sheetnames = workbook.SheetNames;
    var sheetindex= 1;
    var jsonobject = xlsx.utils.sheet_to_json(workbook.Sheets[sheetnames[sheetindex-1]]);
    res.json(jsonobject);
});


app.listen(4000);

