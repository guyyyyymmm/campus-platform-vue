<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <h3>校园信息服务平台</h3>
        <p>
          让校园信息发布更简单，
          让校园生活更加便利。
        </p>
      </div>

      <div class="footer-links">
        <h4>快速入口</h4>

        <RouterLink to="/">
          首页
        </RouterLink>

        <RouterLink to="/lost-items">
          失物招领
        </RouterLink>

        <RouterLink to="/second-hand">
          二手交易
        </RouterLink>

        <RouterLink to="/mutual-aid">
          校园互助
        </RouterLink>
      </div>

      <div class="footer-links">
        <h4>用户服务</h4>

        <RouterLink to="/publish">
          发布信息
        </RouterLink>

        <RouterLink to="/user-center">
          个人中心
        </RouterLink>

        <RouterLink to="/login">
          用户登录
        </RouterLink>
      </div>
    </div>

    <div class="footer-bottom">
      © 2026 校园信息服务平台
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 60px;
  padding: 42px 24px 20px;
  color: white;
  background: linear-gradient(
    135deg,
    #124b58,
    #207182
  );
}

.footer-content {
  max-width: 1100px;
  margin: 0 auto 35px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
}

.footer-brand h3 {
  margin-bottom: 12px;
  font-size: 20px;
}

.footer-brand p {
  max-width: 280px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links h4 {
  margin-bottom: 8px;
  color: #ffe082;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.72);
  text-align: center;
  font-size: 13px;
}

@media (max-width: 700px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
</style>