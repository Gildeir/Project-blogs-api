const PostsCategory = (sequelize, _DataTypes) => {
  const postsCategory = sequelize.define('PostsCategory', 
  {}, { timestamps: false, tableName: 'PostsCategories' });
  postsCategory.associate = (models) => {
    models.BlogPost.belongsToMany(models.Category, { 
      as: 'categories',
      through: postsCategory,
      foreignKey: 'postId',
      otherKey: 'categoryId',
    });
    models.Category.belongsToMany(models.BlogPost, { 
      as: 'blogPosts',
      through: postsCategory,
      foreignKey: 'categoryId',
      otherKey: 'postId',
    });
  };
  return postsCategory;
};

module.exports = PostsCategory;