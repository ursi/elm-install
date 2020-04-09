#!/usr/bin/env node

'use strict';

const
	fs = require(`fs`),
	path = require(`path`),
	os = require(`os`),
	{execSync} = require(`child_process`),
	args = process.argv.slice(2);

const configPath = path.join(os.homedir(), `.elminstall`);

let config
if (fs.existsSync(configPath)) {
	try {
		config = JSON.parse(fs.readFileSync(configPath));
	} catch (error) {
		console.error(`invalid JSON in config`)
		console.error(error);
	}
} else {
	config = {};
}

if (!def(config.aliases))
	config.aliases = {};

if (args[0] === `--list`) {
	Object.entries(config.aliases)
		.map(([alias, packageStr]) => console.log(`${alias} -> ${packageStr}`));
} else {
	const parseStates =
		[ `nothing`
		, `add alias`
		];

	let
		state = parseStates[0],
		installs = [],
		newAliases = [];

	for (const arg of args) {
		switch (state) {
			case parseStates[0]:
				if (arg === `-a`)
					state = parseStates[1];
				else
					installs.push(arg);

				break;
			case parseStates[1]:
				state = parseStates[0];
				newAliases.push(arg);
				installs.push(arg);
				break;
		}
	}

	const command =
		installs
			.map(install => {
				const maybeAlias = config.aliases[install];

				let packageStr
				if (def(maybeAlias))
					packageStr = maybeAlias;
				else
					packageStr = install;

				console.log(`installing ${packageStr}`);
				return `echo y | elm install ${packageStr};`
			})
			.join(` `);

	execSync
		( command
		, { cwd: `.`
		  , shell: config.shell
		  }
		);

	if (newAliases.length > 0) {
		const aliasArray = Object.entries(config.aliases);

		newAliases.map(packageStr => {
			const alias = packageStr.match(/[^/]+\/(?:elm-)?(.+)/)[1]
			aliasArray.push([alias, packageStr]);
		});

		config.aliases =
			Object.fromEntries
				( aliasArray
					.sort((a, b) => {
						if (a < b)
							return -1
						else if (a > b)
							return 1
						else
							return 0
					})
				)

		fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
	}
}

function def(value) {return value !== undefined;}
