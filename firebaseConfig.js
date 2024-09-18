import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC4oSY2i-0lyito6lQyAGgox9PWzpY6Uk4",
  authDomain: "lovemission-521d4.firebaseapp.com",
  projectId: "lovemission-521d4",
  storageBucket: "lovemission-521d4.appspot.com",
  messagingSenderId: "37881646414",
  appId: "1:37881646414:web:6f700b071da1fdcabea21f",
  measurementId: "G-GQ8SNPYT5B",
  // databaseURL: 'https://project-id.firebaseio.com',
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export const requestFcmToken = () => getToken(messaging, {
  vapidKey:
    "BKqdjX6jEYgx9ggWj5qRWF75WCE9UtrvrqqXUhWpDL5WJaLARz9L8XkxTBZTvvfHvI6YaNfd8JPfVBdRQBeM9P0",
})
  .then((token) => {
    console.log(`푸시 토큰 발급 완료 : ${token}`);
  })
  .catch((err) => {
    console.log("푸시 토큰 가져오는 중에 에러 발생");
  });
