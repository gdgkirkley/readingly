'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookauthor', {
      bookGoogleBooksId: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: {
            tableName: 'books',
          },
          key: 'googleBooksId',
        },
      },
      authorId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'authors',
          },
          key: 'id',
        },
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
    await queryInterface.dropTable('bookauthor')
  },
}
