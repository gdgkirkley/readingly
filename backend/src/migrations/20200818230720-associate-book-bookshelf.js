'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookshelfbook', {
      bookGoogleBooksId: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: {
            tableName: 'books',
          },
          key: 'googleBooksId',
        },
      },
      bookshelfId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'bookshelves',
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
    await queryInterface.dropTable('bookshelfbook')
  },
}
