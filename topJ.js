const topRender = () => {
    const container = document.getElementById('anitop-animeContainer');
    const gold = animes.find(a => a.gold);
    const silver = animes.find(a => a.silver);
    const bronze = animes.find(a => a.bronze);

    if (!gold || !silver || !bronze) return;

    container.innerHTML = `
        <div class="lg:col-span-8 relative anitop-reveal flex flex-col">
            <div class="anitop-gold-border"></div>
            <div class="anitop-glass-panel rounded-[2.5rem] px-8 md:px-12 pt-6 pb-12 flex flex-col justify-center">
                <div class="flex items-center gap-3 mb-6">
                    <span class="h-px w-12 bg-yellow-500"></span>
                    <span class="text-yellow-500 font-black text-xs uppercase tracking-[0.4em]">Rank #01 • Gold Edition</span>
                </div>
                <div class="grid md:grid-cols-2 gap-10 items-start">
                    <div class="space-y-6">
                        <h1 class="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white uppercase">${gold.name.split(':')[0]} <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 italic">${gold.name.split(':')[1] || ''}</span></h1>
                        <div class="flex items-center gap-4 text-lg font-black text-white"><span class="text-yellow-500">${gold.rating}</span><div class="h-6 w-px bg-zinc-800"></div><span>${gold.genre}</span></div>
                        <p class="text-zinc-300 text-xl leading-relaxed italic border-l-4 border-yellow-500/30 pl-6 font-medium">"${gold.quote}"</p>
                        <div class="flex flex-wrap gap-3">
                            <button onclick="window.open('${gold.watch}')" class="anitop-btn-action bg-[#FFD700] text-black font-black px-10 py-5 rounded-2xl text-xs uppercase tracking-widest">Watch Now</button>
                            <button onclick="topOpenModal('${gold.name.replace(/'/g, "\\'")}')" class="anitop-btn-action px-10 py-5 rounded-2xl text-xs uppercase tracking-widest bg-zinc-900 border border-zinc-700 text-white font-bold">Details</button>
                        </div>
                    </div>
                    <div class="flex justify-center"><div class="anitop-poster-card anitop-poster-main relative w-80 aspect-[2/3] rounded-[2rem] overflow-hidden border border-yellow-500/30 shadow-2xl" style="background-image: url('${gold.poster}')"></div></div>
                </div>
            </div>
        </div>
        <div class="lg:col-span-4 flex flex-col gap-8">
            <div class="relative anitop-reveal flex-1 flex flex-col">
                <div class="anitop-silver-border"></div>
                <div class="anitop-glass-panel rounded-[2rem] px-8 pt-4 pb-8 flex flex-col justify-center">
                    <div class="flex items-center gap-3 mb-4"><span class="h-px w-8 bg-slate-400"></span><span class="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Rank #02 • Silver</span></div>
                    <div class="flex gap-6 items-start mb-4">
                        <div class="flex-grow">
                            <h2 class="text-2xl font-black text-white uppercase leading-tight mb-2">${silver.name}</h2>
                            <div class="flex items-center gap-2 text-xs font-black text-white mb-3"><span>${silver.rating}</span><div class="h-3 w-px bg-zinc-800"></div><span class="text-zinc-500">${silver.genre}</span></div>
                            <p class="text-sm text-zinc-400 italic line-clamp-2">"${silver.quote}"</p>
                        </div>
                        <div class="w-32 h-44 shrink-0 rounded-2xl anitop-poster-card border border-white/10 shadow-lg" style="background-image: url('${silver.poster}')"></div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="window.open('${silver.watch}')" class="anitop-btn-action flex-1 bg-slate-200 text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest">Watch</button>
                        <button onclick="topOpenModal('${silver.name.replace(/'/g, "\\'")}')" class="anitop-btn-action flex-1 bg-zinc-900 border border-zinc-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest">Details</button>
                    </div>
                </div>
            </div>
            <div class="relative anitop-reveal flex-1 flex flex-col">
                <div class="anitop-bronze-border"></div>
                <div class="anitop-glass-panel rounded-[2rem] px-8 pt-4 pb-8 flex flex-col justify-center">
                    <div class="flex items-center gap-3 mb-4"><span class="h-px w-8 bg-orange-700"></span><span class="text-orange-700 font-black text-[10px] uppercase tracking-[0.3em]">Rank #03 • Bronze</span></div>
                    <div class="flex gap-6 items-start mb-4">
                        <div class="flex-grow">
                            <h2 class="text-3xl font-black text-white uppercase leading-tight mb-2">${bronze.name}</h2>
                            <div class="flex items-center gap-2 text-xs font-black text-white mb-3"><span>${bronze.rating}</span><div class="h-3 w-px bg-zinc-800"></div><span class="text-zinc-500">${bronze.genre}</span></div>
                            <p class="text-sm text-zinc-400 italic line-clamp-2">"${bronze.quote}"</p>
                        </div>
                        <div class="w-32 h-44 shrink-0 rounded-2xl anitop-poster-card border border-white/10 shadow-lg" style="background-image: url('${bronze.poster}')"></div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="window.open('${bronze.watch}')" class="anitop-btn-action flex-1 bg-orange-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest">Watch</button>
                        <button onclick="topOpenModal('${bronze.name.replace(/'/g, "\\'")}')" class="anitop-btn-action flex-1 bg-zinc-900 border border-zinc-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest">Details</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.topOpenModal = (name) => {
    const data = animes.find(a => a.name === name);
    if (!data) return;

    // Prevent background scroll
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;

    document.body.classList.add('anitop-modal-open');
    const accent = document.getElementById('anitop-modalAccent');
    
    if(data.gold) accent.style.background = "linear-gradient(90deg, #ca8a04, #facc15, #ca8a04)";
    else if(data.silver) accent.style.background = "linear-gradient(90deg, #475569, #e2e8f0, #475569)";
    else if(data.bronze) accent.style.background = "linear-gradient(90deg, #7c2d12, #d97706, #7c2d12)";

    document.getElementById('anitop-modalContent').innerHTML = `
        <div class="w-[45%] h-full bg-cover bg-center shrink-0 border-r border-white/5" style="background-image: url('${data.poster}')"></div>
        <div class="w-[55%] h-full flex flex-col p-12 relative bg-zinc-950/40">
            <div class="anitop-modal-scroll-area flex-grow">
                <h2 class="text-5xl font-black text-white mb-2 uppercase tracking-tighter leading-none">${data.name}</h2>
                <p class="text-zinc-400 italic text-sm mb-8 border-l-2 border-white/20 pl-4 font-medium">"${data.quote}"</p>
                
                <div class="flex flex-wrap gap-8 mb-8 items-center">
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Rating</span><span class="text-white font-black text-2xl">${data.rating}</span></div>
                    <div class="w-px h-8 bg-zinc-800"></div>
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Studio</span><span class="text-white font-black text-2xl">${data.studio || 'N/A'}</span></div>
                </div>

                <div class="flex flex-wrap gap-2 mb-8">
                    ${data.genre.split('•').map(g => `<span class="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-zinc-300 uppercase font-bold">${g.trim()}</span>`).join('')}
                </div>

                <div class="space-y-4 mb-10">
                    <h3 class="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Storyline</h3>
                    <p class="text-zinc-300 text-lg italic leading-relaxed">"${data.description}"</p>
                </div>

                <div class="space-y-6">
                    ${data.trailer ? `<div class="rounded-2xl overflow-hidden aspect-video border border-white/10"><iframe width="100%" height="100%" src="${data.trailer}" frameborder="0" allowfullscreen></iframe></div>` : ''}
                    ${data.spotify ? `<div class="rounded-2xl overflow-hidden border border-white/10"><iframe src="${data.spotify}" width="100%" height="450" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>` : ''}
                </div>
            </div>
            
            <div class="pt-8 border-t border-white/5 flex items-center gap-3 mt-auto shrink-0 w-full">
                <button onclick="window.open('${data.watch}')" class="anitop-btn-primary-action">Watch Now</button>
                ${data.laugh ? `<button onclick="window.open('${data.laugh}')" class="anitop-btn-secondary-action">Laugh</button>` : ''}
                <button onclick="topCloseModal()" class="anitop-btn-exit flex-[15]"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
        </div>
    `;
    document.getElementById('anitop-detailsModal').classList.add('active');
};

window.topCloseModal = () => {
    // 1. Simply re-enable scrolling on the body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';

    // 2. Hide the modal
    const modal = document.getElementById('anitop-detailsModal');
    modal.classList.remove('active');
};

document.addEventListener('keydown', (e) => { if (e.key === "Escape") topCloseModal(); });
document.addEventListener('DOMContentLoaded', topRender);
