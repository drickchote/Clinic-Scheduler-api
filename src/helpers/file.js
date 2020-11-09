const fs = require('fs');

module.exports = {
    
    read(){
       let content = fs.readFileSync('src/schedules.json', 'utf-8');
       return JSON.parse(content);
    },
   
    write(data){
       fs.writeFile('src/schedules.json',JSON.stringify(data), (error)=>{
           if(error){
               console.log("An error occurred while writing data:"+error);
           } else{
               console.log("write file");
           }
       })
   }
}


