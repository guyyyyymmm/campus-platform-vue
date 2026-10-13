<script setup>
import { ref, onMounted } from "vue";

import Navbar from "../components/Navbar.vue";
import HeroSection from "../components/HeroSection.vue";
import CategorySection from "../components/CategorySection.vue";
import LostItems from "../components/LostItems.vue";
import { getSecondHandItems } from "../api/secondHand";


import {
  getLostItems,
  deleteLostItem,
  updateLostItem
} from "../api/lostItems";

const isLoggedIn = ref(
  !!localStorage.getItem("user")
);
const lostItems = ref([]);
const loading = ref(true);
const errorMessage = ref("");

onMounted(async function () {
  try {
    const [lostData, secondHandData] = await Promise.all([
  getLostItems(),
  getSecondHandItems()
]);

const secondHandItems = secondHandData.map(function (item) {
  return {
    ...item,
    category: "二手交易",
    time: item.createTime || "刚刚",
    status: item.status || "在售"
  };
});

lostItems.value = [
  ...lostData,
  ...secondHandItems
];
  } catch (error) {
    console.error(error);
    errorMessage.value = "获取失物信息失败";
  } finally {
    loading.value = false;
  }
});




async function handleDeleteItem(item) {
  if (!confirm("确定要删除这条信息吗？")) {
    return;
  }

  try {
    await deleteLostItem(item.id);

    const index = lostItems.value.findIndex(function (currentItem) {
      return currentItem.id === item.id;
    });

    if (index !== -1) {
      lostItems.value.splice(index, 1);
    }

    alert("删除成功！");
  } catch (error) {
    console.error(error);
    alert("删除失败，请检查后端是否运行");
  }
}

async function handleEditItem(item) {
  const name = window.prompt("物品名称：", item.name);
  if (name === null) return;

  const description = window.prompt(
    "物品描述：",
    item.description || ""
  );
  if (description === null) return;

  const location = window.prompt(
    "丢失地点：",
    item.location || ""
  );
  if (location === null) return;

  const status = window.prompt(
    "物品状态：",
    item.status || ""
  );
  if (status === null) return;

  const contact = window.prompt(
    "联系方式：",
    item.contact || ""
  );
  if (contact === null) return;

  try {
    const updatedItem = {
      ...item,
      name,
      description,
      location,
      status,
      contact
    };

    const savedItem = await updateLostItem(
      item.id,
      updatedItem
    );

    Object.assign(item, savedItem);

    alert("修改成功！");
  } catch (error) {
    console.error(error);
    alert("修改失败，请检查后端是否运行");
  }
}
</script>

<template>
  <div class="home">
    <Navbar />
    <HeroSection />
    <CategorySection />

    <div
  v-if="loading"
  class="loading-state"
>
  <div class="loading-spinner"></div>
  <p>正在加载信息...</p>
</div>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

<LostItems
  v-if="!loading && !errorMessage"
  :items="lostItems"
  :is-logged-in="isLoggedIn"
  title="最新校园信息"
  description="最近发布的失物、二手商品和校园互助需求"
  @delete-item="handleDeleteItem"
  @edit-item="handleEditItem"
/>

  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f7fbfc;
}

.error-message {
  max-width: 600px;
  margin: 30px auto;
  padding: 16px 20px;
  border-radius: 10px;
  color: #b94a48;
  background-color: #fff1f1;
  text-align: center;
}

.error-message {
  color: #d9534f;
}

.loading-state {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;

  color: #6b7c85;
  text-align: center;
}

.loading-spinner {
  width: 34px;
  height: 34px;
  border: 4px solid #d9edf0;
  border-top-color: #207182;
  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>