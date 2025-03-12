import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Player {
  name: string;
  color: string;
  type?: 'CHLOE' | 'MICKAEL' | 'OTHER';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  template: `
    <main class="game-container">
      <h1 class="title" *ngIf="currentStep === 'master'">Listen to Win</h1>

      <div class="content-container">
        <!-- Étape 1: Saisie du maître du jeu -->
        <div class="player-form" *ngIf="currentStep === 'master'">
          <input 
            type="text" 
            [(ngModel)]="masterName" 
            placeholder="prénom"
            (keyup.enter)="setMasterName()"
            [style.border-color]="masterColor"
            [style.color]="masterColor"
          >
          <button (click)="setMasterName()">Devenir Maître du jeu</button>
        </div>

        <!-- Étape 2: Sélection du nombre de joueurs -->
        <div class="player-selection" *ngIf="currentStep === 'playerCount'">
          <h2>Il faut exactement 4 joueurs</h2>
          <div class="number-selector">
            <button 
              (click)="selectPlayerCount(4)"
              [class.selected]="true"
            >OK</button>
          </div>
        </div>

        <!-- Étape 3: Saisie des noms des joueurs -->
        <div class="player-names" *ngIf="currentStep === 'playerNames'">
          <div class="player-inputs">
            <div *ngFor="let player of players; let i = index" class="player-input">
              <label>Joueur {{i + 1}}</label>
              <input 
                type="text" 
                [(ngModel)]="players[i].name"
                placeholder="prénom"
                (keyup.enter)="checkAllPlayersNamed()"
                [style.border-color]="player.color"
                [style.color]="player.color"
              >
            </div>
          </div>
          <button 
            (click)="startGame()"
            [disabled]="!allPlayersNamed()"
            class="start-button"
          >
            START
          </button>
        </div>

        <!-- Étape 4: Affichage des règles -->
        <div class="rules-page" *ngIf="currentStep === 'rules'">
          <header class="rules-header">
            <h2>
              <ng-container *ngIf="currentRuleIndex < 3">
                <span [style.color]="masterColor">{{masterName}}</span> pour tous les joueurs
              </ng-container>
              <ng-container *ngIf="currentRuleIndex === 3">
                <span [style.color]="masterColor">{{masterName}}</span> pour <span [style.color]="currentPlayer?.color">{{currentPlayer?.name}}</span>
              </ng-container>
              <ng-container *ngIf="currentRuleIndex === 4">
                <span [style.color]="masterColor">{{masterName}}</span> pour <span [style.color]="currentPlayer?.color">{{currentPlayer?.name}}</span>
              </ng-container>
              <ng-container *ngIf="currentRuleIndex === 5">
                <span [style.color]="masterColor">{{masterName}}</span> pour <span [style.color]="findFirstMickaelPlayer()?.color">{{findFirstMickaelPlayer()?.name}}</span>
              </ng-container>
              <ng-container *ngIf="currentRuleIndex === 6">
                <span [style.color]="masterColor">{{masterName}}</span> pour <span [style.color]="findFirstChloePlayer()?.color">{{findFirstChloePlayer()?.name}}</span>
              </ng-container>
              <ng-container *ngIf="currentRuleIndex === 7">
                <span [style.color]="masterColor">{{masterName}}</span> pour <span [style.color]="findFirstChloePlayer()?.color">{{findFirstChloePlayer()?.name}}</span>
              </ng-container>
            </h2>
          </header>
          
          <div class="rules-container">
            <div class="rule" [class.active]="currentRuleIndex === 0" *ngIf="currentRuleIndex === 0">
              <p class="rule-text typewriter">{{displayedText}}</p>
              <button (click)="nextRule()" class="next-button" *ngIf="!isCountingDown && isTextFullyTyped">➜</button>
              <div class="countdown-small" *ngIf="isCountingDown">{{countdown}}</div>
            </div>

            <div class="rule" [class.active]="currentRuleIndex === 1" *ngIf="currentRuleIndex === 1">
              <p class="rule-text typewriter">{{displayedText}}</p>
              <button (click)="nextRule()" class="next-button" *ngIf="!isCountingDown && isTextFullyTyped">➜</button>
              <div class="countdown-small" *ngIf="isCountingDown">{{countdown}}</div>
            </div>

            <div class="rule" [class.active]="currentRuleIndex === 2" *ngIf="currentRuleIndex === 2">
              <p class="rule-text typewriter">{{displayedText}}</p>
              <button (click)="nextRule()" class="next-button" *ngIf="!isCountingDown && isTextFullyTyped">➜</button>
              <div class="countdown-small" *ngIf="isCountingDown">{{countdown}}</div>
            </div>

            <div class="rule" [class.active]="currentRuleIndex === 3" *ngIf="currentRuleIndex === 3">
              <p class="rule-text typewriter" [innerHTML]="displayedText"></p>
              <button (click)="nextRule()" class="next-button" *ngIf="!isCountingDown && isTextFullyTyped">➜</button>
              <div class="countdown-small" *ngIf="isCountingDown">{{countdown}}</div>
            </div>

            <div class="rule" [class.active]="currentRuleIndex === 4" *ngIf="currentRuleIndex === 4">
              <p class="rule-text typewriter" [innerHTML]="displayedText"></p>
              <button (click)="nextRule()" class="next-button" *ngIf="!isCountingDown && isTextFullyTyped">➜</button>
              <div class="countdown-small" *ngIf="isCountingDown">{{countdown}}</div>
            </div>

            <div class="rule" [class.active]="currentRuleIndex === 5" *ngIf="currentRuleIndex === 5">
              <p class="rule-text typewriter" [innerHTML]="displayedText"></p>
              <button (click)="nextRule()" class="next-button" *ngIf="!isCountingDown && isTextFullyTyped">➜</button>
              <div class="countdown-small" *ngIf="isCountingDown">{{countdown}}</div>
            </div>

            <div class="rule" [class.active]="currentRuleIndex === 6" *ngIf="currentRuleIndex === 6">
              <p class="rule-text typewriter" [innerHTML]="displayedText"></p>
              <button (click)="nextRule()" class="next-button" *ngIf="!isCountingDown && isTextFullyTyped">➜</button>
              <div class="countdown-small" *ngIf="isCountingDown">{{countdown}}</div>
            </div>
            <div class="rule" [class.active]="currentRuleIndex === 7" *ngIf="currentRuleIndex === 7">
              <p class="rule-text typewriter" [innerHTML]="displayedText"></p>
              <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmQ1OTBhYzM5ZmE4ZWM4ZDY4ZmQ5ZWYzYjIzZDM4ZmQ5ZmM1ZjU5YiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7budMRwZvNGJ3pyE/giphy.gif" 
                   alt="bébé qui danse" 
                   class="baby-gif"
              >
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .game-container {
      text-align: center;
      padding: 0;
      max-width: 800px;
      margin: 0 auto;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .title {
      font-size: 3rem;
      margin: 0;
      text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff;
      animation: pulse 2s infinite;
      transition: opacity 1s ease-out;
      height: 25vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title.fade-out {
      opacity: 0;
      height: 0;
      margin: 0;
      overflow: hidden;
    }

    .content-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 75vh;
    }

    .player-form, .player-selection, .player-names {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.5s ease-out;
      padding: 0 2rem;
      width: 100%;
    }

    .rules-page {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .rules-header {
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      text-align: center;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    }

    .rules-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      background: rgba(0, 0, 0, 0.5);
      margin: 2rem;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
      min-height: 200px;
    }

    .rule {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .rule.active {
      opacity: 1;
      transform: translateY(0);
    }

    .rule-text {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      line-height: 1.4;
      text-shadow: 0 0 5px rgba(255,255,255,0.5);
      min-height: 4rem;
    }

    .rule-text::after {
      content: '|';
      animation: blink 1s step-start infinite;
    }

    @keyframes blink {
      50% { opacity: 0; }
    }

    .next-button {
      background: transparent;
      color: #fff;
      border: none;
      padding: 1rem;
      font-size: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 1rem;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInButton 0.5s forwards;
    }

    @keyframes fadeInButton {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .next-button:hover {
      transform: scale(1.2);
      text-shadow: 0 0 10px #fff;
    }

    .countdown-small {
      font-size: 4rem;
      margin-top: 2rem;
      animation: zoomPulse 1s infinite;
    }

    @keyframes zoomPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      color: #fff;
    }

    .number-selector {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .number-selector button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      font-size: 1.5rem;
      border: 2px solid #fff;
      background: transparent;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
    }

    .number-selector button:hover, .number-selector button.selected {
      background: #fff;
      color: #000;
      transform: scale(1.1);
    }

    .player-inputs {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 400px;
    }

    .player-input {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-align: left;
    }

    input {
      background: transparent;
      border: 2px solid #fff;
      color: #fff;
      padding: 1rem;
      font-family: 'Press Start 2P', cursive;
      font-size: 1rem;
      text-align: center;
      width: 100%;
      max-width: 300px;
    }

    button {
      background: #fff;
      color: #000;
      border: none;
      padding: 1rem 2rem;
      font-family: 'Press Start 2P', cursive;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    button:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 0 10px #fff;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .start-button {
      font-size: 2rem;
      padding: 1.5rem 3rem;
      margin-top: 2rem;
      background: #00ff00;
      color: #000;
      text-shadow: 0 0 5px rgba(255,255,255,0.5);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .baby-gif {
      width: 200px;
      height: 200px;
      margin-top: 2rem;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }
  `]
})
export class AppComponent {
  currentStep: 'master' | 'playerCount' | 'playerNames' | 'rules' = 'master';
  masterName: string = '';
  masterColor: string = '#FFD700'; // Couleur or pour le maître du jeu
  playerCount: number = 0;
  players: Player[] = [];
  currentRuleIndex: number = 0;
  countdown: number = 3;
  isCountingDown: boolean = false;
  displayedText: string = '';
  isTextFullyTyped: boolean = false;
  currentPlayer: Player | null = null;
  private countdownInterval: any;
  private typewriterInterval: any;

