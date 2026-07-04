// ==========================================
// GAME STATE
// ==========================================

const state = {
    character: null,
    money: 50,
    happiness: 50,
    familyTrust: 30,
    communityTrust: 0,
    choices: [],
    hasChild: false,
    hasTattoos: false,
    educationPath: false,
    oldFriendsFlag: false,
    bottledEmotions: 0,
    pathHistory: [], // Track player's path through game
    achievements: [] // Track unlocked achievements
};

// Achievement definitions
const ACHIEVEMENTS = {
    first_step: { icon: '👣', title: 'First Steps', description: 'Started your journey' },
    truth_teller: { icon: '💬', title: 'Truth Teller', description: 'Chose honesty at job interview' },
    community_builder: { icon: '🤝', title: 'Community Builder', description: 'Joined support group or café' },
    family_first: { icon: '👨‍👩‍👧', title: 'Family First', description: 'Rebuilt trust with family' },
    education_path: { icon: '📚', title: 'Lifelong Learner', description: 'Enrolled in education' },
    independence: { icon: '🏠', title: 'Independence', description: 'Got your own place' },
    resilience: { icon: '💪', title: 'Resilience', description: 'Overcame major setback' },
    clean_break: { icon: '🚫', title: 'Clean Break', description: 'Cut ties with old friends' },
    vulnerability: { icon: '❤️', title: 'Vulnerability', description: 'Opened up about your past' },
    purpose: { icon: '⭐', title: 'Finding Purpose', description: 'Discovered meaning in helping others' },
    graduation: { icon: '🎓', title: 'Graduate', description: 'Completed education successfully' },
    thriving: { icon: '🌟', title: 'Thriving', description: 'Achieved the best ending' }
};

// Reset game state to default
function resetGameState() {
    state.character = null;
    state.money = 50;
    state.happiness = 50;
    state.familyTrust = 30;
    state.communityTrust = 0;
    state.choices = [];
    state.hasChild = false;
    state.hasTattoos = false;
    state.educationPath = false;
    state.oldFriendsFlag = false;
    state.bottledEmotions = 0;
    state.pathHistory = [];
    state.achievements = [];
    updateStats();
}

// Get character portrait class
function getPortraitClass() {
    return `portrait-${state.character}`;
}

// ==========================================
// ACHIEVEMENT SYSTEM
// ==========================================

function unlockAchievement(achievementId) {
    // Check if already unlocked
    if (state.achievements.includes(achievementId)) return;
    
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;
    
    // Add to unlocked list
    state.achievements.push(achievementId);
    
    // Show popup
    showAchievementPopup(achievement);
    
    // Store in localStorage for persistence
    try {
        localStorage.setItem('steamunity_achievements', JSON.stringify(state.achievements));
    } catch (e) {
        // LocalStorage not available, continue anyway
    }
}

