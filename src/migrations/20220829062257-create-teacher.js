<<<<<<< HEAD
"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("lecturers", {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			user_id: {
				type: Sequelize.STRING,
			},
			is_lecturer: {
				type: Sequelize.BOOLEAN,
			},
			is_mentor: {
				type: Sequelize.BOOLEAN,
			},
			approved_by: {
				type: Sequelize.UUID,
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
		await queryInterface.dropTable("lecturers");
	},
};
=======
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lecturers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_id: {
        type: Sequelize.UUID
      },
      is_lecturer: {
        type: Sequelize.BOOLEAN
      },
      is_mentor: {
        type: Sequelize.BOOLEAN
      },
      approved_by: {
        allowNull: true,
        type: Sequelize.UUID
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
    await queryInterface.dropTable('Lecturers');
  }
};
>>>>>>> c1b84daa499c7d54751af28c96dbc561eaef452d
