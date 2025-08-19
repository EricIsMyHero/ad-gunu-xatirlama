let allLinks = {};

fetch("links.json")
    .then(response => response.json())
    .then(data => {
        allLinks = data;
        
        // Profil məlumatlarını yeniləyir
        document.querySelector('.avatar').src = allLinks.profile.avatar;
        document.querySelector('h1').textContent = allLinks.profile.name;
        
        showLinks('websites'); 
    })
    .catch(error => console.error("Linkləri yükləmək mümkün olmadı:", error));

function showLinks(category) {
    const linksContainer = document.getElementById("links");
    linksContainer.innerHTML = ''; 

    const linksToShow = allLinks[category];
    if (linksToShow) {
        linksToShow.forEach(link => {
            const a = document.createElement("a");
            a.className = "link-item";
            a.href = link.url;
            a.target = "_blank";

            // İkonu əlavə edir
            if (link.icon) {
                const icon = document.createElement('i');
                icon.className = link.icon;
                a.appendChild(icon);
                a.innerHTML += ' ' + link.title;
            } else {
                a.textContent = link.title;
            }
            
            linksContainer.appendChild(a);
        });
    }

    // Aktiv düyməni vurğulayır
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
