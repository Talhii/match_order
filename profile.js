const socket = io('http://localhost:3000')
const Container = document.getElementById('container')
const Container1 = document.getElementById('container1')
const connected = document.getElementById('connected')
const yourbid = document.getElementById('yourbid')
const yourask = document.getElementById('yourask')
const sendbid = document.getElementById('send-bid')
const sendask = document.getElementById('send-ask')
const matchbestask = document.getElementById('matchbestask')
const matchbestbid = document.getElementById('matchbestbid')
const sendname = document.getElementById('send-name')
const ordermatching = document.getElementById('order-matching')

var bidInput = document.getElementById('bid-input')
var askInput = document.getElementById('ask-input')
var username = document.getElementById('name-input')

var a

sendname.addEventListener('click',function(){
    const usernames = username.value
    socket.emit('user',usernames)
    socket.on('user-connected',usernames=>{
    connected.innerHTML = usernames + " Connected"
})
     
})

sendbid.addEventListener('click',function(){
    const usernames = username.value
    const bid = bidInput.value
     yourbid.innerHTML = "Your bid : "+ bid
     if(usernames == '')
     {
        alert("Please Enter username first")
     }
     else if(bid == '')
     {
        alert("Please Enter bid")
     }
     else
     {
        socket.emit('new bid', {note: bid,name : usernames})
     }
     
    bidInput.value = ''
})

sendask.addEventListener('click',function(){
    const usernames = username.value
    const ask = askInput.value
    yourask.innerHTML = "Your ask : "+ ask
 
    if(usernames == '')
    {
       alert("Please Enter username first")
    }
    else if(ask == '')
    {
       alert("Please Enter ask")
    }
    else
    {
       socket.emit('new ask', {noteask: ask,name : usernames})
    }
    askInput.value = ''
})

matchbestask.addEventListener('click',function(){
    const usernames = username.value
    if(usernames == ''){
      alert('Please first Enter user name')
    }
    else
    {
        socket.emit('comparebestask')
    }
   
})

matchbestbid.addEventListener('click',function(){
    const usernames = username.value
    if(usernames == ''){
      alert('Please first Enter user name')
    }
    else
    {
        socket.emit('comparebestbid')
    }
   
})

socket.on('initial bids', function(data){
    
    Container.innerHTML = ''
    for (var i = 0; i < data.length; i++){ 
      Container.innerHTML += '<div>'+ "id :" +data[i].id+" Bid Value : "+data[i].bid +'</div>'
    }
})

    socket.on('initial asks', function(data){
    
        Container1.innerHTML = ''
        for (var i = 0; i < data.length; i++){ 
          Container1.innerHTML += '<div>'+ "id :" +data[i].id+" Ask Value : "+data[i].ask +'</div>'
        }
    })
        
     
    socket.on('comparebestask2',function(data){
        const usernames = username.value
       ordermatching.innerHTML = "Order Executed with Best ask price : "+ data[0].ask+" User name : "+ data[0].username
       socket.emit('deletebestask',data[0].id)
      socket.emit('updateordersbestask',{sellername :data[0].username,buyername:usernames,price : data[0].ask})  
    })

    socket.on('comparebestbid2',function(data){
        const usernames = username.value
       ordermatching.innerHTML = "Order Executed with Best bi price : "+ data[0].bid+" User name : "+ data[0].username
       socket.emit('deletebestbid',data[0].id)
      socket.emit('updateordersbestbid',{sellername :data[0].username,buyername:usernames,price : data[0].bid})  
    })

    socket.on('compare',({ask1, bid1 })=>{
        a=0
        for(var i =0 ; i<ask1.length && a==0;i++)  {
            for(var j =0 ; j<bid1.length && a==0;j++) {
              if(ask1[i].ask == bid1[j].bid)
              {
                  ordermatching.innerHTML ="Order executed : "+"Ask Price :"+ask1[i].ask+"  &&  "+ " Bid Price : "+bid1[j].bid
                  socket.emit('delete',{deleteask:ask1[i].id,deletebid : bid1[j].id})
                  socket.emit('updateorders',{sellername :ask1[i].username,buyername:bid1[j].username,price : ask1[i].ask})
                  a=1
              }
            }
         }
    })
