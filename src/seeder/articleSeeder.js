const { Article } = require("../models");
const { v4: uuidv4 } = require("uuid");

const articles = [
  {
    "title": "Pengenalan Kecerdasan Buatan",
    "description": "Kecerdasan Buatan (AI) adalah cabang ilmu komputer yang berkaitan dengan pembuatan mesin yang dapat belajar dan berperilaku seperti manusia. Artikel ini memberikan pengenalan singkat tentang konsep dasar Kecerdasan Buatan dan penerapannya dalam berbagai bidang."
  },
  {
    "title": "Mengenal Internet of Things (IoT)",
    "description": "Internet of Things (IoT) adalah konsep di mana objek sehari-hari terhubung ke internet dan dapat saling berkomunikasi. Artikel ini menjelaskan apa itu IoT, manfaatnya, serta beberapa contoh pengaplikasiannya dalam kehidupan sehari-hari."
  },
  {
    "title": "Pentingnya Keamanan Informasi dalam Era Digital",
    "description": "Dalam era digital yang terhubung secara online, keamanan informasi menjadi sangat penting. Artikel ini membahas mengapa perlindungan data dan informasi pribadi adalah hal yang krusial, serta memberikan tips tentang langkah-langkah yang dapat diambil untuk menjaga keamanan informasi."
  },
  {
    "title": "Pengantar Bahasa Pemrograman Python",
    "description": "Python adalah bahasa pemrograman yang populer karena sintaksisnya yang sederhana dan mudah dipahami. Artikel ini memberikan pengantar singkat tentang bahasa pemrograman Python, fitur-fiturnya, dan kegunaannya dalam pengembangan perangkat lunak."
  },
  {
    "title": "Membangun Aplikasi Mobile dengan React Native",
    "description": "React Native adalah kerangka kerja pengembangan aplikasi mobile yang memungkinkan pengembang menggunakan JavaScript untuk membuat aplikasi yang berjalan di platform iOS dan Android. Artikel ini menjelaskan konsep dasar React Native dan memberikan panduan langkah demi langkah untuk membangun aplikasi mobile sederhana."
  },
  {
    "title": "Mengenal Teknologi Blockchain",
    "description": "Blockchain adalah teknologi yang mendasari mata uang kripto seperti Bitcoin. Artikel ini menjelaskan konsep dasar blockchain, bagaimana cara kerjanya, dan potensi penerapannya di berbagai bidang seperti keuangan, logistik, dan sumber daya manusia."
  },
  {
    "title": "Mengoptimalkan Kinerja Website dengan Teknik SEO",
    "description": "Optimasi Mesin Pencari (SEO) adalah rangkaian teknik yang digunakan untuk meningkatkan peringkat dan kinerja suatu website di hasil pencarian. Artikel ini memberikan tips dan strategi SEO yang dapat membantu meningkatkan visibilitas dan lalu lintas organik sebuah website."
  },
  {
    "title": "Pemrograman Berorientasi Objek dengan Java",
    "description": "Java adalah bahasa pemrograman berorientasi objek yang populer dan banyak digunakan dalam pengembangan perangkat lunak. Artikel ini menjelaskan konsep dasar pemrograman berorientasi objek menggunakan Java dan memberikan contoh implementasinya dalam pembuatan program sederhana."
  },
  {
    "title": "Mengenal Cloud Computing",
    "description": "Cloud Computing adalah model pengelolaan dan penyimpanan data di mana data disimpan dan diakses melalui internet daripada melalui perangkat penyimpanan lokal. Artikel ini menjelaskan konsep dasar Cloud Computing, manfaatnya, dan jenis layanan cloud yang tersedia."
  },
  {
    "title": "Pengenalan Data Science dan Analisis Data",
    "description": "Data Science adalah disiplin ilmu yang berkaitan dengan pemahaman, pemrosesan, dan analisis data untuk menghasilkan wawasan dan pengambilan keputusan yang informasional. Artikel ini memberikan pengenalan tentang Data Science, alat-alat yang digunakan, dan penerapannya dalam berbagai industri."
  },
  {
    "title": "Mendesain Antarmuka Pengguna yang Menarik",
    "description": "Desain Antarmuka Pengguna (UI) adalah proses mendesain elemen-elemen visual dan interaksi dalam sebuah aplikasi atau website. Artikel ini memberikan tips dan praktik terbaik untuk mendesain antarmuka pengguna yang menarik dan efektif dalam memenuhi kebutuhan pengguna."
  },
  {
    "title": "Mengembangkan Aplikasi Web dengan Framework Laravel",
    "description": "Laravel adalah framework pengembangan aplikasi web berbasis PHP yang populer dan powerful. Artikel ini memberikan pengantar tentang Laravel, fitur-fiturnya, dan panduan langkah demi langkah untuk membangun aplikasi web menggunakan framework ini."
  },
  {
    "title": "Pengenalan Keamanan Cyber",
    "description": "Keamanan Cyber adalah upaya melindungi sistem komputer dan jaringan dari ancaman yang berasal dari dunia maya. Artikel ini menjelaskan pentingnya keamanan cyber, jenis serangan yang umum, dan langkah-langkah yang dapat diambil untuk menjaga keamanan sistem komputer."
  },
  {
    "title": "Mengelola Basis Data dengan MySQL",
    "description": "MySQL adalah sistem manajemen basis data relasional yang populer dan banyak digunakan dalam pengembangan aplikasi. Artikel ini memberikan pengenalan tentang MySQL, cara mengelola basis data, serta contoh penggunaannya dalam operasi CRUD (Create, Read, Update, Delete)."
  },
  {
    "title": "Pengenalan Internet Security",
    "description": "Internet Security melibatkan praktik dan langkah-langkah yang diambil untuk melindungi sistem komputer dan informasi pribadi dari ancaman di dunia maya. Artikel ini memberikan gambaran umum tentang Internet Security, ancaman yang umum, dan praktik keamanan yang dapat diterapkan."
  },
  {
    "title": "Pemrograman Dasar dengan Bahasa C++",
    "description": "C++ adalah bahasa pemrograman yang powerful dan efisien yang digunakan dalam pengembangan perangkat lunak. Artikel ini memberikan pengenalan tentang bahasa pemrograman C++, struktur dasar bahasa, dan contoh implementasinya dalam penulisan program sederhana."
  },
  {
    "title": "Mengembangkan Aplikasi Mobile dengan Flutter",
    "description": "Flutter adalah kerangka kerja pengembangan aplikasi mobile yang menggunakan bahasa pemrograman Dart. Artikel ini menjelaskan tentang Flutter, fitur-fiturnya, dan memberikan panduan langkah demi langkah untuk membangun aplikasi mobile lintas platform menggunakan Flutter."
  },
  {
    "title": "Membangun E-commerce dengan WooCommerce",
    "description": "WooCommerce adalah plugin e-commerce yang populer untuk platform WordPress. Artikel ini membahas cara membangun situs e-commerce menggunakan WooCommerce, mengelola produk, dan mengoptimalkan pengalaman belanja online."
  },
  {
    "title": "Panduan Dasar Pengujian Perangkat Lunak",
    "description": "Pengujian Perangkat Lunak adalah proses untuk mengidentifikasi bug, kesalahan, atau masalah dalam perangkat lunak sebelum dirilis ke pengguna akhir. Artikel ini memberikan panduan dasar tentang pengujian perangkat lunak, strategi pengujian, dan alat-alat yang dapat digunakan."
  },
  {
    "title": "Pengenalan ke dalam Big Data",
    "description": "Big Data adalah istilah yang mengacu pada kumpulan data yang sangat besar dan kompleks yang sulit diproses dengan alat tradisional. Artikel ini menjelaskan apa itu Big Data, tantangan yang dihadapinya, serta manfaat dan aplikasi dalam berbagai industri."
  },
  {
    "title": "Mengembangkan Aplikasi Desktop dengan Electron",
    "description": "Electron adalah kerangka kerja pengembangan aplikasi desktop lintas platform yang menggunakan HTML, CSS, dan JavaScript. Artikel ini memberikan panduan langkah demi langkah untuk membangun aplikasi desktop menggunakan Electron."
  },
  {
    "title": "Pengenalan ke dalam Kecerdasan Buatan",
    "description": "Kecerdasan Buatan (Artificial Intelligence/AI) adalah bidang studi yang berkaitan dengan pengembangan mesin yang dapat melakukan tugas yang membutuhkan kecerdasan manusia. Artikel ini memberikan pengenalan tentang kecerdasan buatan, jenis-jenisnya, dan penerapannya dalam kehidupan sehari-hari."
  }
];

(async () => {
  const findarticle = await Article.findOne({
    where: {
      title: articles[0].title
    }
  });

  if (findarticle) console.log(`[SERVER] Artikel seeder sudah pernah dilakukan`);
  else {
    articles.forEach(async article => {
      await Article.create({
        id: uuidv4(),
        title: article.title,
        description: article.description,
        image: 'images/article/be45ce88-c9b4-4883-b31a-08085dc54f1a-Desain-tanpa-judul-2.png',
        image_link: 'https://firebasestorage.googleapis.com/v0/b/kampus-gratis2.appspot.com/o/images%2Farticle%2Fbe45ce88-c9b4-4883-b31a-08085dc54f1a-Desain-tanpa-judul-2.png?alt=media&token=655dcc77-1758-4785-9768-124a3f5cb18f'
      });

      console.log(`[SERVER] Artikel ${article.title} berhasil diunggah`);
    })

    console.log(`[SERVER] ${articles.length} artikel seeder berhasil dilakukan`);
  }
})();