import request from "../utils/request";

export function getSecondHandItems() {
  return request({
    url: "/second-hand",
    method: "get"
  });
}

export function createSecondHandItem(item) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return request({
    url: "/second-hand",
    method: "post",
    data: item,
    headers: {
      "X-Username": user.username || ""
    }
  });
}

export function deleteSecondHandItem(id) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return request.delete(`/second-hand/${id}`, {
    headers: {
      "X-Username": user.username || ""
    }
  });
}

export function updateSecondHandItem(id, item) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return request.put(`/second-hand/${id}`, item, {
    headers: {
      "X-Username": user.username || ""
    }
  });
}