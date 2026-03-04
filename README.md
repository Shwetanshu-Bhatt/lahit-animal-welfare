# LAHIT Animal Welfare Website

A modern, responsive website for LAHIT Animal Welfare - a volunteer-led animal rescue initiative based in Uttarakhand, India.

## 🐾 About LAHIT

LAHIT Animal Welfare is dedicated to rescuing, feeding, and rehabilitating stray and injured animals across Uttarakhand. This website helps:

- Showcase rescue work and build trust
- Accept donations to support animal care
- Allow people to report injured animals
- Enable volunteers to join the mission
- Facilitate animal adoptions

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Maps:** Leaflet (react-leaflet)
- **Hosting:** Vercel Ready

## 🎨 Design Features

- Soft earth color palette (green, brown, beige, orange accents)
- Rounded components and smooth animations
- Emotional, trustworthy, and human-centered design
- Mobile-first responsive design
- Framer Motion animations throughout

## 📁 Project Structure

```
lahit-welfare/
├── app/
│   ├── page.js          # Main page with all sections
│   ├── layout.js        # Root layout with fonts and metadata
│   └── globals.css      # Global styles and Tailwind config
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── Container.js
│   ├── Navbar.js
│   ├── HeroSection.js
│   ├── ImpactStats.js
│   ├── RescueStories.js
│   ├── HelpCards.js
│   ├── EmergencyRescue.js
│   ├── InstagramFeed.js
│   ├── DonationSection.js
│   ├── VolunteerSection.js
│   ├── RescueMap.js
│   └── Footer.js
├── data/
│   ├── stats.js         # Impact statistics
│   ├── rescues.js       # Rescue stories and locations
│   └── animals.js       # Animals for adoption, donation tiers
└── public/
    └── images/          # Static images
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or navigate to the project directory:
```bash
cd lahit-welfare
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This will create a `dist` folder with static files ready for deployment.

## 🖼️ Adding Images

Place your images in the `public/images/` directory:

- `hero-dog.jpg` - Hero section main image
- `volunteers.jpg` - Volunteer section image
- `rescue-*-before.jpg` / `rescue-*-after.jpg` - Rescue story before/after images
- `adopt-*.jpg` - Animals available for adoption
- `insta-*.jpg` - Instagram feed images

## 🔧 Customization

### Colors

Edit the CSS variables in `app/globals.css`:

```css
:root {
  --primary-green: #2E7D32;
  --earth-brown: #5D4037;
  --warm-beige: #F5F5DC;
  --soft-orange: #F57C00;
}
```

### Contact Information

Update contact details in:
- `components/Footer.js`
- `components/EmergencyRescue.js`
- `components/DonationSection.js`

### Rescue Stories & Stats

Edit the data files in the `data/` directory:
- `stats.js` - Impact statistics
- `rescues.js` - Rescue stories and map locations
- `animals.js` - Adoption listings and donation tiers

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with default settings

### Static Hosting

The build output in `dist/` folder can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- Firebase Hosting
- AWS S3

## 📄 License

This project is built for LAHIT Animal Welfare. All rights reserved.

## 🤝 Contributing

This is a volunteer project for animal welfare. Contributions are welcome!

## 📞 Support

For issues or questions, please contact:
- Email: contact@lahitanimalwelfare.org
- Phone: +91 98765 43210

---

Built with ❤️ for the animals of Uttarakhand
