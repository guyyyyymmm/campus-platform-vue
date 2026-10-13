<script setup>
import {
  ref,
  onMounted,
  computed
} from "vue";

import {
  getLostItems,
  uploadImage
} from "../api/lostItems";
import { getSecondHandItems } from "../api/secondHand";
import Navbar from "../components/Navbar.vue";

const user = ref(
  JSON.parse(
    localStorage.getItem("user") || "{}"
  )
);

const activeTab = ref("posts");
const posts = ref([]);

const favoritesKey = computed(() => {
  return user.value.username
    ? `favorites_${user.value.username}`
    : "favorites_guest";
});

const favorites = ref(
  JSON.parse(
    localStorage.getItem(
      favoritesKey.value
    ) || "[]"
  )
);

const presetAvatars = [
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png",
  "/avatars/avatar-3.png",
  "/avatars/avatar-4.png",
  "/avatars/avatar-5.png",
  "/avatars/avatar-6.png",
  "/avatars/avatar-7.png",
  "/avatars/avatar-8.png"
];

const avatarFileInput = ref(null);

function openAvatarFilePicker() {
  avatarFileInput.value?.click();
}

async function handleAvatarUpload(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("只能选择图片文件");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("头像不能超过 5MB");
    event.target.value = "";
    return;
  }

  try {
    const result = await uploadImage(file);

    avatar.value = result.url;

    localStorage.setItem(
      avatarKey.value,
      result.url
    );

    showAvatarPicker.value = false;
    alert("头像上传成功");
  } catch (error) {
    console.error(error);
    alert("头像上传失败");
  }

  event.target.value = "";
}

const avatarKey = computed(() => {
  return user.value.username
    ? `avatar_${user.value.username}`
    : "avatar_guest";
});

const savedAvatar = localStorage.getItem(
  avatarKey.value
);

const avatar = ref(
  savedAvatar &&
  savedAvatar.startsWith("/avatars/")
    ? savedAvatar
    : presetAvatars[0]
);

const showAvatarPicker = ref(false);

const myPosts = computed(() => {
  return posts.value.filter((item) => {
    return item.createdBy === user.value.username;
  });
});

async function loadMyPosts() {
  try {
    const lostItems = await getLostItems();
    const secondHandItems =
      await getSecondHandItems();

    posts.value = [
      ...lostItems,
      ...secondHandItems
    ];
  } catch (error) {
    console.error(error);
  }
}

function saveFavorites() {
  localStorage.setItem(
    favoritesKey.value,
    JSON.stringify(favorites.value)
  );
}

function removeFavorite(item) {
  favorites.value = favorites.value.filter(
    (favorite) => {
      return !(
        favorite.type === item.type &&
        favorite.id === item.id
      );
    }
  );

  saveFavorites();
}

function contactSeller(item) {
  if (!item.contact) {
    alert("卖家暂未填写联系方式");
    return;
  }

  alert(`卖家联系方式：${item.contact}`);
}

function selectAvatar(item) {
  avatar.value = item;

  localStorage.setItem(
    avatarKey.value,
    item
  );

  window.dispatchEvent(
  new Event("avatar-updated")
);

  showAvatarPicker.value = false;
}

onMounted(loadMyPosts);
</script>

<template>
  <main class="user-center-page">
    <Navbar />

    <div class="user-center-content">
      <h1>个人中心</h1>

      <section class="user-card">
        <div
          class="avatar"
          @click="showAvatarPicker = true"
        >
          <img
            :src="avatar"
            alt="用户头像"
          />
        </div>

        <button
          class="change-avatar-button"
          @click="showAvatarPicker = true"
        >
          更换头像
        </button>

        <h2>
          {{ user.username || "未登录用户" }}
        </h2>

        <p>欢迎回来</p>
      </section>

      <div
        v-if="showAvatarPicker"
        class="avatar-mask"
        @click.self="showAvatarPicker = false"
      >
        <div class="avatar-panel">
          <h3>选择系统头像</h3>
          <button
  class="upload-avatar-button"
  @click="openAvatarFilePicker"
