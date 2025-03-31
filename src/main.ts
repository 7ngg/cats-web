import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

interface CatFact {
  fact: string;
  length: number;
}

interface CatBreed {
  id: string;
  name: string;
  origin: string;
  temperament: string;
  description: string;
  reference_image_id: string;
}

interface CatImage {
  id: string;
  url: string;
}

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface PersonalityQuestion {
  question: string;
  options: {
    text: string;
    traits: string[];
  }[];
}

interface HealthIssue {
  name: string;
  description: string;
  symptoms: string[];
  prevention: string[];
}

interface Toy {
  name: string;
  description: string;
  materials: string[];
  instructions: string[];
  image: string;
}

interface Game {
  name: string;
  description: string;
  instructions: string[];
  image: string;
}

const translations: Translations = {
  en: {
    'nav.facts': 'Cat Facts',
    'nav.catalog': 'Cat Catalog',
    'search.placeholder': 'Search cat breeds...',
    'facts.title': 'Purrfect Cat Facts',
    'facts.subtitle': 'Discover fascinating facts about our feline friends!',
    'facts.loading': 'Loading...',
    'facts.error': 'Oops! Something went wrong. Please try again.',
    'facts.new': 'Get New Fact',
    'catalog.title': 'Cat Breeds Catalog',
    'catalog.subtitle': 'Explore different cat breeds and learn about their unique characteristics',
    'catalog.loading': 'Loading cats...',
    'catalog.error': 'Failed to load cat breeds. Please try again later.',
    'catalog.no-results': 'No cat breeds found matching your search.',
    'modal.origin': 'Origin:',
    'modal.temperament': 'Temperament:',
    'pagination.prev': '← Previous',
    'pagination.next': 'Next →',
    'pagination.page': 'Page',
    'pagination.of': 'of',
    'footer.text': 'Made with ❤️ for cat lovers'
  },
  ru: {
    'nav.facts': 'Факты о кошках',
    'nav.catalog': 'Каталог пород',
    'search.placeholder': 'Поиск пород кошек...',
    'facts.title': 'Интересные факты о кошках',
    'facts.subtitle': 'Узнайте увлекательные факты о наших пушистых друзьях!',
    'facts.loading': 'Загрузка...',
    'facts.error': 'Упс! Что-то пошло не так. Пожалуйста, попробуйте снова.',
    'facts.new': 'Новый факт',
    'catalog.title': 'Каталог пород кошек',
    'catalog.subtitle': 'Изучите различные породы кошек и узнайте об их уникальных характеристиках',
    'catalog.loading': 'Загрузка кошек...',
    'catalog.error': 'Не удалось загрузить породы кошек. Пожалуйста, попробуйте позже.',
    'catalog.no-results': 'Пород кошек, соответствующих вашему поиску, не найдено.',
    'modal.origin': 'Происхождение:',
    'modal.temperament': 'Темперамент:',
    'pagination.prev': '← Назад',
    'pagination.next': 'Вперед →',
    'pagination.page': 'Страница',
    'pagination.of': 'из',
    'footer.text': 'Сделано с ❤️ для любителей кошек'
  },
  az: {
    'nav.facts': 'Pisik faktları',
    'nav.catalog': 'Pisik kataloqu',
    'search.placeholder': 'Pisik növlərini axtarın...',
    'facts.title': 'Mükəmməl Pisik Faktları',
    'facts.subtitle': 'Tüklü dostlarımız haqqında maraqlı faktları kəşf edin!',
    'facts.loading': 'Yüklənir...',
    'facts.error': 'Ups! Bir şeylər yanlış getdi. Zəhmət olmasa yenidən cəhd edin.',
    'facts.new': 'Yeni Fakt',
    'catalog.title': 'Pisik Növləri Kataloqu',
    'catalog.subtitle': 'Müxtəlif pisik növlərini kəşf edin və onların unikal xüsusiyyətlərini öyrənin',
    'catalog.loading': 'Pisiklər yüklənir...',
    'catalog.error': 'Pisik növləri yüklənə bilmədi. Zəhmət olmasa daha sonra yenidən cəhd edin.',
    'catalog.no-results': 'Axtarışınıza uyğun pisik növü tapılmadı.',
    'modal.origin': 'Mənşəyi:',
    'modal.temperament': 'Temperamenti:',
    'pagination.prev': '← Əvvəlki',
    'pagination.next': 'Sonrakı →',
    'pagination.page': 'Səhifə',
    'pagination.of': '/',
    'footer.text': 'Pisik sevənlər üçün ❤️ ilə hazırlanıb'
  }
};

