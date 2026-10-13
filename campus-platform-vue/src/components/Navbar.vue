<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount
} from "vue";

import { useRouter } from "vue-router";

const router = useRouter();

const currentUser = ref(
  JSON.parse(
    localStorage.getItem("user") || "null"
  )
);

const navAvatar = ref(
  "/avatars/avatar-1.png"
);

function loadNavAvatar() {
  const username =
    currentUser.value?.username;

  if (!username) {
    navAvatar.value =
      "/avatars/avatar-1.png";
    return;
  }

  navAvatar.value =
    localStorage.getItem(
      `avatar_${username}`
    ) || "/avatars/avatar-1.png";
}

function logout() {
  localStorage.removeItem("user");
  currentUser.value = null;
  navAvatar.value = "/avatars/avatar-1.png";
  router.push("/login");
}

onMounted(() => {
  loadNavAvatar();

  window.addEventListener(
    "avatar-updated",
    loadNavAvatar
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    "avatar-updated",
    loadNavAvatar
  );
});
</script>

<template>
  <header class="header">
    <nav class="navbar">
      <RouterLink
        to="/"
        class="logo"
      >
        校园信息服务平台
      </RouterLink>

      <ul class="nav-list">
        <li>
          <RouterLink to="/">
            首页
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/lost-items">
            失物招领
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/second-hand">
            二手平台
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/publish">
            发布信息
          </RouterLink>
        </li>

        <li>
          <RouterLink to="/mutual-aid">
            校园互助
          </RouterLink>
        </li>

        <li v-if="currentUser">
          <span class="user-text">
            <img
              class="nav-avatar"
              :src="navAvatar"
              alt="用户头像"
            />

            欢迎，
            {{ currentUser.username }}
          </span>
        </li>

        <li v-if="currentUser">
          <RouterLink to="/user-center">
            个人中心
          </RouterLink>
        </li>

        <li v-if="currentUser">
          <button
            class="logout-button"
            @click="logout"
          >
            退出登录
          </button>
        </li>

        <li v-else>
          <RouterLink to="/login">
            登录
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 10px 0;
  background: rgba(32, 113, 130, 0.96);
  box-shadow: 0 4px 16px rgba(32, 113, 130, 0.16);
  backdrop-filter: blur(10px);
}

.navbar {
  max-width: 1200px;
  min-height: 58px;
  margin: 0 auto;
  padding: 0 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo {
  flex-shrink: 0;
  color: white;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  text-decoration: none;
  white-space: nowrap;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-list li {
  display: flex;
  align-items: center;
}

.nav-list a,
.logout-button {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;

  color: rgba(255, 255, 255, 0.9);
  background: transparent;
  text-decoration: none;
  font-size: 15px;
  white-space: nowrap;

  transition:
    color 0.25s ease,
    background-color 0.25s ease,
    transform 0.25s ease;
}

.nav-list a:hover,
.nav-list a.router-link-active,
.logout-button:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

.user-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  color: #e4f5f6;
  font-size: 14px;
  white-space: nowrap;
}

.nav-avatar {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  object-fit: cover;
}

.logout-button {
  cursor: pointer;
}

@media (max-width: 900px) {
  .navbar {
    align-items: flex-start;
    flex-direction: column;
    padding: 14px 20px;
  }

  .nav-list {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-width: 600px) {
  .header {
    position: static;
  }

  .nav-list {
    gap: 5px;
  }

  .nav-list a,
  .logout-button {
    min-height: 32px;
    padding: 0 8px;
    font-size: 13px;
  }

  .user-text {
    font-size: 13px;
  }

  .nav-avatar {
    width: 26px;
    height: 26px;
  }
}
</style>