import exphbs from 'express-handlebars';
import dateFormat from 'handlebars-dateformat';

const handlebars = exphbs.create({
  extname: 'hbs',
  helpers: {
    dateFormat
  }
});

export default handlebars;
