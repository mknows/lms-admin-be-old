<<<<<<< HEAD
"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("subjects", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			name: {
				type: Sequelize.STRING,
			},
			number_of_sessions: {
				type: Sequelize.INTEGER,
			},
			degree: {
				type: Sequelize.STRING,
			},
			level: {
				type: Sequelize.STRING,
			},
			lecturer: {
				type: Sequelize.ARRAY(Sequelize.UUID),
			},
			description: {
				type: Sequelize.STRING,
			},
			credit: {
				type: Sequelize.INTEGER,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_by: {
				allowNull: true,
				type: Sequelize.UUID,
			},
			created_by: {
				allowNull: true,
				type: Sequelize.UUID,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("subjects");
	},
};
=======
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Subjects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      number_of_sessions: {
        type: Sequelize.INTEGER
      },
      level: {
        type: Sequelize.STRING
      },
      degree: {
        type: Sequelize.STRING
      },
      lecturer_id: {
        type: Sequelize.ARRAY(Sequelize.UUID)
      },
      created_by: {
        allowNull: true,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Subjects');
  }
};
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d
