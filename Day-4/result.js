import fs from "fs";

fs.readFile("data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split("\n");
  console.log(lines);

});