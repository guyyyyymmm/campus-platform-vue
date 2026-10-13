<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login as loginUser } from "../api/auth";

const username = ref("");
const password = ref("");
const router = useRouter();

async function login() {
  if (username.value.trim() === "") {
    alert("请输入用户名或邮箱");
    return;
  }

  if (password.value.trim() === "") {
    alert("请输入密码");
    return;
  }

  try {
    const user = await loginUser({
      username: username.value,
      password: password.value
    });

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    alert("登录成功");
    router.push("/");
  } catch (error) {
    console.error(error);
    alert("登录失败，用户名或密码错误");
  }
}
</script>

<template>
  <main class="login-page">
    <div class="login-card">
      <div class="login-icon">👋</div>

      <h1>欢迎回来</h1>

      <p class="login-description">
        登录校园信息服务平台
      </p>

      <form @submit.prevent="login">
        <div class="form-item">
          <label>用户名或邮箱</label>

          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名或邮箱"
            autocomplete="username"
          />
        </div>

        <div class="form-item">
          <label>密码</label>

          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
          />
        </div>

        <button type="submit">
          登录
        </button>
      </form>

      <p class="register-tip">
        还没有账号？

        <RouterLink to="/register">
          立即注册
        </RouterLink>
      </p>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;

  background:
    linear-gradient(
      135deg,
      #edf8fa,
      #f8fbfc
    );
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 38px 36px;

  border: 1px solid rgba(32, 113, 130, 0.08);
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 14px 35px rgba(32, 113, 130, 0.14);
}

.login-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;

  background-color: #e9f5f7;
  text-align: center;
  font-size: 30px;
  line-height: 64px;
}

.login-card h1 {
  margin-bottom: 8px;
  color: #207182;
  text-align: center;
  font-size: 28px;
}

.login-description {
  margin-bottom: 30px;
  color: #6b7c85;
  text-align: center;
  font-size: 14px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #253746;
  font-size: 15px;
  font-weight: 600;
}

.form-item input {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #d9e5e8;
  border-radius: 9px;
  box-sizing: border-box;

  color: #253746;
  background-color: #fbfdfe;
  font-size: 15px;

  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.form-item input:focus {
  border-color: #207182;
  outline: none;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(32, 113, 130, 0.12);
}

.login-card button {
  width: 100%;
  margin-top: 8px;
  padding: 13px;

  border: none;
  border-radius: 9px;
  color: white;
  background-color: #207182;

  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  transition:
    transform 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease;
}

.login-card button:hover {
  background-color: #15515d;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(32, 113, 130, 0.2);
}

.register-tip {
  margin-top: 24px;
  color: #6b7c85;
  text-align: center;
}

.register-tip a {
  color: #207182;
  font-weight: 600;
  text-decoration: none;
}

.register-tip a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 22px;
  }
}
</style>