<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },

  isLoggedIn: {
    type: Boolean,
    default: false
  },

  showCategoryFilters: {
    type: Boolean,
    default: true
  },

  title: {
    type: String,
    default: "最新失物信息"
  },

  description: {
    type: String,
    default: "最近发布的失物信息"
  }
});

const currentUser = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const currentUsername = currentUser.username || "";

const emit = defineEmits([
  "delete-item",
  "edit-item"
]);

const searchKeyword = ref("");
const currentCategory = ref("全部");
const selectedItem = ref(null);

const categories = [
  "全部",
  "失物招领",
  "二手交易",
  "校园互助"
];

function editItem(item) {
  emit("edit-item", item);
}

function deleteItem(item) {
  if (confirm("确定要删除这条信息吗？")) {
    emit("delete-item", item);
  }
}

function showDetail(item) {
  selectedItem.value = item;
}

function closeDetail() {
  selectedItem.value = null;
}

const filteredItems = computed(() => {
  const keyword = searchKeyword.value
    .trim()
    .toLowerCase();

  return props.items.filter((item) => {
    const text = `
      ${item.name || ""}
      ${item.description || ""}
      ${item.location || ""}
    `.toLowerCase();

    const matchKeyword = text.includes(keyword);

    const matchCategory =
      currentCategory.value === "全部" ||
      item.category === currentCategory.value;

    return matchKeyword && matchCategory;
  });
});
</script>


<template>
  <section class="lost-items">
    <h2>{{ props.title }}</h2>

<p class="description">
  {{ props.description }}
</p>
<div
  v-if="props.showCategoryFilters"
  class="category-filter"
>
  <button
    v-for="category in categories"
    :key="category"
    :class="{ active: currentCategory === category }"
    @click="currentCategory = category"
  >
    {{ category }}
  </button>
</div>
 <input
  v-model="searchKeyword"
  class="search-input"
  type="text"
  placeholder="搜索物品名称或地点"
/>

    <div class="lost-items-list">
        <p v-if="filteredItems.length === 0" class="empty-text">
  没有找到相关信息
</p>
      <div
        v-for="item in filteredItems"
        :key="item.name"
        class="lost-items-card"
      >
        <div class="item-image">
        <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          :alt="item.name"
      />

  <span v-else>
    暂无图片
  </span>
    </div>

        <div class="item-content">
          <h3>{{ item.name }}</h3>

          <p>
  {{
    item.category === "校园互助"
      ? "需求内容："
      : ""
  }}
  {{ item.description }}
</p>

          <div class="item-info">
            <span>
  {{
    item.category === "校园互助"
      ? "需求地点"
      : "地点"
  }}：{{ item.location }}
</span>
            <span>发布于：{{ item.time }}</span>
          </div>

          <div class="item-footer">
           <button
  v-if="
  isLoggedIn &&
  item.createdBy === currentUsername
"
  class="edit-button"
  @click="$emit('edit-item', item)"
>
  修改
</button>
  <span class="item-status">
    {{ item.status }}
  </span>

  <button
    class="detail-button"
    @click="showDetail(item)"
  >
    查看详情
  </button>

  <button
  v-if="
  isLoggedIn &&
  item.createdBy === currentUsername
"
  class="delete-button"
  @click="$emit('delete-item', item)"
>
  删除
</button>
</div>
        </div>
      </div>
    </div>

    <div
  v-if="selectedItem"
  class="detail-mask"
  @click.self="closeDetail"
>
  <div class="detail-panel">
    <h3>{{ selectedItem.name }}</h3>

    <p>
  {{
    selectedItem.category === "校园互助"
      ? "需求内容"
      : "描述"
  }}：{{ selectedItem.description }}
</p>

<p>
  {{
    selectedItem.category === "校园互助"
      ? "需求地点"
      : "地点"
  }}：{{ selectedItem.location }}
</p>
    <p>发布时间：{{ selectedItem.time }}</p>
    <p>状态：{{ selectedItem.status }}</p>
    <p>分类：{{ selectedItem.category }}</p>
    <p>联系方式：{{ selectedItem.contact }}</p>

    <button
      class="close-button"
      @click="closeDetail"
    >
      关闭详情
    </button>
  </div>
</div>
  </section>
</template>

<style scoped>
.lost-items {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

.lost-items h2 {
  margin-bottom: 10px;
  text-align: center;
  font-size: 32px;
}

.description {
  margin-bottom: 25px;
  color: #666;
  text-align: center;
}

.search-input {
  display: block;
  width: 100%;
  max-width: 500px;
  margin: 0 auto 30px;
  padding: 12px;
  border: 1px solid #ccd6d9;
  border-radius: 6px;
  font-size: 16px;
}

.lost-items-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.lost-items-card {
  overflow: hidden;
  border: 1px solid rgba(32, 113, 130, 0.08);
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.1);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.lost-items-card {
  overflow: hidden;
  border: 1px solid rgba(32, 113, 130, 0.08);
  border-radius: 14px;
  background-color: white;
  box-shadow: 0 6px 18px rgba(32, 113, 130, 0.1);

  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

.lost-items-card:hover {
  border-color: #9bd2da;
  transform: translateY(-8px);
  box-shadow: 0 16px 30px rgba(32, 113, 130, 0.18);
}

.item-image {
  height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  color: #49636d;
  background:
    linear-gradient(
      135deg,
      #d9f1f4,
      #a9dce4
    );
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: transform 0.4s ease;
}

.lost-items-card:hover .item-image img {
  transform: scale(1.06);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.item-content {
  min-height: 230px;
  padding: 22px;
  display: flex;
  flex-direction: column;
}

.item-content h3 {
  margin-bottom: 12px;
  color: #253746;
  font-size: 20px;
  line-height: 1.4;
}

.item-content p {
  margin-bottom: 14px;
  color: #607080;
  line-height: 1.7;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
  color: #666;
  font-size: 14px;
}

.item-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  flex-wrap: wrap;
}

.item-status {
  padding: 6px 12px;
  border-radius: 999px;
  color: #756900;
  background-color: #f6e98b;
  font-size: 13px;
  font-weight: 600;
}

.detail-button {
  border: none;
  color: #207182;
  background: transparent;
  cursor: pointer;
}

@media (max-width: 768px) {
  .lost-items-list {
    grid-template-columns: 1fr;
  }
}

.empty-text {
  grid-column: 1 / -1;
  padding: 40px;
  color: #777;
  text-align: center;
  font-size: 18px;
}

.category-filter {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.category-filter button {
  padding: 8px 16px;
  border: 1px solid #207182;
  border-radius: 20px;
  color: #207182;
  background-color: white;
  cursor: pointer;
}

.category-filter button.active,
.category-filter button:hover {
  color: white;
  background-color: #207182;
}

.detail-panel {
  max-width: 600px;
  margin: 30px auto 0;
  padding: 25px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.detail-panel h3 {
  margin-bottom: 15px;
  color: #207182;
}

.detail-panel p {
  margin-bottom: 10px;
}

.close-button {
  margin-top: 15px;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #207182;
  cursor: pointer;
}

.delete-button {
  border: none;
  color: #d9534f;
  background: transparent;
  cursor: pointer;
}

.delete-button:hover {
  text-decoration: underline;
}

.edit-button {
  border: none;
  color: #207182;
  background: transparent;
  cursor: pointer;
}

.edit-button:hover {
  text-decoration: underline;
}

.detail-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.detail-panel {
  width: 90%;
  max-width: 600px;
  padding: 30px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}
</style>