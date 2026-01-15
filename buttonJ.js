/**
 * buttonJ.js - Interactive Hub Controller
 */

const buttons = [
    { name: "Dice", icon: "M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M7,9c-1.1,0-2-0.9-2-2s0.9-2,2-2 s2,0.9,2,2S8.1,9,7,9z M12,14c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,14,12,14z M17,19c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S18.1,19,17,19z" },
    { name: "Trending", icon: "M16,6l2.29,2.29l-4.88,4.88l-4-4L2,16.59L3.41,18l6-6l4,4l6.3-6.29L22,12V6H16z" },
    { name: "Rankings", icon: "M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z" },
    { name: "Versus", icon: "M13.12,2.06L7.58,13.14c-0.27,0.54-0.1,1.2,0.38,1.55c0.48,0.35,1.15,0.28,1.55-0.16l2.49-2.73v8.14 c0,0.55,0.45,1,1,1s1-0.45,1-1v-8.14l2.49,2.73c0.4,0.44,1.07,0.51,1.55,0.16c0.48-0.35,0.65-1.01,0.38-1.55L13.12,2.06z" },    
    { name: "Search", icon: "M15.5,14h-0.79l-0.28-0.27C15.41,12.59,16,11.11,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5S5.91,16,9.5,16 c1.61,0,3.09-0.59,4.23-1.57l0.28,0.27v0.79l5,4.99L20.49,19L15.5,14z M9.5,14C7.01,14,5,11.99,5,9.5S7.01,5,9.5,5S14,7.01,14,9.5 S11.99,14,9.5,14z" },
    { name: "Write", icon: "M3,17.25V21h3.75L17.81,9.94l-3.75-3.75L3,17.25z M20.71,7.04c0.39-0.39,0.39-1.02,0-1.41l-2.34-2.34 c-0.39-0.39-1.02-0.39-1.41,0l-1.83,1.83l3.75,3.75L20.71,7.04z" },
    { name: "Innovation", icon: "M12,2C7.58,2,4,5.58,4,10c0,2.48,1.13,4.69,2.9,6.17V19c0,0.55,0.45,1,1,1h8.1c0.55,0,1-0.45,1-1v-2.83 c1.77-1.48,2.9-3.69,2.9-6.17C20,5.58,16.42,2,12,2z M12,18H8v-1.12c0.88,0.57,1.9,0.92,3,0.92s2.12-0.35,3-0.92V18z" },
    { name: "Match", icon: "M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09 C13.09,3.81,14.76,3,16.5,3C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z" }
];

let rollHistory = [];
let versusState = { pool: [], round: 1, maxRounds: 5, currentPair: [], activeSource: "General" };

// --- Initialization ---
const renderButtons = () => {
    const grid = document.getElementById('anibutton-button-grid');
    if (!grid) return;
    grid.innerHTML = buttons.map(btn => `
        <div class="anibutton-card-wrap" onclick="handleHubAction('${btn.name}')">
            <div class="anibutton-card-border"></div>
            <div class="anibutton-card">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)" class="transition-all duration-300 anibutton-icon">
                    <path d="${btn.icon}"></path>
                </svg>
                <span class="anibutton-card-label">${btn.name}</span>
            </div>
        </div>
    `).join('');
};

window.handleHubAction = (name) => {
    if (name === "Dice") startHubDiceRoll();
    if (name === "Trending") handleTrendingClick();
    if (name === "Rankings") handleRankingsClick();
    if (name === "Search") handleSearchClick();
    if (name === "Versus") startVersusGame();
    if (name === "Write") startWriteClick();
    if (name === "Innovation") startInnovationClick();
    if (name === "Match") startMatchClick();
}

// --- Match Logic (Positive Recommendation System) ---

