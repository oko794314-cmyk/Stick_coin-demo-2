/**
 * News Module - Business Logic
 */

export class NewsLogic {
  constructor() {
    this.news = [];
  }

  async fetchNews(category = 'all') {
    try {
      // Fetch from API
      return this.news;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  filterByCategory(category) {
    if (category === 'all') return this.news;
    return this.news.filter(item => item.category === category);
  }
}
