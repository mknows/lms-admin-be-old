const { Major, Subject, MajorSubject } = require("../models");
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
];

(async () => {
  const majorId = "1db6f467-dd00-4c10-8aa3-56c6fbcf10de";

  const major = await Major.findOne({
    where: {
      id: majorId
    }
  });

  if (!major) {
    await Major.create({
      id: majorId,
      name: "Ilmu Komputer",
    });

    console.log(`[SERVER] Jurusan Ilmu Komputer dibuat`);
  } else console.log(`[SERVER] Seeder Jurusan Ilmu Komputer telah dilakukan`);

  const subject = await Subject.findOne({
    where: {
      name: subjectsName[0]
    }
  });

  if (!subject) {
    console.log(`[SERVER] Memulai seeder Mata Kuliah Ilmu Komputer`);

    subjectsName.forEach(async (subject, index) => {
      console.log(`[SERVER] Mata Kuliah ${subject} dibuat`);
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
  } else console.log(`[SERVER] Mata Kuliah seeder sudah dilakukan. Reset ulang table subjects untuk memulai ulang`);

})();