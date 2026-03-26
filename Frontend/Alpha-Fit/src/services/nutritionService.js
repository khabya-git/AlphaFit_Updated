export async function searchLocalFoods(query, page = 1, limit = 20, category = "all") {
// Load json (served statically from /public)
const res = await fetch("/data/foods.json");
if (!res.ok) throw new Error("Failed to load foods.json");
const all = await res.json();

const q = query.trim().toLowerCase();
let filtered = all;

if (q.length >= 2) {
filtered = filtered.filter(
(f) =>
f.name.toLowerCase().includes(q) ||
(f.brand && f.brand.toLowerCase().includes(q))
);
}

if (category !== "all") {
filtered = filtered.filter((f) => (f.category || "").toLowerCase() === category.toLowerCase());
}

// Pagination
const start = (page - 1) * limit;
const data = filtered.slice(start, start + limit);
const hasMore = start + data.length < filtered.length;

return {
data,
pagination: {
page,
limit,
total: filtered.length,
hasMore
}
};
}

export async function getLocalFoodById(id) {
const res = await fetch("/data/foods.json");
if (!res.ok) throw new Error("Failed to load foods.json");
const all = await res.json();
return all.find((f) => (f.id || f._id) === id);
}