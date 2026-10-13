const viewLostBtn = document.getElementById("view-lost-btn");
const publishBtn = document.getElementById("publish-btn");
const lostItemsSection = document.getElementById("lost-items-section");

// 片段 12：点击查看失物信息，滚动到失物区域
viewLostBtn.addEventListener("click", function (event) {
  event.preventDefault();

  lostItemsSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// 片段 12：点击发布信息，弹出提示
const publishSection = document.querySelector(".publish-section");

publishBtn.addEventListener("click", function (event) {
  event.preventDefault();

  publishSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  itemNameInput.focus();
});
const defaultLostItems = [
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
    description: "在食堂一楼附近捡到",
    location: "第一食堂",
    time: "今天 09:20",
    status: "寻找中",
    category: "失物招领"
  },
  {
    name: "蓝色雨伞",
    description: "遗落在教学楼门口",
    location: "教学楼",
    time: "昨天 16:45",
    status: "寻找中",
    category: "校园互助"
  }
];

let lostItems =
  JSON.parse(localStorage.getItem("lostItems")) || defaultLostItems;


const lostItemsList = document.querySelector(".lost-items-list");
const searchInput = document.getElementById("lost-search");

// 根据数据生成卡片
function renderLostItems(items) {
  lostItemsList.innerHTML = "";

  if (items.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.className = "lost-empty";
    emptyText.textContent = "没有找到相关信息";
    lostItemsList.appendChild(emptyText);
    return;
  }

  items.forEach(function (item) {
    const card = document.createElement("div");
    card.className = "lost-items-card";

    const image = document.createElement("div");
    image.className = "item-image";
    image.textContent = "图片";

    const content = document.createElement("div");
    content.className = "item-content";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const description = document.createElement("p");
    description.textContent = item.description;

    const info = document.createElement("div");
    info.className = "item-info";

    const locationText = document.createElement("span");
    locationText.textContent = `地点：${item.location}`;

    const timeText = document.createElement("span");
    timeText.textContent = `发布于：${item.time}`;

    info.appendChild(locationText);
    info.appendChild(timeText);

    const footer = document.createElement("div");
    footer.className = "item-footer";

    const statusText = document.createElement("span");
    statusText.className = "item-status";
    statusText.textContent = item.status;

    const detailLink = document.createElement("a");
    detailLink.href = "#";
    detailLink.textContent = "查看详情";
    const deleteButton = document.createElement("button");
deleteButton.type = "button";
deleteButton.textContent = "删除信息";
deleteButton.className = "delete-btn";

deleteButton.addEventListener("click", function () {
  const isConfirmed = confirm("确定要删除这条信息吗？");

  if (!isConfirmed) {
    return;
  }

  const itemIndex = lostItems.indexOf(item);

  if (itemIndex !== -1) {
    lostItems.splice(itemIndex, 1);

    localStorage.setItem(
      "lostItems",
      JSON.stringify(lostItems)
    );

    renderFilteredItems();
    alert("删除成功");
  }
});

    detailLink.addEventListener("click", function (event) {
      event.preventDefault();

      alert(`
            物品名称：${item.name}
            描述：${item.description}
            地点：${item.location}
            发布时间：${item.time}
            状态：${item.status}
            `);
    });

footer.appendChild(statusText);
footer.appendChild(detailLink);
footer.appendChild(deleteButton);
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(info);
    content.appendChild(footer);

    card.appendChild(image);
    card.appendChild(content);

    lostItemsList.appendChild(card);
  });
}

let currentKeyword = "";
let currentCategory = "全部";

const categoryButtons =
  document.querySelectorAll(".category-filter button");

function renderFilteredItems() {
  const filteredItems = lostItems.filter(function (item) {
    const keywordText = `
      ${item.name}
      ${item.description}
      ${item.location}
    `.toLowerCase();

    const matchKeyword = keywordText.includes(currentKeyword);

    const matchCategory =
      currentCategory === "全部" ||
      item.category === currentCategory;

    return matchKeyword && matchCategory;
  });

  renderLostItems(filteredItems);
}

renderFilteredItems();

searchInput.addEventListener("input", function () {
  currentKeyword = searchInput.value.trim().toLowerCase();

  renderFilteredItems();
});

categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentCategory = button.dataset.category;

    renderFilteredItems();
  });
});



const publishForm = document.getElementById("publish-form");

const itemNameInput = document.getElementById("item-name");
const itemCategoryInput = document.getElementById("item-category");
const itemLocationInput = document.getElementById("item-location");
const itemDescriptionInput = document.getElementById("item-description");
const itemContactInput = document.getElementById("item-contact");

publishForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const itemName = itemNameInput.value.trim();
  const itemCategory = itemCategoryInput.value;
  const itemLocation = itemLocationInput.value.trim();
  const itemDescription = itemDescriptionInput.value.trim();
  const itemContact = itemContactInput.value.trim();

  if (itemName === "") {
    alert("请输入物品名称");
    return;
  }

  if (itemCategory === "") {
    alert("请选择物品分类");
    return;
  }

  if (itemLocation === "") {
    alert("请输入地点");
    return;
  }

  if (itemDescription === "") {
    alert("请输入详细描述");
    return;
  }

  if (itemContact === "") {
    alert("请输入联系方式");
    return;
  }

  const newItem = {
    name: itemName,
    description: itemDescription,
    location: itemLocation,
    time: "刚刚",
    status: "寻找中",
    category: itemCategory,
    contact: itemContact
  };

  // 把新信息加入数组
  lostItems.push(newItem);

  localStorage.setItem("lostItems", JSON.stringify(lostItems));

  // 重新显示卡片
  renderFilteredItems();

  // 清空表单
  publishForm.reset();

  alert("发布成功！");

  lostItemsSection.scrollIntoView({
  behavior: "smooth",
  block: "start"
});
});