// SiPadi Fuzzy - Mesin Inferensi Fuzzy Mamdani

// Fungsi Keanggotaan Segitiga
// x: nilai input, a: awal, b: puncak, c: akhir
function triMF(x, a, b, c) {
    // Bahu kiri: nilai <= a bernilai 1
    if (a === b) {
        if (x <= a) return 1;
        if (x >= c) return 0;
        return (c - x) / (c - a);
    }
    // Bahu kanan: nilai >= c bernilai 1
    if (b === c) {
        if (x >= c) return 1;
        if (x <= a) return 0;
        return (x - a) / (b - a);
    }
    // Segitiga normal
    if (x <= a || x >= c) return 0;
    if (x === b) return 1;
    if (x < b) return (x - a) / (b - a);
    return (c - x) / (c - b);
}

// Fungsi Keanggotaan Input
const suhuMF = {
    dingin: x => triMF(x, 15, 15, 22),
    sedang: x => triMF(x, 18, 26, 34),
    panas: x => triMF(x, 28, 40, 40),
};

const kelbMF = {
    rendah: x => triMF(x, 20, 20, 50),
    sedang: x => triMF(x, 40, 60, 80),
    tinggi: x => triMF(x, 70, 100, 100),
};

const airMF = {
    kering: x => triMF(x, 0, 0, 10),
    cukup: x => triMF(x, 5, 13, 20),
    tergenang: x => triMF(x, 15, 30, 30),
};

// Fungsi Keanggotaan Output
const pupukMF = {
    sedikit: x => triMF(x, 0, 0, 100),
    sedang: x => triMF(x, 75, 150, 225),
    banyak: x => triMF(x, 200, 300, 300),
};

const irigasiMF = {
    kecil: x => triMF(x, 0, 0, 2),
    sedang: x => triMF(x, 1, 2.5, 4),
    besar: x => triMF(x, 3, 5, 5),
};

// Basis Aturan Fuzzy (27 aturan total)
// Format: [suhu, kelembapan, air, pupuk, irigasi]
const rules = [
    // Suhu: Dingin
    ['dingin', 'tinggi', 'tergenang', 'sedikit', 'kecil'],
    ['dingin', 'tinggi', 'cukup', 'sedikit', 'kecil'],
    ['dingin', 'tinggi', 'kering', 'sedang', 'sedang'],
    ['dingin', 'sedang', 'tergenang', 'sedikit', 'kecil'],
    ['dingin', 'sedang', 'cukup', 'sedang', 'sedang'],
    ['dingin', 'sedang', 'kering', 'sedang', 'sedang'],
    ['dingin', 'rendah', 'tergenang', 'sedang', 'sedang'],
    ['dingin', 'rendah', 'cukup', 'sedang', 'sedang'],
    ['dingin', 'rendah', 'kering', 'sedang', 'besar'],
    // Suhu: Sedang
    ['sedang', 'tinggi', 'tergenang', 'sedikit', 'kecil'],
    ['sedang', 'tinggi', 'cukup', 'sedang', 'sedang'],
    ['sedang', 'tinggi', 'kering', 'sedang', 'sedang'],
    ['sedang', 'sedang', 'tergenang', 'sedang', 'sedang'],
    ['sedang', 'sedang', 'cukup', 'sedang', 'sedang'],
    ['sedang', 'sedang', 'kering', 'sedang', 'sedang'],
    ['sedang', 'rendah', 'tergenang', 'sedang', 'sedang'],
    ['sedang', 'rendah', 'cukup', 'sedang', 'sedang'],
    ['sedang', 'rendah', 'kering', 'banyak', 'besar'],
    // Suhu: Panas
    ['panas', 'tinggi', 'tergenang', 'sedang', 'sedang'],
    ['panas', 'tinggi', 'cukup', 'sedang', 'sedang'],
    ['panas', 'tinggi', 'kering', 'sedang', 'sedang'],
    ['panas', 'sedang', 'tergenang', 'sedang', 'sedang'],
    ['panas', 'sedang', 'cukup', 'sedang', 'sedang'],
    ['panas', 'sedang', 'kering', 'banyak', 'besar'],
    ['panas', 'rendah', 'tergenang', 'sedang', 'sedang'],
    ['panas', 'rendah', 'cukup', 'banyak', 'besar'],
    ['panas', 'rendah', 'kering', 'banyak', 'besar'],
];

