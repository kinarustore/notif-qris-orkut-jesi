// Simpan data mutasi dalam object { tanggal: [ {amount, time}, ... ] }
let mutations = {};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { date, amount, time } = req.body;

    if (!date || !amount) {
      return res.status(400).json({ error: 'Missing date or amount' });
    }

    // Jika tanggal belum ada, buat array baru
    if (!mutations[date]) {
      mutations[date] = [];
    }

    // Tambahkan mutasi baru ke tanggal tsb
    mutations[date].push({
      amount,
      time: time || new Date().toISOString() // fallback: pakai timestamp sekarang
    });

    return res.status(200).json({
      message: 'Mutation saved',
      date,
      amount,
      total: mutations[date].length
    });

  } else if (req.method === 'GET') {
    const { date } = req.query;

    if (date) {
      // ambil mutasi untuk tanggal tertentu
      if (!mutations[date] || mutations[date].length === 0) {
        return res.status(404).json({ error: 'No data for this date' });
      }
      return res.status(200).json({ date, mutations: mutations[date] });
    } else {
      // ambil semua mutasi
      if (Object.keys(mutations).length === 0) {
        return res.status(404).json({ error: 'No data yet' });
      }
      return res.status(200).json(mutations);
    }

  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
