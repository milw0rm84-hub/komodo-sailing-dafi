import { Link } from 'react-router-dom';
import { Calendar, MessageCircle, ArrowRight, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBlogPosts } from '../utils/api';

const categories = ['All', 'Travel Tips', 'Wildlife', 'Destinations', 'Activities'];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <main>
      <section className="relative h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=1920&h=1080&fit=crop)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <nav className="text-sm mb-4 opacity-80">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">Blog</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Blog & Articles</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Travel tips, destination guides, and stories from Komodo Sailing Adventure.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="lg:w-1/4">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                <h3 className="font-semibold mt-8 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-dark font-semibold'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-3/4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post) => (
                    <article key={post.id} className="card group">
                      <div className="relative overflow-hidden">
                        <img
                          src={post.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                          alt={post.title}
                          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <span className="absolute top-4 left-4 bg-primary text-dark text-xs font-semibold px-3 py-1 rounded-full">
                          {post.category || 'Article'}
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="mr-4">{formatDate(post.created_at)}</span>
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span>{post.read_time || 5} min read</span>
                        </div>
                        <h2 className="text-xl font-heading font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                        <Link
                          to={`/blog/${post.id}`}
                          className="inline-flex items-center text-primary font-medium hover:text-amber-600 transition-colors"
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {filteredPosts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Never Miss an Update!</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest travel tips and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition mb-4 sm:mb-0"
            />
            <button className="btn-primary rounded-l-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