// Fuzzifikasi - Mengubah nilai crisp menjadi derajat keanggotaan
function fuzzifikasi(suhu, kelembapan, tinggiair) {
    return {
        suhu: {
            dingin: suhuMF.dingin(suhu),
            sedang: suhuMF.sedang(suhu),
            panas: suhuMF.panas(suhu),
        },
        kelb: {
            rendah: kelbMF.rendah(kelembapan),
            sedang: kelbMF.sedang(kelembapan),
            tinggi: kelbMF.tinggi(kelembapan),
        },
        air: {
            kering: airMF.kering(tinggiair),
            cukup: airMF.cukup(tinggiair),
            tergenang: airMF.tergenang(tinggiair),
        }
    };
}

// Mesin Inferensi Mamdani
// Menerapkan MIN untuk implikasi, MAX untuk komposisi, dan Centroid untuk defuzzifikasi
function inferensi(fuzz) {
    // Evaluasi tiap aturan (operasi MIN untuk implikasi)
    const ruleResults = rules.map(r => {
        const alpha = Math.min(
            fuzz.suhu[r[0]],
            fuzz.kelb[r[1]],
            fuzz.air[r[2]]
        );
        return { alpha, pupuk: r[3], irigasi: r[4] };
    });

    // Defuzzifikasi Centroid dengan integrasi numerik
    function defuzz(mfMap, domain, active) {
        const N = 1000;
        const [lo, hi] = domain;
        const step = (hi - lo) / N;
        let num = 0, den = 0;
        for (let i = 0; i <= N; i++) {
            const z = lo + i * step;
            // Komposisi MAX
            let mu = 0;
            active.forEach(a => {
                const base = mfMap[a.key](z);
                const clipped = Math.min(a.alpha, base);
                mu = Math.max(mu, clipped);
            });
            num += z * mu;
            den += mu;
        }
        return den === 0 ? 0 : num / den;
    }

    // Agregasi himpunan output yang aktif
    const activePupuk = {};
    const activeIrigasi = {};
    ruleResults.forEach(r => {
        if (r.alpha > 0) {
            if (!activePupuk[r.pupuk] || activePupuk[r.pupuk] < r.alpha)
                activePupuk[r.pupuk] = r.alpha;
            if (!activeIrigasi[r.irigasi] || activeIrigasi[r.irigasi] < r.alpha)
                activeIrigasi[r.irigasi] = r.alpha;
        }
    });

    const apArr = Object.entries(activePupuk).map(([k, v]) => ({ key: k, alpha: v }));
    const aiArr = Object.entries(activeIrigasi).map(([k, v]) => ({ key: k, alpha: v }));

    const resPupuk = defuzz(pupukMF, [0, 300], apArr);
    const resIrigasi = defuzz(irigasiMF, [0, 5], aiArr);

    return { ruleResults, resPupuk, resIrigasi, activePupuk, activeIrigasi };
}

// Fungsi perhitungan utama
function hitung() {
    const suhu = parseFloat(document.getElementById('suhu').value);
    const kelembapan = parseFloat(document.getElementById('kelembapan').value);
    const tinggiair = parseFloat(document.getElementById('tinggiair').value);

    const fuzz = fuzzifikasi(suhu, kelembapan, tinggiair);
    const hasil = inferensi(fuzz);

    // Tampilkan hasil
    document.getElementById('res-pupuk').textContent = hasil.resPupuk.toFixed(1);
    document.getElementById('res-irigasi').textContent = hasil.resIrigasi.toFixed(2);

    // Dapatkan label linguistik dominan
    const kp = document.getElementById('kat-pupuk');
    kp.className = 'kategori';
    const labelPupuk = dominanLinguistik(hasil.activePupuk);
    if (labelPupuk) {
        kp.textContent = capitalize(labelPupuk);
        kp.classList.add(labelPupuk);
    } else {
        kp.textContent = '—';
    }

    const ki = document.getElementById('kat-irigasi');
    ki.className = 'kategori';
    const labelIrigasi = dominanLinguistik(hasil.activeIrigasi);
    if (labelIrigasi) {
        ki.textContent = capitalize(labelIrigasi);
        ki.classList.add(labelIrigasi);
    } else {
        ki.textContent = '—';
    }

    // Tampilkan rekomendasi naratif
    tampilkanRekomendasi(suhu, kelembapan, tinggiair, hasil.resPupuk, hasil.resIrigasi, labelPupuk, labelIrigasi);

    // Perbarui bilah kemajuan derajat keanggotaan
    const setPB = (id, val) => {
        document.getElementById('pb-' + id).style.width = (val * 100) + '%';
        document.getElementById('pv-' + id).textContent = val.toFixed(2);
    };
    setPB('su-d', fuzz.suhu.dingin);
    setPB('su-s', fuzz.suhu.sedang);
    setPB('su-p', fuzz.suhu.panas);
    setPB('ke-r', fuzz.kelb.rendah);
    setPB('ke-s', fuzz.kelb.sedang);
    setPB('ke-t', fuzz.kelb.tinggi);
    setPB('ta-k', fuzz.air.kering);
    setPB('ta-c', fuzz.air.cukup);
    setPB('ta-t', fuzz.air.tergenang);

    // Perbarui daftar aturan aktif
    const rl = document.getElementById('rule-list');
    rl.innerHTML = '';
    hasil.ruleResults.forEach((r, i) => {
        const el = document.createElement('div');
        el.className = 'rule-item' + (r.alpha > 0 ? ' aktif' : '');
        el.innerHTML = `<span class="rule-alpha">R${i + 1}: α=${r.alpha.toFixed(2)}</span>
      <span class="rule-text">IF Suhu=${rules[i][0]} AND Kelb=${rules[i][1]} AND Air=${rules[i][2]} THEN Pupuk=${rules[i][3]} AND Irigasi=${rules[i][4]}</span>`;
        rl.appendChild(el);
    });

    // Gambar grafik fungsi keanggotaan
    drawMF('c-suhu', suhuMF, 15, 40, suhu, ['#52b788', '#f4d35e', '#e63946'], ['Dingin', 'Sedang', 'Panas']);
    drawMF('c-kelembapan', kelbMF, 20, 100, kelembapan, ['#f4d35e', '#52b788', '#4cc9f0'], ['Rendah', 'Sedang', 'Tinggi']);
    drawMF('c-tinggiair', airMF, 0, 30, tinggiair, ['#f4d35e', '#52b788', '#4cc9f0'], ['Kering', 'Cukup', 'Tergenang']);
    drawMF('c-pupuk', pupukMF, 0, 300, hasil.resPupuk, ['#52b788', '#f4d35e', '#e63946'], ['Sedikit', 'Sedang', 'Banyak'], true);
    drawMF('c-irigasi', irigasiMF, 0, 5, hasil.resIrigasi, ['#4cc9f0', '#52b788', '#1e6091'], ['Kecil', 'Sedang', 'Besar'], true);
}

