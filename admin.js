const socket = io('http://localhost:3000')
const showorders = document.getElementById('showorders') 
const Container1 = document.getElementById('container1')


showorders.addEventListener('click',function(){
      socket.emit('showorders')
})


socket.on('initial orders', function(data){
    
    Container1.innerHTML = ''
    for (var i = 0; i < data.length; i++){ 
      Container1.innerHTML += '<div>'+ "id :" +data[i].id+" Seller Name : "+data[i].sellername +" Buyer Name : "+data[i].buyername +" Matching Price : "+data[i].matchingprice +  '</div>'
    } 
})

socket.on('update',function(){
     socket.emit('showorders')
})

