/**
 * News Module - UI Component
 */

export class NewsUI {
  constructor() {
    this.container = null;
  }

  render(container, newsItems = []) {
    this.container = container;
    const newsHTML = newsItems.map(item => `
      <div class="news-item">
        <h3>${item.title}</h3>
        <p class="news-date">${new Date(item.date).toLocaleDateString()}</p>
        <p class="news-content">${item.content}</p>
        <a href="#" class="news-link">Read more</a>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="news-module">
        <h2>News</h2>
        <div class="news-list">${newsHTML || '<p>No news available</p>'}</div>
      </div>
    `;
  }
}