class CatFactsApp {
  private factCard: HTMLElement;
  private newFactBtn: HTMLButtonElement;
  private galleryGrid: HTMLElement;
  private modal: HTMLElement;
  private closeModalBtn: HTMLElement;
  private navLinks: NodeListOf<HTMLAnchorElement>;
  private pages: NodeListOf<HTMLElement>;
  private searchInput: HTMLInputElement;
  private searchBtn: HTMLButtonElement;
  private themeToggle: HTMLButtonElement;
  private backToTopBtn: HTMLButtonElement;
  private isLoading: boolean = false;
  private catBreeds: CatBreed[] = [];
  private catImages: Map<string, string> = new Map();
  private currentPage: number = 1;
  private itemsPerPage: number = 12;
  private filteredBreeds: CatBreed[] = [];
  private prevPageBtn: HTMLButtonElement;
  private nextPageBtn: HTMLButtonElement;
  private pageInfo: HTMLElement;
  private langToggle: HTMLButtonElement;
  private langDropdown: HTMLElement;
  private currentLang: string = 'en';
  private quizQuestions: QuizQuestion[] = [];
  private currentQuizQuestion: number = 0;
  private quizScore: number = 0;
  private personalityQuestions: PersonalityQuestion[] = [];
  private currentPersonalityQuestion: number = 0;
  private personalityTraits: string[] = [];
  private healthIssues: HealthIssue[] = [];
  private toys: Toy[] = [];
  private games: Game[] = [];

  constructor() {
    this.factCard = document.querySelector('.fact-card')!;
    this.newFactBtn = document.getElementById('new-fact-btn') as HTMLButtonElement;
    this.galleryGrid = document.querySelector('.gallery-grid')!;
    this.modal = document.getElementById('cat-modal')!;
    this.closeModalBtn = document.querySelector('.close-modal')!;
    this.navLinks = document.querySelectorAll('.nav-link');
    this.pages = document.querySelectorAll('.page');
    this.searchInput = document.getElementById('search-input') as HTMLInputElement;
    this.searchBtn = document.getElementById('search-btn') as HTMLButtonElement;
    this.themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
    this.backToTopBtn = document.getElementById('back-to-top') as HTMLButtonElement;
    this.prevPageBtn = document.getElementById('prev-page') as HTMLButtonElement;
    this.nextPageBtn = document.getElementById('next-page') as HTMLButtonElement;
    this.pageInfo = document.querySelector('.page-info') as HTMLElement;
    this.langToggle = document.getElementById('lang-toggle') as HTMLButtonElement;
    this.langDropdown = document.querySelector('.lang-dropdown') as HTMLElement;
    
    this.initializeEventListeners();
    this.initializeTheme();
    this.initializeLanguage();
    this.fetchNewFact();
    this.fetchCatBreeds();
  }

