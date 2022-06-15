const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeHtmlfile = fs.readFileSync("index.html", "utf-8");
const replaceVal = (teampvalue, realvalue) => {
  let temp = teampvalue.replace(
    "{%tempt%}",
    (realvalue.main.temp - 273.15).toFixed(0)
  );
  temp = temp.replace("{%location%}", realvalue.name);
  temp = temp.replace("{%country%}", realvalue.sys.country);
  temp = temp.replace(
    "{%temptmin%}",
    (realvalue.main.temp_min - 273.15).toFixed(0)
  );
  temp = temp.replace(
    "{%temptmax%}",
    (realvalue.main.temp_max - 273.15).toFixed(0)
  );
  return temp;
};
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=kolkata&appid=60c184d84d04d9c3dd8ce55c9467b693"
    )
      .on("data", function (chunk) {
        const data = JSON.parse(chunk);
        const arrayData = [data];
        console.log(arrayData);
        const realData = arrayData
          .map((val) => replaceVal(homeHtmlfile, val))
          .join("");
        res.write(realData);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        console.log("end");
      });
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server start");
});
