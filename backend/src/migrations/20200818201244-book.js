'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('books', {
      googleBooksId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      pageCount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      thumbnail: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      publishDate: {
        type: Sequelize.DataTypes.STRING,
      },
      publisher: {
        type: Sequelize.DataTypes.STRING,
      },
      averageRating: {
        type: Sequelize.DataTypes.FLOAT,
      },
      categories: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
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
    await queryInterface.dropTable('books')
  },
}
