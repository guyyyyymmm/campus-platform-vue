<script setup>
import { ref, watch } from "vue";

import Navbar from "./components/Navbar.vue";
import HeroSection from "./components/HeroSection.vue";
import CategorySection from "./components/CategorySection.vue";
import LostItems from "./components/LostItems.vue";
import PublishForm from "./components/PublishForm.vue";

const defaultItems = [
  {
    name: "黑色无线耳机",
    description: "在图书馆三楼自习室发现",
    location: "图书馆",
    time: "今天 10:30",
    status: "寻找中",
    category: "失物招领"
  },
  {
    name: "校园卡",
    description: "在食堂一楼附近发现",
    location: "第一食堂",
    time: "今天 09:20",
    status: "寻找中",
    category: "失物招领"
  }
];

const savedItems = localStorage.getItem("lostItems");

const lostItems = ref(
  savedItems
    ? JSON.parse(savedItems)
    : defaultItems
);

function handleNewItem(newItem) {
  lostItems.value.unshift(newItem);
}

watch(
  lostItems,
  function (newItems) {
    localStorage.setItem(
      "lostItems",
      JSON.stringify(newItems)
    );
  },
  {
    deep: true
  }
);

function handleDeleteItem(item) {
  const index = lostItems.value.indexOf(item);

  if (index !== -1) {
    lostItems.value.splice(index, 1);
  }
}

const editingItem = ref(null);

function handleEditItem(item) {
  editingItem.value = item;
}

function handleUpdateItem(updatedItem) {
  const index = lostItems.value.indexOf(editingItem.value);

  if (index !== -1) {
    lostItems.value[index] = updatedItem;
  }

  editingItem.value = null;
}
</script>
<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  padding: 40px;
  background-color: #f7fbfc;
}
</style>