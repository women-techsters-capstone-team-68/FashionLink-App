module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      OrderId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      assignedTo: DataTypes.INTEGER,
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
      }
    },
    {
      tableName: 'Tasks',
      timestamps: true
    }
  );

  Task.associate = function (models) {
    Task.belongsTo(models.Order, { foreignKey: 'OrderId', as: 'order' });
  };

  return Task;
};
