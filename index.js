const express = require('express')
const app = express();
const port = 8080


app.use(express.json());

app.use('/api/products', require('./routes/products'));
app.use('/api/carts', require('./routes/carts'));



app.get('/', (req, res) => {
    res.send('Hello GET')
  })



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})