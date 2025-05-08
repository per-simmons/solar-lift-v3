const fs = require('fs');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');

// Directories
const POSTS_DIR = path.join(__dirname, 'blog', 'posts');
const BLOG_DIR = path.join(__dirname, 'blog');
const TEMPLATE_DIR = path.join(__dirname, 'templates');

// Ensure blog directory exists
if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
}

// Read post template
const postTemplatePath = path.join(TEMPLATE_DIR, 'post-template.html');
const postTemplate = fs.readFileSync(postTemplatePath, 'utf8');

// Function to replace template variables
function renderTemplate(template, data) {
  let result = template;
  
  // Replace {{{content}}} first (triple braces for unescaped HTML)
  if (data.content) {
    result = result.replace('{{{content}}}', data.content);
  }
  
  // Replace all other {{variables}}
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key]);
  });
  
  return result;
}

// Process all markdown files
function processMarkdownFiles() {
  const posts = [];
  
  // Read all markdown files in the posts directory
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  
  files.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse front matter and content
    const { data, content } = matter(fileContent);
    
    // Convert markdown to HTML
    const htmlContent = marked.parse(content);
    
    // Create post data
    const postData = {
      title: data.title,
      author: data.author,
      date: data.date,
      image: data.image,
      slug: data.slug,
      content: htmlContent
    };
    
    // Add to posts array for index generation
    posts.push(postData);
    
    // Generate HTML file for this post
    const postHtml = renderTemplate(postTemplate, postData);
    const outputPath = path.join(BLOG_DIR, `${data.slug}.html`);
    fs.writeFileSync(outputPath, postHtml);
    
    console.log(`Generated: ${outputPath}`);
  });
  
  return posts;
}

// Generate blog index page
function generateBlogIndex(posts) {
  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Create HTML for each post entry
  const postsHtml = posts.map(post => `
    <article class="blog-post-preview">
      <div class="post-image-placeholder"></div>
      <div class="post-content">
        <div class="post-meta">
          <span class="post-category">Outreach</span>
          <time datetime="${post.date}">${post.date}</time>
        </div>
        <h2>${post.title}</h2>
        <p class="post-description">Discover how to get more deals closed and grow your solar business, using proven sales tactics backed by hundreds of successful lead gen campaigns</p>
      </div>
    </article>
  `).join('');
  
  // Create index data
  const indexData = {
    title: 'Solar Lift Blog',
    author: '',
    date: '',
    image: '',
    content: `
      <div class="blog-container">
        <div class="blog-header">
          <h1>Solar Lift Blog</h1>
          <p class="blog-intro">Discover how to get more deals closed and grow your solar business, using proven sales tactics backed by hundreds of successful lead gen campaigns</p>
        </div>
        
        <!-- Add this new section -->
        <div class="popular-posts-section">
          <div class="section-header">
            <h2>Most Popular Posts</h2>
          </div>
          
          <div class="posts-layout">
            <!-- Featured post (left column) -->
            <div class="featured-post">
              <div class="post-card">
                <div class="post-image-container">
                  <div class="post-image-placeholder"></div>
                  <div class="reading-time">
                    <span class="time-icon"><i class="fas fa-clock"></i></span>
                    <span>10 m</span>
                  </div>
                </div>
                <div class="post-content">
                  <h3><a href="/blog/solar-panel-efficiency.html">What are B2B cold email response rates? Solar Lift's 2025 study</a></h3>
                  <p class="post-excerpt">This study analyzed over 7.5 million client emails sent across 40 industries from March 2024 to February 2025. Check out our major findings on reply rate benchmarks and the drivers behind them.</p>
                  <div class="post-meta">
                    <div class="category-tag">Outreach</div>
                    <span class="dot-separator"></span>
                    <span class="post-date">May 5, 2025</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- List of smaller posts (right column) -->
            <div class="post-list">
              <!-- First small post -->
              <div class="small-post">
                <div class="post-thumbnail">
                  <div class="post-image-placeholder yellow"></div>
                </div>
                <div class="post-summary">
                  <h3><a href="/blog/commercial-solar-roi.html">B2B appointment setting costs and pricing models explained</a></h3>
                  <div class="post-meta">
                    <div class="category-tag">Sales</div>
                    <div class="meta-info">
                      <span class="post-date">Jan 15, 2025</span>
                      <span class="dot-separator"></span>
                      <span class="reading-time">13 m</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Second small post -->
              <div class="small-post">
                <div class="post-thumbnail">
                  <div class="post-image-placeholder orange"></div>
                </div>
                <div class="post-summary">
                  <h3><a href="/blog/solar-tax-credits.html">How to create a B2B lead generation funnel (examples included)</a></h3>
                  <div class="post-meta">
                    <div class="category-tag">Lead generation</div>
                    <div class="meta-info">
                      <span class="post-date">May 1, 2025</span>
                      <span class="dot-separator"></span>
                      <span class="reading-time">14 m</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Third small post -->
              <div class="small-post">
                <div class="post-thumbnail">
                  <div class="post-image-placeholder green"></div>
                </div>
                <div class="post-summary">
                  <h3><a href="/blog/solar-battery-storage.html">How to outsource appointment setting to a company</a></h3>
                  <div class="post-meta">
                    <div class="category-tag">Sales</div>
                    <div class="meta-info">
                      <span class="post-date">April 28, 2025</span>
                      <span class="dot-separator"></span>
                      <span class="reading-time">11 m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="view-all-container">
            <a href="/blog" class="view-all-button">
              Read all posts
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `
  };
  
  // Generate HTML file for the index
  const indexHtml = renderTemplate(postTemplate, indexData);
  const outputPath = path.join(BLOG_DIR, 'index.html');
  fs.writeFileSync(outputPath, indexHtml);
  
  console.log(`Generated: ${outputPath}`);
}

// Generate 404 page
function generate404Page() {
  // Create 404 data
  const notFoundData = {
    title: 'Post Not Found',
    author: '',
    date: '',
    image: '',
    content: `
      <h1>Post Not Found</h1>
      <p>Sorry, the blog post you're looking for doesn't exist.</p>
      <p><a href="/blog/index.html">Return to Blog Index</a></p>
    `
  };
  
  // Generate HTML file for 404 page
  const notFoundHtml = renderTemplate(postTemplate, notFoundData);
  const outputPath = path.join(BLOG_DIR, '404.html');
  fs.writeFileSync(outputPath, notFoundHtml);
  
  console.log(`Generated: ${outputPath}`);
}

// Main execution
try {
  console.log('Building blog...');
  const posts = processMarkdownFiles();
  generateBlogIndex(posts);
  generate404Page();
  console.log('Blog build completed successfully!');
} catch (error) {
  console.error('Error building blog:', error);
}
