<script setup>
import {
  ref,
  computed,
  onMounted
} from "vue";

import Navbar from "../components/Navbar.vue";
import LostItems from "../components/LostItems.vue";

import {
  getLostItems,
  updateLostItem,
  deleteLostItem
} from "../api/lostItems";

const items = ref([]);

const currentUser = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const isLoggedIn = !!currentUser.username;

const mutualAidItems = computed(() => {
  return items.value.filter((item) => {
    return item.category === "校园互助";
  });
});

async function loadItems() {
  try {
    items.value = await getLostItems();
  } catch (error) {
    console.error(error);
    alert("获取校园互助信息失败");
  }
}

async function handleDelete(item) {
  if (item.createdBy !== currentUser.username) {
    alert("只能删除自己发布的信息");
    return;
  }

  if (!confirm("确定要删除这条互助信息吗？")) {
    return;
  }

  try {
    await deleteLostItem(item.id);

    items.value = items.value.filter((currentItem) => {
      return currentItem.id !== item.id;
    });

    alert("删除成功");
  } catch (error) {
    console.error(error);
    alert("删除失败");
  }
}

async function handleEdit(item) {
  if (item.createdBy !== currentUser.username) {
    alert("只能修改自己发布的信息");
    return;
  }

  const name = prompt("信息名称：", item.name);

  if (name === null || name.trim() === "") {
    return;
  }

  const description = prompt(
    "详细描述：",
    item.description || ""
  );

  if (description === null) {
    return;
  }

  try {
    const savedItem = await updateLostItem(
      item.id,
      {
        ...item,
        name,
        description,
        category: "校园互助"
      }
    );

    Object.assign(item, savedItem);
    alert("修改成功");
  } catch (error) {
    console.error(error);
    alert("修改失败");
  }
}

onMounted(loadItems);
</script>

<template>
  <main class="mutual-aid-page">
    <Navbar />

    <section class="mutual-aid-header">
      <h1>校园互助</h1>

      <p>
        发布和查看校园内的互助信息
      </p>
    </section>

    <LostItems
  :items="mutualAidItems"
  :is-logged-in="isLoggedIn"
  :show-category-filters="false"
  title="最新校园互助信息"
  description="最近发布的校园互助信息"
  @edit-item="handleEdit"
  @delete-item="handleDelete"
/>
  </main>
</template>

<style scoped>
.mutual-aid-page {
  min-height: 100vh;
  background-color: #f7fbfc;
}

.mutual-aid-header {
  padding: 50px 24px 0;
  text-align: center;
}

.mutual-aid-header h1 {
  margin-bottom: 12px;
  color: #207182;
}

.mutual-aid-header p {
  color: #666;
}
</style>