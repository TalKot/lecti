const express = require('express');
const app = express();

app.get('/',(req,res)=>{
  res.send({'test' : 'testing!'});
});

app.listen(5000);
console.log('app listen on port 5000');
