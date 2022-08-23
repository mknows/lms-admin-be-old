const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey_test-express-auth-firebase-adminsdk-vnzdj-17db49ab3a.json");
const firebaseConfig = require("../config/webAccountKey.json");

const {
  getAuth: getClientAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} = require("firebase/auth");

const { getAuth: getAdminAuth } = require("firebase-admin/auth");
const { initializeApp } = require("firebase/app");

initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyEmail = async () => {
  await signInWithEmailAndPassword(
    getClientAuth(),
    "benlur167@gmail.com",
    "mypassword"
  )
    .then((res) => {
      console.log("success res => ", res);
    })
    .catch((err) => {
      console.log("error res => ", err);
    });

  const user = getClientAuth().currentUser;

  console.log("user => ", user);

  await sendEmailVerification(user)
    .then((res) => {
      console.log("success send email verification : ", res);
    })
    .catch((err) => {
      console.log("error send mail : ", err);
    });
  // await sendPasswordResetEmail(getClientAuth(), "l.ibnuhidayatullah@gmail.com")
  //   .then((res) => {
  //     console.log("log res => ", res);
  //   })
  //   .catch((err) => {
  //     console.log("log err => ", err);
  //   });

  // await getAdminAuth()
  //   .getUserByEmail("benlur167@gmail.com")
  //   .then((res) => {
  //     console.log("log res => ", res);
  //   })
  //   .catch((err) => {
  //     console.log("log err => ", err);
  //   });
};

verifyEmail();

// const getToken = async () => {
//   const token =
//     "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE4YmZhNzU2NDk4ZmRjNTZlNmVmODQ4YWY5NTI5ZThiZWZkZDM3NDUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGVzdC1leHByZXNzLWF1dGgiLCJhdWQiOiJ0ZXN0LWV4cHJlc3MtYXV0aCIsImF1dGhfdGltZSI6MTY2MTA5NDc5MCwidXNlcl9pZCI6InE4eEdOaUNvWEpSWmI1eDBRRVNrYURBZjN0ZjEiLCJzdWIiOiJxOHhHTmlDb1hKUlpiNXgwUUVTa2FEQWYzdGYxIiwiaWF0IjoxNjYxMDk0NzkwLCJleHAiOjE2NjEwOTgzOTAsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.W1Y-4DeUyVqgLFw9NIirSgqBpZAw_6fjJnEqjGYn-dd-_x1ARXACtXeA1x0UolnMVG0D2Fva0VMEQ1uh2Zo10u_-EsVm6cjf1aD_HaMiTTwY9LxU6FclhjB1PEmdeJiDfxEYAt2rKe4uLbjhQRs2OLS2s3Agl2FsiFW0P97Agft8HcgFpC6zZc6fH5pbIfCQ7zj5IgdgCXAKXwT5KS_SkUBkXqorsmBHoMvtNeenZA7_oii1W3DTNnROWdbOGcUzLJRWDzYMIxpCNWjiPcfMQ8a3rl3g7R6SCf-IBp7x9oIUAjJMDprIW4sZ4qh4vNFGBjnfE5lAJ0Rq2Ww59RCo0w";

//   // await getAdminAuth()
//   //   .updateUser("q8xGNiCoXJRZb5x0QESkaDAf3tf1", {
//   //     password: "gantipasswordnya",
//   //   })
//   //   .then((res) => {
//   //     console.log("success res : ", res);
//   //   })
//   //   .catch((err) => {
//   //     console.log("error res : ", err);
//   //   });

//   await getAdminAuth()
//     .verifyIdToken(token)
//     .then((res) => {
//       console.log("success res : ", res);
//     })
//     .catch((err) => {
//       console.log("error res : ", err);
//     });
// };

// getToken();
