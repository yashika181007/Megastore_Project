const express = require('express');
const bodyParser = require('body-parser');
const { sessionMiddleware } = require('./config/session');
const setMessage = require('./config/setMessage');
const path = require('path');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT; // Ensure PORT is read from .env file

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(sessionMiddleware); 
app.use(flash());
app.use(setMessage);

const homeRoutes = require('./routes/homeroutes');
const Adminrouter = require('./routes/Adminroutes');
const Storeroutes = require('./routes/Storeroutes');
const categoryroutes = require('./routes/categoryroutes');
const subcategoryroutes = require('./routes/subcategoryroutes');
const sub_subcategoryroutes = require('./routes/sub_subcategoryroutes');
const Productroutes = require('./routes/Productroutes');
const blogcategoryroutes = require('./routes/blogcategoryroutes');
const blogpostroutes = require('./routes/blogpostroutes');

app.use('/', homeRoutes);
app.use('/', Adminrouter);
app.use('/', Storeroutes); 
app.use('/', categoryroutes); 
app.use('/', subcategoryroutes); 
app.use('/', sub_subcategoryroutes); 
app.use('/', Productroutes); 
app.use('/', blogcategoryroutes); 
app.use('/', blogpostroutes);

const assetsPath = path.join(__dirname, 'assets');
app.use('/assets', express.static(assetsPath));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
