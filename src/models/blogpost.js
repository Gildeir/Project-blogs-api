const BlogPost = (sequelize, DataTypes) => {
  const blogPosts = sequelize.define('BlogPost', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {
    timestamps: true,
    createdAt: 'published',
    updatedAt: 'updated',
  });

  blogPosts.associate = (models) => {
    blogPosts.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return blogPosts;
};

module.exports = BlogPost;