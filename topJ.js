const topRender = () => {
    const container = document.getElementById('top-animeContainer');
    const gold = animes.find(a => a.gold);
    const silver = animes.find(a => a.silver);
    const bronze = animes.find(a => a.bronze);

    if (!gold || !silver || !bronze) return;

    container.innerHTML = `
        <div class="lg:col-span-8 relative top-reveal flex flex-col">
            <div class="top-gold-border"></div>
            <div class="top-glass-panel rounded-[2.5rem] px-8 md:px-12 pt-6 pb-12 flex flex-col justify-center">
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
                            <button onclick="window.open('${gold.watch}')" class="top-btn-action bg-[#FFD700] text-black font-black px-10 py-5 rounded-2xl text-xs uppercase tracking-widest">Watch Now</button>
                            <button onclick="topOpenModal('${gold.name.replace(/'/g, "\\'")}')" class="top-btn-action px-10 py-5 rounded-2xl text-xs uppercase tracking-widest bg-zinc-900 border border-zinc-700 text-white font-bold">Details</button>
                        </div>
                    </div>
                    <div class="flex justify-center"><div class="top-poster-card top-poster-main relative w-80 aspect-[2/3] rounded-[2rem] overflow-hidden border border-yellow-500/30 shadow-2xl" style="background-image: url('${gold.poster}')"></div></div>
                </div>
            </div>
        </div>
        <div class="lg:col-span-4 flex flex-col gap-8">
            <div class="relative top-reveal flex-1 flex flex-col">
                <div class="top-silver-border"></div>
                <div class="top-glass-panel rounded-[2rem] px-8 pt-4 pb-8 flex flex-col justify-center">
                    <div class="flex items-center gap-3 mb-4"><span class="h-px w-8 bg-slate-400"></span><span class="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Rank #02 • Silver</span></div>
                    <div class="flex gap-6 items-start mb-4">
                        <div class="flex-grow">
                            <h2 class="text-2xl font-black text-white uppercase leading-tight mb-2">${silver.name}</h2>
                            <div class="flex items-center gap-2 text-xs font-black text-white mb-3"><span>${silver.rating}</span><div class="h-3 w-px bg-zinc-800"></div><span class="text-zinc-500">${silver.genre}</span></div>
                            <p class="text-sm text-zinc-400 italic line-clamp-2">"${silver.quote}"</p>
                        </div>
                        <div class="w-32 h-44 shrink-0 rounded-2xl top-poster-card border border-white/10 shadow-lg" style="background-image: url('${silver.poster}')"></div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="window.open('${silver.watch}')" class="top-btn-action flex-1 bg-slate-200 text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest">Watch</button>
                        <button onclick="topOpenModal('${silver.name.replace(/'/g, "\\'")}')" class="top-btn-action flex-1 bg-zinc-900 border border-zinc-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest">Details</button>
                    </div>
                </div>
            </div>
            <div class="relative top-reveal flex-1 flex flex-col">
                <div class="top-bronze-border"></div>
                <div class="top-glass-panel rounded-[2rem] px-8 pt-4 pb-8 flex flex-col justify-center">
                    <div class="flex items-center gap-3 mb-4"><span class="h-px w-8 bg-orange-700"></span><span class="text-orange-700 font-black text-[10px] uppercase tracking-[0.3em]">Rank #03 • Bronze</span></div>
                    <div class="flex gap-6 items-start mb-4">
                        <div class="flex-grow">
                            <h2 class="text-3xl font-black text-white uppercase leading-tight mb-2">${bronze.name}</h2>
                            <div class="flex items-center gap-2 text-xs font-black text-white mb-3"><span>${bronze.rating}</span><div class="h-3 w-px bg-zinc-800"></div><span class="text-zinc-500">${bronze.genre}</span></div>
                            <p class="text-sm text-zinc-400 italic line-clamp-2">"${bronze.quote}"</p>
                        </div>
                        <div class="w-32 h-44 shrink-0 rounded-2xl top-poster-card border border-white/10 shadow-lg" style="background-image: url('${bronze.poster}')"></div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="window.open('${bronze.watch}')" class="top-btn-action flex-1 bg-orange-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest">Watch</button>
                        <button onclick="topOpenModal('${bronze.name.replace(/'/g, "\\'")}')" class="top-btn-action flex-1 bg-zinc-900 border border-zinc-700 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest">Details</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.topOpenModal = (name) => {
    const data = animes.find(a => a.name === name);
    if (!data) return;

    document.body.classList.add('top-modal-open');
    const accent = document.getElementById('top-modalAccent');
    
    if(data.gold) accent.style.background = "linear-gradient(90deg, #ca8a04, #facc15, #ca8a04)";
    else if(data.silver) accent.style.background = "linear-gradient(90deg, #475569, #e2e8f0, #475569)";
    else if(data.bronze) accent.style.background = "linear-gradient(90deg, #7c2d12, #d97706, #7c2d12)";

    document.getElementById('top-modalContent').innerHTML = `
        <div class="w-2/5 h-full bg-cover bg-center border-r border-white/5 shrink-0" style="background-image: url('${data.poster}')"></div>
        
        <div class="w-3/5 h-full flex flex-col p-12 relative bg-zinc-950/20 overflow-hidden">
            <div class="top-modal-scroll-area flex-grow">
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
                <button onclick="window.open('${data.watch}')" class="top-btn-action flex-[65] bg-white text-black font-black uppercase text-xs tracking-widest py-6 rounded-2xl">
                    Watch Now
                </button>
                
                ${data.laugh ? `
                <button onclick="window.open('${data.laugh}')" class="top-btn-action flex-[20] bg-gradient-to-r from-orange-600 to-red-600 text-white font-black uppercase text-xs tracking-widest py-6 rounded-2xl text-center shadow-lg">
                    Laugh
                </button>` : ''}

                <button onclick="topCloseModal()" class="top-btn-action flex-[15] border border-zinc-700 text-white font-black uppercase text-xs tracking-widest py-6 rounded-2xl text-center">
                    Return
                </button>
            </div>
        </div>
    `;
    document.getElementById('top-detailsModal').classList.add('active');
};

window.topCloseModal = () => {
    document.body.classList.remove('top-modal-open');
    document.getElementById('top-detailsModal').classList.remove('active');
};

document.addEventListener('keydown', (e) => { if (e.key === "Escape") topCloseModal(); });
document.addEventListener('DOMContentLoaded', topRender);