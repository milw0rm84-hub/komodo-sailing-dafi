const { sql } = require('../../db');

const formatReview = (review) => ({
  id: review.id,
  name: review.name,
  email: review.email,
  rating: review.rating,
  comment: review.comment,
  packageId: review.package_id,
  packageName: review.package_name,
  status: review.status,
  createdAt: review.created_at
});

async function handler(req, res) {
  const { method, query } = req;
  const { status, packageId } = query;

  if (method === 'GET') {
    try {
      let where = [];
      if (status) where.push(`status = '${status}'`);
      if (packageId) where.push(`package_id = ${packageId}`);
      const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
      const { rows } = await sql.query(`SELECT * FROM reviews ${whereClause} ORDER BY created_at DESC`);
      res.json(rows.map(formatReview));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews.' });
    }
  } else if (method === 'POST') {
    try {
      const { name, email, rating, comment, packageId, packageName } = req.body;
      const { rows } = await sql`
        INSERT INTO reviews (name, email, rating, comment, package_id, package_name, status) 
        VALUES (${name}, ${email}, ${rating}, ${comment}, ${packageId}, ${packageName}, 'pending')
        RETURNING *
      `;
      res.status(201).json(formatReview(rows[0]));
    } catch (error) {
      res.status(500).json({ message: 'Error creating review.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
module.exports = handler;