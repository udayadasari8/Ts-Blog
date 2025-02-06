function openForm(): void {
    document.getElementById('form')!.style.display = 'block';
}

function closeForm(): void {
    // event.preventDefault();
    document.getElementById('form')!.style.display = 'none';
}

function submitForm(event: Event): void {
    event.preventDefault();
    const auth = (document.getElementById('textauthor') as HTMLInputElement).value.trim();
    const text = (document.getElementById('textblog') as HTMLTextAreaElement).value.trim();

    if (!auth || !text) {
        alert("Please fill in both fields.");
        return;
    }

    displayBlog(auth, text);
    saveBlog(auth, text);
    closeForm();
    resetForm();
}

function resetForm(): void {
    (document.getElementById('textauthor') as HTMLInputElement).value = "";
    (document.getElementById('textblog') as HTMLTextAreaElement).value = "";
}

function displayBlog(auth: string, text: string, views: number = 0): void {
    const blogsContainer = document.getElementById('blogsContainer')!;
    const newBlogDiv = document.createElement('div');
    newBlogDiv.className = 'p-4 bg-blue-100 border border-blue-300 rounded-lg mb-4';

    newBlogDiv.innerHTML = `
        <div class="auth"><strong>Author:</strong> ${auth}</div>
        <button onclick="showBlog(this)" class="rounded-lg bg-blue-500 text-white mt-2">View Blog</button>
        <div class="blog-content mt-2 p-2 bg-white rounded-lg border border-gray-300" style="display: none;">
            <strong>Blog:</strong> <p>${text}</p>
        </div>
        <strong>Views:</strong> <span class="view-count">${views}</span><br>
        <button onclick="editBlog(this)" class="rounded-lg bg-yellow-500 text-white mt-2">Edit</button>
        <button onclick="deleteBlog(this)" class="rounded-lg bg-red-500 text-white mt-2">Delete</button>
    `;
    blogsContainer.appendChild(newBlogDiv);
}

function showBlog(button: HTMLElement): void {
    const blogContent = button.nextElementSibling as HTMLElement;
    if (blogContent.style.display === 'none') {
        blogContent.style.display = 'block';
        incrementViews(button.parentElement as HTMLElement);
    } else {
        blogContent.style.display = 'none';
    }
}

function saveBlog(auth: string, text: string): void {
    let blogs = JSON.parse(localStorage.getItem('blogs') || '[]') as { auth: string, text: string, views: number }[];
    blogs.push({ auth, text, views: 0 });
    localStorage.setItem('blogs', JSON.stringify(blogs));
}

function loadBlogs(): void {
    let blogs = JSON.parse(localStorage.getItem('blogs') || '[]') as { auth: string, text: string, views: number }[];
    blogs.forEach(blog => displayBlog(blog.auth, blog.text, blog.views));
}

function editBlog(button: HTMLElement): void {
    const blogDiv = button.parentElement as HTMLElement;
    const auth = blogDiv.querySelector('.auth')!.innerText.replace('Author: ', '');
    const text = blogDiv.querySelector('.blog-content p')!.innerText;

    (document.getElementById('textauthor') as HTMLInputElement).value = auth;
    (document.getElementById('textblog') as HTMLTextAreaElement).value = text;

    deleteBlog(button);
    openForm();
}

function deleteBlog(button: HTMLElement): void {
    const blogDiv = button.parentElement as HTMLElement;
    blogDiv.remove();
    updateLocalStorage();
}

function updateLocalStorage(): void {
    const blogsContainer = document.getElementById('blogsContainer')!;
    const blogDivs = blogsContainer.children;
    let blogs: { auth: string, text: string, views: number }[] = [];

    for (let blogDiv of blogDivs) {
        const auth = (blogDiv.querySelector('.auth') as HTMLElement).innerText.replace('Author: ', '');
        const text = (blogDiv.querySelector('.blog-content p') as HTMLElement).innerText;
        const views = parseInt((blogDiv.querySelector('.view-count') as HTMLElement).innerText);
        blogs.push({ auth, text, views });
    }

    localStorage.setItem('blogs', JSON.stringify(blogs));
}

function incrementViews(blogDiv: HTMLElement): void {
    const viewCountSpan = blogDiv.querySelector('.view-count') as HTMLElement;
    let views = parseInt(viewCountSpan.innerText) + 1;
    viewCountSpan.innerText = views.toString();

    updateLocalStorage();
}

function clearAllBlogs(): void {
    if (confirm("Are you sure you want to delete all blogs?")) {
        localStorage.removeItem('blogs');
        document.getElementById('blogsContainer')!.innerHTML = "";
    }
}

document.addEventListener('DOMContentLoaded', loadBlogs);