function showAchievementPopup(achievement) {
    const container = document.getElementById('achievement-container');
    if (!container) return;
    
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <div class="achievement-title">
            <span>${achievement.icon}</span>
            <span>Achievement Unlocked!</span>
        </div>
        <div class="achievement-description">${achievement.title}: ${achievement.description}</div>
    `;
    
    container.appendChild(popup);
    
    // Remove after animation completes (4 seconds)
    setTimeout(() => {
        popup.remove();
    }, 4000);
}

// Track path through game
function addToPath(stepName) {
    state.pathHistory.push({
        step: stepName,
        timestamp: Date.now()
    });
}

// ==========================================
// STAT UPDATES WITH ANIMATIONS
// ==========================================

function updateStats() {
    // Clamp values
    state.money = Math.max(0, state.money);
    state.happiness = Math.max(0, Math.min(100, state.happiness));
    state.familyTrust = Math.max(0, Math.min(100, state.familyTrust));
    state.communityTrust = Math.max(0, Math.min(100, state.communityTrust));
    
    // Update text values with animation
    updateStatValue('money-stat', `$${state.money}`);
    updateStatValue('happiness-stat', `${state.happiness}%`);
    updateStatValue('family-stat', `${state.familyTrust}%`);
    updateStatValue('community-stat', `${state.communityTrust}%`);
    
    // Update progress bars
    updateProgressBar('money-progress', Math.min(100, (state.money / 500) * 100));
    updateProgressBar('happiness-progress', state.happiness);
    updateProgressBar('family-progress', state.familyTrust);
    updateProgressBar('community-progress', state.communityTrust);
    
    // Update color coding based on values
    updateStatColor('happiness-stat', state.happiness);
    updateStatColor('family-stat', state.familyTrust);
    updateStatColor('community-stat', state.communityTrust);
    
    // Check for warning states
    if (state.happiness < 20) {
        document.getElementById('happiness-stat').classList.add('warning-state');
    } else {
        document.getElementById('happiness-stat').classList.remove('warning-state');
    }
    
    if (state.bottledEmotions >= 3) {
        document.getElementById('happiness-stat').classList.add('warning-state');
    }
}

function updateStatValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Add pulse animation
    element.classList.add('changing');
    setTimeout(() => element.classList.remove('changing'), 600);
    
    // Update value
    element.textContent = value;
}

function updateProgressBar(barId, percentage) {
    const bar = document.getElementById(barId);
    if (!bar) return;
    
    bar.style.width = `${percentage}%`;
}

function updateStatColor(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Remove existing color classes
    element.classList.remove('low', 'medium', 'high');
    
    // Add appropriate color class
    if (value < 30) {
        element.classList.add('low');
    } else if (value < 70) {
        element.classList.add('medium');
    } else {
        element.classList.add('high');
    }
}

// ==========================================
// CHARACTER DATA
// ==========================================

const characters = {
    lina: {
        name: "Lina",
        age: 29,
        background: "Multiple incarcerations for drug-related offenses. Stopped school at Sec 3. Has a 3-year-old son she left when he was 6 months old.",
        startingStats: { money: 50, happiness: 40, familyTrust: 25, communityTrust: 0 },
        traits: { hasChild: true, hasTattoos: true, educationLevel: "Sec 3" },
        inspiration: "Inspired by Elizabeth's journey"
    },
    marcus: {
        name: "Marcus",
        age: 32,
        background: "Former secret society member. Did youth corrections multiple times. Wants to find purpose beyond the void deck.",
        startingStats: { money: 80, happiness: 45, familyTrust: 20, communityTrust: 5 },
        traits: { hasChild: false, hasTattoos: true, educationLevel: "Sec 2" },
        inspiration: "Inspired by stories from Yellow Ribbon Project"
    },
    sara: {
        name: "Sara",
        age: 26,
        background: "First-time offender. Fell into wrong company. Family is devastated but willing to support if she proves herself.",
        startingStats: { money: 100, happiness: 55, familyTrust: 40, communityTrust: 0 },
        traits: { hasChild: false, hasTattoos: false, educationLevel: "Sec 4" },
        inspiration: "Composite of reintegration challenges"
    }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function updateStats() {
    document.getElementById('money-stat').textContent = `$${state.money}`;
    document.getElementById('happiness-stat').textContent = `${state.happiness}%`;
    document.getElementById('family-stat').textContent = `${state.familyTrust}%`;
    document.getElementById('community-stat').textContent = `${state.communityTrust}%`;
    
    updateStatColor('happiness-stat', state.happiness);
    updateStatColor('family-stat', state.familyTrust);
    updateStatColor('community-stat', state.communityTrust);
}

function updateStatColor(elementId, value) {
    const element = document.getElementById(elementId);
    element.classList.remove('low', 'medium', 'high');
    if (value < 30) element.classList.add('low');
    else if (value < 60) element.classList.add('medium');
    else element.classList.add('high');
}

function showScene(sceneHTML) {
    const content = document.getElementById('game-content');
    content.innerHTML = `<div class="scene">${sceneHTML}</div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// INTRO & CHARACTER SELECTION
// ==========================================

function intro() {
    resetGameState(); // Reset all state variables
    showScene(`
        <h2 class="scene-title">Welcome to STEAMunity</h2>
        <p class="narrative">This is an interactive story based on <strong>real experiences</strong> of ex-offenders reintegrating into Singapore society.</p>
        
        <div class="elizabeth-quote">
            <div class="elizabeth-quote-label">Words from Elizabeth (Real Ex-Offender)</div>
            <p class="reflection-text">"Stay focused and don't follow the butterflies. Think of your family and yourself. All the small mistakes in the future will slowly increase to do something stupid. Think twice."</p>
        </div>

        <p class="narrative">You will face real challenges: stigma, family mistrust, peer pressure, financial struggles, and the weight of your past.</p>
        <p class="narrative">Your choices matter. Every decision ripples forward.</p>
        
        <button class="continue-btn" onclick="chooseCharacter()">Choose Your Path</button>
    `);
}

function chooseCharacter() {
    showScene(`
        <h2 class="scene-title">Choose Your Character</h2>
        <p class="narrative">Each person has a different story, different challenges, and different paths to redemption.</p>
        
        <div class="character-card" onclick="selectCharacter('lina')">
            <div class="character-portrait portrait-lina scene-portrait"></div>
            <div class="character-info">
                <div class="character-name">Lina, 29</div>
                <p class="character-bio">${characters.lina.background}</p>
                <div class="character-stats">
                    <span>💵 Starting Money: $${characters.lina.startingStats.money}</span>
                    <span>🤝 Family Trust: ${characters.lina.startingStats.familyTrust}%</span>
                </div>
                <p style="margin-top: 10px; font-size: 0.9rem; font-style: italic; color: var(--accent-cool);">${characters.lina.inspiration}</p>
            </div>
        </div>

        <div class="character-card" onclick="selectCharacter('marcus')">
            <div class="character-portrait portrait-marcus scene-portrait"></div>
            <div class="character-info">
                <div class="character-name">Marcus, 32</div>
                <p class="character-bio">${characters.marcus.background}</p>
                <div class="character-stats">
                    <span>💵 Starting Money: $${characters.marcus.startingStats.money}</span>
                    <span>🤝 Family Trust: ${characters.marcus.startingStats.familyTrust}%</span>
                </div>
                <p style="margin-top: 10px; font-size: 0.9rem; font-style: italic; color: var(--accent-cool);">${characters.marcus.inspiration}</p>
            </div>
        </div>

        <div class="character-card" onclick="selectCharacter('sara')">
            <div class="character-portrait portrait-sara scene-portrait"></div>
            <div class="character-info">
                <div class="character-name">Sara, 26</div>
                <p class="character-bio">${characters.sara.background}</p>
                <div class="character-stats">
                    <span>💵 Starting Money: $${characters.sara.startingStats.money}</span>
                    <span>🤝 Family Trust: ${characters.sara.startingStats.familyTrust}%</span>
                </div>
                <p style="margin-top: 10px; font-size: 0.9rem; font-style: italic; color: var(--accent-cool);">${characters.sara.inspiration}</p>
            </div>
        </div>
    `);
}

function selectCharacter(charKey) {
    state.character = charKey;
    const char = characters[charKey];
    state.money = char.startingStats.money;
    state.happiness = char.startingStats.happiness;
    state.familyTrust = char.startingStats.familyTrust;
    state.communityTrust = char.startingStats.communityTrust;
    state.hasChild = char.traits.hasChild;
    state.hasTattoos = char.traits.hasTattoos;
    updateStats();
    
    showIntroScene();
}

function showIntroScene() {
    const char = characters[state.character];
    
    showScene(`
        <div class="character-portrait ${getPortraitClass()} scene-portrait"></div>
        <h2 class="scene-title">Day 1: The Gates of Changi</h2>
        
        <div class="scene-illustration illustration-prison"></div>
        
        <p class="narrative">You are <strong>${char.name}</strong>, ${char.age} years old.</p>
        <p class="narrative">${char.background}</p>
        <p class="narrative emphasis">The metal gates close behind you. You're free. But what does freedom even mean now?</p>
        <p class="narrative">In your pocket: $${state.money}. In your heart: a mix of hope and fear.</p>
        <p class="narrative">Your phone buzzes. Multiple messages. Family. Old friends. A Yellow Ribbon counsellor.</p>
        
        ${state.hasChild ? `
        <p class="narrative" style="color: var(--warning);">Your child is ${state.character === 'lina' ? '3 years old now' : 'waiting to meet you'}. You've missed so much time.</p>
        ` : ''}
        
        <div class="reflection">
            <div class="reflection-label">Elizabeth's Wisdom</div>
            <p class="reflection-text">"When I was first released, I was concerned about friends and surroundings. Peer influence is the most important thing for youths. Your circle of friends is very important."</p>
        </div>
        
        <button class="continue-btn" onclick="actOneHousing()">Face Your First Decision</button>
    `);
}

// ==========================================
// ACT 1: HOUSING DECISION
// ==========================================

function actOneHousing() {
    showScene(`
        <h2 class="scene-title">Act 1: Where Will You Stay?</h2>
        <p class="narrative">You need a place to sleep tonight.</p>
        <p class="narrative">Your family has offered their home, but you can feel the tension in their messages. ${state.familyTrust < 30 ? 'They barely trust you.' : 'They\'re willing to give you a chance.'}</p>
        <p class="narrative">There's also a government halfway house with structured support, mandatory counseling, and curfews.</p>
        
        <div class="choices">
            <div class="choices-prompt">Where will you go?</div>
            <button class="choice-btn" onclick="chooseFamily()">
                Stay with Family (Free, but constant judgment and awkward silences)
            </button>
            <button class="choice-btn" onclick="chooseHalfway()">
                Halfway House ($15/night, structure and independence, meet others like you)
            </button>
            ${state.money >= 300 ? `
            <button class="choice-btn" onclick="chooseRental()">
                Rent a Room ($300/month, complete independence but isolating)
            </button>
            ` : ''}
        </div>
    `);
}

function chooseFamily() {
    state.familyTrust += 10;
    state.happiness -= 15;
    state.bottledEmotions += 1;
    state.choices.push('family');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Family Home</h2>
        
        <div class="scene-illustration illustration-family"></div>
        
        <p class="narrative">Your mother opens the door. The hug is stiff.</p>
        <p class="narrative">"Don't bring any trouble here," she says quietly.</p>
        ${state.hasChild ? `
        <p class="narrative emphasis">Your child is in the living room. They don't recognize you. They hide behind grandma.</p>
        <p class="narrative">That night, you lie in your old room. The walls still have posters from when you were younger, before everything fell apart.</p>
        ` : `
        <p class="narrative">That night, you hear your siblings talking about you in the next room. They think you can't hear.</p>
        <p class="narrative">"Can we really trust them? What if they steal from us?"</p>
        `}
        
        <div class="reflection">
            <div class="reflection-label">Real Story - From Everyday People SG</div>
            <p class="reflection-text">"Caught for the second time, I lost the trust of family. Even after my third release, it took 2-3 years before they started trusting me again."</p>
        </div>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Emotional Pressure Increasing</div>
            <p>Bottling up feelings in front of family. You need to talk to someone soon.</p>
        </div>
        
        <button class="continue-btn" onclick="familyRulesScene()">Continue</button>
    `);
}

function familyRulesScene() {
    showScene(`
        <h2 class="scene-title">The House Rules</h2>
        <p class="narrative">The next morning, your mother sits you down at the kitchen table.</p>
        <p class="narrative">"There are rules if you're staying here," she says. "10pm curfew. No friends over. Help with chores. And you need to find a job within two weeks."</p>
        <p class="narrative">Your younger sibling rolls their eyes. "Why do they get special treatment? I don't have a curfew anymore."</p>
        <p class="narrative">You feel your face getting hot. You're being treated like a child. But this is their house.</p>
        
        <div class="choices">
            <div class="choices-prompt">How do you respond?</div>
            <button class="choice-btn" onclick="acceptFamilyRules()">
                Accept the rules gracefully. "Thank you for letting me stay. I'll follow your rules."
            </button>
            <button class="choice-btn" onclick="negotiateFamilyRules()">
                Try to negotiate. "Can we discuss the curfew? I'm an adult and I need some independence."
            </button>
            <button class="choice-btn" onclick="silentResentment()">
                Say nothing. Just nod and leave the room. (You're angry but you need the free housing)
            </button>
        </div>
    `);
}

function acceptFamilyRules() {
    state.familyTrust += 15;
    state.happiness -= 5;
    state.choices.push('accepted_rules');
    updateStats();

    showScene(`
        <h2 class="scene-title">Rebuilding Trust</h2>
        <p class="narrative">"Thank you for letting me stay," you say. "I understand. I'll follow your rules."</p>
        <p class="narrative">Your mother's shoulders relax slightly. "Good. We're trying to help you."</p>
        <p class="narrative">Over the next few days, you come home before curfew, do the dishes without being asked, and stay out of everyone's way.</p>
        <p class="narrative">It's humbling. It hurts your pride. But you're slowly earning back their trust.</p>
        
        <div class="reflection">
            <div class="reflection-label">Small Steps</div>
            <p class="reflection-text">Rebuilding trust requires swallowing your pride. Actions speak louder than words.</p>
        </div>
        
        <button class="continue-btn" onclick="breakthroughCafe()">Continue</button>
    `);
}

function negotiateFamilyRules() {
    state.familyTrust -= 10;
    state.happiness += 5;
    state.bottledEmotions += 1;
    state.choices.push('negotiated_rules');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Argument</h2>
        <p class="narrative">"Can we discuss the curfew?" you ask. "I'm an adult. I need some independence."</p>
        <p class="narrative">Your mother's face hardens. "You want independence? Then get your own place."</p>
        <p class="narrative">"When you were 'independent' before, you ended up in prison," your sibling mutters.</p>
        <p class="narrative emphasis">The room goes silent. That word—prison—hangs in the air.</p>
        <p class="narrative">You back down. "Okay. 10pm. I understand."</p>
        <p class="narrative">But the damage is done. They see you as someone who still doesn't get it.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Trust Damaged</div>
            <p>Trying to negotiate too early made them think you haven't changed. Trust is even harder now.</p>
        </div>
        
        <button class="continue-btn" onclick="breakthroughCafe()">Continue</button>
    `);
}

function silentResentment() {
    state.happiness -= 15;
    state.bottledEmotions += 2;
    state.familyTrust += 5;
    state.choices.push('silent_resentment');
    updateStats();

    showScene(`
        <h2 class="scene-title">Swallowing It Down</h2>
        <p class="narrative">You say nothing. You just nod and walk to your room.</p>
        <p class="narrative">You're 29 years old with a curfew. Being treated like a teenager. Like you can't be trusted.</p>
        <p class="narrative">And the worst part? They're right. You broke their trust. This is the consequence.</p>
        <p class="narrative">That night, you punch your pillow until your knuckles hurt. But you don't talk to anyone about it.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Dangerous Pattern</div>
            <p>You're bottling up anger and resentment. This is building toward an explosion. You need to talk to someone.</p>
        </div>
        
        <div class="elizabeth-quote">
            <div class="elizabeth-quote-label">Elizabeth's Warning</div>
            <p class="reflection-text">"Youths should not bottle it up. When you bottle stuff up, your mind might have darker ideas. Talk to a counselor or mentor to solve problems."</p>
        </div>
        
        <button class="continue-btn" onclick="breakthroughCafe()">Continue</button>
    `);
}

function chooseHalfway() {
    state.money -= 15;
    state.happiness -= 5;
    state.communityTrust += 10;
    state.choices.push('halfway');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Halfway House</h2>
        
        <div class="scene-illustration illustration-halfway"></div>
        
        <p class="narrative">The building smells like disinfectant and instant noodles. Your room is small but it's yours.</p>
        <p class="narrative">At the community dinner, you meet others:</p>
        <p class="narrative"><strong>Aminah</strong> (42): "Been here 8 months. Working as a cleaner. My daughter finally agreed to see me next week."</p>
        <p class="narrative"><strong>Kumar</strong> (35): "Just started a diploma in social work. Takes time but it's worth it."</p>
        <p class="narrative">For the first time today, you don't feel completely alone.</p>
        
        <div class="reflection">
            <div class="reflection-label">Reflection</div>
            <p class="reflection-text">Independence has a price. But sometimes, paying for your own space means paying for your dignity and peace of mind.</p>
        </div>
        
        <button class="continue-btn" onclick="halfwayConnectionScene()">Continue</button>
    `);
}

function halfwayConnectionScene() {
    showScene(`
        <h2 class="scene-title">Building Community</h2>
        <p class="narrative">After dinner, Aminah invites you to join a weekly support group in the common room.</p>
        <p class="narrative">"We talk about our struggles, help each other with job applications, that kind of thing. Totally voluntary, but... it helps."</p>
        <p class="narrative">Kumar adds: "Plus, Thursday nights we order prata and watch football. More fun than sitting alone, right?"</p>
        <p class="narrative">You're tired. The idea of talking about your feelings with strangers sounds exhausting. But maybe connection is what you need?</p>
        
        <div class="choices">
            <div class="choices-prompt">Do you join the support group?</div>
            <button class="choice-btn" onclick="joinSupportGroup()">
                Join the group. You need community and these people understand what you're going through.
            </button>
            <button class="choice-btn" onclick="stayIsolated()">
                Politely decline. "Maybe next time." You need time alone to process everything.
            </button>
            <button class="choice-btn" onclick="justSocialEvents()">
                "I'll come for the football, but skip the support group." (You want connection but not vulnerability)
            </button>
        </div>
    `);
}

function joinSupportGroup() {
    state.happiness += 20;
    state.communityTrust += 20;
    state.bottledEmotions = Math.max(0, state.bottledEmotions - 2);
    state.choices.push('support_group');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Support Circle</h2>
        <p class="narrative">That Thursday, you sit in a circle with eight other people. Everyone has a story.</p>
        <p class="narrative">When it's your turn, you start to say "I'm fine" but then... you break.</p>
        <p class="narrative">"I'm terrified," you admit. "I'm scared I'll mess this up again. I'm scared no one will ever trust me."</p>
        <p class="narrative emphasis">And they get it. No judgment. Just understanding nods.</p>
        <p class="narrative">Aminah says: "That fear? That's normal. That's what keeps you careful. Use it."</p>
        <p class="narrative">For the first time since release, you feel seen.</p>
        
        <div class="reflection">
            <div class="reflection-label">The Power of Connection</div>
            <p class="reflection-text">Research shows peer support groups reduce recidivism by 40%. Shared experiences create accountability and hope.</p>
        </div>
        
        <button class="continue-btn" onclick="breakthroughCafe()">Continue</button>
    `);
}

