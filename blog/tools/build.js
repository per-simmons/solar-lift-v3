const fs = require('fs');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');

// Directories
const POSTS_DIR = path.join(__dirname, '..', 'posts');
const BLOG_DIR = path.join(__dirname, '..', 'blog');
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
    <article>
      <a href="/blog/${post.slug}.html">${post.title}</a>
      <time>${post.date}</time> by <em>${post.author}</em>
    </article>
  `).join('');
  
  // Create index data
  const indexData = {
    title: 'Solar Lift Blog',
    content: `
      <h1>Solar Lift Blog</h1>
      <div class="blog-posts">
        ${postsHtml}
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
