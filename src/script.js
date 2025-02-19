class Gallery {
    constructor() {
        this.gallery = document.getElementById('gallery');
        this.loadMoreBtn = document.getElementById('loadMore');
        this.clearGalleryBtn = document.getElementById('clearGallery');
        this.removeLastBtn = document.getElementById('removeLastImage');
        this.reverseGalleryBtn = document.getElementById('reverseGallery');
        
        this.page = 1;
        this.imagesPerLoad = 4;
        this.images = [];
        
        this.initializeEventListeners();
        this.loadInitialImages();
    }
    
    initializeEventListeners() {
        this.loadMoreBtn.addEventListener('click', () => this.loadMoreImages());
        this.clearGalleryBtn.addEventListener('click', () => this.clearGallery());
        this.removeLastBtn.addEventListener('click', () => this.removeLastImage());
        this.reverseGalleryBtn.addEventListener('click', () => this.reverseGallery());
    }
    
    async fetchImages() {
        try {
            const response = await fetch(`https://picsum.photos/v2/list?page=${this.page}&limit=${this.imagesPerLoad}`);
            if (!response.ok) throw new Error('Помилка завантаження зображень');
            return await response.json();
        } catch (error) {
            console.error('Помилка:', error);
            return [];
        }
    }
    
    async loadInitialImages() {
        const newImages = await this.fetchImages();
        this.images = newImages;
        this.renderGallery();
    }
    
    async loadMoreImages() {
        this.page++;
        const newImages = await this.fetchImages();
        this.images = [...this.images, ...newImages];
        this.renderGallery();
    }
    
    clearGallery() {
        this.images = [];
        this.renderGallery();
    }
    
    removeLastImage() {
        if (this.images.length > 0) {
            this.images.pop();
            this.renderGallery();
        }
    }
    
    reverseGallery() {
        this.images.reverse();
        this.renderGallery();
    }
    
    renderGallery() {
        this.gallery.innerHTML = '';
        this.images.forEach(image => {
            const img = document.createElement('img');
            img.src = image.download_url;
            img.alt = `Фото від ${image.author}`;
            img.title = `Автор: ${image.author}`;
            this.gallery.appendChild(img);
        });
        

        this.updateButtonStates();
    }
    
    updateButtonStates() {
        const hasImages = this.images.length > 0;
        this.clearGalleryBtn.disabled = !hasImages;
        this.removeLastBtn.disabled = !hasImages;
        this.reverseGalleryBtn.disabled = !hasImages;
        

        [this.clearGalleryBtn, this.removeLastBtn, this.reverseGalleryBtn].forEach(btn => {
            btn.style.opacity = hasImages ? '1' : '0.5';
            btn.style.cursor = hasImages ? 'pointer' : 'not-allowed';
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});
