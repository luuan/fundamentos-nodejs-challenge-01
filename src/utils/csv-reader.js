import fs from "node:fs";
import { parse } from "csv-parse";
import axios from "axios";

const __dirname = new URL("../assets", import.meta.url).pathname;

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(`${__dirname}/sample-csv-file.csv`).pipe(
    parse({
      from_line: 2,
    })
  );
  for await (const record of parser) {
    axios
      .post("http://localhost:3333/tasks", {
        title: record[0],
        description: record[1],
      })
      .then((response) => {
        console.log(
          `Status code: ${response.status}\n Message: ${response.statusText}`
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

(async () => {
  const records = await processFile();
})();
