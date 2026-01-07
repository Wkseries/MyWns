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
        <div class="best-card-wrapper">
            <div class="best-card-border"></div>
            <div class="best-card group" onclick="openModal('${anime.name.replace(/'/g, "\\'")}')">
                <img id="${imgId}"
                     src="${anime.poster}" 
                     class="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110" 
                     style="opacity: 0"
                     onload="this.style.opacity='1'; this.dataset.done='true';"
                     onerror="window.forceBestAlt('${imgId}', '${anime.alt}')">
                
                <script>
                    setTimeout(() => { window.forceBestAlt('${imgId}', "${anime.alt}"); }, 3000);
                </script>

                <div class="card-overlay">
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

    document.body.classList.add('modal-open');
    document.getElementById('modalContent').innerHTML = `
        <div class="w-[45%] h-full bg-cover bg-center border-r border-white/5 shrink-0 flex items-center justify-center bg-zinc-900" 
             style="background-image: url('${data.poster}')">
             <img src="${data.poster}" class="hidden" onerror="this.parentElement.innerHTML='<div class=\'p-10 text-center\'><span class=\'text-zinc-600 font-black uppercase tracking-widest\'>${data.alt}</span></div>'">
        </div>
        <div class="w-[55%] h-full flex flex-col p-12 relative bg-zinc-950/20">
            <div class="overflow-y-auto flex-grow pr-4">
                <h2 class="text-5xl font-black text-white mb-2 uppercase tracking-tighter">${data.name}</h2>
                <p class="text-zinc-400 italic text-sm mb-8 border-l-2 border-orange-500/50 pl-4">"${data.quote}"</p>
                <div class="flex flex-wrap gap-8 mb-4 items-center">
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Rating</span><span class="text-orange-500 font-black text-2xl">${data.rating}</span></div>
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Episodes</span><span class="text-white font-black text-2xl">${data.episodes}</span></div>
                </div>
                <p class="text-zinc-300 text-lg italic leading-relaxed mb-8">"${data.description}"</p>
            </div>
            <div class="pt-8 border-t border-white/5 flex gap-3 mt-auto">
                <button onclick="window.open('${data.watch}')" class="flex-[70] bg-white text-black font-black uppercase text-xs py-5 rounded-2xl">Watch Now</button>
                <button onclick="closeModal()" class="flex-[30] border border-zinc-700 text-white font-black uppercase text-xs py-5 rounded-2xl">Return</button>
            </div>
        </div>
    `;
    document.getElementById('detailsModal').classList.add('active');
};

window.closeModal = () => {
    document.body.classList.remove('modal-open');
    document.getElementById('detailsModal').classList.remove('active');
};

document.addEventListener('DOMContentLoaded', renderBest);