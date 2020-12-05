'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('goals', 'startDate', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('goals', 'endDate', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('goals', 'status', {
        type: Sequelize.ENUM('NOTSTARTED', 'INPROGRESS', 'COMPLETE'),
        defaultValue: 'NOTSTARTED',
        allowNull: false,
      }),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('goals', 'startDate'),
      queryInterface.removeColumn('goals', 'endDate'),
      queryInterface.removeColumn('goals', 'status'),
    ])
  },
}
