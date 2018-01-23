'use strict';

/**
* Exports to CSV report downloaded events
*/

const fs = require('fs');
const path = require('path');
const json2csv = require('json2csv');
const logger = require('log4js').getLogger();
const IncrementalJSONParser = require('incremental-json-parser');

const argv = require('yargs')
	.option('file-name', {
		default: 'test-events.txt',
		describe: 'Input file name',
		type: 'string',
	})
	.help()
	.argv;

const file = path.resolve(process.cwd(), argv.fileName);

logger.info('Export-tool started');

const messageJson = fs.readFileSync(file, 'UTF-8');

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

fs.writeFile('output2.csv', csv, err => {
	if (err) {
		throw err;
	}
	logger.info('Wrote all data to file');
});
