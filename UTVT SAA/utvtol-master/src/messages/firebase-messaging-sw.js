/*
Give the service worker access to Firebase Messaging.
Note that you can only use Firebase Messaging here, other Firebase libraries are not available in the service worker.
*/
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging.js');

/*
Initialize the Firebase app in the service worker by passing in the messagingSenderId.
* New configuration for app@pulseservice.com
*/
firebase.initializeApp({
  apiKey: "AIzaSyCEwanCPVKUKjcaKvK7hxPRWZ8yxSXl254",
  authDomain: "utvtol-7d4be.firebaseapp.com",
  projectId: "utvtol-7d4be",
  storageBucket: "utvtol-7d4be.appspot.com",
  messagingSenderId: "648927300610",
  appId: "1:648927300610:web:d8473b9798930d4fa22b1b",
  measurementId: "G-QNPQD5C1CN"
});

/*
Retrieve an instance of Firebase Messaging so that it can handle background messages.
*/
const app = firebase.initializeApp(firebaseConfig);

export const messaging = firebase.messaging(app);
messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  /* Customize notification here */
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/itwonders-web-logo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

