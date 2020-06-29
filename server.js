const io = require('socket.io')(process.env.PORT || 3000)
const mysql = require("mysql");
var orders = []
var bids = []
var asks = []
var minimumask =[]
var maximumbid =[]
var db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "Talhiandroid5",
    database : "Project",
});

db.connect((err)=>{

    if(!err)
    {
       console.log("Connected");
    }
    else
    {
        console.log(err);
    }

});


io.on('connection',socket=>{
    
    
    showbids()
    showasks()   
    socket.on('user',username=>{
        socket.emit('user-connected',username)  
    })
    socket.on('showorders',function(){
        orders = []
        db.query('SELECT * FROM orders')
        .on('result', function(data){
        orders.push(data)
        })
        .on('end', function(){
            socket.emit('initial orders', orders)  
        })   

    })
        
        socket.on('new bid', function(data){
          
            db.query('INSERT INTO bids (bid,username) VALUES (?,?)',[data.note,data.name])
            showbids()

        })

        socket.on('new ask', function(data){

        
            db.query('INSERT INTO asks (ask,username) VALUES (?,?)', [data.noteask,data.name])
            showasks()
            
    
        })   

        socket.on('comparebestask',function(){
             minimumask =[]
            db.query('SELECT id,ask,username FROM asks where ask=(SELECT MIN(ask) FROM asks)')
            .on('result', function(data){
            minimumask.push(data)
            })
            .on('end', function(){
                socket.emit('comparebestask2', minimumask)  
            })    
        })

        socket.on('comparebestbid',function(){
            maximumbid =[]
           db.query('SELECT id,bid,username FROM bids where bid=(SELECT MAX(bid) FROM bids)')
           .on('result', function(data){
           maximumbid.push(data)
           })
           .on('end', function(){
               socket.emit('comparebestbid2', maximumbid)  
           })    
       })
        socket.on('updateorders',function(data){
            db.query('INSERT INTO orders (sellername,buyername,matchingprice) VALUES (?,?,?)', [data.sellername,data.buyername,data.price])
            socket.broadcast.emit('update')
        })
        
        socket.on('delete',({deleteask, deletebid})=>{
            db.query('DELETE FROM asks where id=?',deleteask)
            db.query('DELETE FROM bids where id=?',deletebid)
            bids = []
            asks = []
            db.query('SELECT * FROM asks')
        .on('result', function(data){
           
        asks.push(data)
        })
        .on('end', function(){
            socket.emit('initial asks', asks)  
        })  

        db.query('SELECT * FROM bids')
            .on('result', function(data){
              bids.push(data)
            })
            .on('end', function(){
              socket.emit('initial bids', bids)
         }) 
        })
         

      socket.on('deletebestask',function(data){
        db.query('DELETE FROM asks where id=?',data)
      })

      socket.on('deletebestbid',function(data){
        db.query('DELETE FROM bids where id=?',data)
      })

      socket.on('updateordersbestask',function(data){
        db.query('INSERT INTO orders (sellername,buyername,matchingprice) VALUES (?,?,?)', [data.sellername,data.buyername,data.price])
        showasks()
        socket.broadcast.emit('update')
    })
    socket.on('updateordersbestbid',function(data){
        db.query('INSERT INTO orders (sellername,buyername,matchingprice) VALUES (?,?,?)', [data.sellername,data.buyername,data.price])
        showbids()
        socket.broadcast.emit('update')
    })

      

     function showbids()
     {

        bids = []
    
        db.query('SELECT * FROM bids')
            .on('result', function(data){
              bids.push(data)
            })
            .on('end', function(){
              socket.emit('initial bids', bids)
              socket.emit('compare',{ask1 : asks,bid1:bids})
         }) 
     }

     function showasks()
     {
        asks = []
        db.query('SELECT * FROM asks')
        .on('result', function(data){
           
        asks.push(data)
        })
        .on('end', function(){
            socket.emit('initial asks', asks)  
            socket.emit('compare',{ask1 : asks,bid1:bids})
        })    
     }

    
})