const getMatchGenres = () => {
    const counts = {};
    animes.forEach(anime => {
        if (anime.keyGenre) {
            const genres = anime.keyGenre.split(',').map(g => g.trim().toLowerCase());
            genres.forEach(g => { if (g.length > 2) counts[g] = (counts[g] || 0) + 1; });
        }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 35).map(entry => entry[0]).filter(word => !word.includes(' ') && word.length <= 12);
};

const getSevenMatchGenres = () => {
    const list = getMatchGenres();
    return list.sort(() => 0.5 - Math.random()).slice(0, 7);
};

window.startMatchClick = () => {
    versusState.activeSource = "Match";
    const modal = document.getElementById('anibutton-modal-overlay');
    const content = document.getElementById('anibutton-modal-content');
    document.body.classList.add('modal-open');
    modal.classList.add('anibutton-active');
    modal.style.display = 'flex';

    renderMatchView(content);
};

const renderMatchView = (container) => {
    container.classList.remove('anibutton-details-modal');
    const suggestions = getSevenMatchGenres();
    
    container.innerHTML = `
        <div class="anibutton-match-view">
            <h2 class="text-2xl font-bold text-white mb-1 tracking-tight">Match Finder</h2>
            <p class="text-zinc-500 text-sm mb-4">What's your mood? Enter genres you <span class="text-orange-500 font-bold">love</span> to see your best fit.</p>
            
            <input type="text" id="anibutton-match-input" placeholder="Enter genres you want to see..." autocomplete="off" 
                class="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl text-white outline-none focus:border-orange-500 mb-6 transition-all">
            
            <div class="anibutton-match-row">
                <div class="anibutton-match-keywords-row1 flex gap-3 mb-2">
                    ${suggestions.slice(0,4).map(genre => `<button class="anibutton-match-tag" onclick="addGenreToMatch('${genre}')">${genre}</button>`).join('')}
                </div>
                <div class="anibutton-match-keywords-row2 flex gap-3 items-center">
                    ${suggestions.slice(4,7).map(genre => `<button class="anibutton-match-tag" onclick="addGenreToMatch('${genre}')">${genre}</button>`).join('')}
                    <button onclick="refreshMatchGenres()" class="anibutton-match-refresh ml-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                </div>
            </div>

            <div id="anibutton-match-grid" class="grid grid-cols-2 gap-6">
                <div class="anibutton-match-empty col-span-2">
                    <div class="anibutton-match-heart">❤️‍🔥</div>
                    <h3 class="anibutton-monster-main">Find Your Genre</h3>
                    <p class="anibutton-monster-sub">Waiting for your favorite genres...</p>
                </div>
            </div>
        </div>`;

    const input = document.getElementById('anibutton-match-input');
    let typingTimer;
    
    input.addEventListener('input', (e) => {
        clearTimeout(typingTimer);
        const query = e.target.value.toLowerCase().trim();
        const grid = document.getElementById('anibutton-match-grid');

        if (!query) {
            grid.innerHTML = `
                <div class="anibutton-match-empty col-span-2">
                    <div class="anibutton-match-heart">❤️‍🔥</div>
                    <h3 class="anibutton-monster-main">Find Your Soulmate</h3>
                    <p class="anibutton-monster-sub">Waiting for your favorite genres...</p>
                </div>`;
            return;
        }

        grid.innerHTML = `
            <div class="col-span-2 flex flex-col items-center justify-center h-[350px]">
                <div class="anibutton-match-scanner"></div>
                <p class="anibutton-text mt-8 text-orange-500 font-black uppercase tracking-[0.4em] animate-pulse">Searching Perfect Matches</p>
            </div>`;

        typingTimer = setTimeout(() => {
            const searchGenres = query.split(/[\s,]+/).filter(t => t.length > 2);
            
            // LOGIC: Find animes that DO contain any of the selected genres
            const matches = animes.filter(anime => {
                const animeGenres = (anime.keyGenre || "").toLowerCase();
                return searchGenres.some(genre => animeGenres.includes(genre));
            }).sort(() => 0.5 - Math.random()).slice(0, window.innerWidth < 768 ? 1 : 2);

            if (matches.length === 0) {
                grid.innerHTML = `
                    <div class="anibutton-match-empty col-span-2">
                        <div class="anibutton-match-heart">💔</div>
                        <h3 class="anibutton-monster-main">No Matches Found</h3>
                        <p class="anibutton-monster-sub">Try different genres or check your spelling.</p>
                    </div>`;
            } else {
                grid.innerHTML = matches.map(anime => `
                    <div class="anibutton-suggestion-card" onclick="showAnimeDetails(animes.find(a => a.name === '${anime.name.replace(/'/g, "\\'")}'))">
                        <img src="${anime.poster}" class="anibutton-suggestion-poster">
                        <div class="anibutton-suggestion-content">
                            <h3 class="anibutton-suggestion-name">${anime.name}</h3>
                            <div class="anibutton-suggestion-meta">
                                <span class="anibutton-suggestion-rating">${anime.rating}</span>
                                <span class="anibutton-suggestion-episodes">${anime.episodes || '??'} eps</span>
                            </div>
                            <p class="anibutton-suggestion-hook">"${anime.hook}"</p>
                        </div>
                    </div>`).join('');
            }
        }, 2000);
    });
};

window.refreshMatchGenres = () => {
    const suggestions = getSevenMatchGenres();
    document.querySelector('.anibutton-match-keywords-row1').innerHTML = suggestions.slice(0,4).map(genre => `
        <button class="anibutton-match-tag" onclick="addGenreToMatch('${genre}')">${genre}</button>
    `).join('');
    document.querySelector('.anibutton-match-keywords-row2').innerHTML = suggestions.slice(4,7).map(genre => `
        <button class="anibutton-match-tag" onclick="addGenreToMatch('${genre}')">${genre}</button>
    `).join('') + `
        <button onclick="refreshMatchGenres()" class="anibutton-match-refresh ml-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
    `;
};

window.addGenreToMatch = (genre) => {
    const input = document.getElementById('anibutton-match-input');
    const val = input.value.trim();
    input.value = val ? `${val}, ${genre}` : genre;
    input.dispatchEvent(new Event('input'));
}; 

// --- Innovation Logic (Unique Classes & Orange Theme) ---

const getInnovationGenres = () => {
    const counts = {};
    animes.forEach(anime => {
        if (anime.keyGenre) {
            const genres = anime.keyGenre.split(',').map(g => g.trim().toLowerCase());
            genres.forEach(g => { if (g.length > 2) counts[g] = (counts[g] || 0) + 1; });
        }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 35).map(entry => entry[0]).filter(word => !word.includes(' ') && word.length <= 12);
};

const getSevenInnovationGenres = () => {
    const list = getInnovationGenres();
    return list.sort(() => 0.5 - Math.random()).slice(0, 7);
};

window.startInnovationClick = () => {
    versusState.activeSource = "Innovation";
    const modal = document.getElementById('anibutton-modal-overlay');
    const content = document.getElementById('anibutton-modal-content');
    document.body.classList.add('modal-open');
    modal.classList.add('anibutton-active');
    modal.style.display = 'flex';

    renderInnovationView(content);
};

const renderInnovationView = (container) => {
    container.classList.remove('anibutton-details-modal');
    const suggestions = getSevenInnovationGenres();
    
    container.innerHTML = `
        <div class="anibutton-innovation-view">
            <h2 class="text-2xl font-bold text-white mb-1 tracking-tight">Innovation Hub</h2>
            <p class="text-zinc-500 text-sm mb-4">Exclude your comfort zones. I'll find something <span class="text-orange-500 font-bold">different</span>.</p>
            
            <input type="text" id="anibutton-innovation-input" placeholder="Enter genres you usually watch..." autocomplete="off" 
                class="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl text-white outline-none focus:border-orange-500 mb-6 transition-all">
            
            <div class="anibutton-innovation-row">
                <div class="anibutton-innovation-keywords-row1 flex gap-3 mb-2">
                    ${suggestions.slice(0,4).map(genre => `<button class="anibutton-innovation-tag" onclick="addGenreToInnovation('${genre}')">${genre}</button>`).join('')}
                </div>
                <div class="anibutton-innovation-keywords-row2 flex gap-3 items-center">
                    ${suggestions.slice(4,7).map(genre => `<button class="anibutton-innovation-tag" onclick="addGenreToInnovation('${genre}')">${genre}</button>`).join('')}
                    <button onclick="refreshInnovationGenres()" class="anibutton-innovation-refresh ml-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                </div>
            </div>

            <div id="anibutton-innovation-grid" class="grid grid-cols-2 gap-6">
                <div class="anibutton-innovation-empty col-span-2">
                    <div class="anibutton-innovation-ufo">🛸</div>
                    <h3 class="anibutton-monster-main">Explore the Unknown</h3>
                    <p class="anibutton-monster-sub">List your usual genres to find an outlier...</p>
                </div>
            </div>
        </div>`;

    const input = document.getElementById('anibutton-innovation-input');
    let typingTimer;
    
    input.addEventListener('input', (e) => {
        clearTimeout(typingTimer);
        const query = e.target.value.toLowerCase().trim();
        const grid = document.getElementById('anibutton-innovation-grid');

        if (!query) {
            grid.innerHTML = `
                <div class="anibutton-innovation-empty col-span-2">
                    <div class="anibutton-innovation-ufo">🛸</div>
                    <h3 class="anibutton-monster-main">Explore the Unknown</h3>
                    <p class="anibutton-monster-sub">I'm waiting to find your opposite match...</p>
                </div>`;
            return;
        }

        grid.innerHTML = `
            <div class="col-span-2 flex flex-col items-center justify-center h-[350px]">
                <div class="anibutton-innovation-scanner"></div>
                <p class="anibutton-text mt-8 text-orange-500 font-black uppercase tracking-[0.4em] animate-pulse">Filtering Out Comfort Zones</p>
            </div>`;

        typingTimer = setTimeout(() => {
            const excludedGenres = query.split(/[\s,]+/).filter(t => t.length > 2);
            
            const matches = animes.filter(anime => {
                const animeGenres = (anime.keyGenre || "").toLowerCase();
                return excludedGenres.every(genre => !animeGenres.includes(genre));
            }).sort(() => 0.5 - Math.random()).slice(0, window.innerWidth < 768 ? 1 : 2);

            if (matches.length === 0) {
                grid.innerHTML = `
                    <div class="anibutton-innovation-empty col-span-2">
                        <div class="anibutton-innovation-ufo">👽</div>
                        <h3 class="anibutton-monster-main">No Escape</h3>
                        <p class="anibutton-monster-sub">Your taste is too broad! Try different keywords.</p>
                    </div>`;
            } else {
                grid.innerHTML = matches.map(anime => `
                    <div class="anibutton-suggestion-card" onclick="showAnimeDetails(animes.find(a => a.name === '${anime.name.replace(/'/g, "\\'")}'))">
                        <img src="${anime.poster}" class="anibutton-suggestion-poster">
                        <div class="anibutton-suggestion-content">
                            <h3 class="anibutton-suggestion-name">${anime.name}</h3>
                            <div class="anibutton-suggestion-meta">
                                <span class="anibutton-suggestion-rating">${anime.rating}</span>
                                <span class="anibutton-suggestion-episodes">${anime.episodes || '??'} eps</span>
                            </div>
                            <p class="anibutton-suggestion-hook">"${anime.hook}"</p>
                        </div>
                    </div>`).join('');
            }
        }, 2000);
    });
};

window.refreshInnovationGenres = () => {
    const suggestions = getSevenInnovationGenres();
    document.querySelector('.anibutton-innovation-keywords-row1').innerHTML = suggestions.slice(0,4).map(genre => `
        <button class="anibutton-innovation-tag" onclick="addGenreToInnovation('${genre}')">${genre}</button>
    `).join('');
    document.querySelector('.anibutton-innovation-keywords-row2').innerHTML = suggestions.slice(4,7).map(genre => `
        <button class="anibutton-innovation-tag" onclick="addGenreToInnovation('${genre}')">${genre}</button>
    `).join('') + `
        <button onclick="refreshInnovationGenres()" class="anibutton-innovation-refresh ml-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
    `;
};

window.addGenreToInnovation = (genre) => {
    const input = document.getElementById('anibutton-innovation-input');
    const val = input.value.trim();
    input.value = val ? `${val}, ${genre}` : genre;
    input.dispatchEvent(new Event('input'));
};
    

// --- Write Logic ---

const getTopKeywordsList = () => {
    const counts = {};
    animes.forEach(anime => {
        if (anime.keywords) {
            const words = anime.keywords.split(',').map(w => w.trim().toLowerCase());
            words.forEach(word => { if (word.length > 3) counts[word] = (counts[word] || 0) + 1; });
        }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 40).map(entry => entry[0]).filter(word => !word.includes(' ') && word.length <= 12);
};

const getSevenKeywords = () => {
    const list = getTopKeywordsList();
    return list.sort(() => 0.5 - Math.random()).slice(0, 7); // Exactly 7
};

window.startWriteClick = () => {
    versusState.activeSource = "Write";
    const modal = document.getElementById('anibutton-modal-overlay');
    const content = document.getElementById('anibutton-modal-content');
    document.body.classList.add('modal-open');
    modal.classList.add('anibutton-active');
    modal.style.display = 'flex';

    renderWriteView(content);
};

const renderWriteView = (container) => {
    container.classList.remove('anibutton-details-modal');
    const suggestions = getSevenKeywords();
    
    container.innerHTML = `
        <div class="anibutton-write-view">
            <h2 class="text-2xl font-bold text-white mb-4 tracking-tight">Pattern Prediction</h2>
            <input type="text" id="anibutton-write-input" placeholder="Feed me tropes, keywords or plot points..." autocomplete="off" 
                class="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xl text-white outline-none focus:border-orange-500 mb-6">
            
            <div class="anibutton-write-row">
                <div class="anibutton-write-keywords-row1 flex gap-3 mb-2">
                    ${suggestions.slice(0,4).map(word => `<button class="anibutton-write-tag" onclick="addWordToWrite('${word}')">${word}</button>`).join('')}
                </div>
                <div class="anibutton-write-keywords-row2 flex gap-3 items-center">
                    ${suggestions.slice(4,7).map(word => `<button class="anibutton-write-tag" onclick="addWordToWrite('${word}')">${word}</button>`).join('')}
                    <button onclick="refreshWriteKeywords()" class="anibutton-write-refresh ml-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                </div>
            </div>

            <div id="anibutton-write-grid" class="grid grid-cols-2 gap-6">
                <div class="anibutton-write-empty col-span-2">
                    <div class="anibutton-write-emoji">🤔</div>
                    <h3 class="anibutton-monster-main">Describe Your Series</h3>
                    <p class="anibutton-monster-sub">I need keywords to find the series you're looking for...</p>
                </div>
            </div>
        </div>`;

    const input = document.getElementById('anibutton-write-input');
    let typingTimer;
    
    input.addEventListener('input', (e) => {
        clearTimeout(typingTimer);
        const query = e.target.value.toLowerCase().trim();
        const grid = document.getElementById('anibutton-write-grid');

        if (!query) {
            grid.innerHTML = `
                <div class="anibutton-write-empty col-span-2">
                    <div class="anibutton-write-emoji">🤔</div>
                    <h3 class="anibutton-monster-main">Awaiting Input</h3>
                    <p class="anibutton-monster-sub">Describe a series to begin prediction...</p>
                </div>`;
            return;
        }

        // Custom Scanning State (No Dice)
        grid.innerHTML = `
            <div class="col-span-2 flex flex-col items-center justify-center h-[350px]">
                <div class="anibutton-scan-line"></div>
                <p class="mt-8 text-orange-500 font-black uppercase tracking-[0.4em] animate-pulse">Scanning Database</p>
            </div>`;

        typingTimer = setTimeout(() => {
            const terms = query.split(/[\s,]+/).filter(t => t.length > 2);
            const results = animes.map(anime => {
                let score = 0;
                const pool = `${anime.name} ${anime.keywords} ${anime.description}`.toLowerCase();
                terms.forEach(t => {
                    if (pool.includes(t)) {
                        score += 1;
                        if (anime.keywords.toLowerCase().includes(t)) score += 3;
                        if (anime.name.toLowerCase().includes(t)) score += 10;
                    }
                });
                return { anime, score };
            }).filter(res => res.score > 0)
              .sort((a, b) => b.score - a.score)
              .slice(0, window.innerWidth < 768 ? 1 : 2);

            if (results.length === 0) {
                grid.innerHTML = `
                    <div class="anibutton-write-empty col-span-2">
                        <div class="anibutton-write-emoji">😵‍💫</div>
                        <h3 class="anibutton-monster-main">Pattern Error</h3>
                        <p class="anibutton-monster-sub">No known series matches this description.</p>
                    </div>`;
            } else {
                grid.innerHTML = results.map(res => `
                    <div class="anibutton-suggestion-card" onclick="showAnimeDetails(animes.find(a => a.name === '${res.anime.name.replace(/'/g, "\\'")}'))">
                        <img src="${res.anime.poster}" class="anibutton-suggestion-poster">
                        <div class="anibutton-suggestion-content">
                            <h3 class="anibutton-suggestion-name">${res.anime.name}</h3>
                            <div class="anibutton-suggestion-meta">
                                <span class="anibutton-suggestion-rating">${res.anime.rating}</span>
                                <span class="anibutton-suggestion-episodes">${res.anime.episodes || '??'} eps</span>
                            </div>
                            <p class="anibutton-suggestion-hook">"${res.anime.hook || 'Explore details'}"</p>
                        </div>
                    </div>`).join('');
            }
        }, 2000);
    });
};

window.refreshWriteKeywords = () => {
    const suggestions = getSevenKeywords();
    document.querySelector('.anibutton-write-keywords-row1').innerHTML = suggestions.slice(0,4).map(word => `
        <button class="anibutton-write-tag" onclick="addWordToWrite('${word}')">${word}</button>
    `).join('');
    document.querySelector('.anibutton-write-keywords-row2').innerHTML = suggestions.slice(4,7).map(word => `
        <button class="anibutton-write-tag" onclick="addWordToWrite('${word}')">${word}</button>
    `).join('') + `
        <button onclick="refreshWriteKeywords()" class="anibutton-write-refresh ml-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
    `;
};

window.addWordToWrite = (word) => {
    const input = document.getElementById('anibutton-write-input');
    const val = input.value.trim();
    input.value = val ? `${val}, ${word}` : word;
    input.dispatchEvent(new Event('input'));
};

// --- Versus Logic ---
window.startVersusGame = () => {
    versusState.activeSource = "Versus";
    const modal = document.getElementById('anibutton-modal-overlay');
    document.body.classList.add('modal-open');
    modal.classList.add('anibutton-active');
    modal.style.display = 'flex';

    const shuffled = [...animes].sort(() => 0.5 - Math.random());
    versusState.pool = shuffled.slice(0, 6);
    versusState.round = 1;
    versusState.currentPair = [versusState.pool[0], versusState.pool[1]];
    renderVersusRound();
};

const renderVersusRound = () => {
    const content = document.getElementById('anibutton-modal-content');
    content.classList.remove('anibutton-details-modal');
    const [leftAnime, rightAnime] = versusState.currentPair;
    const progress = (versusState.round / versusState.maxRounds) * 100;

    content.innerHTML = `
        <div class="anibutton-versus-arena">
            <div class="anibutton-versus-header">
                <h2 class="anibutton-versus-title">VERSUS</h2>
                <span class="anibutton-versus-round">Round ${versusState.round} of ${versusState.maxRounds}</span>
                <div class="anibutton-versus-progress-bg"><div class="anibutton-versus-progress-fill" style="width: ${progress}%"></div></div>
            </div>
            <div class="anibutton-versus-field">
                <div class="anibutton-versus-option" onclick="processVersusChoice(0)">
                    <img src="${leftAnime.poster}">
                    <div class="anibutton-versus-info">
                        <div class="anibutton-versus-text">
                            <p class="anibutton-versus-hook">${leftAnime.hook || ""}</p>
                            <h3>${leftAnime.name}</h3>
                        </div>
                    </div>
                </div>
                <div class="anibutton-versus-vs">VS</div>
                <div class="anibutton-versus-option" onclick="processVersusChoice(1)">
                    <img src="${rightAnime.poster}">
                    <div class="anibutton-versus-info">
                        <div class="anibutton-versus-text">
                            <p class="anibutton-versus-hook">${rightAnime.hook || ""}</p>
                            <h3>${rightAnime.name}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
};

window.processVersusChoice = (winnerSideIndex) => {
    const winner = versusState.currentPair[winnerSideIndex];
    if (versusState.round < versusState.maxRounds) {
        versusState.round++;
        const nextChallenger = versusState.pool[versusState.round];
        if (winnerSideIndex === 0) {
            versusState.currentPair = [winner, nextChallenger];
        } else {
            versusState.currentPair = [nextChallenger, winner];
        }
        renderVersusRound();
    } else {
        showAnimeDetails(winner);
    }
};

// --- Search Logic ---
window.handleSearchClick = () => {
    versusState.activeSource = "Search";
    const modal = document.getElementById('anibutton-modal-overlay');
    const content = document.getElementById('anibutton-modal-content');
    content.classList.remove('anibutton-details-modal');
    document.body.classList.add('modal-open');
    modal.classList.add('anibutton-active');
    modal.style.display = 'flex';

    const renderMonster = (isAngry, title, sub) => `
        <div class="anibutton-monster-stage">
            <div class="anibutton-monster-body ${isAngry ? 'anibutton-monster-angry' : 'anibutton-monster-hungry'}">
                ${isAngry ? '🤬' : '🤤'}
            </div>
            <div class="text-center">
                <h3 class="anibutton-monster-main">${title}</h3>
                <p class="anibutton-monster-sub">${sub}</p>
            </div>
        </div>`;

    content.innerHTML = `
        <div class="anibutton-search-view">
            <h2 class="text-2xl font-bold text-white mb-4 tracking-tight">Database Search</h2>
            <input type="text" id="anibutton-search-input" placeholder="Feed me anime names..." autocomplete="off">
            <div id="anibutton-search-grid">
                ${renderMonster(false, "I'm Starving", "Type To Find The Best Series...")}
            </div>
        </div>`;

    const input = document.getElementById('anibutton-search-input');
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const grid = document.getElementById('anibutton-search-grid');
        if (!query) {
            grid.innerHTML = renderMonster(false, "I'm Starving", "Type To Find The Best Series...");
            return;
        }
        let filtered = animes.filter(a => a.name.toLowerCase().startsWith(query));
        if (filtered.length === 0) {
            filtered = animes.filter(a => a.name.toLowerCase().includes(query));
        }
        const isMobile = window.innerWidth <= 768;
        const limit = isMobile ? 2 : 4;
        filtered = filtered.slice(0, limit);
        if (filtered.length === 0) {
            grid.innerHTML = renderMonster(true, "Disgusting!", `"${query}" is nowhere to be found!`);
        } else {
            grid.innerHTML = filtered.map(anime => `
                <div class="anibutton-suggestion-card" onclick="showAnimeDetails(animes.find(a => a.name === '${anime.name.replace(/'/g, "\\'")}'))">
                    <img src="${anime.poster}" class="anibutton-suggestion-poster">
                    <div class="anibutton-suggestion-content">
                        <h3 class="anibutton-suggestion-name">${anime.name}</h3>
                        <div class="anibutton-suggestion-meta">
                            <span class="anibutton-suggestion-rating">${anime.rating}</span>
                            <span class="anibutton-suggestion-episodes">${anime.episodes || '??'} Episodes</span>
                        </div>
                        <p class="anibutton-suggestion-hook">"${anime.hook || 'View details'}"</p>
                    </div>
                </div>`).join('');
        }
    });
};

// --- Trending & Rankings ---
window.handleTrendingClick = () => {
    versusState.activeSource = "Trending";
    const modal = document.getElementById('anibutton-modal-overlay');
    const content = document.getElementById('anibutton-modal-content');
    content.classList.remove('anibutton-details-modal');
    document.body.classList.add('modal-open');
    modal.classList.add('anibutton-active');
    modal.style.display = 'flex';

    const trending = animes.filter(a => a.trending === true);
    content.innerHTML = `
        <div class="anibutton-trending-scene">
            <h2 class="anibutton-trending-title">Trending Now</h2>
            <div class="anibutton-trending-grid">
                ${trending.map(anime => `
                    <div class="anibutton-trending-card" onclick="showAnimeDetails(animes.find(a => a.name === '${anime.name.replace(/'/g, "\\'")}'))">
                        <img src="${anime.poster}">
                        <div class="anibutton-trending-hook">
                            <span class="anibutton-trending-text">Current Trend</span>
                            <h3 class="text-lg font-black uppercase text-white leading-tight mb-1 truncate">${anime.name}</h3>
                            <p class="anibutton-trending-desc">"${anime.hook || 'Highly anticipated series.'}"</p>
                        </div>
                    </div>`).join('')}
            </div>
        </div>`;
};

window.handleRankingsClick = () => {
    versusState.activeSource = "Rankings";
    const modal = document.getElementById('anibutton-modal-overlay');
    const content = document.getElementById('anibutton-modal-content');
    content.classList.remove('anibutton-details-modal');
    document.body.classList.add('modal-open');
    modal.classList.add('anibutton-active');
    modal.style.display = 'flex';

    const tiers = [
        { title: "God Tier", color: "#f97316", filter: "5" },
        { title: "Amazing", color: "#ffffff", filter: "4" },
        { title: "Not Bad", color: "#71717a", filter: "3" }
    ];

    content.innerHTML = `<div class="anibutton-rankings-view">
        ${tiers.map(tier => {
            const list = animes.filter(a => a.rating.includes(tier.filter));
            return list.length ? `
                <div class="anibutton-rank-section">
                    <h2 class="anibutton-rank-header" style="color: ${tier.color}; border-color: ${tier.color};">${tier.title}</h2>
                    <div class="anibutton-rank-row">
                        ${list.map(a => `
                            <div class="anibutton-rank-card" onclick="showAnimeDetails(animes.find(an => an.name === '${a.name.replace(/'/g, "\\'")}'))">
                                <img src="${a.poster}">
                                <div class="anibutton-rank-hook">
                                    <span class="anibutton-rank-hook-text">Quick Hook</span>
                                    <p class="anibutton-rank-hook-desc">${a.hook || 'Explore this elite series...'}</p>
                                </div>
                            </div>`).join('')}
                    </div>
                </div>` : '';
        }).join('')}
    </div>`;
};

// --- Dice Roll ---
window.startHubDiceRoll = () => {
    versusState.activeSource = "Dice";
    const modal = document.getElementById('anibutton-modal-overlay');
    const content = document.getElementById('anibutton-modal-content');
    content.classList.remove('anibutton-details-modal');
    document.body.classList.add('modal-open');
    modal.classList.add('anibutton-active');
    modal.style.display = 'flex';
    content.innerHTML = `<div class="anibutton-dice-scene"><div class="anibutton-loader-ring"></div><p class="mt-16 text-white font-black uppercase tracking-[1em] text-lg opacity-60 animate-pulse">Rolling Destiny</p></div>`;
    setTimeout(() => {
        const pool = animes.map((_, i) => i);
        let available = pool.filter(i => !rollHistory.includes(i));
        if (available.length === 0) { rollHistory = []; available = pool; }
        const chosen = available[Math.floor(Math.random() * available.length)];
        rollHistory.push(chosen);
        if (rollHistory.length > 5) rollHistory.shift();
        showAnimeDetails(animes[chosen]);
    }, 1000);
};

// --- Details View ---

const showAnimeDetails = (data) => {
    const content = document.getElementById('anibutton-modal-content');
    content.classList.add('anibutton-details-modal');
    
    let actionBtn = '';
    const backIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>`;
    const refreshIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>`;

    if (versusState.activeSource === "Versus") actionBtn = `<button onclick="startVersusGame()" class="anibutton-btn-action w-16">${refreshIcon}</button>`;
    else if (versusState.activeSource === "Dice") actionBtn = `<button onclick="startHubDiceRoll()" class="anibutton-btn-action w-16">${refreshIcon}</button>`;
    else if (versusState.activeSource === "Trending") actionBtn = `<button onclick="handleTrendingClick()" class="anibutton-btn-action w-16">${backIcon}</button>`;
    else if (versusState.activeSource === "Rankings") actionBtn = `<button onclick="handleRankingsClick()" class="anibutton-btn-action w-16">${backIcon}</button>`;
    else if (versusState.activeSource === "Write") actionBtn = `<button onclick="startWriteClick()" class="anibutton-btn-action w-16">${backIcon}</button>`;
    else if (versusState.activeSource === "Search") actionBtn = `<button onclick="handleSearchClick()" class="anibutton-btn-action w-16">${backIcon}</button>`;

    content.innerHTML = `
        <div class="w-[45%] h-full bg-cover bg-center border-r border-white/5 shrink-0 flex items-center justify-center bg-zinc-900" style="background-image: url('${data.poster}')"></div>
        <div class="w-[55%] h-full flex flex-col p-12 relative bg-zinc-950/20 overflow-hidden text-left">
            <div class="anibutton-modal-scroll flex-grow">
                <h2 class="text-5xl font-black text-white mb-2 uppercase tracking-tighter leading-none">${data.name}</h2>
                <p class="text-zinc-400 italic text-sm mb-8 border-l-2 border-orange-500/50 pl-4 font-medium">"${data.quote}"</p>
                <div class="flex flex-wrap gap-8 mb-4 items-center">
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Rating</span><span class="text-orange-500 font-black text-2xl">${data.rating}</span></div>
                    <div class="w-px h-8 bg-zinc-800"></div>
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Episodes</span><span class="text-white font-black text-2xl">${data.episodes || '??'}</span></div>
                    <div class="w-px h-8 bg-zinc-800"></div>
                    <div class="flex flex-col"><span class="text-zinc-500 text-[10px] uppercase mb-1">Studio</span><span class="text-white font-black text-2xl">${data.studio || 'N/A'}</span></div>
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
                <button onclick="window.open('${data.watch}')" class="anibutton-btn-primary">Watch Now</button>
                ${data.laugh ? `<button onclick="window.open('${data.laugh}')" class="anibutton-btn-secondary">Laugh</button>` : ''}
                ${actionBtn}
                <button onclick="closeHubModal()" class="anibutton-btn-action w-16">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>`;
};

window.closeHubModal = () => {
    document.body.classList.remove('modal-open');
    document.getElementById('anibutton-modal-overlay').classList.remove('anibutton-active');
    document.getElementById('anibutton-modal-overlay').style.display = 'none';
    document.getElementById('anibutton-modal-content').classList.remove('anibutton-details-modal');
};

document.addEventListener('keydown', (e) => { if (e.key === "Escape") closeHubModal(); });
document.addEventListener('DOMContentLoaded', renderButtons);