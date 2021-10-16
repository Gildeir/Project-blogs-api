const Category = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING,
  }, {
    timestamps: false,
  });

  return category;
};

module.exports = Category;