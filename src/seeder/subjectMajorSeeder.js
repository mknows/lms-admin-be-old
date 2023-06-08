const { Subject, MajorSubject } = require("../models");
const { v4: uuidv4 } = require("uuid");

const subjectsName = [
  'Sistem Operasi',
  'Pemrograman Web',
  'Struktur Data',
  'Pemrograman Lanjut',
  'Jaringan Komputer',
  'Kecerdasan Buatan',
  'Mata Kuliah Terakhir',
  'Basis Data',
  'Algoritma dan Pemrograman',
  'Teori Bahasa dan Otomata',
  'Grafika Komputer',
  'Sistem Informasi',
  'Pengolahan Citra',
  'Komputasi Paralel',
  'Kriptografi',
  'Pengembangan Aplikasi Mobile',
  'Interaksi Manusia dan Komputer',
  'Pemrosesan Bahasa Alami',
  'Rekayasa Perangkat Lunak',
  'Manajemen Proyek Perangkat Lunak',
  'Keamanan Jaringan',
  'Pengenalan Pola',
  'Pemrograman Jaringan',
  'Komputasi Awan',
  'Analisis Big Data',
  'Pengenalan Data Mining',
  'Pemrograman Paralel',
  'Analisis dan Desain Algoritma',
  'Pemodelan dan Simulasi',
  'Logika Informatika',
  'Etika Komputer',
  'Sistem Pendukung Keputusan',
  'Pemrograman Fungsional',
  'Pemrosesan Sinyal Digital',
  'Rekayasa Pengetahuan',
  'Pengolahan Bahasa Alami',
  'Komputasi Kognitif',
  'Grafika Komputer Lanjut',
  'Jaringan Sensor Nirkabel',
  'Pemrograman Logika',
  'Pemrograman Game',
  'Sistem Multimedia',
  'Pemrograman Berorientasi Objek',
  'Keamanan Sistem Informasi',
  'Pengolahan Data Geografis',
  'Integrasi Sistem Enterprise',
  'Data Mining dan Warehouse',
  'Pemrograman Grafis',
  'Kecerdasan Komputasional',
  'Rekayasa Data',
  'Mata Kuliah Terakhir'
]

function seeder() {
  const majorId = "1db6f467-dd00-4c10-8aa3-56c6fbcf10de";

  subjectsName.forEach(async (subject, index) => {
    const uuid = uuidv4();

    await Subject.create({
      id: uuid,
      name: subject,
      subject_code: subject.split(" ").join(" ").toLocaleLowerCase(),
      description: `This is the description for ${index}`,
    });

    await MajorSubject.create({
      id: uuidv4(),
      major_id: majorId,
      subject_id: uuid,
      degree: "S1",
      semester: Math.floor(Math.random() * 8) + 1
    })
  });
}

seeder()