let allLinks = {};

fetch("links.json")
    .then(response => response.json())
    .then(data => {
        allLinks = data;
        
        // Profil məlumatlarını yeniləyir
        document.querySelector('.avatar').src = allLinks.profile.avatar;
        document.querySelector('h1').textContent = allLinks.profile.name;
        
        // Bu hissə dəyişdirildi: İndi sayt yüklənəndə "social" bölməsi aktiv olur
        showLinks('social'); 
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
// ... mövcud kodlar ...

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    const themeButton = document.getElementById('theme-toggle');

    if (body.classList.contains('dark-theme')) {
        themeButton.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        themeButton.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
}

// Səhifə yüklənəndə son mövzunu yadda saxla
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-toggle').textContent = '🌙';
    }
});
