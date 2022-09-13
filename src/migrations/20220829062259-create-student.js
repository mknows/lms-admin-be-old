<<<<<<< HEAD
"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("students", {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				primaryKey: true,
			},
			user_id: {
				type: Sequelize.STRING,
			},
			major_id: {
				allowNull: false,
				type: Sequelize.ARRAY(Sequelize.STRING),
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
			approvedBy: {
				allowNull: true,
				type: Sequelize.UUID,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("students");
	},
};
=======

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Students', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID
      },
      major_id: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.UUID)
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
    await queryInterface.dropTable('Students');
  }
};
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d
