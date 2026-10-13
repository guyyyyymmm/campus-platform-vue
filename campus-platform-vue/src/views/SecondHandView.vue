<script setup>
import { ref, onMounted, computed } from "vue";
import Navbar from "../components/Navbar.vue";

import {
  getSecondHandItems,
  deleteSecondHandItem,
  updateSecondHandItem
} from "../api/secondHand";

const products = ref([]);
const searchKeyword = ref("");
const selectedProduct = ref(null);

const currentUser = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const isLoggedIn = !!currentUser.username;
const currentUsername = currentUser.username || "";

const favoritesKey = currentUsername
  ? `favorites_${currentUsername}`
  : "favorites_guest";

const favorites = ref(
  JSON.parse(
    localStorage.getItem(favoritesKey) || "[]"
  )
);

const filteredProducts = computed(function () {
  const keyword = searchKeyword.value
    .trim()
    .toLowerCase();

  return products.value.filter(function (product) {
    const text = `
      ${product.name}
      ${product.description}
      ${product.location}
    `.toLowerCase();

    return text.includes(keyword);
  });
});

function showProductDetail(product) {
  selectedProduct.value = product;
}

function closeProductDetail() {
  selectedProduct.value = null;
}

function isFavorite(item) {
  return favorites.value.some(function (favorite) {
    return (
      favorite.type === "secondHand" &&
      favorite.id === item.id
    );
  });
}

function toggleFavorite(item) {
  if (item.createdBy === currentUsername) {
    alert("不能收藏自己发布的商品");
    return;
  }

  const index = favorites.value.findIndex(function (favorite) {
    return (
      favorite.type === "secondHand" &&
      favorite.id === item.id
    );
  });

  if (index === -1) {
    favorites.value.push({
      type: "secondHand",
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      location: item.location,
      contact: item.contact,
      imageUrl: item.imageUrl
    });
  } else {
    favorites.value.splice(index, 1);
  }

  localStorage.setItem(
  favoritesKey,
  JSON.stringify(favorites.value)
);
}

function contactSeller(item) {
  if (!item.contact) {
    alert("卖家暂未填写联系方式");
    return;
  }

  alert(`卖家联系方式：${item.contact}`);
}

async function loadProducts() {
  try {
    products.value = await getSecondHandItems();
  } catch (error) {
    console.error(error);
    alert("获取二手商品失败");
  }
}

async function deleteProduct(item) {
  if (item.createdBy !== currentUsername) {
    alert("只能删除自己发布的商品");
    return;
  }

  if (!confirm("确定要删除这个商品吗？")) {
    return;
  }

  try {
    await deleteSecondHandItem(item.id);

    products.value = products.value.filter(function (product) {
      return product.id !== item.id;
    });

    alert("删除成功");
  } catch (error) {
    console.error(error);
    alert("删除失败");
  }
}

async function editProduct(item) {
  if (item.createdBy !== currentUsername) {
    alert("只能修改自己发布的商品");
    return;
  }

  const name = prompt("商品名称：", item.name);
  if (name === null) return;

  const description = prompt(
    "商品描述：",
    item.description || ""
  );
  if (description === null) return;

  const price = prompt(
    "商品价格：",
    item.price || ""
  );
  if (price === null) return;

  const location = prompt(
    "交易地点：",
    item.location || ""
  );
  if (location === null) return;

  const contact = prompt(
    "联系方式：",
    item.contact || ""
  );
  if (contact === null) return;

  const imageUrl = prompt(
    "图片地址：",
    item.imageUrl || ""
  );
  if (imageUrl === null) return;

  try {
    const savedItem = await updateSecondHandItem(
      item.id,
      {
        ...item,
        name,
        description,
        price: Number(price),
        location,
        contact,
        imageUrl
      }
    );

    Object.assign(item, savedItem);
    alert("修改成功");
  } catch (error) {
    console.error(error);
    alert("修改失败");
  }
}

onMounted(loadProducts);
</script>

