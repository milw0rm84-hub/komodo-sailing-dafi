const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  const { status, packageId } = req.query;
  
  try {
    if (req.method === 'GET') {
      let where = [];
      if (status) where.push(`status = '${status}'`);
      if (packageId) where.push(`package_id = ${packageId}`);
      const { rows } = await sql.query(`SELECT * FROM reviews ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`);
      return res.json(rows.map(r => ({ id: r.id, name: r.name, email: r.email, rating: r.rating, comment: r.comment, packageId: r.package_id, packageName: r.package_name, status: r.status, createdAt: r.created_at })));
    }
    if (req.method === 'POST') {
      const { name, email, rating, comment, packageId, packageName } = req.body;
      const { rows } = await sql`INSERT INTO reviews (name, email, rating, comment, package_id, package_name, status) VALUES (${name}, ${email}, ${rating}, ${comment}, ${packageId}, ${packageName}, 'pending') RETURNING *`;
      const r = rows[0];
      return res.status(201).json({ id: r.id, name: r.name, email: r.email, rating: r.rating, comment: r.comment, packageId: r.package_id, packageName: r.package_name, status: r.status, createdAt: r.created_at });
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ message: 'Error' }); }
};