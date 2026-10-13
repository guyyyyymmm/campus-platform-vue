import request from "../utils/request";

function getUsername() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return user.username || "";
}

// 获取失物列表
export function getLostItems(params) {
  return request({
    url: "/lost-items",
    method: "get",
    params
  });
}

// 获取失物详情
export function getLostItemDetail(id) {
  return request({
    url: `/lost-items/${id}`,
    method: "get"
  });
}

// 发布失物或校园互助信息
export function createLostItem(data) {
  return request({
    url: "/lost-items",
    method: "post",
    data,
    headers: {
      "X-Username": getUsername()
    }
  });
}

// 修改失物或校园互助信息
export function updateLostItem(id, item) {
  return request({
    url: `/lost-items/${id}`,
    method: "put",
    data: item,
    headers: {
      "X-Username": getUsername()
    }
  });
}

// 删除失物或校园互助信息
export function deleteLostItem(id) {
  return request({
    url: `/lost-items/${id}`,
    method: "delete",
    headers: {
      "X-Username": getUsername()
    }
  });
}

// 上传本地图片
export function uploadImage(file) {
  const formData = new FormData();

  formData.append("file", file);

  return request({
    url: "/upload",
    method: "post",
    data: formData
  });
}