import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as db from '../db';

describe('Article Database Operations', () => {
  let testArticleId: number;

  beforeAll(async () => {
    // Ensure database connection is available
    const database = await db.getDb();
    expect(database).toBeDefined();
  });

  it('should create a new article', async () => {
    const newArticle = {
      title: 'Test Article',
      slug: 'test-article-' + Date.now(),
      content: 'This is a test article content.',
      excerpt: 'Test excerpt',
      category: 'fashion',
      featuredImage: '/assets/test.jpg',
      authorId: 1,
      published: 0,
      publishedAt: null,
    };

    const result = await db.createArticle(newArticle);
    expect(result).toBeDefined();
    
    // Verify the article was created by fetching it
    const createdArticle = await db.getArticleBySlug(newArticle.slug);
    expect(createdArticle).toBeDefined();
    expect(createdArticle?.title).toBe(newArticle.title);
    expect(createdArticle?.slug).toBe(newArticle.slug);
    
    testArticleId = createdArticle!.id;
  });

  it('should retrieve an article by slug', async () => {
    const article = await db.getArticleBySlug('test-article-' + testArticleId);
    expect(article).toBeDefined();
    if (article) {
      expect(article.id).toBe(testArticleId);
    }
  });

  it('should retrieve all articles', async () => {
    const articles = await db.getAllArticles(false);
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);
  });

  it('should retrieve articles by category', async () => {
    const fashionArticles = await db.getArticlesByCategory('fashion', false);
    expect(Array.isArray(fashionArticles)).toBe(true);
    fashionArticles.forEach(article => {
      expect(article.category).toBe('fashion');
    });
  });

  it('should update an article', async () => {
    await db.updateArticle(testArticleId, {
      title: 'Updated Test Article',
      published: 1,
    });

    const updatedArticle = await db.getArticleById(testArticleId);
    expect(updatedArticle).toBeDefined();
    expect(updatedArticle?.title).toBe('Updated Test Article');
    expect(updatedArticle?.published).toBe(1);
  });

  it('should filter published articles only', async () => {
    const publishedArticles = await db.getAllArticles(true);
    expect(Array.isArray(publishedArticles)).toBe(true);
    publishedArticles.forEach(article => {
      expect(article.published).toBe(1);
    });
  });

  afterAll(async () => {
    // Clean up test article
    if (testArticleId) {
      await db.deleteArticle(testArticleId);
    }
  });
});
