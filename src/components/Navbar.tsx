import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-8 md:px-16 py-4 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-sm' : 'bg-gradient-to-b from-background/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <h1
            onClick={() => navigate('/')}
            className="text-2xl md:text-3xl font-bold text-primary cursor-pointer hover:scale-105 transition-transform"
          >
            CINEMORE
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            {isSearchOpen ? (
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
                className="w-64 bg-black/60 border border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
                autoFocus
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-all hover:scale-110"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};
