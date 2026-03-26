const isEmpty = (v) => v === null || v === undefined || (typeof v === "string" && v.trim() === "");

const deepClean = (obj) => {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        const cleaned = deepClean(v);
        if (Object.keys(cleaned).length) out[k] = cleaned;
      } else if (!isEmpty(v)) {
        out[k] = v;
      }
    }
    return out;
  }
  return obj;
};

module.exports = { deepClean };
