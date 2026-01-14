class AzerType {
    constructor() {
        this.words = [
            'Cachalot', 'Ordinateur', 'Clavier', 'Souris', 'Écran', 'Fenêtre',
            'Bureau', 'Fichier', 'Dossier', 'Internet', 'Navigateur', 'Site',
            'Page', 'Lien', 'Email', 'Message', 'Texte', 'Document', 'Image'
        ];

        this.sentences = [
            'La programmation est un art créatif.',
            'JavaScript est un langage polyvalent.',
            'Le développement web évolue rapidement.',
            'Les frameworks facilitent le développement.',
            'La pratique améliore les compétences.',
            'Le code propre est essentiel.',
            'Les tests garantissent la qualité.',
            'La documentation aide les développeurs.'
        ];

        this.currentMode = 'mots';
        this.currentIndex = 0;
        this.score = 0;
        this.total = 0;
    }

    start() {
        this.initializeElements();
        this.bindEvents();
        this.displayNewWord();
    }

    initializeElements() {
        this.currentWordElement = document.getElementById('currentWord');
        this.wordDisplayElement = document.getElementById('wordDisplay');
        this.userInput = document.getElementById('userInput');
        this.validateBtn = document.getElementById('validateBtn');
        this.scoreElement = document.getElementById('score');
        this.totalElement = document.getElementById('total');
        this.shareBtn = document.getElementById('shareBtn');
        this.modeRadios = document.querySelectorAll('input[name="gameMode"]');
    }

    bindEvents() {
        this.validateBtn.addEventListener('click', () => this.validateInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.validateInput();
            }
        });

        this.modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentMode = e.target.value;
                this.resetGame();
            });
        });

        this.shareBtn.addEventListener('click', () => this.shareScore());

        // Focus on input when page loads
        this.userInput.focus();
    }

    getCurrentList() {
        return this.currentMode === 'mots' ? this.words : this.sentences;
    }

    getCurrentText(){
        return this.currentIndex == -1 ? '' : this.getCurrentList()[this.currentIndex];
    }

    displayNewWord() {
        const currentList = this.getCurrentList();
        if (this.currentIndex >= currentList.length) {
            this.currentIndex = 0;
        }

        this.currentWordElement.textContent = currentList[this.currentIndex];
        this.userInput.value = '';
        this.userInput.focus();
    }

    validateInput() {
        const userText = this.userInput.value.trim();
        const currentText = this.getCurrentText();

        if (userText === '') {
            return;
        }

        this.total++;

        const isCorrect = userText === currentText;
        if (isCorrect) {
            this.score++;
        }
        this.showFeedback(isCorrect);

        this.updateScore();
        this.currentIndex++;

        setTimeout(() => {
            this.displayNewWord();
        }, 1000);
    }

    showFeedback(isCorrect) {
        const originalColor = this.currentWordElement.style.color;
        const originalBgColor = this.wordDisplayElement.style.backgroundColor;
        this.currentWordElement.style.color = isCorrect ? '#4CAF50' : '#000';
        this.wordDisplayElement.style.backgroundColor = isCorrect ? originalBgColor : '#f44336';

        setTimeout(() => {
            this.currentWordElement.style.color = originalColor;
            this.wordDisplayElement.style.backgroundColor = originalBgColor;
        }, 1000);
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        this.totalElement.textContent = this.total;
    }

    resetGame() {
        this.score = 0;
        this.total = 0;
        this.currentIndex = 0;
        this.updateScore();
        this.displayNewWord();
    }

    shareScore() {
        const percentage = this.total > 0 ? Math.round((this.score / this.total) * 100) : 0;
        const message = `J'ai obtenu ${this.score}/${this.total} (${percentage}%) sur AzerType ! Pouvez-vous faire mieux ?`;

        if (navigator.share) {
            navigator.share({
                title: 'Mon score AzerType',
                text: message,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(message).then(() => {
                alert('Score copié dans le presse-papiers !');
            }).catch(() => {
                alert(`Mon score : ${message}`);
            });
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AzerType().start();
});
