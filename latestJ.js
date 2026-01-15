window.anilastForceAltName = (imgId, altText) => {
    const img = document.getElementById(imgId);
    if (!img || img.dataset.done === "true") return;

    if (img.complete && img.naturalWidth > 0) {
        img.style.opacity = "1";
        img.dataset.done = "true";
        return;
    }

    const fallback = document.createElement('div');
    fallback.className = "anilast-img flex items-center justify-center bg-zinc-900 border-r border-white/10 p-4 text-center";
    fallback.innerHTML = `<span class="text-orange-500 font-black uppercase text-[10px] tracking-tighter leading-none">${altText || 'Title Missing'}</span>`;

    if (img.parentNode) {
        img.parentNode.replaceChild(fallback, img);
    }
};

const anilastRenderLatest = () => {
    const container = document.getElementById('anilast-latestContainer');
    container.className = "grid grid-cols-1 xl:grid-cols-2 gap-6 w-full"; 
    const latestItems = animes.slice(-8);

    container.innerHTML = latestItems.map((anime, index) => {
        const imgId = `anilast_img_${index}`;
        
        return `
        <div class="anilast-card-wrapper">
            <div class="anilast-card-border"></div>
            <div class="anilast-strip" onclick="anilastOpenModal('${anime.name.replace(/'/g, "\\'")}')">
                <img id="${imgId}"
                     src="${anime.poster}" 
                     class="anilast-img transition-opacity duration-300" 
                     style="opacity: 0"
                     alt="${anime.alt}"
                     onload="this.style.opacity='1'; this.dataset.done='true';"
                     onerror="window.anilastForceAltName('${imgId}', '${anime.alt}')">
                
                <div class="anilast-info">
                    <span class="text-orange-500 font-black text-[9px] tracking-[0.4em] uppercase mb-1">New Arrival</span>
                    <h3 class="text-white text-xl font-black uppercase tracking-tighter leading-tight mb-2">${anime.name}</h3>
                    <div class="flex gap-3 mb-2">
                        <span class="anistudio text-zinc-500 text-[10px] font-bold uppercase tracking-[0.1em]">${anime.studio}</span>
                        <div class="flex items-center gap-1.5">
                            <span class="text-zinc-400 text-[10px] font-bold uppercase">${anime.episodes}</span>
                            <span class="text-orange-500 text-[10px] font-black uppercase tracking-[0.1em]">${anime.rating}</span>
                        </div>
                    </div>
                    <p class="text-zinc-400 text-xs italic opacity-80 group-hover:opacity-100 transition-opacity leading-snug">"${anime.hook}"</p>
                </div>
            </div>
        </div>
    `}).join('');
};

window.anilastOpenModal = (name) => {
    const data = animes.find(a => a.name === name);
    if (!data) return;

    document.body.classList.add('modal-open');
    document.getElementById('anilast-modalContent').innerHTML = `
        <div class="w-[45%] h-full bg-cover bg-center border-r border-white/5 shrink-0 flex items-center justify-center bg-zinc-900" 
             style="background-image: url('${data.poster}')">
             <img src="${data.poster}" class="hidden" onerror="this.parentElement.innerHTML='<div class=\'p-10 text-center\'><span class=\'text-zinc-500 font-black uppercase tracking-widest\'>${data.alt}</span></div>'">
        </div>
        <div class="w-[55%] h-full flex flex-col p-12 relative bg-zinc-950/20 overflow-hidden">
            <div class="anilast-modal-scroll-area flex-grow">
                <h2 class="text-5xl font-black text-white mb-2 uppercase tracking-tighter leading-none">${data.name}</h2>
                <p class="text-zinc-400 italic text-sm mb-8 border-l-2 border-orange-500/50 pl-4 font-medium">"${data.quote}"</p>
                <div class="flex flex-wrap gap-8 mb-4 items-center">
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Rating</span><span class="text-orange-500 font-black text-2xl">${data.rating}</span></div>
                    <div class="w-px h-8 bg-zinc-800"></div>
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Episodes</span><span class="text-white font-black text-2xl">${data.episodes || '??'}</span></div>
                    <div class="w-px h-8 bg-zinc-800"></div>
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Studio</span><span class="text-white font-black text-2xl">${data.studio}</span></div>
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
                <button onclick="window.open('${data.watch}')" class="anilast-btn-primary-action">Watch Now</button>
                ${data.laugh ? `<button onclick="window.open('${data.laugh}')" class="anilast-btn-secondary-action">Laugh</button>` : ''}
                <button onclick="anilastCloseModal()" class="anilast-btn-exit flex-[15]"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
        </div>
    `;
    document.getElementById('anilast-detailsModal').classList.add('active');
};

window.anilastCloseModal = () => {
    document.body.classList.remove('modal-open');
    document.getElementById('anilast-detailsModal').classList.remove('active');
};

document.addEventListener('keydown', (e) => { if (e.key === "Escape") anilastCloseModal(); });
document.addEventListener('DOMContentLoaded', anilastRenderLatest);