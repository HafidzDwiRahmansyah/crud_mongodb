// Import modul yang diperlukan
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Koneksi ke MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/siswa_bm3', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Buat model MongoDB
const Siswa = mongoose.model('Siswa', {
  id: Number,
  nama: String,
  kelas: String,
  nisn: String,
  alamat: String,
  no_telepon: String
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Rute untuk menampilkan semua data siswa
app.get('/', async (req, res) => {
  try {
    const dataSiswa = await Siswa.find({});
    res.render('index', { siswa: dataSiswa });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan saat mengambil data siswa.');
  }
});

// Rute untuk menampilkan form tambah data siswa
app.get('/tambah', (req, res) => {
  res.render('tambah');
});

// Rute untuk menambahkan data siswa ke MongoDB
app.post('/tambah', async (req, res) => {
  const siswaBaru = new Siswa(req.body);
  try {
    await siswaBaru.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan saat menambahkan data siswa.');
  }
});

// Rute untuk menampilkan form edit data siswa
app.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const siswa = await Siswa.findById(id);
    res.render('edit', { siswa: siswa });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan saat mengambil data siswa.');
  }
});

// Rute untuk menyimpan perubahan data siswa
app.post('/edit/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Siswa.findByIdAndUpdate(id, req.body);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan saat menyimpan perubahan data siswa.');
  }
});

// Rute untuk menghapus data siswa
app.get('/hapus/:id', async (req, res) => {
  const id = req.params.id;
  try {
      await Siswa.findByIdAndRemove(id);
      res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan saat menghapus data siswa.');
  }
});

// Jalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
