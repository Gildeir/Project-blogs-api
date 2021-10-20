const Category = (sequelize, DataTypes) => {
  const category = sequelize.define('Category', {
    name: DataTypes.STRING,
  }, {
    timestamps: false,
  });

  category.associate = (models) => {
   category.hasMany(models.Category,
      { foreignKey: 'id', as: 'categoryId' });
  };
  
  return category;
};

module.exports = Category;