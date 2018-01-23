'use strict';

/**
* Exports to CSV report downloaded events
*/

const fs = require('fs');
const json2csv = require('json2csv');
const logger = require('log4js').getLogger();
const IncrementalJSONParser = require('incremental-json-parser');

const argv = require('yargs')
	.option('kafka', {
		default: 'localhost:9092',
		describe: 'Kafka address',
		type: 'string',
	})
	.help()
	.argv;

const FILE = './test-events.txt';

logger.info('Export-tool started');

const messageJson = fs.readFileSync(FILE, 'UTF-8');

const events = [];

function handler(event) {
	if (event.type === 'http://collaborne.com/schemas/events/polaris/reports/downloaded') {
		events.push(event);
	}
}

const incrementalParser = new IncrementalJSONParser(handler);

const lines = messageJson.split('\n')
	.map(line => {
		incrementalParser.submit(line);
	});

const fields = ['_meta.tenant', '_meta.user_id', '_meta.timestamp'];
const csv = json2csv({data: events, fields});

fs.writeFile('output.csv', csv, err => {
	if (err) {
		throw err;
	}
	logger.info('Wrote all data to file');
});
