// Firebase importları
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, push, set, onValue, remove, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase config (sizin verdiyiniz)
const firebaseConfig = {
  apiKey: "AIzaSyDWhvfx-7CiVGxdHFgR_kE2xVBAmOm6yrc",
  authDomain: "device-streaming-36e0d1e5.firebaseapp.com",
  databaseURL: "https://device-streaming-36e0d1e5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "device-streaming-36e0d1e5",
  storageBucket: "device-streaming-36e0d1e5.firebasestorage.app",
  messagingSenderId: "565227952193",
  appId: "1:565227952193:web:2aef870a62975281864ec0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// HTML elementləri
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const addBtn = document.getElementById('addBtn');
const nameInput = document.getElementById('name');
const dateInput = document.getElementById('date');
const birthdayList = document.getElementById('birthdayList');

// Login / Logout
loginBtn.onclick = async () => { await signInWithPopup(auth, provider); }
logoutBtn.onclick = async () => { await signOut(auth); }

// İstifadəçi statusunu izləmək
onAuthStateChanged(auth, (user) => {
  if(user){
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    listenBirthdays(user.uid);
  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    birthdayList.innerHTML = '';
  }
});

// Ad günü əlavə et
addBtn.onclick = async () => {
  const user = auth.currentUser;
  if(!user) return alert('Əvvəlcə daxil olun!');
  const name = nameInput.value.trim();
  const date = dateInput.value;
  if(!name || !date) return alert('Ad və tarix lazımdır!');
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth()+1;

  const newRef = push(ref(db, `users/${user.uid}/birthdays`));
  await set(newRef, { name, day, month, createdAt: serverTimestamp() });

  nameInput.value = '';
  dateInput.value = '';
}

// Realtime siyahı
function listenBirthdays(uid){
  const birthdaysRef = ref(db, `users/${uid}/birthdays`);
  onValue(birthdaysRef, (snap)=>{
    const data = snap.val() || {};
    const today = new Date();
    const tDay = today.getDate();
    const tMonth = today.getMonth()+1;
    birthdayList.innerHTML = '';
    for(const [id, b] of Object.entries(data)){
      const li = document.createElement('li');
      const isToday = (b.day === tDay && b.month === tMonth);
      li.innerHTML = `<span>${b.name} — ${String(b.day).padStart(2,'0')}.${String(b.month).padStart(2,'0')} ${isToday?'<span class="today">🎂 Bu gün!</span>':''}</span>
                      <button>Sil</button>`;
      li.querySelector('button').onclick = ()=> remove(ref(db, `users/${uid}/birthdays/${id}`));
      birthdayList.appendChild(li);

      // Brauzer açıq olduqda alert bildiriş
      if(isToday) alert(`🎉 Bu gün ${b.name}-in ad günüdür!`);
    }
  });
}
