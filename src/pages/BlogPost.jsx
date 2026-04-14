import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MessageCircle, ArrowLeft } from 'lucide-react';
import { getBlogPost } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

export default function BlogPost() {
  const { settings } = useSettings();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await getBlogPost(id);
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="btn-primary inline-block">Back to Blog</Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <article>
        <section className="relative h-[400px] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.image || 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1920&h=1080&fit=crop'})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          </div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <nav className="text-sm mb-4 opacity-80">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/blog" className="hover:text-primary">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-primary">{post.category}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{post.title}</h1>
            <div className="flex items-center justify-center space-x-4 text-sm opacity-90">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                {post.read_time || 5} min read
              </span>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <Link
              to="/blog"
              className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
            />

            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Share this article:</span>
                <div className="flex space-x-3">
                  <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    f
                  </button>
                  <button className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-colors">
                    t
                  </button>
                  <button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    in
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Ready to Experience Komodo?</h2>
          <p className="text-gray-600 mb-6">
            Book your dream trip to Komodo National Park today!
          </p>
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            className="inline-flex items-center bg-secondary text-white font-semibold px-8 py-4 rounded-full hover:bg-green-600 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  );
}