// Gambar visualisasi fungsi keanggotaan pada canvas
function drawMF(canvasId, mfObj, xmin, xmax, xval, colors, labels, isOutput = false) {
    const canvas = document.getElementById(canvasId);
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.parentElement.clientWidth;
    const H = 120;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const pad = { l: 8, r: 8, t: 8, b: 20 };
    const iw = W - pad.l - pad.r;
    const ih = H - pad.t - pad.b;

    const toX = v => pad.l + ((v - xmin) / (xmax - xmin)) * iw;
    const toY = mu => pad.t + (1 - mu) * ih;

    // Gambar kurva setiap fungsi keanggotaan
    const keys = Object.keys(mfObj);
    keys.forEach((k, i) => {
        const N = 300;
        ctx.beginPath();
        for (let j = 0; j <= N; j++) {
            const x = xmin + (j / N) * (xmax - xmin);
            const mu = mfObj[k](x);
            if (j === 0) ctx.moveTo(toX(x), toY(mu));
            else ctx.lineTo(toX(x), toY(mu));
        }
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Gambar sumbu
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t + ih);
    ctx.lineTo(pad.l + iw, pad.t + ih);
    ctx.stroke();

    // Gambar garis nilai saat ini
    ctx.strokeStyle = '#1e6091';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(toX(xval), pad.t);
    ctx.lineTo(toX(xval), pad.t + ih);
    ctx.stroke();
    ctx.setLineDash([]);

    // Gambar label nilai
    ctx.fillStyle = '#888';
    ctx.font = '10px IBM Plex Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(xval.toFixed(1), toX(xval), H - 4);
}

// Dapatkan label linguistik dominan dari himpunan fuzzy aktif
function dominanLinguistik(activeMap) {
    let best = null, bestAlpha = -1;
    Object.entries(activeMap).forEach(([key, alpha]) => {
        if (alpha > bestAlpha) { bestAlpha = alpha; best = key; }
    });
    return bestAlpha > 0 ? best : null;
}

// Kapitalkan huruf pertama
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// Bangun teks rekomendasi naratif
const TEKS_PUPUK = {
    sedikit: 'pupuk urea dalam jumlah <strong>sedikit</strong> sudah cukup',
    sedang: 'pupuk urea dalam jumlah <strong>sedang</strong> direkomendasikan',
    banyak: 'pupuk urea dalam jumlah <strong>banyak</strong> diperlukan',
};

const TEKS_IRIGASI = {
    kecil: 'debit irigasi <strong>kecil</strong> sudah memadai',
    sedang: 'debit irigasi <strong>sedang</strong> perlu diberikan',
    besar: 'debit irigasi <strong>besar</strong> sangat dibutuhkan segera',
};

function tampilkanRekomendasi(suhu, kelembapan, tinggiair, resPupuk, resIrigasi, labelPupuk, labelIrigasi) {
    const box = document.getElementById('rekomendasi-box');
    const teksEl = document.getElementById('rekomendasi-teks');

    if (!labelPupuk || !labelIrigasi) {
        teksEl.innerHTML = 'Tidak ada aturan fuzzy yang aktif untuk kombinasi input ini.';
        return;
    }

    const emoji = (resPupuk >= 200 || resIrigasi >= 3.5) ? '🔥' : (resPupuk <= 100 && resIrigasi <= 2 ? '🌤️' : '🌾');
    box.querySelector('.emoji').textContent = emoji;

    const kalimatPupuk = TEKS_PUPUK[labelPupuk] || '';
    const kalimatIrigasi = TEKS_IRIGASI[labelIrigasi] || '';

    teksEl.innerHTML =
        `Berdasarkan kondisi lahan saat ini, sistem merekomendasikan ${kalimatPupuk} ` +
        `(<strong>${resPupuk.toFixed(1)} kg/Ha</strong>), dan ${kalimatIrigasi} ` +
        `(<strong>${resIrigasi.toFixed(2)} L/s/Ha</strong>) untuk menjaga pertumbuhan tanaman padi tetap optimal.` +
        `<span class="kondisi">Suhu ${suhu}°C · Kelembapan ${kelembapan}% · Genangan air ${tinggiair} cm</span>`;
}

// Perbarui nilai yang ditampilkan saat slider berubah
function updateVal(id, val) {
    document.getElementById('val-' + id).textContent = parseFloat(val);
}

// Perbarui gradien slider berdasarkan nilai saat ini
function updateGradient(input) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const val = parseFloat(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    input.style.background = `linear-gradient(to right, #52b788 0%, #52b788 ${pct}%, #e9ecef ${pct}%, #e9ecef 100%)`;
}

// Atur data sampel dan hitung
function setSampel(s, k, a) {
    const rangeUpdate = (id, val) => {
        const el = document.getElementById(id);
        el.value = val;
        updateVal(id, val);
        updateGradient(el);
    };
    rangeUpdate('suhu', s);
    rangeUpdate('kelembapan', k);
    rangeUpdate('tinggiair', a);
    hitung();
}

// Isi tabel data sampel
function populasiTabelSampel() {
    const sampelData = [
        { no: 1, label: 'Panas-Kering', suhu: 32, kelb: 45, air: 5 },
        { no: 2, label: 'Normal', suhu: 26, kelb: 65, air: 13 },
        { no: 3, label: 'Sejuk-Basah', suhu: 20, kelb: 80, air: 18 },
        { no: 4, label: 'Sangat Kering', suhu: 35, kelb: 30, air: 2 },
        { no: 5, label: 'Sejuk-Sedang', suhu: 22, kelb: 55, air: 10 },
    ];
    const tbody = document.getElementById('tbody-sampel');
    if (!tbody) return;
    tbody.innerHTML = '';
    sampelData.forEach((s, idx) => {
        const fuzz = fuzzifikasi(s.suhu, s.kelb, s.air);
        const hasil = inferensi(fuzz);
        const labP = dominanLinguistik(hasil.activePupuk) || '—';
        const labI = dominanLinguistik(hasil.activeIrigasi) || '—';
        const bg = idx % 2 === 0 ? '#f8faf8' : 'white';
        const tr = document.createElement('tr');
        tr.style.background = bg;
        tr.innerHTML = `
      <td style="padding:0.5rem 0.8rem;text-align:center;font-weight:700;">Kasus ${s.no}<br><span style="font-size:0.7rem;font-weight:400;color:var(--abu);">${s.label}</span></td>
      <td style="padding:0.5rem 0.8rem;text-align:center;">${s.suhu}</td>
      <td style="padding:0.5rem 0.8rem;text-align:center;">${s.kelb}</td>
      <td style="padding:0.5rem 0.8rem;text-align:center;">${s.air}</td>
      <td style="padding:0.5rem 0.8rem;text-align:center;font-weight:700;color:var(--tanah);">${hasil.resPupuk.toFixed(1)}</td>
      <td style="padding:0.5rem 0.8rem;text-align:center;font-weight:700;color:var(--biru-air);">${hasil.resIrigasi.toFixed(2)}</td>
      <td style="padding:0.5rem 0.8rem;text-align:center;">${capitalize(labP)}</td>
      <td style="padding:0.5rem 0.8rem;text-align:center;">${capitalize(labI)}</td>
    `;
        tbody.appendChild(tr);
    });
}

// Inisialisasi saat halaman dimuat
document.querySelectorAll('input[type=range]').forEach(r => updateGradient(r));
hitung();
populasiTabelSampel();

window.addEventListener('resize', hitung);
