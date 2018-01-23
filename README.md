# json-to-csv-exporter

Giving a file containing line-separated JSON events (Kafka export), provides a CSV containing tenant, user_id and timestamp information related to `reports/downloaded` events.

## Start
First run:
```bash
$ npm install
```
then:
```bash
$ node index.js --file-name INPUT_FILE_NAME
```