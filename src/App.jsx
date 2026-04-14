import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import KomodoTour from './pages/KomodoTour';
import TourDetail from './pages/TourDetail';
import LombokTour from './pages/LombokTour';
import LombokTourDetail from './pages/LombokTourDetail';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/komodo-tour" element={<KomodoTour />} />
            <Route path="/komodo-tour/:id" element={<TourDetail />} />
            <Route path="/lombok-tour" element={<LombokTour />} />
            <Route path="/lombok-tour/:id" element={<LombokTourDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </Router>
  );
}

export default App;