function stayIsolated() {
    state.happiness -= 10;
    state.bottledEmotions += 1;
    state.communityTrust += 5;
    state.choices.push('isolated');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Lonely Path</h2>
        <p class="narrative">"Maybe next time," you say.</p>
        <p class="narrative">You retreat to your room. You can hear laughter from the common room. The smell of prata wafts down the hallway.</p>
        <p class="narrative">You scroll through social media. Everyone else seems to have their life together.</p>
        <p class="narrative">The walls feel like they're closing in.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Isolation Risk</div>
            <p>Avoiding connection feels safe, but isolation increases relapse risk. You need support.</p>
        </div>
        
        <button class="continue-btn" onclick="breakthroughCafe()">Continue</button>
    `);
}

function justSocialEvents() {
    state.happiness += 10;
    state.communityTrust += 10;
    state.choices.push('surface_connection');
    updateStats();

    showScene(`
        <h2 class="scene-title">Surface Connections</h2>
        <p class="narrative">You join them for football on Thursday. You laugh, eat prata, cheer for your team.</p>
        <p class="narrative">It's nice. But when Kumar asks "How are you really doing?" you deflect.</p>
        <p class="narrative">"I'm good, bro. Just taking it one day at a time."</p>
        <p class="narrative">They don't push. But you can see in Aminah's eyes—she knows you're not really letting them in.</p>
        
        <div class="reflection">
            <div class="reflection-label">Vulnerability Takes Time</div>
            <p class="reflection-text">Surface friendships help, but true support requires vulnerability. It's okay to go slow.</p>
        </div>
        
        <button class="continue-btn" onclick="breakthroughCafe()">Continue</button>
    `);
}

// NEW: Breakthrough Café Scene
function breakthroughCafe() {
    showScene(`
        <h2 class="scene-title">Breakthrough Café</h2>
        
        <div class="scene-illustration illustration-cafe"></div>
        
        <p class="narrative">Walking back from the bus stop, you notice a small café you've never seen before.</p>
        <p class="narrative">The sign reads: <strong>"Breakthrough Café - Where Second Chances Brew"</strong></p>
        <p class="narrative">Through the window, you see people laughing, talking. Behind the counter, someone with visible tattoos is making coffee.</p>
        <p class="narrative">A sign on the door: "Run by ex-offenders. Everyone welcome. Every story matters."</p>
        <p class="narrative emphasis">You see the cage of your past starting to open. Maybe there's a community here?</p>
        
        <div class="elizabeth-quote">
            <div class="elizabeth-quote-label">The Power of Shared Stories</div>
            <p class="reflection-text">"People feel more comfortable talking to people who understand what they've gone through. That's why I want to help others now."</p>
        </div>
        
        <div class="choices">
            <div class="choices-prompt">Do you enter?</div>
            <button class="choice-btn" onclick="enterBreakthrough()">
                Enter the café. Join them. Maybe they understand.
            </button>
            <button class="choice-btn" onclick="skipBreakthrough()">
                Keep walking. You're not ready to share your story yet.
            </button>
        </div>
    `);
}

function enterBreakthrough() {
    state.happiness += 25;
    state.communityTrust += 20;
    state.choices.push('breakthrough_joined');
    updateStats();

    showScene(`
        <h2 class="scene-title">A Circle of Understanding</h2>
        <p class="narrative">Inside, everyone shares their life stories over coffee.</p>
        <p class="narrative"><strong>Wei Jun</strong> (28): "I spent 4 years inside for robbery. Now I'm learning to be a barista. Third month on the job."</p>
        <p class="narrative"><strong>Priya</strong> (35): "Drug trafficking. 8 years. My daughter didn't recognize me when I got out. Now she comes here after school sometimes."</p>
        <p class="narrative">They ask if you want to share. You hesitate, then speak.</p>
        <p class="narrative emphasis">For the first time, people don't look away when you mention prison. They just... listen.</p>
        <p class="narrative">"Come back anytime," Wei Jun says. "We're here Tuesday and Thursday evenings. Free coffee for anyone trying."</p>
        
        <div class="reflection">
            <div class="reflection-label">Community as Medicine</div>
            <p class="reflection-text">Research from Yellow Ribbon Singapore shows that ex-offenders with strong peer support networks have 60% lower recidivism rates. Shared stories reduce shame and isolation.</p>
        </div>
        
        <button class="continue-btn" onclick="actTwoOldFriend()">Continue</button>
    `);
}

function skipBreakthrough() {
    state.happiness -= 5;
    state.bottledEmotions += 1;
    state.choices.push('breakthrough_skipped');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Weight of Silence</h2>
        <p class="narrative">You keep walking. Too many people. Too many questions you're not ready to answer.</p>
        <p class="narrative">But as you walk away, you feel heavier somehow.</p>
        <p class="narrative">Everyone in that café looked... free. Like they'd put down a weight you're still carrying.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Isolation Warning</div>
            <p>Keeping your story locked inside makes it harder to heal. You need connection eventually.</p>
        </div>
        
        <button class="continue-btn" onclick="actTwoOldFriend()">Continue</button>
    `);
}

