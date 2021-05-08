'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.createTable('privacy', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        privacyLevel: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
      }),
      await queryInterface.bulkInsert('privacy', [
        {
          privacyLevel: 'Private',
        },
        {privacyLevel: 'Friends'},
        {privacyLevel: 'Public'},
      ]),
      await queryInterface.addColumn('goals', 'privacyId', {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: {
          model: {
            tableName: 'privacy',
          },
          key: 'id',
        },
      }),
      await queryInterface.addColumn('notes', 'privacyId', {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: {
          model: {
            tableName: 'privacy',
          },
          key: 'id',
        },
      }),
      await queryInterface.addColumn('readings', 'privacyId', {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: {
          model: {
            tableName: 'privacy',
          },
          key: 'id',
        },
      }),
      await queryInterface.addColumn('bookshelves', 'privacyId', {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: {
          model: {
            tableName: 'privacy',
          },
          key: 'id',
        },
      }),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.removeColumn('goals', 'privacyId'),
      await queryInterface.removeColumn('notes', 'privacyId'),
      await queryInterface.removeColumn('readings', 'privacyId'),
      await queryInterface.dropTable('privacy'),
    ])
  },
}
