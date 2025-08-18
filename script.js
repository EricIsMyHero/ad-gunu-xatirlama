fetch("links.json")
  .then(response => response.json())
  .then(data => {
    const linksContainer = document.getElementById("links");
    data.forEach(link => {
      const a = document.createElement("a");
      a.className = "link-item";
      a.href = link.url;
      a.textContent = link.title;
      a.target = "_blank";
      linksContainer.appendChild(a);
    });
  })
  .catch(error => console.error("Linkləri yükləmək mümkün olmadı:", error));
