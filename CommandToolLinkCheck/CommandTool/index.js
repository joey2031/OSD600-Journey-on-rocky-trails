const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const packageJson = require("./package.json");
const colors = require("colors");

// ExitCode
process.on("SIGTERM", () => {
    server.close(() => {
        console.log("Program is terminated");
    });
});

//Flag labeling each URL as a good or bad
const _label = ({
    good: "GOOD",
    bad: "BAD"
});

//const getTelescope = fetch('http:/') data
async function getTelescopeData() {

    //fetching data from local host
    fetch("http://localhost:3000/posts").then(response => {
        return response.json();
    }).then(data => {
        console.log(data);

        //truncate the data and write to file
        fs.truncate("telescopeData.txt", 0, function () {
            for (i = 0; i < data.length; i++) {
                fetch(`http://localhost:3000${data[i].url}`)
                    .then(res => {
                        return res.json();
                    }).then(telescopeData => {
                        //Append to telescopeData.txt
                        fs.appendFile("telescopeData.txt", telescopeData.html,
                            (err) => {
                                if (err) {
                                    console.log(err)
                                        .then.process(); //Termination 
                                }
                            });
                    });
            }
        });

        // its not reading the file for some reason. File is empty when I add this.
        fs.readFile("telescopeData.txt", "utf-8", (err, data) => {
            if (err) {
                console.log("Fail to read file", err);
            }
            else {

                console.log(data);
                console.log("^^^");
                const validUrl = data.match(/(http|https)(:\/\/)([\w+\-&@`~#$%^*.=/?:]+)/gi);
                console.log(validUrl);
                console.log("^^^");
                validUrl.forEach((url) => {
                    fetch(url, { method: "HEAD", timeout: 2000 })
                        .then((res) => {
                            if (res.status == 200)
                                console.log(res.status, url.green, _label.good.rainbow);
                            else if (res.status == 400 || res.status == 404)
                                console.log(res.status, url);
                            else console.log(res.status, url)
                                .then.process(); //Termination 

                        })
                        .catch((error) => {
                            console.log("404", url.red, _label.bad.bgRed);
                        });
                });
            }
        });
    } // then ends
    );
}




if (process.argv.length == 2) {
    greetingMessage();
    console.log("Hello");
} else if (process.argv[2] == "--telescope") {
    console.log("Telescope");
    getTelescopeData();
}
else {
    const filePath = path.join(__dirname, process.argv[2]);
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            console.log("Fail to read file", err);
        }
        else {
            const validUrl = data.match(/(http|https)(:\/\/)([\w+\-&@`~#$%^*.=/?:]+)/gi);
            validUrl.forEach((url) => {
                fetch(url, { method: "HEAD", timeout: 2000 })
                    .then((res) => {
                        if (res.status == 200)
                            console.log(res.status, url.green, _label.good.rainbow);
                        else if (res.status == 400 || res.status == 404)
                            console.log(res.status, url);
                        else console.log(res.status, url)
                            .then.process(); //Termination 

                    })
                    .catch((error) => {
                        console.log("404", url.red, _label.bad.bgRed);
                    });
            });
        }
    });
}