function chooseRental() {
    state.money -= 300;
    state.happiness -= 10;
    state.choices.push('rental');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Rental Room</h2>
        <p class="narrative">It's a tiny room in a shared flat. The landlord asked no questions when you paid cash.</p>
        <p class="narrative">Your roommates are foreign workers. They keep to themselves.</p>
        <p class="narrative">You have complete freedom. But as night falls, the silence is overwhelming.</p>
        <p class="narrative">No family judgment. But also... no family.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Isolation Risk</div>
            <p>Social isolation is a major risk factor for relapse. Consider building connections.</p>
        </div>
        
        <button class="continue-btn" onclick="actTwoOldFriend()">Continue</button>
    `);
}

// ==========================================
// ACT 2: OLD FRIEND TEMPTATION
// ==========================================

function actTwoOldFriend() {
    showScene(`
        <h2 class="scene-title">Act 2: A Message from the Past</h2>
        <p class="narrative">Three days into your new life, your phone buzzes.</p>
        <p class="narrative emphasis">"Eh bro/sis, heard you're out. Come meet lah. Just catch up only."</p>
        <p class="narrative">It's from someone you knew before. Someone who was part of your old life.</p>
        <p class="narrative">You remember the good times. The feeling of belonging. But you also remember where that road led.</p>
        
        <div class="elizabeth-quote">
            <div class="elizabeth-quote-label">Elizabeth's Warning</div>
            <p class="reflection-text">"What we should focus on for youths is peer influence. Your circle of friends is very important. When you feel troubled or have issues unsolved, you should not bottle it up. Talk to a counselor or teacher instead."</p>
        </div>
        
        <div class="choices">
            <div class="choices-prompt">How do you respond?</div>
            <button class="choice-btn" onclick="ignoreOldFriend()">
                Ignore the message. Block the number. You can't risk it.
            </button>
            <button class="choice-btn" onclick="meetOldFriend()">
                Meet them. Just for coffee. You're lonely and they understand you.
            </button>
            <button class="choice-btn" onclick="talkToCounselor()">
                Don't respond yet. Talk to your Yellow Ribbon counselor first.
            </button>
        </div>
    `);
}

function ignoreOldFriend() {
    state.happiness -= 10;
    state.communityTrust += 5;
    state.choices.push('ignored_friend');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Lonely Choice</h2>
        <p class="narrative">You block the number.</p>
        <p class="narrative">That night, you sit alone. Your finger hovers over social media, looking at pictures of your old life.</p>
        <p class="narrative">Everyone looks so happy. So connected.</p>
        <p class="narrative">You wonder: Did you make the right choice?</p>
        
        <div class="reflection">
            <div class="reflection-label">Reality Check</div>
            <p class="reflection-text">Research shows old social networks are the #1 cause of recidivism. But cutting ties is emotionally painful. You need new support systems.</p>
        </div>
        
        <button class="continue-btn" onclick="actThreeJobHunt()">Continue</button>
    `);
}

function meetOldFriend() {
    state.happiness += 10;
    state.communityTrust -= 15;
    state.familyTrust -= 10;
    state.oldFriendsFlag = true;
    state.choices.push('met_friend');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Meetup</h2>
        <p class="narrative">You meet at the old void deck. They look the same—easy smile, confident posture.</p>
        <p class="narrative">"Good to see you, bro/sis. We missed you."</p>
        <p class="narrative">For an hour, it feels normal. Like no time has passed.</p>
        <p class="narrative">Then they say: "Eh, I got one job for you. Easy money. Just help me hold some stuff for a few days."</p>
        <p class="narrative emphasis">Your stomach drops. You realize: This was never just about catching up.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Critical Decision Point</div>
            <p>This is a trap. Old connections rarely want to "just catch up." They will pull you back.</p>
        </div>
        
        <div class="choices">
            <div class="choices-prompt">What do you do?</div>
            <button class="choice-btn" onclick="refuseAndLeave()">
                Refuse immediately and leave. Cut all contact.
            </button>
            <button class="choice-btn" onclick="considerIt()">
                "Let me think about it..." (You need the money)
            </button>
        </div>
    `);
}

function talkToCounselor() {
    state.happiness += 5;
    state.communityTrust += 15;
    state.bottledEmotions = Math.max(0, state.bottledEmotions - 1);
    state.choices.push('counselor');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Counseling Session</h2>
        <p class="narrative">You meet Ms. Tan at the Yellow Ribbon office.</p>
        <p class="narrative">"It's normal to feel lonely," she says. "But old connections rarely want to 'just catch up.' They see you as useful."</p>
        <p class="narrative">She helps you understand: You're not rejecting friendship. You're rejecting a path that leads back to prison.</p>
        <p class="narrative">"Let me connect you with some community groups. People who've been where you are. People who understand."</p>
        
        <div class="reflection">
            <div class="reflection-label">Elizabeth's Advice</div>
            <p class="reflection-text">"Youths should open up with a counselor or teacher instead of bottling stuff up. Your mind might have darker ideas from bottling stuff up. Talking to a mentor can solve problems and change your mindset."</p>
        </div>
        
        <button class="continue-btn" onclick="actThreeJobHunt()">Continue</button>
    `);
}

function refuseAndLeave() {
    state.happiness -= 5;
    state.communityTrust += 10;
    state.choices.push('refused_trap');
    updateStats();

    showScene(`
        <h2 class="scene-title">Walking Away</h2>
        <p class="narrative">"I can't," you say. "I'm trying to change."</p>
        <p class="narrative">They scoff. "Change? You think you're better than us now?"</p>
        <p class="narrative">You walk away. Your hands are shaking. But you did it.</p>
        
        <div class="reflection">
            <div class="reflection-label">Small Victory</div>
            <p class="reflection-text">Breaking old patterns is painful. But every time you walk away, you get stronger.</p>
        </div>
        
        <button class="continue-btn" onclick="actThreeJobHunt()">Continue</button>
    `);
}

function considerIt() {
    state.happiness -= 25;
    state.familyTrust -= 20;
    state.communityTrust -= 20;
    state.choices.push('trap_failed');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Close Call</h2>
        <p class="narrative">You agree. They give you a package. "Just hold it for 3 days."</p>
        <p class="narrative">That night, you can't sleep. You know what's in the package.</p>
        <p class="narrative">The next day, you see a police car in your neighborhood. Your heart races.</p>
        <p class="narrative emphasis">You throw the package away in a random trash bin and never answer their calls again.</p>
        <p class="narrative">You almost threw everything away. You almost went back.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Serious Setback</div>
            <p>You've lost significant trust and mental health. This nearly destroyed your second chance.</p>
        </div>
        
        <div class="reflection">
            <div class="reflection-label">Reality - From Research</div>
            <p class="reflection-text">Studies show that reconnecting with old criminal networks is the single biggest predictor of recidivism. Breaking these ties is essential for successful reintegration.</p>
        </div>
        
        <button class="continue-btn" onclick="actThreeJobHunt()">Continue</button>
    `);
}

// ==========================================
// ACT 3: JOB HUNTING
// ==========================================

function actThreeJobHunt() {
    showScene(`
        <h2 class="scene-title">Act 3: The Job Search</h2>
        <p class="narrative">You need a job. Your money is running out.</p>
        <p class="narrative">You've applied to 15 places. Most never respond. A few reject you immediately when they see the gap in your resume.</p>
        <p class="narrative">Finally, you get an interview: A logistics company needs warehouse packers.</p>
        <p class="narrative">The manager seems friendly. Then she asks:</p>
        <p class="narrative emphasis">"I notice there's a two-year gap in your work history. Can you explain?"</p>
        
        <div class="choices">
            <div class="choices-prompt">How do you respond?</div>
            <button class="choice-btn" onclick="beHonestJob()">
                Be completely honest: "I was incarcerated, but I've completed rehabilitation and I'm committed to rebuilding my life."
            </button>
            <button class="choice-btn" onclick="lieAboutJob()">
                Lie: "I was doing freelance work and taking care of family matters."
            </button>
            <button class="choice-btn" onclick="vagueTruthJob()">
                Be vague: "I was dealing with personal issues, but I'm ready to work now."
            </button>
        </div>
    `);
}

function beHonestJob() {
    state.happiness += 15;
    state.communityTrust += 20;
    state.money += 60;
    state.choices.push('honest_job');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Honest Path</h2>
        <p class="narrative">You tell the truth. You watch her face carefully.</p>
        <p class="narrative">She pauses. Makes a note. "I appreciate your honesty. That takes courage."</p>
        <p class="narrative">"We have a night shift position available. It pays $1,800/month—less than day shift, but the work is steady."</p>
        <p class="narrative">You got the job! But there's a "stigma tax"—lower pay, worse hours.</p>
        
        <div class="reflection">
            <div class="reflection-label">Reality Check - The "Stigma Tax"</div>
            <p class="reflection-text">Research shows ex-offenders who are honest often face systematic discrimination: 20-30% lower wages, limited to night shifts, slower promotions. But honesty builds trust, which matters long-term.</p>
        </div>
        
        <button class="continue-btn" onclick="firstDayAtWork()">Continue</button>
    `);
}

