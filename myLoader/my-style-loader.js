// 动态创建style标签
module.exports = function(source) { 
  return `
    const tag = document.createElement("style");
    tag.innerHTML = ${source};
    document.head.appendChild(tag);
  `
}