const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const ProgressBar = require('progress');
let mainDatabase = {};

app.get('/search', (req, res) => {
    let keyword = req.query.keyword.toString();//req.query.keyword;
    if (!keyword) {
        res.status(400).json({ error: 'Missing keyword parameter.' });
        return;
    }
    let results = [];
    for (let id in mainDatabase) {
        if (mainDatabase[id]['name'] && mainDatabase[id]['name'].includes(keyword)) {
            //console.log("[OK]", mainDatabase[id]['name']);
            results.push(mainDatabase[id]);
        }
    }
    console.log("[Search][keyword]", keyword, results.length);
    res.json(results);
});

function handleAttribute(objects, id, attribute) {
    if (objects[id][attribute]) {
        let value = objects[id][attribute].replace(`http://data.visitkorea.or.kr/${attribute === 'type' ? 'ontology' : 'resource'}/`, '');
        if (objects[value]) {
            const declareLabel = objects[value]['label'];
            if (Array.isArray(declareLabel)) {
                objects[id][attribute] = declareLabel.length > 1 ? declareLabel[1] : declareLabel[0];
            } else {
                objects[id][attribute] = declareLabel;
            }
        } else {
            objects[id][attribute] = '-';
        }
    }
}

const getLinesCount = async (filePath) => {
    let linesCount = 0;
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath, { encoding: 'utf8' }),
    });

    for await (const line of rl) {
        linesCount += 1;
    }
    return linesCount;
}

const processData = async (filePath, linesCount) => {
    let inputDatabase = {};
    const bar = new ProgressBar('processing [:bar]', {
        complete: '=',
        incomplete: ' ',
        width: 30,
        total: linesCount
    });

    const rl = readline.createInterface({
        input: fs.createReadStream(filePath, { encoding: 'utf8' }),
    });

    for await (const line of rl) {
        let matches = line.match(/^<http:\/\/data.visitkorea.or.kr\/resource\/(\d+)> <(.+)> (.+) \.$/);
        let matchesReverse = line.match(/^<(.+)> <(.+)> <http:\/\/data.visitkorea.or.kr\/resource\/(\d+)> \.$/);
        let matchesLabel = line.match(/^<http:\/\/data.visitkorea.or.kr\/resource\/(CATEGORY:\d+|A\d+)> <(.+)> (.+) \.$/);
        let matchesDeclareLabel = line.match(/^<http:\/\/data.visitkorea.or.kr\/ontology\/(.+)> <http:\/\/www.w3.org\/2000\/01\/rdf-schema#(.+)> (.+) \.$/);

        let id, key, value;

        let match;

        if (matchesDeclareLabel) {
            match = matchesDeclareLabel;
        } else if (matches) {
            match = matches;
        } else if (matchesLabel) {
            match = matchesLabel;
        }

        if (match) {
            id = match[1];
            key = match[2].replace(/.*#/, '');
            value = match[3].replace(/["<>]/g, '').replace(/\^\^http:\/\/www\.w3\.org\/2001\/XMLSchema#double$/, '').trim().replace(/@\w{2}$/, '').trim().replace(/\\u([\d\w]{4})/gi, (match, grp) => {
                return String.fromCharCode(parseInt(grp, 16));
            });
        } else if (matchesReverse) {
            id = matchesReverse[3];
            key = matchesReverse[2].replace(/.*#/, '');;
            value = matchesReverse[1].replace(/["<>]/g, '').replace(/\^\^http:\/\/www\.w3\.org\/2001\/XMLSchema#double$/, '').trim().replace(/@\w{2}$/, '').trim();
        }

        if (id && key && value) {
            // Get only the part of the key after the last '/'
            let keyParts = key.split('/');
            key = keyParts[keyParts.length - 1];

            if (!inputDatabase[id]) {
                inputDatabase[id] = {};
            }

            if (key in inputDatabase[id]) {
                if (Array.isArray(inputDatabase[id][key])) {
                    inputDatabase[id][key].push(value);
                } else {
                    inputDatabase[id][key] = [inputDatabase[id][key], value];
                }
            } else {
                inputDatabase[id][key] = value;
            }
        }
        bar.tick();
    }

    for (let id in inputDatabase) {
        handleAttribute(inputDatabase, id, 'type');
        handleAttribute(inputDatabase, id, 'category');
        handleAttribute(inputDatabase, id, 'location');
    }

    return inputDatabase; // Return inputDatabase
}

app.listen(port, async () => {
    const filePath = path.join(__dirname, 'visitkorea.nt');

    const used1 = process.memoryUsage();
    console.log(`[ProcessStart] Memory usage: ${Math.round(used1.heapUsed / 1024 / 1024 * 100) / 100} MB / ${Math.round(used1.heapTotal / 1024 / 1024 * 100) / 100} MB`);

    try {
        const linesCount = await getLinesCount(filePath);
        mainDatabase = await processData(filePath, linesCount); // Update mainDatabase here
        //console.log(mainDatabase);
        console.log(`App listening at http://localhost:${port}`)
    } catch (err) {
        console.error('App Loading Failed', err);
    }

    const used2 = process.memoryUsage();
    console.log(`[ProcessEnd] Memory usage: ${Math.round(used2.heapUsed / 1024 / 1024 * 100) / 100} MB / ${Math.round(used2.heapTotal / 1024 / 1024 * 100) / 100} MB`);
});