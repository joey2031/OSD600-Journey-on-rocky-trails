const fs=require('fs')
const fetch=require('node-fetch')
const path=require('path')
const packageJson = require('./package.json');
const colors = require('colors');
let ignoreLinks = [];


//This is command line tool - if red links are not working - if green links are working
//Run with a file name to process file, run with argument v or version to get the version 
//of this tool

//Flag labeling each URL as a good or bad
const _label = ({
    good: "GOOD",
    bad: "BAD"
})

// ExitCode
process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Program is terminated')
    })
  })

if(process.argv.length == 2){
    console.log("Hello");
}
else{ // more then 2

    if (process.argv[2] == "v" || process.argv[2] == "version") {
        console.log(packageJson.name + " Version " + packageJson.version);
    } else if (process.argv[2] == "--ignore"){
        const filePath = path.join(__dirname, process.argv[3]); // file with ignore links, argv[4] will be file to process
        ignoreLinks = fs.readFileSync(filePath, 'utf-8').split('\n')
        ignoreLinks = ignoreLinks.filter(w => !w.startsWith('#'))
        ignoreLinks = ignoreLinks.filter(w => !w.startsWith("www."))
        //console.log(ignoreLinks);
        //console.log(ignoreLinks.length);
        
        if(ignoreLinks.length == 0){
            console.log("Invalid file, file cannt contain only comments (#) and invalid URLs")
            process.exitCode = 1;
        } else{
            processFile();
        }
    }else{
        processFile();  
    }
}


function processFile(){
    let filePath = "";
    if(process.argv[2] == "--ignore"){
        filePath = path.join(__dirname,process.argv[4])
    } else{
        filePath = path.join(__dirname,process.argv[2])
    }
    fs.readFile(filePath,'utf-8',(err,data)=>{ // data is contents of file
        if(err){
            console.log("Fail to read file",err)
        } else{
            // we return an array waith data.match and store it in valid URL
            const validUrl=data.match(/(http|https)(:\/\/)([\w+\-&@`~#$%^*.=/?:]+)/gi)
            // not sure if we need this if
            if(ignoreLinks.length != 0){
                // Need  to trim since every line ends with \r
                var trimmedArr = ignoreLinks.map(s => s.trim())
                //console.log("trimmedArr:");
                //console.log(trimmedArr);

            // Stack overflow: https://stackoverflow.com/questions/34901593/how-to-filter-an-array-from-all-elements-of-another-array
            // Filter using the trimmed array since that matches the links grabed by the RegEx
            var filtered = validUrl.filter(f => !trimmedArr.includes(f)) // f repersents ignoreLinks

            // call for each on new array with filter on it
            filtered.forEach((url)=>{
                fetch(url,{method:'HEAD',timeout:2000})
                .then((res)=>{
                    if(res.status==200)
                    console.log(res.status,url.green,_label.good.rainbow)
                    else if(res.status==400||res.status==404)
                    console.log(res.status,url)
                .then.process(); //termination 
                    
                })
                .catch((error)=>{
                    console.log("404",url.red, _label.bad.bgRed)
                })
            })
            } else{
            // Call on original array
            validUrl.forEach((url)=>{
                fetch(url,{method:'HEAD',timeout:2000})
                .then((res)=>{
                    if(res.status==200)
                    console.log(res.status,url.green,_label.good.rainbow)
                    else if(res.status==400||res.status==404)
                    console.log(res.status,url)
                .then.process(); //termination 
                    
                })
                .catch((error)=>{
                    console.log("404",url.red, _label.bad.bgRed)
                })
            })
            }
        }
    }) 
    
}

