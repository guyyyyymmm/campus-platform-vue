<template>
  <section class="hero">
    <div class="hero-content">
      <h1>让校园更便利</h1>

      <p>
        在这里发布失物信息、校园互助需求，
        也可以发现身边的实用好物。
      </p>

      <div class="hero-buttons">
        <RouterLink
          to="/lost-items"
          class="btn primary-btn"
        >
          查看失物信息
        </RouterLink>

        <RouterLink
          to="/publish"
          class="btn secondary-btn"
        >
          发布信息
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  max-width: 1200px;
  min-height: 400px;
  margin: 0 auto;
  padding: 80px 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
}

.hero-content {
  max-width: 760px;
}

.hero-content h1 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 52px;
  line-height: 1.2;
}

.hero-content p {
  max-width: 620px;
  margin: 0 auto 30px;
  color: #607080;
  line-height: 1.8;
  font-size: 18px;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn {
  display: inline-block;
  padding: 13px 28px;
  border-radius: 8px;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(32, 113, 130, 0.2);
}

.primary-btn {
  border: 1px solid #207182;
  color: white;
  background-color: #207182;
}

.primary-btn:hover {
  background-color: #15515d;
}

.secondary-btn {
  border: 1px solid #207182;
  color: #207182;
  background-color: white;
}

.secondary-btn:hover {
  color: white;
  background-color: #207182;
}

@media (max-width: 600px) {
  .hero {
    min-height: 340px;
    padding: 60px 20px;
  }

  .hero-content h1 {
    font-size: 36px;
  }

  .hero-content p {
    font-size: 16px;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>