<template>
  <main class="second-hand-page">
    <Navbar />

    <section class="second-hand">
      <h1>二手交易</h1>

      <RouterLink
        to="/publish"
        class="publish-link"
      >
        去发布信息
      </RouterLink>

      <p class="description">
        浏览校园里的闲置物品
      </p>

      <input
        v-model="searchKeyword"
        class="search-input"
        placeholder="搜索商品名称、描述或地点"
      />

      <div class="product-list">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
        >
          <div class="product-image">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
            />

            <span v-else>
              暂无图片
            </span>
          </div>

          <div class="product-content">
            <h2>{{ product.name }}</h2>

            <p>{{ product.description }}</p>
            <p>价格：{{ product.price }}</p>
            <p>地点：{{ product.location }}</p>
            <p>联系方式：{{ product.contact }}</p>

            <button
              class="detail-button"
              @click="showProductDetail(product)"
            >
              查看详情
            </button>

            <button
              v-if="product.createdBy !== currentUsername"
              class="favorite-button"
              @click="toggleFavorite(product)"
            >
              {{
                isFavorite(product)
                  ? "取消收藏"
                  : "收藏"
              }}
            </button>

            <button
              v-if="product.createdBy !== currentUsername"
              class="contact-button"
              @click="contactSeller(product)"
            >
              联系卖家
            </button>

            <button
              v-if="
                isLoggedIn &&
                product.createdBy === currentUsername
              "
              class="edit-button"
              @click="editProduct(product)"
            >
              修改
            </button>

            <button
              v-if="
                isLoggedIn &&
                product.createdBy === currentUsername
              "
              class="delete-button"
              @click="deleteProduct(product)"
            >
              删除
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="selectedProduct"
        class="detail-mask"
        @click.self="closeProductDetail"
      >
        <div class="detail-panel">
          <h2>{{ selectedProduct.name }}</h2>

          <p>
            描述：{{ selectedProduct.description }}
          </p>

          <p>
            价格：{{ selectedProduct.price }}
          </p>

          <p>
            地点：{{ selectedProduct.location }}
          </p>

          <p>
            联系方式：{{ selectedProduct.contact }}
          </p>

          <p>
            状态：{{ selectedProduct.status }}
          </p>

          <button @click="closeProductDetail">
            关闭
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.second-hand-page {
  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      #edf8fa 0%,
      #f8fbfc 55%,
      #f4f8fa 100%
    );
}

.second-hand {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.second-hand h1 {
  margin: 18px 0 20px;
  color: #207182;
  text-align: center;
  font-size: 34px;
}

.publish-link {
  display: block;
  width: 220px;
  margin: 0 auto 20px;
  padding: 13px 20px;
  border-radius: 9px;
  color: white;
  background-color: #207182;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  transition:
    background-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.publish-link:hover {
  background-color: #15515d;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(32, 113, 130, 0.2);
}

.description {
  margin-bottom: 28px;
  color: #6b7c85;
  text-align: center;
}

.search-input {
  display: block;
  width: 100%;
  max-width: 520px;
  margin: 0 auto 34px;
  padding: 13px 18px;
  border: 1px solid #d9e5e8;
  border-radius: 999px;
  color: #253746;
  background-color: white;
  font-size: 15px;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.search-input:focus {
  border-color: #207182;
  outline: none;
  box-shadow: 0 0 0 4px rgba(32, 113, 130, 0.12);
}

.product-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.product-card {
  overflow: hidden;
  border: 1px solid rgba(32, 113, 130, 0.08);
  border-radius: 14px;
  background-color: white;
  box-shadow: 0 6px 18px rgba(32, 113, 130, 0.1);
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 30px rgba(32, 113, 130, 0.18);
}

.product-image {
  height: 180px;
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

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.06);
}

.product-content {
  min-height: 270px;
  padding: 22px;
  display: flex;
  flex-direction: column;
}

.product-content h2 {
  margin-bottom: 14px;
  color: #207182;
  font-size: 20px;
}

.product-content p {
  margin-bottom: 9px;
  color: #607080;
  line-height: 1.6;
}

.product-content button {
  margin-top: 10px;
}

.detail-button,
.favorite-button,
.contact-button,
.edit-button,
.delete-button {
  margin-right: 6px;
  padding: 8px 13px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.detail-button {
  background-color: #207182;
}

.favorite-button {
  background-color: #8e78bd;
}

.contact-button {
  background-color: #5b9b78;
}

.edit-button {
  background-color: #d7a044;
}

.delete-button {
  background-color: #d96b6b;
}

.detail-button:hover,
.favorite-button:hover,
.contact-button:hover,
.edit-button:hover,
.delete-button:hover {
  opacity: 0.88;
  transform: translateY(-2px);
}

.detail-mask {
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

.detail-panel {
  width: 100%;
  max-width: 600px;
  padding: 30px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 18px 45px rgba(25, 52, 61, 0.2);
}

.detail-panel h2 {
  margin-bottom: 20px;
  color: #207182;
}

.detail-panel p {
  margin-bottom: 12px;
  color: #607080;
  line-height: 1.7;
}

.detail-panel button {
  margin-top: 12px;
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  color: white;
  background-color: #207182;
  cursor: pointer;
}

@media (max-width: 900px) {
  .product-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .second-hand {
    padding: 35px 16px 60px;
  }

  .second-hand h1 {
    font-size: 28px;
  }

  .product-list {
    grid-template-columns: 1fr;
  }

  .product-content {
    min-height: auto;
  }
}
</style>