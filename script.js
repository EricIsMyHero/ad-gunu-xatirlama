let allLinks = {};

// Bütün linkləri bir dəfə yüklə
fetch("links.json")
    .then(response => response.json())
    .then(data => {
        allLinks = data;
        showLinks('websites'); // Səhifə yüklənəndə default olaraq "Saytlar"ı göstər
    })
    .catch(error => console.error("Linkləri yükləmək mümkün olmadı:", error));

function showLinks(category) {
    const linksContainer = document.getElementById("links");
    linksContainer.innerHTML = ''; // Köhnə linkləri təmizlə

    const linksToShow = allLinks[category];
    if (linksToShow) {
        linksToShow.forEach(link => {
            const a = document.createElement("a");
            a.className = "link-item";
            a.href = link.url;
            a.textContent = link.title;
            a.target = "_blank";
            linksContainer.appendChild(a);
        });
    }

    // Aktiv düyməni vurğula
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.category-button[onclick="showLinks('${category}')"]`).classList.add('active');
}

function shareSite() {
    const shareData = {
        title: "My portfolio",
        text: "Qısaca bir çox şey",
        url: window.location.href
    };
    if (navigator.share) {
        navigator.share(shareData).catch(err => console.error("Paylaşmaq mümkün olmadı:", err));
    } else {
        alert("Paylaşma funksiyası bu cihazda dəstəklənmir.");
    }
}
