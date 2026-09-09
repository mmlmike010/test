# Costco Same-Day with Ask Kirk Shopping Chatbot

A pixel-faithful recreation of the Costco Same-Day (Instacart-powered) storefront featuring the "Ask Kirk" AI shopping assistant chatbot.

![Costco Same-Day](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- 🛒 **Full Costco Storefront UI** - Pixel-accurate recreation with header, navigation, and product grids
- 🤖 **Ask Kirk Chatbot** - Interactive shopping assistant with contextual cart-building responses
- 💳 **Smart Cart Management** - Real-time cart updates when adding products via UI or chatbot
- 📱 **Responsive Design** - Works beautifully on desktop and adapts to different screen sizes
- ✨ **Member Only Savings** - Product cards with pricing, discounts, and savings badges
- 🎯 **Category Navigation** - Circular category scroller and department sidebar
- 🔍 **Search Interface** - Full header with search, delivery info, and cart display

## Tech Stack

- **Framework:** Next.js 16.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Icons:** Lucide React
- **Images:** Next.js Image Optimization

## Quick Start

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with all components
│   └── globals.css         # Global styles and Tailwind imports
├── components/
│   ├── Header.tsx          # Top navigation and search bar
│   ├── DepartmentsSidebar.tsx  # Left sidebar with categories
│   ├── CategoryScroller.tsx    # Circular category icons
│   ├── ProductGrid.tsx     # Product cards and savings section
│   └── AskKirkChat.tsx     # Chatbot sidebar (star feature!)
├── lib/
│   ├── data/
│   │   └── products.ts     # Product catalog and departments
│   └── store/
│       └── cart.ts         # Zustand cart store
└── next.config.ts          # Next.js configuration
```

## Components

### Ask Kirk Chatbot (`AskKirkChat.tsx`)

The star feature! An interactive shopping assistant that:

- **Understands context**: Responds to queries about Kirkland swaps, party planning, dietary restrictions, treasure hunts, and more
- **Adds to cart**: Automatically adds recommended products to your cart
- **Suggestion chips**: Quick-access buttons for common requests
- **Reset & Close**: Manage conversation state easily
- **Mock responses**: Works out of the box without any API keys
- **Voice input ready**: Microphone button (stub for future implementation)

**Sample queries Kirk understands:**
- "Find Kirkland swaps"
- "Build a party platter"
- "Kids soccer week, no peanuts"
- "Stock for this weather"
- "What's on treasure hunt?"
- "Use my member savings"

### Product Grid (`ProductGrid.tsx`)

- Member Only Savings section with promotional cards
- Product cards with images, pricing, discounts, and "Add" buttons
- Warehouse event banner
- "In stock here" section
- Real-time cart updates

### Header (`Header.tsx`)

- Costco branding and navigation
- Search bar with Ask Kirk button
- Delivery time and location display
- Cart with live item count badge
- Navigation links and utility buttons

## Cart Management

The app uses Zustand for simple, efficient state management:

```typescript
// Add items from product cards
addItem(product)

// Kirk adds items automatically when suggesting products
getTotalItems() // Updates cart badge in real-time
```

## Customization

### Adding Products

Edit `lib/data/products.ts` to add more products:

```typescript
{
  id: "13",
  name: "Your Product",
  brand: "Brand Name",
  category: "category",
  price: 9.99,
  originalPrice: 14.99,
  savings: 5.00,
  image: "https://images.unsplash.com/photo-...",
  inStock: true,
}
```

### Customizing Kirk's Responses

Edit `components/AskKirkChat.tsx` and update the `getMockResponse()` function to add new response patterns.

### Optional: Real LLM Integration

To use a real LLM instead of mock responses:

1. Create `.env.local`:
```bash
OPENAI_API_KEY=your_key_here
```

2. Add OpenAI SDK:
```bash
npm install openai
```

3. Update `getMockResponse()` in `AskKirkChat.tsx` to call the OpenAI API

## Styling

The app uses Costco's signature colors:
- **Red:** `#CC0000` - Primary brand color, Ask Kirk button
- **Blue:** `#0060A9` - Interactive elements, chat bubbles
- **White/Gray:** Clean, warehouse-style background

All spacing and typography matches the original Costco Same-Day interface.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development Notes

- Images are loaded from Unsplash via Next.js Image optimization
- Cart state persists during the session (no localStorage yet)
- Voice input button is a placeholder (shows alert)
- Sign In/Register buttons are non-functional (demo purposes)

## Performance

- Server-side rendering with Next.js App Router
- Optimized images with automatic WebP conversion
- Tree-shaking and code splitting
- Fast Refresh for instant updates during development

## Known Limitations

- No real Costco/Instacart API integration
- Mock chatbot responses (not connected to real LLM by default)
- No actual payment or authentication
- Static product catalog

## Future Enhancements

- [ ] Persistent cart with localStorage
- [ ] Real LLM integration with OpenAI/Anthropic
- [ ] Voice input with Web Speech API
- [ ] Product search functionality
- [ ] Cart checkout page
- [ ] User authentication
- [ ] Order history

## License

This is a demonstration project created for educational purposes.

## Acknowledgments

Built as a pixel-faithful recreation of the Costco Same-Day interface with Instacart integration, featuring the Ask Kirk shopping assistant.

---

**Ready to shop?** Run `npm run dev` and start chatting with Kirk! 🛒✨
