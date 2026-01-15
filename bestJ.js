window.forceBestAlt = (imgId, altText) => {
    const img = document.getElementById(imgId);
    if (!img || img.dataset.done === "true") return;

    if (img.complete && img.naturalWidth > 0) {
        img.style.opacity = "1";
        img.dataset.done = "true";
        return;
    }

    const fallback = document.createElement('div');
    fallback.className = "absolute inset-0 flex items-center justify-center bg-zinc-900 p-6 text-center";
    fallback.innerHTML = `<span class="text-orange-500 font-black uppercase text-xs tracking-widest">${altText || 'Title Missing'}</span>`;

    if (img.parentNode) {
        img.parentNode.replaceChild(fallback, img);
    }
};

const renderBest = () => {
    const container = document.getElementById('bestContainer');
    container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full";
    const bestItems = animes.filter(a => a.best).slice(0, 8);

    container.innerHTML = bestItems.map((anime, index) => {
        const imgId = `best_img_${index}`;
        return `
        <div class="anibest-card-wrapper">
            <div class="anibest-card-border"></div>
            <div class="anibest-card group" onclick="openModal('${anime.name.replace(/'/g, "\\'")}')">
                <img id="${imgId}"
                     src="${anime.poster}" 
                     class="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110" 
                     style="opacity: 0"
                     onload="this.style.opacity='1'; this.dataset.done='true';"
                     onerror="window.forceBestAlt('${imgId}', '${anime.alt}')">
                
                <script>
                    setTimeout(() => { window.forceBestAlt('${imgId}', "${anime.alt}"); }, 3000);
                </script>

                <div class="anibest-card-overlay">
                    <h3 class="text-white font-black uppercase tracking-tighter text-xl leading-none">${anime.name}</h3>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="text-orange-500 text-xs font-black">${anime.rating}</span>
                        <span class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">${anime.genre.split('•')[0]}</span>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
};

window.openModal = (name) => {
    const data = animes.find(a => a.name === name);
    if (!data) return;

    document.body.classList.add('anibest-modal-open');
    document.getElementById('modalContent').innerHTML = `
        <div class="w-[45%] h-full bg-cover bg-center border-r border-white/5 shrink-0 flex items-center justify-center bg-zinc-900" 
             style="background-image: url('${data.poster}')">
             <img src="${data.poster}" class="hidden" onerror="this.parentElement.innerHTML='<div class=\'p-10 text-center\'><span class=\'text-zinc-600 font-black uppercase tracking-widest\'>${data.alt}</span></div>'">
        </div>
        <div class="w-[55%] h-full flex flex-col p-12 relative bg-zinc-950/20 overflow-hidden">
            <div class="anibest-modal-scroll-area flex-grow">
                <h2 class="text-5xl font-black text-white mb-2 uppercase tracking-tighter leading-none">${data.name}</h2>
                <p class="text-zinc-400 italic text-sm mb-8 border-l-2 border-orange-500/50 pl-4 font-medium">"${data.quote}"</p>
                
                <div class="flex flex-wrap gap-8 mb-4 items-center">
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Rating</span><span class="text-orange-500 font-black text-2xl">${data.rating}</span></div>
                    <div class="w-px h-8 bg-zinc-800"></div>
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Episodes</span><span class="text-white font-black text-2xl">${data.episodes || '??'}</span></div>
                    <div class="w-px h-8 bg-zinc-800"></div>
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Studio</span><span class="text-white font-black text-2xl">${data.studio || 'Unknown'}</span></div>
                </div>

                <div class="flex flex-wrap gap-2 mb-10">
                    ${data.genre.split('•').map(g => `<span class="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-zinc-300 uppercase font-bold">${g.trim()}</span>`).join('')}
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
                <button onclick="window.open('${data.watch}')" class="anibest-btn-primary">Watch Now</button>
                ${data.laugh ? `<button onclick="window.open('${data.laugh}')" class="anibest-btn-secondary">Laugh</button>` : ''}
                <button onclick="closeModal()" class="anibest-btn-exit flex-[15]"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
        </div>
    `;
    document.getElementById('detailsModal').classList.add('active');
};

window.closeModal = () => {
    document.body.classList.remove('anibest-modal-open');
    document.getElementById('detailsModal').classList.remove('active');
};

document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeModal(); });
document.addEventListener('DOMContentLoaded', renderBest);