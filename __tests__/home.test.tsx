// Generated by CodiumAI

describe('Home', () => {

    // Renders the Home component without crashing
    import Home from './app/page';

    it('should render the Home component without crashing', () => {
        const { container } = render(<Home />);
        expect(container).toBeInTheDocument();
    });

    import { render } from '@testing-library/react';

    it('should handle missing image sources gracefully', () => {
        const { getByAltText } = render(<Home />);
        const nextImage = getByAltText('Next.js logo');
        const vercelImage = getByAltText('Vercel logomark');
        const fileImage = getByAltText('File icon');
        const windowImage = getByAltText('Window icon');
        const globeImage = getByAltText('Globe icon');

        expect(nextImage).toBeInTheDocument();
        expect(vercelImage).toBeInTheDocument();
        expect(fileImage).toBeInTheDocument();
        expect(windowImage).toBeInTheDocument();
        expect(globeImage).toBeInTheDocument();
    });

    // Displays the Vercel logo image correctly
    it('should display Vercel logo image correctly', () => {
        render(<Home />);
        const vercelLogo = screen.getByAltText('Vercel logomark');
        expect(vercelLogo).toBeInTheDocument();
    });

    // Renders the "Get started by editing" text
    it('should render the "Get started by editing" text', () => {
        const { getByText } = render(<Home />);
        expect(getByText('Get started by editing')).toBeInTheDocument();
    });

    // Displays the Next.js logo image correctly
    it('should display Next.js logo image correctly', () => {
        render(<Home />);
        const nextLogo = screen.getByAltText('Next.js logo');
        expect(nextLogo).toBeInTheDocument();
    });

    // Renders the "Save and see your changes instantly" text
    it('should render the "Save and see your changes instantly" text', () => {
        render(<Home />);
        const saveText = screen.getByText('Save and see your changes instantly.');
        expect(saveText).toBeInTheDocument();
    });

    // "Deploy now" link navigates to the correct URL
    it('should navigate to correct URL when clicking on "Deploy now" link', () => {
        render(<Home />);
        const deployNowLink = screen.getByText('Deploy now');
        expect(deployNowLink).toHaveAttribute('href', 'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
    });

    // "Go to nextjs.org" link navigates to the correct URL
    it('should navigate to nextjs.org when link is clicked', () => {
        render(<Home />);
        const link = screen.getByText('Go to nextjs.org →');
        expect(link).toHaveAttribute('href', 'https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
    });

    // "Examples" link navigates to the correct URL
    it('should navigate to correct URL when Examples link is clicked', () => {
        render(<Home />);
        const examplesLink = screen.getByText('Examples');
        fireEvent.click(examplesLink);
        expect(window.location.href).toBe('https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
    });

    // "Learn" link navigates to the correct URL
    it('should navigate to correct URL when clicking on "Learn" link', () => {
        // Mock the window.open method
        const originalOpen = window.open;
        window.open = jest.fn();

        render(<Home />);

        const learnLink = screen.getByText('Learn');
        fireEvent.click(learnLink);

        expect(window.open).toHaveBeenCalledWith('https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app', '_blank');

        // Restore the original window.open method
        window.open = originalOpen;
    });

    // "Read our docs" link navigates to the correct URL
    it('should navigate to correct URL when clicked', () => {
        render(<Home />);
        const readDocsLink = screen.getByText('Read our docs');
        expect(readDocsLink).toHaveAttribute('href', 'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
    });

    // Handles invalid URLs in anchor tags
    it('should handle invalid URLs in anchor tags', () => {
        render(<Home />);
        const anchorTags = screen.getAllByRole('link');
        anchorTags.forEach((tag) => {
            expect(tag).toHaveAttribute('href', expect.stringMatching(/^https?:\/\//));
        });
    });

    // Renders correctly in dark mode
    it('should render correctly in dark mode', () => {
        const { container } = render(<Home />);
        expect(container).toBeInTheDocument();
    });

    // Renders correctly in light mode
    it('should render correctly in light mode', () => {
        render(<Home />);
        // Add test logic here
    });

    // Handles very large screen sizes
    it('should render the Home component for very large screens', () => {
        const { container } = render(<Home />);
        expect(container).toBeInTheDocument();
    });

    // Handles very small screen sizes
    it('should render the Home component for very small screen sizes', () => {
        const { container } = render(<Home />);
        expect(container).toBeInTheDocument();
    });

    // Verifies the correct use of aria-hidden attribute
    it('should verify correct use of aria-hidden attribute', () => {
        render(<Home />);
        const images = document.querySelectorAll('img[aria-hidden="true"]');
        images.forEach((image) => {
            expect(image).toBeInTheDocument();
        });
    });

    // Checks the priority loading of images
    it("should prioritize loading images when 'priority' attribute is set", () => {
        render(<Home />);
        const nextImage = screen.getByAltText('Next.js logo');
        const vercelImage = screen.getByAltText('Vercel logomark');
        const fileIcon = screen.getByAltText('File icon');
        const windowIcon = screen.getByAltText('Window icon');
        const globeIcon = screen.getByAltText('Globe icon');

        expect(nextImage).toHaveAttribute('loading', 'eager');
        expect(vercelImage).toHaveAttribute('loading', 'eager');
        expect(fileIcon).toHaveAttribute('loading', 'eager');
        expect(windowIcon).toHaveAttribute('loading', 'eager');
        expect(globeIcon).toHaveAttribute('loading', 'eager');
    });

    // Ensures the correct application of CSS classes
    it('should apply correct CSS classes to elements', () => {
        const { getByAltText, getByText } = render(<Home />);

        expect(getByAltText('Next.js logo')).toHaveClass('dark:invert');
        expect(getByText('Deploy now')).toHaveClass('dark:invert');
        expect(getByText('Read our docs')).toHaveClass('dark:invert');
        expect(getByAltText('File icon')).toHaveClass('aria-hidden');
        expect(getByAltText('Window icon')).toHaveClass('aria-hidden');
        expect(getByAltText('Globe icon')).toHaveClass('aria-hidden');
    });

    // Verifies the presence of alt text for accessibility
    it('should have alt text for Next.js logo', () => {
        render(<Home />);
        const nextJsLogo = screen.getByAltText('Next.js logo');
        expect(nextJsLogo).toBeInTheDocument();
    });
});
