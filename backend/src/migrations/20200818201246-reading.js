'use strict'

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('readings', {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        type: Sequelize.DataTypes.UUID,
      },
      progress: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.DataTypes.FLOAT,
      },
      bookGoogleBooksId: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: {
            tableName: 'books',
          },
          key: 'googleBooksId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('readings')
  },
}
