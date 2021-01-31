const express = require('express');
const app = express();
const mongoose = require('mongoose');
const articleRouter = require('./router/articles');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, usecCeateIndex: true });

//app.engine('.hbs', handlebars({
//handlebars: allowInsecurePrototypeAccess(handlebars),
//extname: '.hbs'
//}));
app.engine('.hbs', handlebars({ extname: '.hbs', allowedProtoMethods:true, __proto__: true, allowedProtoProperties: true, allowProtoMethodsByDefault: true, allowProtoPropertiesByDefault: true, }));

app.set('view engine', '.hbs')

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.redirect('/articles')
})

app.use('/articles', articleRouter);

app.listen(5000, () => console.log('Server is listening on port 5000...'));