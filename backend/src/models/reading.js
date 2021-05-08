import {Model, DataTypes} from 'sequelize'

class Reading extends Model {}

const reading = sequelize => {
  Reading.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      // Progress should allow both a page count, or a percent
      progress: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.FLOAT,
        validate: {
          min: 0,
        },
      },
      privacyId: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        references: {
          model: {
            tableName: 'privacy',
          },
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'reading',
    },
  )

  Reading.associate = model => {
    Reading.belongsTo(model.User)
    Reading.belongsTo(model.Book)
  }

  return Reading
}

export default reading

export {Reading}
