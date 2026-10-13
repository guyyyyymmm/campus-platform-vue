<script setup>
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import PublishForm from "../components/PublishForm.vue";

import { createLostItem } from "../api/lostItems";
import { createSecondHandItem } from "../api/secondHand";

const router = useRouter();

async function handleSubmit(item) {
  try {
    if (item.category === "二手交易") {
      await createSecondHandItem({
        name: item.name,
        description: item.description,
        price: item.price,
        location: item.location,
        contact: item.contact,
        imageUrl: item.imageUrl,
        status: "在售",
        createdBy: item.createdBy
      });

      alert("二手商品发布成功");
      router.push("/second-hand");
      return;
    }

    await createLostItem(item);

    if (item.category === "校园互助") {
      alert("校园互助需求发布成功");
      router.push("/mutual-aid");
      return;
    }

    alert("失物信息发布成功");
    router.push("/lost-items");
  } catch (error) {
    console.error(error);
    alert("发布失败，请检查后端是否运行");
  }
}
</script>

<template>
  <main class="publish-page">
    <Navbar />

    <PublishForm
      @submit-item="handleSubmit"
    />
  </main>
</template>

<style scoped>
.publish-page {
  min-height: 100vh;
  background-color: #f7fbfc;
}
</style>