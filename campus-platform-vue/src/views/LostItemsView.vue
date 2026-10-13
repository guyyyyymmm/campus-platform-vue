<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import LostItems from "../components/LostItems.vue";
import {
  getLostItems,
  deleteLostItem,
  updateLostItem
} from "../api/lostItems";

const items = ref([]);
const isLoggedIn = ref(
  !!localStorage.getItem("user")
);

async function loadItems() {
  items.value = await getLostItems();
}

async function handleDelete(item) {
  if (!confirm("确定要删除这条信息吗？")) {
    return;
  }

  await deleteLostItem(item.id);
  items.value = items.value.filter(function (currentItem) {
    return currentItem.id !== item.id;
  });

  alert("删除成功");
}

async function handleEdit(item) {
  const name = prompt("物品名称：", item.name);
  if (name === null) return;

  const updatedItem = {
    ...item,
    name
  };

  const savedItem = await updateLostItem(
    item.id,
    updatedItem
  );

  Object.assign(item, savedItem);
  alert("修改成功");
}

onMounted(loadItems);
</script>

<template>
  <main class="lost-items-page">
    <Navbar />

    <h1>失物招领</h1>

    <LostItems
  :items="items"
  :is-logged-in="isLoggedIn"
  :show-category-filters="false"
  @delete-item="handleDelete"
  @edit-item="handleEdit"
/>
  </main>
</template>

<style scoped>
.lost-items-page {
  min-height: 100vh;
  padding-bottom: 50px;
  background-color: #f7fbfc;
}

h1 {
  padding: 40px 0 20px;
  color: #207182;
  text-align: center;
}
</style>