// ===================================
// State Management
// ===================================
let allPrompts = [];
let filteredPrompts = [];
let currentSearchTerm = '';

// ===================================
// DOM Elements
// ===================================
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const promptsGrid = document.getElementById('promptsGrid');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');
const loadingIndicator = document.getElementById('loadingIndicator');
const submitModal = document.getElementById('submitModal');
const submitPromptBtn = document.getElementById('submitPromptBtn');
const closeModalBtn = document.getElementById('closeModal');
const cancelSubmitBtn = document.getElementById('cancelSubmit');
const submitForm = document.getElementById('submitForm');
const submissionSuccess = document.getElementById('submissionSuccess');
const closeSuccessBtn = document.getElementById('closeSuccess');
const toast = document.getElementById('toast');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

// ===================================
// CSV Parser
// ===================================
function parseCSV(text) {
    const lines = text.split('\n');
    const prompts = [];
    let currentPrompt = null;
    let inMultilineField = false;
    let fieldBuffer = '';

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        if (!inMultilineField) {
            // Start of new prompt
            const commaIndex = line.indexOf(',');
            if (commaIndex === -1) continue;

            const name = line.substring(0, commaIndex).trim();
            let content = line.substring(commaIndex + 1).trim();

            // Check if content starts with quote
            if (content.startsWith('"')) {
                content = content.substring(1);

                // Check if it also ends with quote (single line quoted field)
                if (content.endsWith('"') && content.length > 1) {
                    content = content.substring(0, content.length - 1);
                    prompts.push({ name, content });
                } else {
                    // Start of multiline field
                    inMultilineField = true;
                    currentPrompt = { name };
                    fieldBuffer = content;
                }
            } else {
                // Simple unquoted field
                prompts.push({ name, content });
            }
        } else {
            // Continuation of multiline field
            if (line.endsWith('"')) {
                // End of multiline field
                fieldBuffer += '\n' + line.substring(0, line.length - 1);
                currentPrompt.content = fieldBuffer;
                prompts.push(currentPrompt);
                inMultilineField = false;
                fieldBuffer = '';
                currentPrompt = null;
            } else {
                // Continue accumulating
                fieldBuffer += '\n' + line;
            }
        }
    }

    return prompts.filter(p => p.name && p.content);
}

// ===================================
// Load Prompts from CSV
// ===================================
async function loadPrompts() {
    try {
        const response = await fetch('assets/data/prompts.csv');
        const text = await response.text();
        allPrompts = parseCSV(text);
        filteredPrompts = [...allPrompts];

        renderPrompts();
        updateResultsCount();
        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error('Error loading prompts:', error);
        loadingIndicator.innerHTML = '<p style="color: var(--text-secondary);">Error loading prompts. Please refresh the page.</p>';
    }
}

// ===================================
// Search Functionality
// ===================================
function filterPrompts(searchTerm) {
    currentSearchTerm = searchTerm.toLowerCase().trim();

    if (!currentSearchTerm) {
        filteredPrompts = [...allPrompts];
    } else {
        filteredPrompts = allPrompts.filter(prompt => {
            const nameMatch = prompt.name.toLowerCase().includes(currentSearchTerm);
            const contentMatch = prompt.content.toLowerCase().includes(currentSearchTerm);
            return nameMatch || contentMatch;
        });
    }

    renderPrompts();
    updateResultsCount();
}

// Debounce function for search
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedFilter = debounce((searchTerm) => {
    filterPrompts(searchTerm);
}, 300);

// ===================================
// Render Prompts
// ===================================
function renderPrompts() {
    promptsGrid.innerHTML = '';

    if (filteredPrompts.length === 0) {
        noResults.style.display = 'flex';
        return;
    }

    noResults.style.display = 'none';

    filteredPrompts.forEach((prompt, index) => {
        const card = createPromptCard(prompt, index);
        promptsGrid.appendChild(card);
    });
}