function lieAboutJob() {
    state.happiness -= 20;
    state.communityTrust = 10;
    state.money += 100;
    state.bottledEmotions += 2;
    state.choices.push('lied_job');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Hidden Truth</h2>
        <p class="narrative">She smiles. "That must have been challenging. Welcome to the team. Day shift, $2,200/month."</p>
        <p class="narrative">You shake her hand. The money is better. The hours are better.</p>
        <p class="narrative">But that night, you can't sleep. Every time you close your eyes, you imagine being discovered.</p>
        <p class="narrative">A background check you missed. A coworker who recognizes you. The fear sits in your chest like a stone.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Living with Fear</div>
            <p>The constant anxiety of hiding your past creates chronic stress. This affects mental health and relationships.</p>
        </div>
        
        <button class="continue-btn" onclick="firstDayAtWork()">Continue</button>
    `);
}

function vagueTruthJob() {
    state.happiness -= 5;
    state.communityTrust += 5;
    state.money += 75;
    state.choices.push('vague_job');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Middle Ground</h2>
        <p class="narrative">She looks skeptical but doesn't push. "Alright. We'll start you on day shift, $1,900/month. Probation period is 6 months."</p>
        <p class="narrative">You got the job, but you feel like you're walking on eggshells.</p>
        <p class="narrative">What if she finds out? What if someone recognizes you?</p>
        
        <button class="continue-btn" onclick="firstDayAtWork()">Continue</button>
    `);
}

function firstDayAtWork() {
    showScene(`
        <h2 class="scene-title">First Day at the Warehouse</h2>
        
        <div class="scene-illustration illustration-workplace"></div>
        
        <p class="narrative">Your first day. You're assigned to pack boxes with two other workers: <strong>Muthu</strong> (50s, been here 10 years) and <strong>Jenny</strong> (20s, university student doing part-time).</p>
        <p class="narrative">During lunch break, Jenny asks the dreaded question: "So what were you doing before this?"</p>
        <p class="narrative">Muthu glances at you, curious.</p>
        ${state.choices.includes('honest_job') ? `
        <p class="narrative">You were honest with the manager. But do you need to tell your coworkers too?</p>
        ` : `
        <p class="narrative">You lied to the manager. Now you have to keep the story straight with coworkers too.</p>
        `}
        
        <div class="choices">
            <div class="choices-prompt">What do you say?</div>
            <button class="choice-btn" onclick="tellCoworkersHonest()">
                Be honest: "I was incarcerated. I'm rebuilding my life now."
            </button>
            <button class="choice-btn" onclick="vagueWithCoworkers()">
                Keep it vague: "I was dealing with some personal stuff. But I'm good now."
            </button>
            <button class="choice-btn" onclick="deflectAndChangeSubject()">
                Deflect: "Boring stuff, not worth talking about. What about you, Jenny? How's uni?"
            </button>
        </div>
    `);
}

function tellCoworkersHonest() {
    if (state.choices.includes('honest_job')) {
        state.happiness += 10;
        state.communityTrust += 15;
    } else {
        state.happiness -= 15;
        state.communityTrust -= 10;
        state.bottledEmotions += 1;
    }
    state.choices.push('told_coworkers');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Coworker Reaction</h2>
        <p class="narrative">"I was incarcerated," you say quietly. "Drug-related offense. I served my time. I'm trying to rebuild my life."</p>
        <p class="narrative">Silence.</p>
        <p class="narrative">Jenny's eyes widen. She shifts slightly away.</p>
        <p class="narrative">But Muthu nods slowly. "Takes guts to be honest. I respect that."</p>
        <p class="narrative">"My cousin went through something similar," he continues. "It's not easy. But you're here, you're working. That's what matters."</p>
        <p class="narrative emphasis">Jenny stays quiet for the rest of lunch. She starts avoiding you after that.</p>
        
        <div class="reflection">
            <div class="reflection-label">Mixed Reactions</div>
            <p class="reflection-text">Honesty doesn't guarantee acceptance. Some people will support you. Others will pull away. That's their choice to make.</p>
        </div>
        
        <button class="continue-btn" onclick="actFourTattooIncident()">Continue</button>
    `);
}

function vagueWithCoworkers() {
    state.happiness -= 5;
    state.bottledEmotions += 1;
    state.choices.push('vague_coworkers');
    updateStats();

    showScene(`
        <h2 class="scene-title">Keeping Secrets</h2>
        <p class="narrative">"Just dealing with some personal stuff," you say. "Family issues, you know. But I'm good now."</p>
        <p class="narrative">Jenny seems satisfied. The conversation moves on.</p>
        <p class="narrative">But every time they ask questions about your past, you have to dodge. Where did you work before? Which school did you go to? Why the gap?</p>
        <p class="narrative">The lies get more complicated. You have to remember what you've said to whom.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Web of Lies</div>
            <p>Each lie requires more lies. The fear of exposure grows daily.</p>
        </div>
        
        <button class="continue-btn" onclick="actFourTattooIncident()">Continue</button>
    `);
}

function deflectAndChangeSubject() {
    state.happiness += 5;
    state.communityTrust += 5;
    state.choices.push('deflected');
    updateStats();

    showScene(`
        <h2 class="scene-title">Steering Clear</h2>
        <p class="narrative">"Boring stuff, not worth talking about," you say with a smile. "What about you, Jenny? How's uni?"</p>
        <p class="narrative">She lights up, talking about her marketing major. The moment passes.</p>
        <p class="narrative">Muthu gives you a knowing look. He doesn't press. Maybe he's been around long enough to recognize when someone needs privacy.</p>
        <p class="narrative">You've bought yourself time. But eventually, people will wonder.</p>
        
        <button class="continue-btn" onclick="workplaceConflict()">Continue</button>
    `);
}

// NEW: Workplace Discrimination Scene
function workplaceConflict() {
    addToPath('Workplace Challenge');
    
    showScene(`
        <h2 class="scene-title">The Manager's Office</h2>
        
        <div class="scene-illustration illustration-workplace"></div>
        
        <p class="narrative">Two weeks into the job. You've been working hard, arriving early, staying late.</p>
        <p class="narrative">Your manager calls you into the office. Her expression is cold.</p>
        <p class="narrative">"Someone told me about your... background," she says, not meeting your eyes.</p>
        <p class="narrative emphasis">${state.choices.includes('honest_job') ? 'You were honest in the interview. But now she seems different. Like she regrets hiring you.' : 'Someone found out. Maybe a background check you missed. Maybe gossip.'}</p>
        <p class="narrative">"I need you to understand—we have a reputation to maintain. Some of our clients are... sensitive."</p>
        <p class="narrative">"I'm moving you to the back warehouse. No customer contact. And I'm cutting you to part-time hours."</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Workplace Discrimination</div>
            <p>This is illegal in Singapore under the Fair Consideration Framework, but it happens. Many ex-offenders face this.</p>
        </div>
        
        <div class="choices">
            <div class="choices-prompt">How do you respond?</div>
            <button class="choice-btn" onclick="acceptDemotion()">
                Accept it quietly. You need this job. Swallow your pride.
            </button>
            <button class="choice-btn" onclick="pushBackRespectfully()">
                Push back respectfully: "I've been doing good work. This isn't fair. Give me a chance to prove myself."
            </button>
            <button class="choice-btn" onclick="quitInProtest()">
                Quit on the spot. You don't need this discrimination. Walk out with dignity.
            </button>
        </div>
    `);
}

function acceptDemotion() {
    state.happiness -= 20;
    state.money -= 40; // Part-time = less pay
    state.bottledEmotions += 2;
    state.choices.push('accepted_demotion');
    unlockAchievement('resilience');
    updateStats();

    showScene(`
        <h2 class="scene-title">Swallowing Injustice</h2>
        <p class="narrative">"Okay," you say quietly. "I understand."</p>
        <p class="narrative">You don't understand. But you need the money.</p>
        <p class="narrative">That night, you lie in bed staring at the ceiling. The anger sits in your chest like a stone.</p>
        <p class="narrative emphasis">You're doing everything right. But it's never enough.</p>
        
        <div class="reflection">
            <div class="reflection-label">The Weight of Stigma</div>
            <p class="reflection-text">Studies show 68% of Singapore ex-offenders face workplace discrimination despite doing good work. The "second chance" rhetoric doesn't always match reality.</p>
        </div>
        
        <button class="continue-btn" onclick="mentorIntervention()">Continue</button>
    `);
}

function pushBackRespectfully() {
    state.happiness -= 10;
    state.familyTrust += 10; // Standing up for yourself
    state.communityTrust += 15;
    state.choices.push('pushed_back');
    unlockAchievement('resilience');
    updateStats();

    showScene(`
        <h2 class="scene-title">Standing Your Ground</h2>
        <p class="narrative">"With respect, I've been doing good work," you say firmly. "My past doesn't define my present. Give me a month to prove myself."</p>
        <p class="narrative">She shifts uncomfortably. "I... I'll think about it."</p>
        <p class="narrative">Two days later, she calls you back. "Fine. One month. But one mistake and you're done."</p>
        <p class="narrative emphasis">You kept your position. But the trust is fragile. You're walking on eggshells now.</p>
        
        <div class="reflection">
            <div class="reflection-label">Advocacy Works</div>
            <p class="reflection-text">Sometimes, respectfully standing up for yourself opens doors. But it requires confidence many ex-offenders struggle to have.</p>
        </div>
        
        <button class="continue-btn" onclick="mentorIntervention()">Continue</button>
    `);
}

function quitInProtest() {
    state.happiness += 10; // Dignity restored
    state.money -= 80; // But lost income
    state.communityTrust -= 10;
    state.choices.push('quit_job');
    updateStats();

    showScene(`
        <h2 class="scene-title">Walking Out</h2>
        <p class="narrative">"I don't need this," you say, standing up. "I'm done being treated like a criminal when I've served my time."</p>
        <p class="narrative">You walk out, head high.</p>
        <p class="narrative">For the first time in weeks, you feel... powerful. In control.</p>
        <p class="narrative emphasis">But that night, checking your bank account, reality sets in. You're unemployed. And rent is due next week.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Financial Crisis</div>
            <p>Dignity costs money. Without a job, how will you survive?</p>
        </div>
        
        <button class="continue-btn" onclick="jobSearchAgain()">Continue</button>
    `);
}

// NEW: Mentor Intervention Scene
function mentorIntervention() {
    addToPath('Mentor Support');
    
    showScene(`
        <h2 class="scene-title">The Yellow Ribbon Call</h2>
        <p class="narrative">Your phone rings. It's <strong>Mr. Tan</strong>, your Yellow Ribbon counselor. You haven't spoken to him in weeks.</p>
        <p class="narrative">"I heard about what happened at work," he says. "How are you holding up?"</p>
        <p class="narrative">For some reason, that simple question breaks something in you.</p>
        <p class="narrative">"I'm tired," you admit. "I'm doing everything right, but it's never enough. People see my past, not my present."</p>
        <p class="narrative">Silence. Then: "I want you to come to a workshop this Saturday. It's about rights awareness for ex-offenders. And there's someone I want you to meet."</p>
        
        <div class="elizabeth-quote">
            <div class="elizabeth-quote-label">The Power of Mentorship</div>
            <p class="reflection-text">"Having someone who believes in you, even when you don't believe in yourself—that's what saved me. My counselor never gave up." - Elizabeth</p>
        </div>
        
        <div class="choices">
            <div class="choices-prompt">Will you go to the workshop?</div>
            <button class="choice-btn" onclick="attendWorkshop()">
                Yes. Maybe you need this. Maybe connection is the answer.
            </button>
            <button class="choice-btn" onclick="skipWorkshop()">
                No. You're too tired. Too defeated. What's the point?
            </button>
        </div>
    `);
}

function attendWorkshop() {
    state.happiness += 30;
    state.communityTrust += 25;
    state.choices.push('attended_workshop');
    unlockAchievement('community_builder');
    updateStats();

    showScene(`
        <h2 class="scene-title">Finding Your People</h2>
        <p class="narrative">The workshop is in a community center. Fifteen people. All with records. All trying.</p>
        <p class="narrative">You learn about the Rehabilitation and Protection Act, about wrongful termination, about resources you didn't know existed.</p>
        <p class="narrative">During break, Mr. Tan introduces you to <strong>David</strong> (38, 10 years clean, now runs a social enterprise hiring ex-offenders).</p>
        <p class="narrative">"We could use someone like you," David says. "Someone who knows what it's like. Interested?"</p>
        <p class="narrative emphasis">For the first time in months, you see a path forward that doesn't involve hiding who you are.</p>
        
        <div class="reflection">
            <div class="reflection-label">Social Enterprises</div>
            <p class="reflection-text">Organizations like Yellow Ribbon Project, ISCOS, and SANA employ thousands of ex-offenders in Singapore, providing dignified work without stigma.</p>
        </div>
        
        <button class="choice-btn" onclick="actFourTattooIncident()">Continue</button>
    `);
}

function skipWorkshop() {
    state.happiness -= 15;
    state.bottledEmotions += 2;
    state.communityTrust -= 10;
    state.choices.push('skipped_workshop');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Spiral</h2>
        <p class="narrative">"I can't," you tell Mr. Tan. "I'm sorry. I just... I can't."</p>
        <p class="narrative">You hang up. Lie in bed. Stare at the ceiling.</p>
        <p class="narrative">Days blur together. You go to work (if you still have it), come home, sleep. Repeat.</p>
        <p class="narrative emphasis">The isolation is suffocating. But reaching out feels impossible.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Isolation Crisis</div>
            <p>You're slipping. Without support, the risk of relapse increases dramatically.</p>
        </div>
        
        <button class="continue-btn" onclick="actFourTattooIncident()">Continue</button>
    `);
}