  private rules = [
    '',  // Sera défini dynamiquement avec le nom du maître
    'Les règles sont simples mais ne seront énumérées qu\'au fur et à mesure. Alors, ecoutez pour gagner !',
    'Avant de commencer, chaque joueur va avoir une phrase mystère qui va lui permettre d\'avancer dans le jeu',
  ];

  private normalizePlayerName(name: string): { normalizedName: string; type: 'CHLOE' | 'MICKAEL' | 'OTHER' } {
    const lowercaseName = name.toLowerCase().trim();
    if (lowercaseName.startsWith('chl')) {
      return { normalizedName: name.trim(), type: 'CHLOE' };
    }
    if (lowercaseName.startsWith('mick')) {
      return { normalizedName: name.trim(), type: 'MICKAEL' };
    }
    return { normalizedName: name.trim(), type: 'OTHER' };
  }

  setMasterName() {
    if (this.masterName.trim()) {
      this.masterName = this.normalizePlayerName(this.masterName).normalizedName;
      this.currentStep = 'playerCount';
    }
  }

  selectPlayerCount(count: number) {
    this.playerCount = count;
    this.players = Array(count).fill(null).map(() => ({ 
      name: '',
      color: this.getRandomPlayerColor(),
      type: 'OTHER'
    }));
    this.currentStep = 'playerNames';
  }