  private initializeEventListeners(): void {
    this.newFactBtn.addEventListener('click', () => this.fetchNewFact());
    this.closeModalBtn.addEventListener('click', () => this.closeModal());
    window.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Navigation event listeners
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        if (targetPage) {
          this.navigateToPage(targetPage);
        }
      });
    });

    // Search functionality
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleSearch();
      }
    });
    this.searchBtn.addEventListener('click', () => this.handleSearch());

    // Theme toggle
    this.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Back to top button
    window.addEventListener('scroll', () => this.handleScroll());
    this.backToTopBtn.addEventListener('click', () => this.scrollToTop());

    this.prevPageBtn.addEventListener('click', () => this.changePage(-1));
    this.nextPageBtn.addEventListener('click', () => this.changePage(1));

    // Language switcher
    this.langToggle.addEventListener('click', () => {
      this.langDropdown.classList.toggle('show');
    });
    
    document.querySelectorAll('.lang-option').forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        if (lang) {
          this.setLanguage(lang);
          this.langDropdown.classList.remove('show');
        }
      });
    });
    
    // Close language dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.langToggle.contains(e.target as Node) && !this.langDropdown.contains(e.target as Node)) {
        this.langDropdown.classList.remove('show');
      }
    });

    // Quiz event listeners
    document.getElementById('quiz-submit')?.addEventListener('click', () => this.handleQuizSubmit());
    document.getElementById('quiz-next')?.addEventListener('click', () => this.handleQuizNext());
    document.getElementById('quiz-restart')?.addEventListener('click', () => this.initializeQuiz());
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  private toggleTheme(): void {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  private updateThemeIcon(theme: string): void {
    this.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  private handleScroll(): void {
    if (window.scrollY > 300) {
      this.backToTopBtn.classList.add('visible');
    } else {
      this.backToTopBtn.classList.remove('visible');
    }
  }

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  private handleSearch(): void {
    const searchTerm = this.searchInput.value.toLowerCase();
    if (searchTerm.trim() === '') return;

    // Store the search term in localStorage
    localStorage.setItem('catSearchTerm', searchTerm);
    
    // Navigate to catalog page
    this.navigateToPage('catalog');
  }

  private navigateToPage(pageId: string): void {
    // Update active nav link
    this.navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-page') === pageId);
    });

    // Update active page
    this.pages.forEach(page => {
      page.classList.toggle('active', page.id === `${pageId}-page`);
    });

    // Scroll to top when changing pages
    this.scrollToTop();

    // Initialize page-specific content
    switch (pageId) {
      case 'quiz':
        this.initializeQuiz();
        break;
      case 'personality':
        this.initializePersonalityTest();
        break;
      case 'health':
        this.initializeHealthGuide();
        break;
      case 'toys':
        this.initializeToysAndGames();
        break;
      case 'catalog':
        // Check if there's a stored search term
        const searchTerm = localStorage.getItem('catSearchTerm');
        if (searchTerm) {
          this.searchInput.value = searchTerm;
          this.filteredBreeds = this.catBreeds.filter(breed => 
            breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            breed.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          this.currentPage = 1;
          this.updatePagination();
          this.renderCatGallery();
          // Clear the stored search term
          localStorage.removeItem('catSearchTerm');
        } else {
          this.filteredBreeds = [...this.catBreeds];
          this.updatePagination();
          this.renderCatGallery();
        }
        break;
    }
  }

  private async fetchNewFact(): Promise<void> {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.factCard.innerHTML = '<div class="loading">Loading...</div>';
    this.newFactBtn.disabled = true;

    try {
      const response = await fetch('https://catfact.ninja/fact');
      const data: CatFact = await response.json();
      
      // Add a fade effect
      this.factCard.style.opacity = '0';
      setTimeout(() => {
        this.factCard.innerHTML = `<p>${data.fact}</p>`;
        this.factCard.style.opacity = '1';
      }, 300);
    } catch (error) {
      this.factCard.innerHTML = '<p>Oops! Something went wrong. Please try again.</p>';
    } finally {
      this.isLoading = false;
      this.newFactBtn.disabled = false;
    }
  }

  private async fetchCatBreeds(): Promise<void> {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/breeds');
      this.catBreeds = await response.json();
      this.filteredBreeds = [...this.catBreeds];
      await this.fetchCatImages();
      this.updatePagination();
      this.renderCatGallery();
    } catch (error) {
      this.galleryGrid.innerHTML = '<p>Failed to load cat breeds. Please try again later.</p>';
    }
  }

  private async fetchCatImages(): Promise<void> {
    const imagePromises = this.catBreeds.map(async (breed) => {
      if (breed.reference_image_id) {
        try {
          const response = await fetch(`https://api.thecatapi.com/v1/images/${breed.reference_image_id}`);
          const imageData: CatImage = await response.json();
          this.catImages.set(breed.id, imageData.url);
        } catch (error) {
          console.error(`Failed to fetch image for breed ${breed.name}`);
        }
      }
    });

    await Promise.all(imagePromises);
  }

  private renderCatGallery(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const breedsToShow = this.filteredBreeds.slice(startIndex, endIndex);

    if (breedsToShow.length === 0) {
      this.galleryGrid.innerHTML = `<p>${this.t('catalog.no-results')}</p>`;
      return;
    }

    this.galleryGrid.innerHTML = breedsToShow
      .map(breed => `
        <div class="cat-card" data-breed-id="${breed.id}">
          <img src="${this.catImages.get(breed.id) || 'https://placekitten.com/400/300'}" alt="${breed.name}">
          <div class="cat-card-info">
            <h3>${breed.name}</h3>
          </div>
        </div>
      `)
      .join('');

    // Add click event listeners to cat cards
    document.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('click', () => {
        const breedId = card.getAttribute('data-breed-id');
        const breed = this.catBreeds.find(b => b.id === breedId);
        if (breed) {
          this.openModal(breed);
        }
      });
    });
  }

  private openModal(breed: CatBreed): void {
    const modalImage = document.getElementById('modal-cat-image') as HTMLImageElement;
    const modalName = document.getElementById('modal-cat-name')!;
    const modalOrigin = document.getElementById('modal-cat-origin')!;
    const modalTemperament = document.getElementById('modal-cat-temperament')!;
    const modalDescription = document.getElementById('modal-cat-description')!;

    modalImage.src = this.catImages.get(breed.id) || 'https://placekitten.com/400/300';
    modalName.textContent = breed.name;
    modalOrigin.textContent = `${this.t('modal.origin')} ${breed.origin}`;
    modalTemperament.textContent = `${this.t('modal.temperament')} ${breed.temperament}`;
    modalDescription.textContent = breed.description;

    this.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  private closeModal(): void {
    this.modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  private changePage(delta: number): void {
    const newPage = this.currentPage + delta;
    const maxPages = Math.ceil(this.filteredBreeds.length / this.itemsPerPage);
    
    if (newPage >= 1 && newPage <= maxPages) {
      this.currentPage = newPage;
      this.updatePagination();
      this.renderCatGallery();
    }
  }

  private updatePagination(): void {
    const maxPages = Math.ceil(this.filteredBreeds.length / this.itemsPerPage);
    
    this.prevPageBtn.disabled = this.currentPage === 1;
    this.nextPageBtn.disabled = this.currentPage === maxPages;
    
    this.pageInfo.textContent = `${this.t('pagination.page')} ${this.currentPage} ${this.t('pagination.of')} ${maxPages}`;
  }

  private initializeLanguage(): void {
    const savedLang = localStorage.getItem('language') || 'en';
    this.setLanguage(savedLang);
  }

  private setLanguage(lang: string): void {
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    this.updateLanguageUI();
    this.updateAllTexts();
  }

  private updateLanguageUI(): void {
    // Update active language option
    document.querySelectorAll('.lang-option').forEach(option => {
      option.classList.toggle('active', option.getAttribute('data-lang') === this.currentLang);
    });
  }

  private updateAllTexts(): void {
    // Update navigation
    document.querySelector('[data-page="facts"]')!.textContent = this.t('nav.facts');
    document.querySelector('[data-page="catalog"]')!.textContent = this.t('nav.catalog');
    
    // Update search placeholder
    this.searchInput.placeholder = this.t('search.placeholder');
    
    // Update facts page
    document.querySelector('#facts-page h1')!.textContent = this.t('facts.title');
    document.querySelector('#facts-page p')!.textContent = this.t('facts.subtitle');
    
    // Update catalog page
    document.querySelector('#catalog-page h1')!.textContent = this.t('catalog.title');
    document.querySelector('#catalog-page p')!.textContent = this.t('catalog.subtitle');
    
    // Update pagination
    this.prevPageBtn.textContent = this.t('pagination.prev');
    this.nextPageBtn.textContent = this.t('pagination.next');
    
    // Update footer
    document.querySelector('footer p')!.textContent = this.t('footer.text');
  }

  private t(key: string): string {
    return translations[this.currentLang][key] || translations['en'][key] || key;
  }

  private async initializeQuiz(): Promise<void> {
    // Sample quiz questions
    this.quizQuestions = [
      {
        question: "What is the largest domestic cat breed?",
        options: ["Maine Coon", "Persian", "Siamese", "British Shorthair"],
        correctAnswer: 0
      },
      {
        question: "How many hours do cats typically sleep per day?",
        options: ["8-10 hours", "12-14 hours", "16-18 hours", "20-22 hours"],
        correctAnswer: 2
      },
      {
        question: "What is a cat's normal body temperature?",
        options: ["97-99°F", "100-102.5°F", "103-105°F", "106-108°F"],
        correctAnswer: 1
      },
      {
        question: "How many whiskers does a cat typically have?",
        options: ["8-12", "12-18", "24-28", "40-50"],
        correctAnswer: 2
      },
      {
        question: "Which of these is toxic to cats?",
        options: ["Catnip", "Lilies", "Catmint", "Cat grass"],
        correctAnswer: 1
      },
      {
        question: "At what age do kittens typically open their eyes?",
        options: ["1-3 days", "7-10 days", "14-16 days", "21-24 days"],
        correctAnswer: 1
      },
      {
        question: "What is the average lifespan of an indoor cat?",
        options: ["8-11 years", "12-15 years", "15-18 years", "20-22 years"],
        correctAnswer: 1
      },
      {
        question: "Which sense is most developed in cats at birth?",
        options: ["Sight", "Hearing", "Smell", "Taste"],
        correctAnswer: 2
      }
    ];
    
    this.currentQuizQuestion = 0;
    this.quizScore = 0;
    this.updateQuizUI();
  }

  private updateQuizUI(): void {
    const question = this.quizQuestions[this.currentQuizQuestion];
    const progress = ((this.currentQuizQuestion + 1) / this.quizQuestions.length) * 100;
    
    (document.querySelector('.progress-bar') as HTMLElement).style.width = `${progress}%`;
    document.getElementById('quiz-score')!.textContent = this.quizScore.toString();
    document.getElementById('quiz-question')!.textContent = question.question;
    
    const optionsContainer = document.getElementById('quiz-options')!;
    optionsContainer.innerHTML = question.options.map((option, index) => `
      <div class="quiz-option" data-index="${index}">${option}</div>
    `).join('');

    // Add click event listeners to options
    const quizOptions = optionsContainer.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected class from all options
        quizOptions.forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
        // Enable submit button
        const submitButton = document.getElementById('quiz-submit') as HTMLButtonElement;
        submitButton.disabled = false;
      });
    });
    
    // Reset submit button state
    const submitButton = document.getElementById('quiz-submit') as HTMLButtonElement;
    submitButton.style.display = 'block';
    submitButton.disabled = true;
    
    // Hide next button
    const nextButton = document.getElementById('quiz-next') as HTMLButtonElement;
    nextButton.style.display = 'none';
  }

  private handleQuizSubmit(): void {
    const selectedOption = document.querySelector('.quiz-option.selected');
    if (!selectedOption) return;
    
    const selectedIndex = parseInt(selectedOption.getAttribute('data-index') || '0');
    const question = this.quizQuestions[this.currentQuizQuestion];
    
    // Disable all options after submission
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
      option.classList.add('disabled');
      const optionIndex = parseInt(option.getAttribute('data-index') || '0');
      if (optionIndex === question.correctAnswer) {
        option.classList.add('correct');
      } else if (optionIndex === selectedIndex) {
        option.classList.add('incorrect');
      }
    });

    if (selectedIndex === question.correctAnswer) {
      this.quizScore++;
      document.getElementById('quiz-score')!.textContent = this.quizScore.toString();
    }
    
    // Hide submit button and show next button
    const submitButton = document.getElementById('quiz-submit') as HTMLButtonElement;
    const nextButton = document.getElementById('quiz-next') as HTMLButtonElement;
    submitButton.style.display = 'none';
    nextButton.style.display = 'block';
  }

  private handleQuizNext(): void {
    this.currentQuizQuestion++;
    
    if (this.currentQuizQuestion < this.quizQuestions.length) {
      this.updateQuizUI();
    } else {
      this.showQuizResults();
    }
  }

  private showQuizResults(): void {
    const quizContainer = document.querySelector('.quiz-container') as HTMLElement;
    const resultsContainer = document.querySelector('.quiz-results') as HTMLElement;
    const scoreDisplay = resultsContainer.querySelector('.score-display')!;
    const resultsMessage = resultsContainer.querySelector('.results-message')!;
    
    scoreDisplay.textContent = `${this.quizScore}/${this.quizQuestions.length}`;
    resultsMessage.textContent = this.getQuizMessage();
    
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
  }

  private getQuizMessage(): string {
    const percentage = (this.quizScore / this.quizQuestions.length) * 100;
    if (percentage >= 90) return "Purrfect! You're a cat expert!";
    if (percentage >= 70) return "Great job! You know a lot about cats!";
    if (percentage >= 50) return "Not bad! Keep learning about cats!";
    return "Keep studying cats to improve your knowledge!";
  }

  private async initializePersonalityTest(): Promise<void> {
    // Sample personality questions
    this.personalityQuestions = [
      {
        question: "How do you prefer to spend your free time?",
        options: [
          { text: "Quiet activities at home", traits: ["calm", "independent", "reserved"] },
          { text: "Social gatherings with friends", traits: ["social", "friendly", "energetic"] },
          { text: "Active outdoor activities", traits: ["active", "adventurous", "playful"] },
          { text: "Learning new things", traits: ["curious", "intelligent", "focused"] }
        ]
      },
      {
        question: "What's your ideal living space?",
        options: [
          { text: "A cozy, quiet apartment", traits: ["calm", "reserved", "independent"] },
          { text: "A busy household with lots of activity", traits: ["social", "energetic", "playful"] },
          { text: "A spacious home with outdoor access", traits: ["active", "adventurous", "independent"] },
          { text: "A modern space with lots of gadgets", traits: ["curious", "intelligent", "focused"] }
        ]
      },
      {
        question: "How do you handle new situations?",
        options: [
          { text: "Observe carefully before engaging", traits: ["reserved", "intelligent", "calm"] },
          { text: "Jump right in enthusiastically", traits: ["adventurous", "energetic", "playful"] },
          { text: "Approach with curiosity", traits: ["curious", "friendly", "focused"] },
          { text: "Take it at my own pace", traits: ["independent", "calm", "reserved"] }
        ]
      },
      {
        question: "What's your preferred way to show affection?",
        options: [
          { text: "Quiet companionship", traits: ["reserved", "calm", "independent"] },
          { text: "Physical closeness and cuddles", traits: ["friendly", "social", "playful"] },
          { text: "Playing and being active together", traits: ["energetic", "adventurous", "playful"] },
          { text: "Sharing experiences", traits: ["curious", "social", "focused"] }
        ]
      },
      {
        question: "How do you react to unexpected changes?",
        options: [
          { text: "Need time to adjust", traits: ["reserved", "calm", "focused"] },
          { text: "Embrace the excitement", traits: ["adventurous", "energetic", "curious"] },
          { text: "Go with the flow", traits: ["friendly", "adaptable", "playful"] },
          { text: "Analyze the situation", traits: ["intelligent", "independent", "focused"] }
        ]
      }
    ];
    
    this.currentPersonalityQuestion = 0;
    this.personalityTraits = [];
    this.updatePersonalityUI();
  }

  private updatePersonalityUI(): void {
    const question = this.personalityQuestions[this.currentPersonalityQuestion];
    const progress = ((this.currentPersonalityQuestion + 1) / this.personalityQuestions.length) * 100;
    
    document.getElementById('personality-question')!.textContent = question.question;
    
    const optionsContainer = document.querySelector('.options-container')!;
    optionsContainer.innerHTML = question.options.map((option, index) => `
      <div class="personality-option" data-index="${index}">${option.text}</div>
    `).join('');

    // Add click event listeners to options
    const options = optionsContainer.querySelectorAll('.personality-option');
    options.forEach((option, index) => {
      option.addEventListener('click', () => {
        // Remove selected class from all options
        options.forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
        // Handle the answer after a short delay for animation
        setTimeout(() => this.handlePersonalityAnswer(index), 500);
      });
    });
    
    // Update progress dots
    const progressDots = document.querySelector('.progress-dots')!;
    progressDots.innerHTML = this.personalityQuestions.map((_, index) => `
      <div class="progress-dot ${index === this.currentPersonalityQuestion ? 'active' : ''}"></div>
    `).join('');
  }

  private handlePersonalityAnswer(index: number): void {
    const question = this.personalityQuestions[this.currentPersonalityQuestion];
    this.personalityTraits.push(...question.options[index].traits);
    
    this.currentPersonalityQuestion++;
    
    if (this.currentPersonalityQuestion < this.personalityQuestions.length) {
      this.updatePersonalityUI();
    } else {
      this.showPersonalityResults();
    }
  }

  private showPersonalityResults(): void {
    const resultsContainer = document.querySelector('.personality-results')!;
    const matchContent = resultsContainer.querySelector('.match-content')!;
    
    // Find the most common traits
    const traitCounts = this.personalityTraits.reduce((acc, trait) => {
      acc[trait] = (acc[trait] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantTraits = Object.entries(traitCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([trait]) => trait);
    
    // Find matching cat breed based on traits
    const matchingBreed = this.findMatchingBreed(dominantTraits);
    
    matchContent.innerHTML = `
      <div class="match-breed">${matchingBreed.name}</div>
      <div class="match-description">${matchingBreed.description}</div>
      <div class="personality-traits">
        ${dominantTraits.map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
      </div>
      <button class="btn share-match">Share Your Match</button>
    `;
    
    (document.querySelector('.personality-quiz') as HTMLElement).style.display = 'none';
    (resultsContainer as HTMLElement).style.display = 'block';
  }

  private findMatchingBreed(traits: string[]): CatBreed {
    // Find a breed that matches the most traits
    const breedMatches = this.catBreeds.map(breed => ({
      breed,
      matches: traits.filter(trait => 
        breed.temperament.toLowerCase().includes(trait.toLowerCase())
      ).length
    }));

    // Sort by number of matching traits
    breedMatches.sort((a, b) => b.matches - a.matches);

    // Return the best match or a default breed if no matches
    return breedMatches[0]?.breed || this.catBreeds[0];
  }

  private async initializeHealthGuide(): Promise<void> {
    // Sample health issues
    this.healthIssues = [
      {
        name: "Obesity",
        description: "A common health issue in cats that can lead to various complications including diabetes, joint problems, and heart disease.",
        symptoms: [
          "Weight gain and difficulty feeling ribs",
          "Difficulty moving or jumping",
          "Lethargy and reduced activity",
          "Excessive panting",
          "Difficulty grooming"
        ],
        prevention: [
          "Measure food portions carefully",
          "Provide regular exercise and playtime",
          "Avoid free-feeding",
          "Use puzzle feeders for mental stimulation",
          "Regular weight monitoring"
        ]
      },
      {
        name: "Dental Disease",
        description: "Dental problems are common in cats and can lead to serious health issues if left untreated.",
        symptoms: [
          "Bad breath",
          "Difficulty eating",
          "Red or swollen gums",
          "Drooling",
          "Pawing at the mouth"
        ],
        prevention: [
          "Regular dental check-ups",
          "Daily tooth brushing",
          "Dental treats and toys",
          "Professional cleaning when needed",
          "Monitor eating habits"
        ]
      },
      {
        name: "Kidney Disease",
        description: "Chronic kidney disease is common in older cats and requires careful management.",
        symptoms: [
          "Increased thirst and urination",
          "Weight loss",
          "Poor appetite",
          "Vomiting",
          "Lethargy"
        ],
        prevention: [
          "Regular veterinary check-ups",
          "Fresh water always available",
          "Balanced diet",
          "Monitor water intake",
          "Early detection through blood tests"
        ]
      },
      {
        name: "Upper Respiratory Infections",
        description: "Common viral infections that can affect cats of all ages, especially in multi-cat households.",
        symptoms: [
          "Sneezing and coughing",
          "Runny nose and eyes",
          "Fever",
          "Loss of appetite",
          "Lethargy"
        ],
        prevention: [
          "Regular vaccinations",
          "Clean living environment",
          "Proper ventilation",
          "Stress reduction",
          "Quarantine new cats"
        ]
      }
    ];
    
    this.renderHealthGuide();
  }

  private renderHealthGuide(): void {
    const healthIssuesContainer = document.querySelector('.health-issues')!;
    healthIssuesContainer.innerHTML = `
      <div class="health-intro">
        <h2>Cat Health Guide</h2>
        <p>Learn about common health issues in cats, their symptoms, and prevention methods. Regular veterinary check-ups are essential for maintaining your cat's health.</p>
      </div>
      <div class="health-grid">
        ${this.healthIssues.map(issue => `
          <div class="health-card">
            <h3>${issue.name}</h3>
            <p class="health-description">${issue.description}</p>
            <div class="health-symptoms">
              <h4>Symptoms</h4>
              <ul>${issue.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}</ul>
            </div>
            <div class="health-prevention">
              <h4>Prevention</h4>
              <ul>${issue.prevention.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="health-tips">
        <h2>General Health Tips</h2>
        <div class="tips-grid">
          <div class="tip-card">
            <h4>Regular Check-ups</h4>
            <p>Schedule annual veterinary visits for routine check-ups and vaccinations.</p>
          </div>
          <div class="tip-card">
            <h4>Proper Nutrition</h4>
            <p>Feed your cat a balanced diet appropriate for their age and health status.</p>
          </div>
          <div class="tip-card">
            <h4>Exercise</h4>
            <p>Provide regular playtime and exercise to maintain physical and mental health.</p>
          </div>
          <div class="tip-card">
            <h4>Grooming</h4>
            <p>Regular grooming helps maintain coat health and allows early detection of skin issues.</p>
          </div>
        </div>
      </div>
    `;
  }

  private async initializeToysAndGames(): Promise<void> {
    // Sample toys and games
    this.toys = [
      {
        name: "DIY Cat Wand",
        description: "A simple and engaging wand toy that will keep your cat entertained for hours.",
        materials: [
          "Wooden dowel or stick (12-18 inches)",
          "String or yarn (2-3 feet)",
          "Feathers or small toy",
          "Hot glue gun",
          "Scissors"
        ],
        instructions: [
          "Cut the string to desired length",
          "Attach feathers or toy to one end of the string",
          "Secure the other end to the stick with hot glue",
          "Let the glue dry completely before use"
        ],
        image: "https://weallsew.com/wp-content/uploads/sites/4/2023/06/Cat-Toy-Mouse-Tutorial-by-Erika-Mulvenna-11.jpg"
      },
      {
        name: "Cardboard Cat Maze",
        description: "Create an exciting maze for your cat to explore and play in.",
        materials: [
          "Large cardboard boxes",
          "Scissors or box cutter",
          "Tape",
          "Cat treats",
          "Small toys"
        ],
        instructions: [
          "Cut holes in the sides of boxes",
          "Arrange boxes to create a maze",
          "Secure boxes with tape",
          "Add treats and toys inside",
          "Let your cat explore!"
        ],
        image: "https://www.awesomeinventions.com/wp-content/uploads/2015/05/cats-maze.jpg"
      },
      {
        name: "Pom-Pom Cat Toy",
        description: "A lightweight, bouncy toy perfect for batting and chasing.",
        materials: [
          "Yarn in various colors",
          "Scissors",
          "Cardboard for template",
          "Needle and thread"
        ],
        instructions: [
          "Cut two cardboard circles with center holes",
          "Wrap yarn around the circles",
          "Cut yarn around the edges",
          "Tie yarn in the middle",
          "Remove cardboard and fluff"
        ],
        image: "https://images.squarespace-cdn.com/content/v1/5c6467680cf57d95a64743db/1618328994450-N4WPNDVB14548VESBZSS/glitter_pom_pom_cat-_toy.jpg?format=1000w"
      }
    ];
    
    this.games = [
      {
        name: "Laser Pointer Chase",
        description: "A classic game that provides great exercise for your cat.",
        instructions: [
          "Use a laser pointer in a safe area",
          "Move the dot slowly at first",
          "Create interesting patterns",
          "Let your cat catch the dot occasionally",
          "End with a treat or toy reward"
        ],
        image: "https://cdn.mos.cms.futurecdn.net/vuBezxjtXV3xuDuXqeNDgL-1200-80.png"
      },
      {
        name: "Treat Hunt",
        description: "A mentally stimulating game that taps into your cat's hunting instincts.",
        instructions: [
          "Hide treats around the room",
          "Start with easy-to-find spots",
          "Gradually increase difficulty",
          "Use different types of treats",
          "Praise your cat for finding treats"
        ],
        image: "https://catamazing.com/cdn/shop/files/MEGA-two-cats-4-joanne-square-480_480x480.jpg?v=1646408420"
      },
      {
        name: "Box Fort Adventure",
        description: "Transform cardboard boxes into an exciting play area.",
        instructions: [
          "Collect various sized boxes",
          "Create tunnels and hideouts",
          "Add toys and treats inside",
          "Let your cat explore and play",
          "Change the layout regularly"
        ],
        image: "https://static.boredpanda.com/blog/wp-content/uploads/2018/02/Boxes-of-cardboard-are-transformed-into-cat-cabins-and-the-result-is-lovely-5a8d3007334b1__880.jpg"
      }
    ];
    
    this.renderToysAndGames();
  }

  private renderToysAndGames(): void {
    const toysGrid = document.querySelector('.toys-grid')!;
    toysGrid.innerHTML = this.toys.map(toy => `
      <div class="toy-card">
        <img src="${toy.image}" alt="${toy.name}" class="toy-image">
        <div class="toy-content">
          <h3 class="toy-title">${toy.name}</h3>
          <p class="toy-description">${toy.description}</p>
          <div class="toy-materials">
            <h4>Materials:</h4>
            <ul>${toy.materials.map(material => `<li>${material}</li>`).join('')}</ul>
          </div>
          <div class="toy-instructions">
            <h4>Instructions:</h4>
            <ol>${toy.instructions.map(instruction => `<li>${instruction}</li>`).join('')}</ol>
          </div>
        </div>
      </div>
    `).join('');
    
    const gamesGrid = document.querySelector('.games-grid')!;
    gamesGrid.innerHTML = this.games.map(game => `
      <div class="game-card">
        <img src="${game.image}" alt="${game.name}" class="game-image">
        <div class="game-content">
          <h3 class="game-title">${game.name}</h3>
          <p class="game-description">${game.description}</p>
          <div class="game-instructions">
            <h4>How to Play:</h4>
            <ol>${game.instructions.map(instruction => `<li>${instruction}</li>`).join('')}</ol>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CatFactsApp();
});

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
