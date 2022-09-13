"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const databases = {};
const files = [];

let sequelize;

if (config.use_env_variable)
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
else
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config
	);

<<<<<<< HEAD
fs.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
		);
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(
			sequelize,
			Sequelize.DataTypes
		);

		databases[model.name] = model;
	});
=======
const sortDir = (mainDirectory) => {
  const folders = [];
  const CheckFile = filePath => (fs.statSync(filePath).isFile());
  const sortPath = (directory) => {
    fs
      .readdirSync(directory)
      .filter(file => (file.indexOf(".") !== 0) && (file !== "index.js"))
      .forEach((res) => {
        const filePath = path.join(directory, res);
        if (CheckFile(filePath)) files.push(filePath);
        else folders.push(filePath);
      });
  };

  folders.push(mainDirectory);

  let i = 0;

  do {
    sortPath(folders[i]);
    i += 1;
  } while (i < folders.length);
};

sortDir(__dirname);

files
  .forEach((file) => {
    const model = require(file)(sequelize, Sequelize.DataTypes);
    databases[model.name] = model;
  });
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d

Object.keys(databases).forEach((tableName) => {
	if (databases[tableName].associate) {
		databases[tableName].associate(databases);
	}
});

databases.sequelize = sequelize;
databases.Sequelize = Sequelize;

module.exports = databases;