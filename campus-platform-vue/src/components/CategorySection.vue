<template>
  <section class="categories">
    <h2>信息分类</h2>

    <p class="description">
      快速查找自己需要的信息
    </p>

    <div class="category-list">
      <RouterLink
        to="/lost-items"
        class="category-card"
      >
        <div class="category-icon">🔍</div>
        <h3>失物招领</h3>
        <p>寻找丢失的物品</p>
        <span>查看详情</span>
      </RouterLink>

      <RouterLink
        to="/second-hand"
        class="category-card"
      >
        <div class="category-icon">🛒</div>
        <h3>二手交易</h3>
        <p>发布和浏览闲置物品</p>
        <span>查看详情</span>
      </RouterLink>

      <RouterLink
        to="/mutual-aid"
        class="category-card"
      >
        <div class="category-icon">🤝</div>
        <h3>校园互助</h3>
        <p>发布和查看校园求助需求</p>
        <span>查看详情</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.categories {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 24px;
  text-align: center;
}

.categories h2 {
  margin-bottom: 12px;
  color: #207182;
  font-size: 30px;
}

.description {
  margin-bottom: 30px;
  color: #607080;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.category-card {
  padding: 30px 20px;
  border: 1px solid rgba(32, 113, 130, 0.08);
  border-radius: 14px;
  color: #311e1e;
  background-color: white;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(32, 113, 130, 0.12);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.category-card:hover {
  border-color: #b8dce3;
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(32, 113, 130, 0.2);
}

.category-icon {
  margin-bottom: 18px;
  font-size: 36px;
}

.category-card h3 {
  margin-bottom: 14px;
  color: #2c3e50;
  font-size: 22px;
}

.category-card p {
  min-height: 48px;
  margin-bottom: 18px;
  color: #607080;
  line-height: 1.6;
}

.category-card span {
  color: #207182;
  font-weight: bold;
}

@media (max-width: 768px) {
  .category-list {
    grid-template-columns: 1fr;
  }

  .category-card {
    padding: 26px 20px;
  }
}
</style>