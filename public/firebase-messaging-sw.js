importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAdMnrksl2fzIT-xYXVjdsIQjTVAahFtbI",
    authDomain: "braid-on-call.firebaseapp.com",
    projectId: "braid-on-call",
    storageBucket: "braid-on-call.firebasestorage.app",
    messagingSenderId: "210193830331",
    appId: "1:210193830331:web:c30f15f97245d193edf49e",
    measurementId: "G-0VH5SCBPTR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("Background message: ", payload);

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/logo192.png",
    });
});