// NEW: If player quit job, they need to find work again
function jobSearchAgain() {
    addToPath('Job Search Again');
    
    showScene(`
        <h2 class="scene-title">Back to Square One</h2>
        <p class="narrative">You spend the next two weeks applying for jobs. Cleaning, delivery, warehouse work—anything.</p>
        <p class="narrative">Most don't respond. A few reject you outright once they see your record.</p>
        <p class="narrative">Your savings are disappearing. ${state.money < 100 ? 'You can barely afford food.' : 'You have maybe a month left before you\'re broke.'}</p>
        
        <div class="choices">
            <div class="choices-prompt">What do you do?</div>
            <button class="choice-btn" onclick="socialEnterpriseJob()">
                Apply to Yellow Ribbon's job placement program. Swallow your pride and ask for help.
            </button>
            <button class="choice-btn" onclick="gigEconomy()">
                Do gig work—Grab driving, food delivery. Flexible but unstable.
            </button>
        </div>
    `);
}

function socialEnterpriseJob() {
    state.money += 70;
    state.happiness += 20;
    state.communityTrust += 30;
    state.choices.push('social_enterprise');
    unlockAchievement('community_builder');
    updateStats();

    showScene(`
        <h2 class="scene-title">A Second Chance Employer</h2>
        <p class="narrative">Yellow Ribbon connects you with a social enterprise café—one that explicitly hires ex-offenders.</p>
        <p class="narrative">The pay is modest ($1,600/month), but the atmosphere is different. Your manager, Raj, has a record too.</p>
        <p class="narrative">"We've all been there," he says. "No judgment here. Just do good work and we're good."</p>
        <p class="narrative emphasis">For the first time, you don't have to hide.</p>
        
        <button class="continue-btn" onclick="actFourTattooIncident()">Continue</button>
    `);
}

function gigEconomy() {
    state.money += 40;
    state.happiness -= 10;
    state.bottledEmotions += 1;
    state.choices.push('gig_work');
    updateStats();

    showScene(`
        <h2 class="scene-title">Hustle Mode</h2>
        <p class="narrative">You sign up for Grab, Deliveroo, Foodpanda. Work whenever, wherever.</p>
        <p class="narrative">The flexibility is nice. But the income is unpredictable. Some days you make $80. Some days $20.</p>
        <p class="narrative">There's no community. No colleagues. Just you, your bike, and the road.</p>
        <p class="narrative emphasis">The loneliness is crushing.</p>
        
        <button class="continue-btn" onclick="actFourTattooIncident()">Continue</button>
    `);
}

// ==========================================
// ACT 4: TATTOO STIGMA
// ==========================================

function actFourTattooIncident() {
    if (!state.hasTattoos) {
        actFiveChildReconnection();
        return;
    }

    showScene(`
        <h2 class="scene-title">Act 4: The Playground Incident</h2>
        
        <div class="scene-illustration illustration-playground"></div>
        
        <p class="narrative">It's your day off. You're at the neighborhood playground.</p>
        ${state.hasChild ? `
        <p class="narrative">You're finally allowed to spend time with your child. They're warming up to you slowly.</p>
        ` : `
        <p class="narrative">You're just sitting, watching kids play, remembering simpler times.</p>
        `}
        <p class="narrative">It's hot. You're wearing a t-shirt. Your tattoos are visible on your arms.</p>
        <p class="narrative emphasis">A mother notices. She grabs her child's hand and pulls them away, glancing at you with fear.</p>
        <p class="narrative">"Come, dear. Don't play near that... person."</p>
        ${state.hasChild ? `<p class="narrative">Your child hears this. They look confused. "Why doesn't she like you, mommy/daddy?"</p>` : ''}
        
        <div class="elizabeth-quote">
            <div class="elizabeth-quote-label">Real Story - Elizabeth's Experience</div>
            <p class="reflection-text">"Someone I knew told their daughter not to come near me cause they said I'm a gangster because I have tattoos. I just laughed. You think I gangster? I don't really mind what people think anymore. As long as I'm good and don't harm anyone, people can think what they think."</p>
        </div>
        
        <div class="choices">
            <div class="choices-prompt">How do you respond?</div>
            <button class="choice-btn" onclick="confrontMother()">
                Confront her: "Excuse me, what's your problem? I'm just sitting here."
            </button>
            <button class="choice-btn" onclick="ignoreMother()">
                Ignore it. Focus on ${state.hasChild ? 'your child' : 'your phone'}. Don't let them see it bothers you.
            </button>
            <button class="choice-btn" onclick="leavePlayground()">
                Leave quietly. You don't want to cause a scene.
            </button>
        </div>
    `);
}

