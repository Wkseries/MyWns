(function() {
    const initGallery = () => {
        if (typeof animes === 'undefined') return;
        const track = document.getElementById('anislider-galleryTrack');
        const viewport = document.querySelector('.anislider-gallery-viewport');
        if (!track || !viewport) return;

        const localAnimeData = animes.map(item => ({ 
            name: item.name,
            poster: item.poster, 
            hook: item.hook || "",
            quote: item.quote || "",
            rating: item.rating || "",
            episodes: item.episodes || "",
            studio: item.studio || "",
            genre: item.genre || "",
            description: item.description || "",
            watch: item.watch || "",
            laugh: item.laugh || "",
            trailer: item.trailer || "",
            spotify: item.spotify || "",
            alt: item.alt || ""
        }));
        
        const getItemsToShow = () => (window.innerWidth <= 1024) ? 3 : 5;
        
        let itemsToShow = getItemsToShow();
        let step = 100 / itemsToShow;
        let index = itemsToShow;
        let isDragging = false, startPos, dragOffset = 0;
        let currentIndex = 0;
        const posterHeight = 160;
        const gap = 10;

        const render = (data) => data.map(item => `
            <div class="anislider-poster-item">
                <div class="anislider-poster-link" onclick="anisliderOpenModal('${item.name.replace(/'/g, "\\'")}')">
                    <img src="${item.poster}" alt="${item.name}" draggable="false">
                    <div class="anislider-poster-info-overlay">
                        <div class="anislider-poster-title">${item.name}</div>
                        <div class="anislider-poster-hook">${item.hook}</div>
                    </div>
                </div>
            </div>`).join('');

        const refreshTrack = () => {
            if (window.innerWidth <= 768) {
                track.innerHTML = render(localAnimeData);
                track.style.transform = "none";
                return;
            }
            itemsToShow = getItemsToShow();
            step = 100 / itemsToShow;
            const clonesBefore = localAnimeData.slice(-itemsToShow);
            const clonesAfter = localAnimeData.slice(0, itemsToShow);
            track.innerHTML = render([...clonesBefore, ...localAnimeData, ...clonesAfter]);
            updatePos(false);
        };

        const updatePos = (animate = true) => {
            if (window.innerWidth <= 768) return;
            track.style.transition = animate ? "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)" : "none";
            const finalPercent = -(index * step) + (dragOffset / track.offsetWidth * 100);
            track.style.transform = `translate3d(${finalPercent}%, 0, 0)`;
        };

        window.anisliderShiftGallery = (dir) => { 
            if (document.body.classList.contains('anislider-modal-open')) return;
            if (window.innerWidth <= 768) {
                const v = document.querySelector('.anislider-gallery-viewport');
                currentIndex += dir;
                if (currentIndex < 0) currentIndex = localAnimeData.length - 1;
                if (currentIndex >= localAnimeData.length) currentIndex = 0;
                const scrollTop = currentIndex * (posterHeight + gap);
                v.scrollTo({ top: scrollTop, behavior: 'smooth' });
            } else {
                index += (dir * itemsToShow); 
                updatePos(); 
            }
        };

        const startDrag = (e) => {
            if (window.innerWidth <= 768 || document.body.classList.contains('anislider-modal-open')) return;
            isDragging = true;
            startPos = e.touches ? e.touches[0].pageX : e.pageX;
            track.style.transition = "none";
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            dragOffset = (e.touches ? e.touches[0].pageX : e.pageX) - startPos;
            updatePos(false);
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            const dragInItems = dragOffset / (track.offsetWidth / itemsToShow);
            if (Math.abs(dragInItems) > 0.1) index -= dragInItems > 0 ? itemsToShow : -itemsToShow;
            index = Math.round(index / itemsToShow) * itemsToShow;
            dragOffset = 0;
            updatePos(true);
        };

        track.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', endDrag);
        track.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('resize', refreshTrack);
        track.addEventListener('transitionend', () => {
            if (window.innerWidth <= 768) return;
            if (index >= localAnimeData.length + itemsToShow) index = itemsToShow;
            if (index <= 0) index = localAnimeData.length;
            updatePos(false);
        });
        refreshTrack();
    };

    window.anisliderOpenModal = (name) => {
        const data = animes.find(a => a.name === name);
        if (!data) return;

        document.body.classList.add('anislider-modal-open');
        const modalContent = document.getElementById('anislider-modalContent');
        
        modalContent.innerHTML = `
            <div class="w-[45%] h-full bg-cover bg-center border-r border-white/5 shrink-0 flex items-center justify-center bg-zinc-900" 
                 style="background-image: url('${data.poster}')">
                 <img src="${data.poster}" class="hidden" onerror="this.parentElement.innerHTML='<div class=\'p-10 text-center\'><span class=\'text-zinc-500 font-black uppercase tracking-widest\'>${data.alt || data.name}</span></div>'">
            </div>
            <div class="w-[55%] h-full flex flex-col p-12 relative bg-zinc-950/20 overflow-hidden">
                <div class="anislider-modal-scroll-area flex-grow">
                    <h2 class="text-5xl font-black text-white mb-2 uppercase tracking-tighter leading-none">${data.name}</h2>
                    <p class="text-zinc-400 italic text-sm mb-8 border-l-2 border-orange-500/50 pl-4 font-medium">"${data.quote || ''}"</p>
                    
                    <div class="flex flex-wrap gap-8 mb-4 items-center">
                        <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Rating</span><span class="text-orange-500 font-black text-2xl">${data.rating}</span></div>
                        <div class="w-px h-8 bg-zinc-800"></div>
                        <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Episodes</span><span class="text-white font-black text-2xl">${data.episodes || '??'}</span></div>
                        <div class="w-px h-8 bg-zinc-800"></div>
                        <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Studio</span><span class="text-white font-black text-2xl">${data.studio}</span></div>
                    </div>

                    <div class="flex flex-wrap gap-2 mb-10">
                        ${data.genre ? data.genre.split('•').map(g => `<span class="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-zinc-300 uppercase font-bold">${g.trim()}</span>`).join('') : ''}
                    </div>

                    <div class="space-y-4 mb-8">
                        <h3 class="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em]">Storyline</h3>
                        <p class="text-zinc-300 text-lg italic leading-relaxed">"${data.description}"</p>
                    </div>

                    <div class="space-y-6 mb-10">
                        ${data.trailer ? `<div class="rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl"><iframe width="100%" height="100%" src="${data.trailer}" frameborder="0" allowfullscreen></iframe></div>` : ''}
                        ${data.spotify ? `<div class="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"><iframe src="${data.spotify}" width="100%" height="462" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>` : ''}
                    </div>
                </div>

                <div class="pt-8 border-t border-white/5 flex items-center gap-3 mt-auto shrink-0 w-full">
                    <button onclick="window.open('${data.watch}')" class="anislider-btn-primary-action">Watch Now</button>
                    ${data.laugh ? `<button onclick="window.open('${data.laugh}')" class="anislider-btn-secondary-action">Laugh</button>` : ''}
                    <button onclick="anisliderCloseModal()" class="anislider-btn-exit flex-[15]">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>
        `;
        document.getElementById('anislider-detailsModal').classList.add('active');
        document.getElementById('anislider-detailsModal').style.display = 'flex';
    };

    window.anisliderCloseModal = () => {
        document.body.classList.remove('anislider-modal-open');
        const modal = document.getElementById('anislider-detailsModal');
        modal.classList.remove('active');
        modal.style.display = 'none';
    };

    document.addEventListener('keydown', (e) => { if (e.key === "Escape") anisliderCloseModal(); });
    document.readyState === 'complete' ? initGallery() : window.addEventListener('load', initGallery);
})();