import {Model, DataTypes} from 'sequelize'

class Note extends Model {}

const note = sequelize => {
  Note.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      page: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'note',
    },
  )

  Note.associate = model => {
    Note.belongsTo(model.User)
    Note.belongsTo(model.Book)
  }

  return Note
}

export default note

export {Note}
