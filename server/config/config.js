const env = process.env.NODE_ENV || "development";

if( env==='development' ){
    console.log( "We're in DEVELOPMENTT");
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/Todos';
}else if( env === 'test' ){
    console.log( "We're in TESTT");
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/Todos_test';
}