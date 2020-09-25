const fs=require('fs')
const fetch=require('node-fetch')
const path=require('path')

console.log(process.argv)
const greetingMessage=()=>{
console.log("This is command line tool");
console.log("if red links are not working");
console.log("if green links are working")
}


if(process.argv.length==2){
    greetingMessage();
}
else{
    const filePath=path.join(__dirname,process.argv[2])
    fs.readFile(filePath,'utf-8',(err,data)=>{
        if(err){
            console.log("Fail to read file",err)
        }
        else{
            const validUrl=data.match(/(http|https)(:\/\/)([\w+\-&@`~#$%^*.=/?:]+)/gi)
            validUrl.forEach((url)=>{
            fetch(url,{method:'HEAD',timeout:2000})
            .then((res)=>{
                if(res.status==200)
                console.log(res.status,url)
                else if(res.status==400||res.status==404)
                console.log(res.status,url)
                else console.log(res.status,url)
            })
            .catch((error)=>{
                console.log("404",url)
            })
        })
        }
    })
}