  private getRandomPlayerColor(): string {
    const colors = [
      '#FF6B6B', // Rouge vif
      '#4ECDC4', // Turquoise
      '#45B7D1', // Bleu clair
      '#96CEB4', // Vert menthe
      '#FFEEAD', // Jaune pâle
      '#D4A5A5'  // Rose poudré
    ];
    
    // Trouver les couleurs déjà utilisées
    const usedColors = this.players.map(p => p.color);
    
    // Filtrer les couleurs disponibles
    const availableColors = colors.filter(color => !usedColors.includes(color));
    
    // Si toutes les couleurs sont utilisées, prendre une couleur au hasard
    if (availableColors.length === 0) {
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Sinon, prendre une couleur disponible au hasard
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }

  allPlayersNamed(): boolean {
    return this.players.every(player => player.name.trim().length > 0);
  }

  checkAllPlayersNamed() {
    // Normaliser les noms avant de vérifier
    this.players = this.players.map(player => {
      const { normalizedName, type } = this.normalizePlayerName(player.name);
      return {
        ...player,
        name: normalizedName,
        type: type
      };
    });
    
    if (this.allPlayersNamed()) {
      this.startGame();
    }
  }

  private findFirstOtherPlayer(): Player | null {
    return this.players.find(player => player.type === 'OTHER') || null;
  }

  private findSecondOtherPlayer(): Player | null {
    const firstPlayer = this.findFirstOtherPlayer();
    const otherPlayers = this.players.filter(player => 
      player.type === 'OTHER' && 
      player.name !== firstPlayer?.name
    );
    return otherPlayers[0] || null;
  }

  public findFirstMickaelPlayer(): Player | null {
    return this.players.find(player => player.type === 'MICKAEL') || null;
  }

  public findFirstChloePlayer(): Player | null {
    return this.players.find(player => player.type === 'CHLOE') || null;
  }

  startGame() {
    if (this.allPlayersNamed()) {
      this.currentStep = 'rules';
      this.currentRuleIndex = 0;
      this.rules[0] = `Maître du jeu, vous devez vous lever et expliquer les règles du jeu`;
      this.rules[3] = `<i>Une nouvelle saison commence</i>`;
      this.rules[4] = `<i>Abracadabra pif pas pouf</i>`;
      this.rules[5] = `<i>Merci au champion</i>`;
      this.rules[6] = `<i>Je vais</i>`;
      this.rules[7] = `<i>etre mami !</i>`;

      this.startTyping();
    }
  }

  startTyping() {
    this.isTextFullyTyped = false;
    this.displayedText = '';
    const currentRule = this.rules[this.currentRuleIndex];
    let charIndex = 0;
    
    this.typewriterInterval = setInterval(() => {
      if (charIndex < currentRule.length) {
        this.displayedText += currentRule[charIndex];
        charIndex++;
      } else {
        clearInterval(this.typewriterInterval);
        this.isTextFullyTyped = true;
      }
    }, 1); // Vitesse de frappe
  }

  nextRule() {
    if (!this.isTextFullyTyped) return;
    
    clearInterval(this.typewriterInterval);
    
    if (this.currentRuleIndex === 0) {
      // Pour le premier bouton, garder le décompte
      this.isCountingDown = true;
      this.countdown = 3;
      
      this.countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(this.countdownInterval);
          setTimeout(() => {
            this.isCountingDown = false;
            this.currentRuleIndex++;
            this.startTyping();
          }, 1000);
        }
      }, 1000);
    } else {
      // Pour les autres boutons, passer directement à la règle suivante
      if (this.currentRuleIndex < this.rules.length - 1) {
        this.currentRuleIndex++;
        if (this.currentRuleIndex === 3) {
          this.currentPlayer = this.findFirstOtherPlayer();
        } else if (this.currentRuleIndex === 4) {
          this.currentPlayer = this.findSecondOtherPlayer();
        } else if (this.currentRuleIndex === 5) {
          this.currentPlayer = this.findFirstMickaelPlayer();
        } else if (this.currentRuleIndex === 6) {
          this.currentPlayer = this.findFirstChloePlayer();
        } else if (this.currentRuleIndex === 7) {
          this.currentPlayer = this.findFirstChloePlayer();
        }
        this.startTyping();
      }
    }
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }
  }
}
