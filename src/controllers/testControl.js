const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey_test-express-auth-firebase-adminsdk-vnzdj-17db49ab3a.json");
const firebaseConfig = require("../config/webAccountKey.json");

const {
  getAuth: getClientAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require("firebase/auth");

const { getAuth: getAdminAuth } = require("firebase-admin/auth");
const { initializeApp } = require("firebase/app");

initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const getToken = async () => {
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY2MTA3MDUyNiwiZXhwIjoxNjYxMDc0MTI2LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay12bnpkakB0ZXN0LWV4cHJlc3MtYXV0aC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLXZuemRqQHRlc3QtZXhwcmVzcy1hdXRoLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiSUtLZ1o3aG1JSVhSSkQ3eURqU2FFZUNhUkdoMiJ9.l87kj85Nepxh48DIR6tFgzRtHYai2oMds36U8UDCtNbJdjKgLc6w3fEKXKCrzCYAdaBAZQ6DC3v2TzsVEN560DIjPSZo78wvj7MUNemmVKy1UYPV26A5rw4oASSluA5Vk-DLMjpWWkqsCdYZYyw7xfzCDWxESEm1WE94lvChgZpNzUwoJoZWoP8-pmTk9Rr4pOBg1o_ejF6FrA7Dxw0aqeDcKYUxEgFXQXTskwxkjUqgywmrwznet9RJdKeD014uTW83H76TUFfNBGYlFCO8adW2BYRC8RN3VVISeJdnXGjxxEePJq58btRaX8hg_3FKWOkhECTVHg8-zKDqp89i1A";

  await getAdminAuth()
    .verifyIdToken(token)
    .then((res) => {
      console.log("success res : ", res);
    })
    .catch((err) => {
      console.log("error res : ", err);
    });
};

getToken();
