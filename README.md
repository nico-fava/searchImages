<!-- https://github.com/nico-fava/searchImages -->

# Project Title: Unsplash Image Search Application

## Description

This project is a robust web application built with **React**, **TypeScript**, **Redux Toolkit**, and **Vite**. It interfaces with the **Unsplash API** to search and display images based on user input, following a mobile-first, client-side-only approach. The application allows users to manage comments and favorites, ensuring a seamless experience while adhering to accessibility standards and security best practices.

## Key Features

- **Search & Pagination**: Users can search for images using keywords with pagination support.
- **Random Keyword Display**: Displays images based on a random keyword if no search term is provided.
- **Detailed Image View**: Each image has a dedicated view for more information.
- **Comment Feature**: Users can comment on images, with data stored client-side.
- **Favorite Images**: Users can save images as favorites, stored locally.

## Technology Stack

- **React**
- **TypeScript**
- **Redux Toolkit**
- **Vite**
- **SCSS** (for responsive design)

## Installation Instructions

1. Clone the repository:

```
git clone https://github.com/nico-fava/searchImages.git
cd searchImages
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
npm run dev
```

## Configuration

You can use my API key, just this once (;

## Usage

To use the application, simply enter a keyword in the search bar to find images from Unsplash. You can also view random images or click on an image for detailed information.

4. Comment Feature: Allow users to comment on images, with data stored client-side.
5. Favorite Images: Enable users to save images as favorites, stored locally.

```
src/
│── components/
│   ├── ImageCard.tsx
│   ├── SearchBar.tsx
│── pages/
│   ├── Home.tsx
│── store/
│   ├── store.ts
│   ├── imageSlice.ts
│── hooks/
│   ├── useLocalStorage.ts
│── styles/
│   ├── global.scss
│── utils/
│   ├── api.ts
│── App.tsx
│── main.tsx
```

## Acknowledgments

Special thanks to the Unsplash API.
