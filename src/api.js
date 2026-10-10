
const API_URL = "http://localhost:8080/api";

async function request(path, options = {}) {
  const { token, ...fetchOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message || `Request failed (${response.status})`
    );
  }

  return data;
}

// Login
export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Register
export function register(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// Get all posts
export function getPosts(token) {
  return request("/posts", {
    token,
  });
}

// Create a post
export function createPost(token, title, content) {
  return request("/posts", {
    method: "POST",
    token,
    body: JSON.stringify({ title, content }),
  });
}

// Update a post
export function updatePost(token, id, title, content) {
  return request(`/posts/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ title, content }),
  });
}

// Delete a post
export function deletePost(token, id) {
  return request(`/posts/${id}`, {
    method: "DELETE",
    token,
  });
}

// Get comments for a post

export function getComments(postId, token) {
  return request(`/comments/post/${postId}`, {
    token,
  });
}


// Add a comment
export function addComment(token, comment) {
  return request("/comments", {
    method: "POST",
    token,
    body: JSON.stringify(comment),
  });
}

// Delete a comment
export function deleteComment(token, id) {
  return request(`/comments/${id}`, {
    method: "DELETE",
    token,
  });
}