function confrontMother() {
    state.happiness -= 10;
    state.familyTrust -= 15;
    state.communityTrust -= 10;
    state.choices.push('confronted');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Confrontation</h2>
        <p class="narrative">You stand up. "What's your problem? I'm just sitting here minding my own business."</p>
        <p class="narrative">She backs away. "I... I don't want any trouble."</p>
        <p class="narrative">Other parents start staring. Someone takes out their phone.</p>
        <p class="narrative emphasis">Now you look like the aggressor. Like the gangster she assumed you were.</p>
        ${state.hasChild ? `<p class="narrative">Your child starts crying. "Mommy/Daddy, let's go home..."</p>` : ''}
        <p class="narrative">Later, your ${state.choices.includes('family') ? 'family' : 'counselor'} hears about it. They're disappointed.</p>
        
        <div class="reflection">
            <div class="reflection-label">Lesson Learned</div>
            <p class="reflection-text">Stigma is real and painful. But responding with anger only confirms stereotypes. The high road is harder, but it protects your progress.</p>
        </div>
        
        <button class="continue-btn" onclick="actFiveChildReconnection()">Continue</button>
    `);
}

function ignoreMother() {
    state.happiness -= 5;
    state.familyTrust += 10;
    state.communityTrust += 5;
    state.choices.push('ignored_stigma');
    updateStats();

    showScene(`
        <h2 class="scene-title">Grace Under Pressure</h2>
        <p class="narrative">You take a deep breath. You don't respond. You stay calm.</p>
        ${state.hasChild ? `
        <p class="narrative">You focus on your child. "Come, let's go to the swings."</p>
        <p class="narrative">Later, your family member who's watching says: "I saw that. I'm proud of you for staying calm."</p>
        ` : `
        <p class="narrative">You stay on the bench, scrolling your phone, showing no reaction.</p>
        <p class="narrative">Eventually, she leaves with her child, looking embarrassed.</p>
        `}
        
        <div class="reflection">
            <div class="reflection-label">Elizabeth's Wisdom</div>
            <p class="reflection-text">"I don't really mind what people look at me and think anymore. As long as I'm good and don't harm anyone, people can think what they think. I've learned to accept and adapt to the fact that people will distance themselves."</p>
        </div>
        
        <button class="continue-btn" onclick="actFiveChildReconnection()">Continue</button>
    `);
}

function leavePlayground() {
    state.happiness -= 15;
    state.bottledEmotions += 1;
    state.choices.push('left_playground');
    updateStats();

    showScene(`
        <h2 class="scene-title">Walking Away</h2>
        <p class="narrative">You leave. ${state.hasChild ? 'Your child protests but you take their hand and go.' : 'You walk back to your room.'}</p>
        <p class="narrative">You're angry. Hurt. Frustrated.</p>
        <p class="narrative">You did nothing wrong. But you're treated like a criminal for just existing.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Bottling Emotions</div>
            <p>You're holding in pain and anger. You need to talk to someone before this builds up.</p>
        </div>
        
        <button class="continue-btn" onclick="actFiveChildReconnection()">Continue</button>
    `);
}

// ==========================================
// ACT 5: CHILD RECONNECTION OR EDUCATION
// ==========================================

function actFiveChildReconnection() {
    if (state.hasChild && state.character === 'lina') {
        showChildScene();
    } else {
        showEducationScene();
    }
}

function showChildScene() {
    showScene(`
        <h2 class="scene-title">Act 5: Building Trust with Your Child</h2>
        <p class="narrative">Three months have passed. You've been working steadily.</p>
        <p class="narrative emphasis">Your 3-year-old still doesn't call you "mommy." They call you by your first name.</p>
        <p class="narrative">Your mother watches every interaction like a hawk. One mistake and you'll lose access.</p>
        <p class="narrative">Tonight, your child is crying. They want their grandma, not you.</p>
        
        <div class="elizabeth-quote">
            <div class="elizabeth-quote-label">Real Story - From Everyday People SG (Normizan)</div>
            <p class="reflection-text">"Now that I'm out, my daughter and I are able to really build our relationship. Our first meeting was very weird and awkward. We didn't really talk much. I'd speak a word and she'd reply with a single word. But I'm happy that she is slowly starting to open up more..."</p>
        </div>
        
        <div class="choices">
            <div class="choices-prompt">How do you handle this?</div>
            <button class="choice-btn" onclick="persistWithChild()">
                Keep trying. Sit with them. Be patient even though it hurts.
            </button>
            <button class="choice-btn" onclick="giveUpChild()">
                Give up for tonight. Let grandma handle it. You're exhausted.
            </button>
        </div>
    `);
}

function persistWithChild() {
    state.happiness += 20;
    state.familyTrust += 25;
    state.choices.push('patient_parent');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Breakthrough</h2>
        <p class="narrative">You sit on the floor. You don't force anything. You just... exist in the same space.</p>
        <p class="narrative">Slowly, they stop crying. They peek at you.</p>
        <p class="narrative">"Want to read a book?" you ask softly.</p>
        <p class="narrative">They nod.</p>
        <p class="narrative emphasis">That night, as you read, your child leans against your shoulder. Just for a moment.</p>
        <p class="narrative">Your mother watches from the doorway. For the first time, she smiles.</p>
        
        <div class="reflection">
            <div class="reflection-label">Small Victories</div>
            <p class="reflection-text">Trust rebuilds slowly. Not through grand gestures, but through consistent, patient presence.</p>
        </div>
        
        <button class="continue-btn" onclick="showEducationScene()">Continue</button>
    `);
}

function giveUpChild() {
    state.happiness -= 15;
    state.familyTrust -= 10;
    state.bottledEmotions += 1;
    state.choices.push('gave_up');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Distance Grows</h2>
        <p class="narrative">You walk away. Your mother takes over.</p>
        <p class="narrative">You hear your child stop crying in her arms.</p>
        <p class="narrative">You sit in your room, staring at the wall, feeling like a failure.</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Relationship Strain</div>
            <p>Every time you give up, it gets harder to rebuild trust. Consistency is key.</p>
        </div>
        
        <button class="continue-btn" onclick="showEducationScene()">Continue</button>
    `);
}

function showEducationScene() {
    showScene(`
        <h2 class="scene-title">Act 6: A Path Forward</h2>
        
        <div class="scene-illustration illustration-education"></div>
        
        <p class="narrative">Six months have passed. You've been working steadily. Paying your way.</p>
        <p class="narrative">One day, your supervisor mentions: "You're good at helping people solve problems. Ever thought about social work?"</p>
        <p class="narrative">You look it up. There's a Diploma in Social Service offered part-time.</p>
        <p class="narrative">But you only finished Sec 3. You'd need bridging courses first. It would cost money and time.</p>
        
        <div class="elizabeth-quote">
            <div class="elizabeth-quote-label">Elizabeth's Turning Point</div>
            <p class="reflection-text">"Education was a big concern when I got out the third time. I realized I haven't found a meaning in life, haven't accomplished anything. Currently I'm pursuing a diploma in social service part-time. I want to help others. People feel more comfortable talking to people who understand what they've gone through."</p>
        </div>
        
        <div class="choices">
            <div class="choices-prompt">Will you pursue education?</div>
            <button class="choice-btn" onclick="pursueEducation()">
                Yes. Enroll in bridging courses. Invest in your future. (-$500, -Time, +Purpose)
            </button>
            <button class="choice-btn" onclick="skipEducation()">
                No. Focus on working and earning. Education can wait. (+Money, +Stability)
            </button>
        </div>
    `);
}

function pursueEducation() {
    state.money -= 500;
    state.happiness += 30;
    state.communityTrust += 20;
    state.educationPath = true;
    state.choices.push('education');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Meaning Path</h2>
        <p class="narrative">You enroll. The first class is terrifying. You're the oldest student. You haven't studied in years.</p>
        <p class="narrative">But slowly, something clicks. You're learning. Growing. Building toward something meaningful.</p>
        <p class="narrative">Your supervisor is supportive: "Take evening shifts. Study during the day."</p>
        <p class="narrative emphasis">For the first time since release, you feel like you're not just surviving. You're building a future.</p>
        
        <div class="reflection">
            <div class="reflection-label">Purpose as Protection</div>
            <p class="reflection-text">Research shows that ex-offenders with clear goals and purpose have significantly lower recidivism rates. Meaning protects against relapse.</p>
        </div>
        
        <button class="continue-btn" onclick="studyChallengeScene()">Continue</button>
    `);
}

function studyChallengeScene() {
    showScene(`
        <h2 class="scene-title">The First Exam</h2>
        <p class="narrative">Three months into your bridging course. You have a major English exam tomorrow worth 40% of your grade.</p>
        <p class="narrative">But your supervisor just called: "Can you cover John's shift tonight? Overnight, 11pm to 7am. Double pay."</p>
        <p class="narrative">You need the money. But you also need to study. You've been up late every night this week working and studying.</p>
        <p class="narrative emphasis">If you fail this exam, you might have to retake the entire course. That's another $300 you don't have.</p>
        
        <div class="choices">
            <div class="choices-prompt">What do you do?</div>
            <button class="choice-btn" onclick="prioritizeStudy()">
                Decline the shift. Focus on studying. "Sorry, I have something important tomorrow."
            </button>
            <button class="choice-btn" onclick="workAndStudy()">
                Take the shift but bring your notes. Study during breaks. You can do both.
            </button>
            <button class="choice-btn" onclick="prioritizeMoney()">
                Take the shift. You need the money. You'll wing the exam tomorrow.
            </button>
        </div>
    `);
}

