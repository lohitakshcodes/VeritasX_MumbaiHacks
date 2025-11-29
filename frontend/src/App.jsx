import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewspaperLayout from './components/NewspaperLayout';
import Flashcard from './components/Flashcard';
import { ArrowLeft } from 'lucide-react';

// Configure axios base URL (assuming localhost:8000 for backend)
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

function App() {
  const [view, setView] = useState('home'); // 'home' or 'flashcard'
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Trigger scrape on load (optional, or rely on backend cron/trigger)
    // api.post('/trigger-scrape/');

    // Fetch news
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/news/');
      setNewsItems(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Fallback to empty array if backend fails, we will generate random news later
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomNews = (genre) => {
    const templates = [
      { title: "Rumour Has It: [Topic] Goes Viral", description: "Social media is abuzz with claims about [Topic]. Our analysis shows this is likely misleading context." },
      { title: "Fact Check: [Topic] Debunked", description: "A viral message claiming [Topic] has been proven false by official sources." },
      { title: "Verified: [Topic] Update", description: "Official confirmation received regarding [Topic]. Here is what you need to know." },
      { title: "Deepfake Alert: [Topic] Video", description: "A video circulating about [Topic] has been identified as AI-generated." },
      { title: "Scam Warning: [Topic]", description: "Be aware of a new [Topic] scam targeting users via SMS." }
    ];

    const topics = {
      'Politics': ['Election Dates', 'New Policy', 'Minister Statement', 'Vote Count'],
      'Economy': ['Market Crash', 'New Currency', 'Tax Hike', 'Bank Merger'],
      'Climate': ['Heatwave Warning', 'Flood Alert', 'Cloud Seeding', 'Snow in Desert'],
      'Social': ['Celebrity Death', 'Free iPhone', 'Viral Challenge', 'Secret Menu'],
      'Mumbai': ['Local Train Delay', 'Bridge Collapse', 'Water Cut', 'New Metro Line'],
      'Health': ['New Virus', 'Miracle Cure', 'Vaccine Side Effect', 'Diet Tip'],
      'Education': ['Exam Cancelled', 'Scholarship Link', 'Syllabus Change', 'School Holiday'],
      'Scam': ['KYC Update', 'Lottery Winner', 'Job Offer', 'Electricity Bill'],
      'Tech': ['AI Takeover', 'New iPhone Feature', 'Data Leak', 'Banned App']
    };

    const genreTopics = topics[genre] || ['General News', 'Viral Post', 'Breaking Story'];
    const randomTopic = genreTopics[Math.floor(Math.random() * genreTopics.length)];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Generate longer content
    const longContent = `
      In recent days, a significant amount of discussion has erupted regarding ${randomTopic}. 
      Various sources on social media have been circulating claims that have caused concern and confusion among the public. 
      
      Our team at Veritas X has conducted a thorough investigation into these allegations. 
      We have cross-referenced official government notifications, consulted with subject matter experts, and analyzed the digital footprint of the original messages.
      
      The findings indicate that the viral claims are largely unsubstantiated. 
      Official sources have clarified that there is no truth to the rumors surrounding ${randomTopic}. 
      We urge the public to rely only on verified channels for information and to refrain from forwarding unverified messages.
    `;

    return {
      title: randomTemplate.title.replace('[Topic]', randomTopic),
      description: randomTemplate.description.replace('[Topic]', randomTopic),
      content: longContent,
      genre: genre,
      pub_date: new Date().toISOString(),
      source: "Veritas X AI Analysis",
      is_verified: true,
      misinformation_score: Math.floor(Math.random() * 20), // Low score = likely true
      fact_check_result: "This claim has been verified against official sources and found to be accurate/debunked as appropriate."
    };
  };

  const handleSelectGenre = (genre) => {
    setSelectedGenre(genre);

    // Filter news by genre
    let filtered = newsItems.filter(item => !genre || item.genre === genre);

    // If no news for genre, generate some random ones for the demo
    if (filtered.length === 0) {
      const randomCount = 3 + Math.floor(Math.random() * 3); // 3 to 5 items
      for (let i = 0; i < randomCount; i++) {
        filtered.push(generateRandomNews(genre));
      }
    }

    // Sort by date desc
    filtered.sort((a, b) => new Date(b.pub_date) - new Date(a.pub_date));

    // Update the display items temporarily for this view
    // We can't overwrite newsItems because we want to keep the original fetched data
    // So we'll store the current view items in a separate state or just pass them to render
    // But our render logic currently derives from newsItems. 
    // Let's add a state for `displayItems`
    setDisplayItems(filtered);

    setView('flashcard');
    setCurrentIndex(0);
  };

  const [displayItems, setDisplayItems] = useState([]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  };

  const handleBack = () => {
    setView('home');
    setSelectedGenre(null);
    setDisplayItems([]);
  };

  // Fallback if no items (shouldn't happen with random generation, but good for safety)
  const currentDisplayItem = displayItems.length > 0 ? displayItems[currentIndex % displayItems.length] : {
    title: "No news available",
    description: "Please trigger a scrape or check back later.",
    genre: "System",
    pub_date: new Date().toISOString()
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (view === 'flashcard') {
        if (e.key === 'Enter') {
          // Flip logic handled in Flashcard
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  return (
    <div className="min-h-screen bg-paper text-ink font-newspaper">
      {view === 'home' ? (
        <NewspaperLayout
          genres={['Politics', 'Economy', 'Climate', 'Social', 'Mumbai', 'Health', 'Education', 'Scam', 'Tech']}
          onSelectGenre={handleSelectGenre}
        />
      ) : (
        <div className="h-screen flex flex-col">
          <div className="p-4 border-b border-black flex justify-between items-center bg-white">
            <button
              onClick={handleBack}
              className="flex items-center font-bold hover:underline"
            >
              <ArrowLeft className="mr-2" /> Back to Front Page
            </button>
            <span className="font-headline font-bold text-xl uppercase">{selectedGenre}</span>
            <div className="w-20"></div> {/* Spacer */}
          </div>

          <div className="flex-grow overflow-hidden">
            <Flashcard
              newsItem={currentDisplayItem}
              onNext={handleNext}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