function createPromptCard(prompt, index) {
    const card = document.createElement('div');
    card.className = 'prompt-card';

    const preview = prompt.content.length > 200
        ? prompt.content.substring(0, 200) + '...'
        : prompt.content;

    card.innerHTML = `
        <div class="prompt-card-header">
            <h3 class="prompt-card-title">${escapeHtml(prompt.name)}</h3>
            <button class="copy-btn" data-index="${index}" aria-label="Copy prompt">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
        </div>
        <div class="prompt-card-content">
            <p class="prompt-preview">${escapeHtml(preview)}</p>
        </div>
        <div class="prompt-card-footer">
            <button class="view-full-btn" data-index="${index}">View Full Prompt →</button>
        </div>
    `;

    // Add event listeners
    const copyBtn = card.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => copyPrompt(index));

    const viewBtn = card.querySelector('.view-full-btn');
    viewBtn.addEventListener('click', () => viewFullPrompt(index));

    return card;
}

// ===================================
// Copy to Clipboard
// ===================================
async function copyPrompt(index) {
    const prompt = filteredPrompts[index];

    try {
        await navigator.clipboard.writeText(prompt.content);
        showToast('Prompt copied to clipboard!');
    } catch (error) {
        console.error('Failed to copy:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = prompt.content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Prompt copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy prompt');
        }
        document.body.removeChild(textArea);
    }
}

// ===================================
// View Full Prompt
// ===================================
function viewFullPrompt(index) {
    const prompt = filteredPrompts[index];

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <button class="modal-close" aria-label="Close">×</button>
            <h2>${escapeHtml(prompt.name)}</h2>
            <div style="margin: var(--spacing-md) 0;">
                <pre style="white-space: pre-wrap; word-wrap: break-word; font-family: var(--font-family); color: var(--text-secondary); line-height: 1.6; font-size: var(--font-size-small); max-height: 60vh; overflow-y: auto; padding: var(--spacing-md); background-color: var(--surface); border-radius: var(--border-radius-sm);">${escapeHtml(prompt.content)}</pre>
            </div>
            <div class="form-actions">
                <button class="btn btn-secondary close-modal-btn">Close</button>
                <button class="btn btn-primary copy-full-btn">Copy Prompt</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners for the full prompt modal
    const closeBtn = modal.querySelector('.modal-close');
    const closeModalBtn = modal.querySelector('.close-modal-btn');
    const copyFullBtn = modal.querySelector('.copy-full-btn');

    const closeModal = () => {
        modal.remove();
    };

    closeBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    copyFullBtn.addEventListener('click', () => {
        copyPrompt(index);
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// ===================================
// Toast Notification
// ===================================
function showToast(message) {
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// Update Results Count
// ===================================
function updateResultsCount() {
    const count = filteredPrompts.length;
    const total = allPrompts.length;

    if (currentSearchTerm) {
        resultsCount.textContent = `Showing ${count} of ${total} prompts`;
    } else {
        resultsCount.textContent = `${total} prompts available`;
    }
}

// ===================================
// Utility Functions
// ===================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================
// Modal Management
// ===================================
function openSubmitModal() {
    submitModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSubmitModal() {
    submitModal.classList.remove('active');
    document.body.style.overflow = '';
    submitForm.reset();
    submitForm.style.display = 'block';
    submissionSuccess.style.display = 'none';
}

// ===================================
// Form Submission
// ===================================
submitForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(submitForm);

    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        });

        if (response.ok) {
            submitForm.style.display = 'none';
            submissionSuccess.style.display = 'block';
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting your prompt. Please try again or email directly to tom@tom-panos.com');
    }
});

// ===================================
// Event Listeners
// ===================================

// Search
searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    debouncedFilter(value);

    if (value) {
        clearSearchBtn.classList.add('visible');
    } else {
        clearSearchBtn.classList.remove('visible');
    }
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.remove('visible');
    filterPrompts('');
    searchInput.focus();
});

// Submit Modal
submitPromptBtn.addEventListener('click', openSubmitModal);
closeModalBtn.addEventListener('click', closeSubmitModal);
cancelSubmitBtn.addEventListener('click', closeSubmitModal);
closeSuccessBtn.addEventListener('click', closeSubmitModal);

// Close modal on outside click
submitModal.addEventListener('click', (e) => {
    if (e.target === submitModal) {
        closeSubmitModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && submitModal.classList.contains('active')) {
        closeSubmitModal();
    }
});

// Mobile menu toggle (if needed for future enhancement)
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        // Could implement mobile menu dropdown here
        console.log('Mobile menu clicked');
    });
}

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    loadPrompts();
});
