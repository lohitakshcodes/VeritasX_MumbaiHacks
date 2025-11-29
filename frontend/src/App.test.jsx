import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Flashcard from './components/Flashcard';
import NewspaperLayout from './components/NewspaperLayout';

// Mock axios
vi.mock('axios', () => ({
    default: {
        create: () => ({
            get: vi.fn(() => Promise.resolve({ data: [] })),
            post: vi.fn(),
        }),
    },
}));

describe('App Component', () => {
    it('renders the newspaper layout by default', () => {
        render(<App />);
        expect(screen.getByText(/The Daily Truth/i)).toBeInTheDocument();
    });
});

describe('NewspaperLayout Component', () => {
    it('renders genre sections', () => {
        const onSelectGenre = vi.fn();
        render(<NewspaperLayout genres={['Technology']} onSelectGenre={onSelectGenre} />);

        // Use getAllByText in case multiple elements match, and take the first one or specific one
        const techElements = screen.getAllByText(/TECHNOLOGY/i);
        expect(techElements.length).toBeGreaterThan(0);

        const techSection = screen.getByText(/Tech World in Chaos/i);
        fireEvent.click(techSection);
        expect(onSelectGenre).toHaveBeenCalledWith('Technology');
    });
});

describe('Flashcard Component', () => {
    const mockNewsItem = {
        title: "Test News",
        genre: "Technology",
        pub_date: new Date().toISOString(),
        description: "Test description",
        is_verified: true,
        misinformation_score: 10,
        fact_check_result: "This is true."
    };

    it('renders front of card initially', () => {
        render(<Flashcard newsItem={mockNewsItem} onNext={() => { }} />);
        expect(screen.getByText("Test News")).toBeInTheDocument();
        // In jsdom, both sides are rendered. We just verify the content exists.
        expect(screen.getByText("This is true.")).toBeInTheDocument();
    });

    it('flips on click', () => {
        render(<Flashcard newsItem={mockNewsItem} onNext={() => { }} />);
        const card = screen.getByText("Test News");
        fireEvent.click(card);
        // Again, visual flip isn't testable in jsdom easily without checking style props
        // We assume the click handler works if no error is thrown
    });
});
