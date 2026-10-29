// ===== 1. Ambil elemen =====
const form = document.querySelector('#formDaftar');
const fields = form.querySelectorAll('input');
const tanggal = document.querySelector('#tanggal');
const statusForm = document.querySelector('#statusForm');

// ===== 2. Daftar pesan error (kunci = id input) =====
const pesan = {
  nama:    { kosong: 'Nama wajib diisi.', 
             pendek: 'Nama minimal 3 huruf.' },
  hp:      { kosong: 'Nomor HP wajib diisi.', 
             format: 'Nomor HP harus diawali 08 dan terdiri dari 10–13 digit.' },
  password: { kosong: 'Password wajib diisi.',
             pendek: 'Password minimal 8 karakter.' },
  retype:  { kosong: 'Ketik ulang password.',
             beda: 'Password dan ketik ulang tidak sama.' },
  tanggalLahir: { kosong: 'Pilih tanggal lahir.',
                  muda: 'Usia minimal 20 tahun.'}
};

// ===== 3. Tampilkan dan hapus error =====
function showError(input, teks) {
  input.classList.add('is-invalid');           // tampilan merah Bootstrap
  input.setAttribute('aria-invalid', 'true');
  document.getElementById(input.id + '-error').textContent = teks;
  return false;
}

function clearError(input) {
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  document.getElementById(input.id + '-error').textContent = '';
  return true;
}

// ===== 4. Pengecekan field =====
function cekField(input) {
  const v = input.validity;
  const p = pesan[input.id];

  if (input.value.trim() === '') return showError(input, p.kosong);
  if (v.tooShort) return showError(input, p.pendek);
  if (v.typeMismatch || v.patternMismatch) return showError(input, p.format);
  if (input.id === 'retype' && input.value !== document.querySelector('#password').value)return showError(input, p.beda);
  if (v.rangeOverflow) return showError(input, p.muda);
  return clearError(input);
}

function semuaFieldValid() {
  let valid = true;
  for (const input of fields) {
    if (!cekField(input)) valid = false;
  }
  return valid;
}

// ===== 5. Tanggal maksimal  =====
function hariIni(d) {
  const bulan = String(d.getMonth() + 1).padStart(2, '0');
  const tgl = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + bulan + '-' + tgl;
};

const batasLahir = new Date()
batasLahir.setFullYear(batasLahir.getFullYear() - 20);
tanggalLahir.max = hariIni(batasLahir);

// ===== 6. Event: saat pindah field =====
function saatBlur(event) {
  cekField(event.target);
}

for (const input of fields) {
  input.addEventListener('blur', saatBlur);
}

// ===== 7. Event: saat form dikirim =====
function saatSubmit(event) {
  event.preventDefault();
  statusForm.className = '';        // sembunyikan pesan sukses sebelumnya
  statusForm.textContent = '';

  if (!semuaFieldValid()) {
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  statusForm.textContent = 'Registrasi berhasil!';
  statusForm.className = 'alert alert-success mt-3';
  form.reset();
}

form.addEventListener('submit', saatSubmit);
