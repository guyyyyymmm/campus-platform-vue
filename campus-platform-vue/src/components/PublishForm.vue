<script setup>
import { ref, watch } from "vue";
import { uploadImage } from "../api/lostItems";

const selectedFile = ref(null);
const previewUrl = ref("");

const emit = defineEmits([
  "submit-item",
  "update-item"
]);

const props = defineProps({
  editingItem: {
    type: Object,
    default: null
  }
});

const isLoggedIn = ref(
  !!localStorage.getItem("user")
);

const formData = ref({
  name: "",
  category: "",
  price: "",
  location: "",
  description: "",
  contact: "",
  imageUrl: ""
});

function handleFileChange(event) {
  const file = event.target.files[0];

  if (!file) {
    selectedFile.value = null;
    previewUrl.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("只能选择图片文件");
    event.target.value = "";
    selectedFile.value = null;
    previewUrl.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("图片大小不能超过 5MB");
    event.target.value = "";
    selectedFile.value = null;
    previewUrl.value = "";
    return;
  }

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
}

watch(
  () => props.editingItem,
  (item) => {
    if (item) {
      formData.value = {
        name: item.name || "",
        category: item.category || "",
        price: item.price || "",
        location: item.location || "",
        description: item.description || "",
        contact: item.contact || "",
        imageUrl: item.imageUrl || ""
      };
    }
  }
);

async function submitForm() {
  if (
    formData.value.name.trim() === "" ||
    formData.value.category === "" ||
    formData.value.location.trim() === "" ||
    formData.value.description.trim() === "" ||
    formData.value.contact.trim() === ""
  ) {
    alert("请填写完整信息");
    return;
  }

  if (
    formData.value.category === "二手交易" &&
    !formData.value.price
  ) {
    alert("请输入商品价格");
    return;
  }

  let imageUrl = formData.value.imageUrl;

  if (selectedFile.value) {
    try {
      const result = await uploadImage(
        selectedFile.value
      );

      imageUrl = result.url;
    } catch (error) {
      console.error(error);
      alert("图片上传失败");
      return;
    }
  }

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  let status = "寻找中";

  if (formData.value.category === "二手交易") {
    status = "在售";
  }

  if (formData.value.category === "校园互助") {
    status = "待帮助";
  }

  const newItem = {
    name: formData.value.name,
    category: formData.value.category,
    price: formData.value.price
      ? Number(formData.value.price)
      : null,
    location: formData.value.location,
    description: formData.value.description,
    contact: formData.value.contact,
    imageUrl,
    time: "刚刚",
    status,
    createdBy: currentUser.username || ""
  };

  if (props.editingItem) {
    emit("update-item", {
      ...newItem,
      id: props.editingItem.id
    });

    
  } else {
    emit("submit-item", newItem);
    
  }

  formData.value = {
    name: "",
    category: "",
    price: "",
    location: "",
    description: "",
    contact: "",
    imageUrl: ""
  };

  selectedFile.value = null;
  previewUrl.value = "";
}
</script>

<template>
  <section class="publish-section">
    <h2>
      {{
        formData.category === "校园互助"
          ? "发布求助信息"
          : "发布信息"
      }}
    </h2>

    <form
      v-if="isLoggedIn"
      @submit.prevent="submitForm"
    >
      <div class="form-item">
        <label>
          {{
            formData.category === "校园互助"
              ? "需求标题"
              : "物品名称"
          }}
        </label>

        <input
          v-model="formData.name"
          type="text"
          :placeholder="
            formData.category === '校园互助'
              ? '请输入求助标题，例如：求借教材'
              : '请输入物品名称'
          "
          required
        />
      </div>

      <div class="form-item">
        <label>信息分类</label>

        <select
          v-model="formData.category"
          required
        >
          <option value="">
            请选择分类
          </option>

          <option value="失物招领">
            失物招领
          </option>

          <option value="二手交易">
            二手交易
          </option>

          <option value="校园互助">
            校园互助（需求帮助）
          </option>
        </select>
      </div>

      <div
        v-if="formData.category === '二手交易'"
        class="form-item"
      >
        <label>商品价格</label>

        <input
          v-model="formData.price"
          type="number"
          min="0"
          placeholder="请输入商品价格"
        />
      </div>

      <div class="form-item">
        <label>
          {{
            formData.category === "校园互助"
              ? "需求地点"
              : "地点"
          }}
        </label>

        <input
          v-model="formData.location"
          type="text"
          :placeholder="
            formData.category === '校园互助'
              ? '请输入需要帮助的地点'
              : '请输入地点'
          "
          required
        />
      </div>

      <div class="form-item">
        <label>
          {{
            formData.category === "校园互助"
              ? "需求内容"
              : "详细描述"
          }}
        </label>

        <textarea
          v-model="formData.description"
          :placeholder="
            formData.category === '校园互助'
              ? '请详细描述你需要什么帮助'
              : '请输入详细描述'
          "
          required
        ></textarea>
      </div>

      <div class="form-item">
        <label>联系方式</label>

        <input
          v-model="formData.contact"
          type="text"
          placeholder="请输入联系方式"
          required
        />
      </div>

      <div class="form-item">
        <label>图片地址</label>

        <input
          v-model="formData.imageUrl"
          type="text"
          placeholder="请输入图片网址，可不填写"
        />
      </div>

      <div class="form-item">
        <label>选择本地图片</label>

        <input
          type="file"
          accept="image/*"
          @change="handleFileChange"
        />
      </div>

      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="图片预览"
        class="image-preview"
      />

      <button type="submit">
        {{
          formData.category === "校园互助"
            ? "发布求助信息"
            : "提交信息"
        }}
      </button>
    </form>

    <p
      v-else
      class="login-tip"
    >
      请先登录后再发布信息
    </p>
  </section>
</template>

<style scoped>
.publish-section {
  max-width: 720px;
  margin: 42px auto;
  padding: 36px 40px;

  border: 1px solid rgba(32, 113, 130, 0.08);
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 12px 30px rgba(32, 113, 130, 0.12);
}

.publish-section h2 {
  margin-bottom: 30px;
  color: #207182;
  text-align: center;
  font-size: 30px;
  letter-spacing: 1px;
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

input,
select,
textarea {
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
    box-shadow 0.25s ease,
    background-color 0.25s ease;
}

input:hover,
select:hover,
textarea:hover {
  border-color: #9ccbd2;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #207182;
  outline: none;
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(32, 113, 130, 0.12);
}

textarea {
  min-height: 140px;
  resize: vertical;
  line-height: 1.7;
}

input[type="file"] {
  padding: 10px;
  color: #607080;
  background-color: #f7fbfc;
  cursor: pointer;
}

.image-preview {
  display: block;
  width: 220px;
  height: 150px;
  margin: 14px auto 20px;
  border: 1px solid #d9e5e8;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 6px 16px rgba(32, 113, 130, 0.12);
}

form button[type="submit"] {
  width: 100%;
  margin-top: 10px;
  padding: 14px;

  border: none;
  border-radius: 9px;
  color: white;
  background-color: #207182;

  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  transition:
    background-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

form button[type="submit"]:hover {
  background-color: #15515d;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(32, 113, 130, 0.2);
}

.login-tip {
  padding: 28px;
  border-radius: 10px;
  color: #d96b6b;
  background-color: #fff5f5;
  text-align: center;
  font-size: 16px;
}

@media (max-width: 600px) {
  .publish-section {
    margin: 24px 16px;
    padding: 28px 20px;
  }

  .publish-section h2 {
    font-size: 25px;
  }

  .image-preview {
    width: 100%;
    max-width: 220px;
  }
}
</style>