>
  从电脑选择图片
</button>

<input
  ref="avatarFileInput"
  type="file"
  accept="image/*"
  class="hidden-file-input"
  @change="handleAvatarUpload"
/>

          <div class="avatar-list">
            <button
              v-for="item in presetAvatars"
              :key="item"
              class="avatar-option"
              @click="selectAvatar(item)"
            >
              <img
                :src="item"
                alt="系统头像"
              />
            </button>
          </div>

          <button
            class="close-avatar-button"
            @click="showAvatarPicker = false"
          >
            取消
          </button>
        </div>
      </div>

      <section class="menu-list">
        <button
          :class="{
            active: activeTab === 'posts'
          }"
          @click="activeTab = 'posts'"
        >
          我的发布
        </button>

        <button
          :class="{
            active: activeTab === 'favorites'
          }"
          @click="activeTab = 'favorites'"
        >
          我的收藏
        </button>
      </section>

      <section
        v-if="activeTab === 'posts'"
        class="posts-section"
      >
        <h2>我的发布</h2>

        <p
          v-if="myPosts.length === 0"
          class="empty-text"
        >
          暂无发布信息
        </p>

        <div
          v-for="item in myPosts"
          :key="`${item.category}-${item.id}`"
          class="post-card"
        >
          <h3>{{ item.name }}</h3>

          <p>{{ item.description }}</p>

          <p>
            {{
              item.category === "校园互助"
                ? "需求地点"
                : "地点"
            }}：{{ item.location }}
          </p>

          <p v-if="item.price">
            价格：{{ item.price }}
          </p>

          <p>
            联系方式：{{ item.contact }}
          </p>

          <span class="post-type">
            {{ item.category || "二手交易" }}
          </span>
        </div>
      </section>

      <section
        v-else
        class="posts-section"
      >
        <h2>我的收藏</h2>

        <p
          v-if="favorites.length === 0"
          class="empty-text"
        >
          暂无收藏商品
        </p>

        <div
          v-for="item in favorites"
          :key="`${item.type}-${item.id}`"
          class="post-card"
        >
          <h3>{{ item.name }}</h3>

          <p>{{ item.description }}</p>

          <p v-if="item.price">
            价格：{{ item.price }}
          </p>

          <p>
            地点：{{ item.location }}
          </p>

          <p>
            联系方式：{{ item.contact }}
          </p>

          <button
            v-if="item.type === 'secondHand'"
            class="contact-button"
            @click="contactSeller(item)"
          >
            联系卖家
          </button>

          <button
            class="remove-favorite-button"
            @click="removeFavorite(item)"
          >
            取消收藏
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.user-center-page {
  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      #edf8fa 0%,
      #f8fbfc 55%,
      #f4f8fa 100%
    );
}

.user-center-content {
  max-width: 1050px;
  margin: 0 auto;
  padding: 50px 24px 80px;
}

h1 {
  margin: 20px 0 32px;
  color: #207182;
  text-align: center;
  font-size: 34px;
}

.user-card {
  position: relative;
  max-width: 520px;
  margin: 0 auto 30px;
  padding: 48px 24px 38px;
  border: 1px solid rgba(32, 113, 130, 0.08);
  border-radius: 16px;
  background-color: white;
  text-align: center;
  box-shadow: 0 10px 28px rgba(32, 113, 130, 0.12);
}