function prioritizeStudy() {
    state.happiness += 20;
    state.communityTrust += 10;
    state.money -= 20;
    state.choices.push('prioritized_education');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Right Choice</h2>
        <p class="narrative">"Sorry, I have something important tomorrow," you say.</p>
        <p class="narrative">Your supervisor pauses. "Important? This is double pay."</p>
        <p class="narrative">"I have an exam," you admit. "I'm trying to finish my education."</p>
        <p class="narrative">Silence. Then: "Good for you. Okay, I'll find someone else."</p>
        <p class="narrative">That night, you study until 2am. The next day, you ace the exam—78%.</p>
        <p class="narrative emphasis">Your lecturer pulls you aside: "I can see how hard you're working. Keep it up."</p>
        
        <div class="reflection">
            <div class="reflection-label">Long-term Thinking</div>
            <p class="reflection-text">Choosing your future over immediate money is hard. But education is an investment that pays off.</p>
        </div>
        
        <button class="continue-btn" onclick="finalTest()">Continue to Ending</button>
    `);
}

function workAndStudy() {
    state.happiness -= 15;
    state.money += 100;
    state.bottledEmotions += 1;
    state.choices.push('tried_both');
    updateStats();

    showScene(`
        <h2 class="scene-title">Burning the Candle</h2>
        <p class="narrative">You take the shift. You bring your notes. During quiet moments, you try to study.</p>
        <p class="narrative">But by 3am, the words blur together. You're so tired you can't focus.</p>
        <p class="narrative">At 7am, you go straight to the exam. You're exhausted. You do your best.</p>
        <p class="narrative">Results: 52%. You passed, but barely.</p>
        <p class="narrative">The money helped. But you wonder: Was it worth it?</p>
        
        <div class="warning-box">
            <div class="warning-label">⚠ Burnout Risk</div>
            <p>You can't sustain this pace. Working all night and studying all day will break you eventually.</p>
        </div>
        
        <button class="continue-btn" onclick="finalTest()">Continue to Ending</button>
    `);
}

function prioritizeMoney() {
    state.happiness -= 25;
    state.money += 150;
    state.educationPath = false;
    state.choices.push('dropped_education');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Difficult Reality</h2>
        <p class="narrative">You take the shift. The money is too good to pass up.</p>
        <p class="narrative">The exam the next day is a disaster. You're too exhausted to think. You fail—38%.</p>
        <p class="narrative">The retake costs $300. Plus you'll have to repeat three months of classes.</p>
        <p class="narrative emphasis">Two weeks later, you withdraw from the course. "I'll try again later," you tell yourself.</p>
        <p class="narrative">But deep down, you know: Later might never come.</p>
        
        <div class="reflection">
            <div class="reflection-label">The Survival Trap</div>
            <p class="reflection-text">When you're living paycheck to paycheck, long-term investments feel impossible. This is how poverty perpetuates cycles.</p>
        </div>
        
        <button class="continue-btn" onclick="finalTest()">Continue to Ending</button>
    `);
}

function skipEducation() {
    state.money += 200;
    state.happiness -= 10;
    state.choices.push('no_education');
    updateStats();

    showScene(`
        <h2 class="scene-title">The Practical Path</h2>
        <p class="narrative">You decide to focus on work. Earning money. Stability first.</p>
        <p class="narrative">The months pass. You're surviving. Paying bills. Staying clean.</p>
        <p class="narrative">But sometimes you wonder: Is this all there is? Work, sleep, work, sleep?</p>
        
        <button class="continue-btn" onclick="finalTest()">Continue</button>
    `);
}

// ==========================================
// ENDINGS
// ==========================================

function finalTest() {
    const score = state.happiness + state.familyTrust + state.communityTrust;
    
    if (state.oldFriendsFlag && score < 150) {
        crisisEnding();
    } else if (score > 180) {
        goodEnding();
    } else if (score > 120) {
        neutralEnding();
    } else {
        strugglingEnding();
    }
}

function crisisEnding() {
    showScene(`
        <div class="ending">
            <h2 class="ending-title bad">Crisis: On the Edge</h2>
            <p class="ending-text">One year has passed.</p>
            <p class="ending-text">Your old friend from before contacts you again. They're in trouble. They need help.</p>
            <p class="ending-text">"Just this once. Please."</p>
            <p class="ending-text">You're tired. Your family still doesn't fully trust you. Work is exhausting. You feel isolated.</p>
            <p class="ending-text emphasis">You're at a crossroads. One choice away from throwing it all away.</p>
        </div>
        ${educationCorner()}
        <div class="ending">
            <p style="color: var(--danger); font-size: 1.1rem; margin: 30px 0;">This is the critical moment. Your support system makes the difference between relapse and recovery.</p>
            <button class="restart-btn" onclick="intro()">Start New Journey</button>
        </div>
    `);
}

function strugglingEnding() {
    showScene(`
        <div class="ending">
            <h2 class="ending-title neutral">Struggling: Day by Day</h2>
            <p class="ending-text">One year has passed.</p>
            <p class="ending-text">You have a job. You have a place to sleep. You're paying your bills.</p>
            <p class="ending-text">But connection still feels out of reach. ${state.hasChild ? 'Your child is slowly warming up, but it\'s painful and slow.' : 'You eat lunch alone at work.'}</p>
            <p class="ending-text">Every day is a calculation: get through work, avoid temptation, sleep, repeat.</p>
            <p class="ending-text emphasis">You're not thriving. But you're not back in prison either. Is this enough?</p>
        </div>
        ${educationCorner()}
        <div class="ending">
            <button class="restart-btn" onclick="intro()">Try Another Path</button>
        </div>
    `);
}

function neutralEnding() {
    showScene(`
        <div class="ending">
            <h2 class="ending-title neutral">Stable: Finding Balance</h2>
            <p class="ending-text">One year has passed.</p>
            <p class="ending-text">You've built a routine. Work is steady. Your family is slowly rebuilding trust.</p>
            ${state.hasChild ? `<p class="ending-text">Your child now calls you "mommy/daddy" sometimes. It's the sweetest sound.</p>` : ''}
            ${state.educationPath ? `<p class="ending-text">You're halfway through your bridging courses. It's hard, but you're proud.</p>` : ''}
            <p class="ending-text">Life isn't perfect. Some days are hard. But you're moving forward.</p>
            <p class="ending-text emphasis">You're building a real second chance, one day at a time.</p>
        </div>
        ${educationCorner()}
        <div class="ending">
            <button class="restart-btn" onclick="intro()">Try Another Path</button>
        </div>
    `);
}

function goodEnding() {
    showScene(`
        <div class="ending">
            <h2 class="ending-title good">Thriving: The Helper</h2>
            <p class="ending-text">Eighteen months have passed.</p>
            ${state.educationPath ? `
            <p class="ending-text">You've completed your bridging courses. You're now enrolled in the Diploma in Social Service.</p>
            <p class="ending-text">You've started volunteering at halfway houses, sharing your story with newly released inmates.</p>
            ` : `
            <p class="ending-text">Your supervisor promoted you to team leader. You're mentoring new workers.</p>
            `}
            ${state.hasChild ? `
            <p class="ending-text">Your child ran to you yesterday and hugged your leg. "I love you, mommy/daddy."</p>
            <p class="ending-text">Your family sees how hard you've worked. They trust you now.</p>
            ` : `
            <p class="ending-text">Your family invited you to dinner. Not out of obligation, but because they want you there.</p>
            `}
            <p class="ending-text emphasis">You've done more than rebuild your life. You've found meaning in helping others rebuild theirs.</p>
            
            <div class="elizabeth-quote" style="margin-top: 30px;">
                <div class="elizabeth-quote-label">Elizabeth's Message</div>
                <p class="reflection-text">"The past is past. The future is very important. Let go of the past and think of the future and move on. Then you can only change. Think of your family and yourself."</p>
            </div>
        </div>
        ${educationCorner()}
        <div class="ending">
            <button class="restart-btn" onclick="intro()">Play Different Character</button>
        </div>
    `);
}

function educationCorner() {
    return `
        <div class="education-corner">
            <h3 class="education-title">What You Can Do: Support Reintegration</h3>
            <ul class="education-list">
                <li><strong>Challenge Your Assumptions:</strong> Tattoos don't make someone a gangster. Ex-offenders are people rebuilding their lives, not their past mistakes.</li>
                <li><strong>Support Fair Hiring:</strong> Encourage companies to give second chances. The Yellow Ribbon Project works with employers to hire ex-offenders.</li>
                <li><strong>Be a Mentor:</strong> Many ex-offenders lack positive role models. Volunteer with CARE Network, SANA, or ISCOS.</li>
                <li><strong>Watch Your Language:</strong> Use "formerly incarcerated person" instead of "ex-con" or "criminal." Words matter.</li>
                <li><strong>Learn More:</strong> Visit <a href="https://www.yellowribbon.gov.sg" target="_blank">Yellow Ribbon Singapore</a> or <a href="https://everydaypeople.sg/rehabilitation-singapore/" target="_blank">Everyday People SG</a> to read real stories.</li>
            </ul>
            <p style="text-align: center; margin-top: 30px; font-style: italic; color: var(--accent-cool);">This game is based on real stories from Singapore ex-offenders. Thank you to Elizabeth and all who shared their journeys.</p>
        </div>
    `;
}

// ==========================================
// GAME INITIALIZATION
// ==========================================

// Start the game when page loads
intro();
