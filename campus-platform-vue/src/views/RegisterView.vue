<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register as registerUser } from "../api/auth";

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

async function register() {
  if (username.value.trim() === "") {
    alert("请输入用户名");
    return;
  }

  if (email.value.trim() === "") {
    alert("请输入邮箱");
    return;
  }

  if (password.value.trim() === "") {
    alert("请输入密码");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("两次输入的密码不一致");
    return;
  }

  try {
    await registerUser({
      username: username.value,
      password: password.value,
      email: email.value
    });

    alert("注册成功");
    router.push("/login");
  } catch (error) {
    console.error(error);
    alert("注册失败，用户名可能已经存在");
  }
}
</script>

<template>
  <main class="register-page">
    <div class="register-card">
      <h1>用户注册</h1>

      <form @submit.prevent="register">
        <div class="form-item">
          <label>用户名</label>
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-item">
          <label>邮箱</label>
          <input
            v-model="email"
            type="email"
            placeholder="请输入邮箱"
          />
        </div>

        <div class="form-item">
          <label>密码</label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
          />
        </div>

        <div class="form-item">
          <label>确认密码</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
          />
        </div>

        <button type="submit">
          注册
        </button>
      </form>

      <p class="login-tip">
        已有账号？
        <RouterLink to="/login">
          返回登录
        </RouterLink>
      </p>
    </div>
  </main>
</template>

<style scoped>
.register-page {
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

.register-card {
  width: 100%;
  max-width: 440px;
  padding: 38px 36px;

  border: 1px solid rgba(32, 113, 130, 0.08);
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 14px 35px rgba(32, 113, 130, 0.14);
}

.register-card h1 {
  margin-bottom: 30px;
  color: #207182;
  text-align: center;
  font-size: 28px;
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

.register-card button {
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

.register-card button:hover {
  background-color: #15515d;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(32, 113, 130, 0.2);
}

.login-tip {
  margin-top: 24px;
  color: #6b7c85;
  text-align: center;
}

.login-tip a {
  color: #207182;
  font-weight: 600;
  text-decoration: none;
}

.login-tip a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 30px 22px;
  }
}
</style>