.avatar {
  width: 130px;
  height: 130px;
  margin: 0 auto 18px;
  overflow: hidden;
  border: 5px solid #e9f5f7;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(32, 113, 130, 0.18);
  transition: transform 0.25s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar:hover {
  transform: scale(1.06);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-avatar-button {
  position: absolute;
  top: 24px;
  right: 24px;

  margin: 0;
  padding: 8px 14px;
  border: none;
  border-radius: 999px;
  color: #207182;
  background-color: #e9f5f7;
  font-size: 13px;
  cursor: pointer;
  transition:
    color 0.25s ease,
    background-color 0.25s ease,
    transform 0.25s ease;
}

.change-avatar-button:hover {
  color: white;
  background-color: #207182;
  transform: translateY(-2px);
}

.user-card h2 {
  margin-bottom: 8px;
  color: #253746;
}

.user-card p {
  margin: 0;
  color: #6b7c85;
}

.avatar-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: rgba(25, 52, 61, 0.42);
  backdrop-filter: blur(3px);
}

.avatar-panel {
  width: 100%;
  max-width: 430px;
  padding: 28px;
  border-radius: 16px;
  background-color: white;
  text-align: center;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
}

.avatar-panel h3 {
  margin: 0;
  color: #207182;
}

.avatar-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin: 24px 0;
}

.avatar-option {
  width: 72px;
  height: 72px;
  padding: 0;
  overflow: hidden;
  border: 3px solid transparent;
  border-radius: 50%;
  background-color: #edf8fa;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-option:hover {
  border-color: #207182;
  transform: scale(1.08);
}

.close-avatar-button {
  padding: 9px 22px;
  border: none;
  border-radius: 8px;
  color: white;
  background-color: #207182;
  cursor: pointer;
}

.menu-list {
  max-width: 560px;
  margin: 0 auto 34px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.menu-list button {
  padding: 13px;
  border: 1px solid #a9ccd2;
  border-radius: 9px;
  color: #207182;
  background-color: white;
  font-size: 16px;
  cursor: pointer;
}

.menu-list button:hover,
.menu-list button.active {
  color: white;
  background-color: #207182;
  transform: translateY(-2px);
}

.posts-section {
  max-width: 760px;
  margin: 0 auto;
}

.posts-section h2 {
  margin-bottom: 16px;
  font-size: 24px;
}

.empty-text {
  padding: 40px 20px;
  border-radius: 12px;
  color: #7d8c93;
  background-color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

.post-card {
  margin-bottom: 14px;
  padding: 16px 20px;
  border: 1px solid rgba(32, 113, 130, 0.08);
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 5px 14px rgba(32, 113, 130, 0.09);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(32, 113, 130, 0.14);
}

.post-card h3 {
  margin-bottom: 8px;
  color: #207182;
  font-size: 18px;
}

.post-card p {
  margin-bottom: 5px;
  color: #607080;
  line-height: 1.5;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(32, 113, 130, 0.16);
}

.post-card h3 {
  margin-bottom: 12px;
  color: #207182;
  font-size: 20px;
}

.post-card p {
  margin-bottom: 9px;
  color: #607080;
  line-height: 1.6;
}

.post-type {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 12px;
  border-radius: 999px;
  color: #756900;
  background-color: #f6e98b;
  font-size: 13px;
  font-weight: 600;
}

.contact-button,
.remove-favorite-button {
  margin: 12px 10px 0 0;
  padding: 9px 15px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.contact-button {
  background-color: #5b9b78;
}

.remove-favorite-button {
  background-color: #d96b6b;
}

@media (max-width: 600px) {
  .user-center-content {
    padding: 35px 16px 60px;
  }

  h1 {
    font-size: 28px;
  }

  .menu-list {
    grid-template-columns: 1fr;
  }

  .avatar-list {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .avatar-option {
    width: 60px;
    height: 60px;
  }

  .post-card {
    padding: 20px;
  }
  .user-card {
  padding-top: 58px;
}

.avatar {
  width: 110px;
  height: 110px;
}

.change-avatar-button {
  top: 18px;
  right: 18px;
}
}

.upload-avatar-button {
  margin-top: 18px;
  padding: 9px 16px;
  border: none;
  border-radius: 8px;
  color: white;
  background-color: #207182;
  cursor: pointer;
}

.upload-avatar-button:hover {
  background-color: #15515d;
  transform: translateY(-2px);
}

.hidden-file-input {
  display: none;
}
</style>