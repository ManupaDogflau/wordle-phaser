import BigLetterBox from './bigLetterBox';
import * as dotenv from 'dotenv';
dotenv.config();


enum letterState {
    WRONG = 1,
    CORRECT,
    PERFECT
}

export class GameGrid {
    currentRow: number;
    currentColumn: number;
    letterBox: BigLetterBox[][];
    add: any;
    cameras: any;
    scene: Phaser.Scene;
    gameOverText: Phaser.GameObjects.Text;
    winnerText: Phaser.GameObjects.Text;
    overlayRect: Phaser.GameObjects.Rectangle;
    leaderboardTuples: [string, number][];
    leaderboardEntries: Phaser.GameObjects.Text[];
    resetButton: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, rows: number, firstRowX: number, firstRowY: number) {
        this.scene = scene;
        this.currentRow = 0;
        this.currentColumn = 0;
        this.letterBox = [];
        this.leaderboardTuples = [];
        this.leaderboardEntries = [];
        this.resetButton = this.scene.add.rectangle(0, 0, 0, 0, 0x000000); // Asignamos un rectangle vacío como valor por defecto

        for (let i: number = 0; i < 5; i++) {
            this.letterBox[i] = [];
            for (let j: number = 0; j < rows; j++) {
                this.letterBox[i][j] = new BigLetterBox(scene, firstRowX + i * 110, firstRowY + j * 110);
            }
        }

        this.overlayRect = this.scene.add.rectangle(0, 0, scene.cameras.main.width, scene.cameras.main.height, 0x000000);
        this.overlayRect.setOrigin(0);
        this.overlayRect.setAlpha(0);

        this.gameOverText = this.scene.add.text(350, 300, 'Game Over', { fontSize: '64px', color: '#ffffff' }).setOrigin(0.5);
        this.winnerText = this.scene.add.text(350, 300, 'Winner', { fontSize: '64px', color: '#ffffff' }).setOrigin(0.5);

        this.gameOverText.setVisible(false);
        this.winnerText.setVisible(false);

        // Add "retr0" to the leaderboard with a score of 100
        this.updateLeaderboard("retr0", 100);
        this.updateLeaderboard("juan", 100);
        this.updateLeaderboard("manupa", 100);
        this.updateLeaderboard("jesus", 100);
        this.updateLeaderboard("ivan", 100);
        this.leaderboardEntries.forEach(entry => entry.setVisible(false));
    }

    addLetter(letter: string): void {
        this.letterBox[this.currentColumn][this.currentRow].setLetter(letter);
        this.currentColumn++;
    }

    removeLetter(): void {
        this.currentColumn--;
        this.letterBox[this.currentColumn][this.currentRow].setLetter('');
    }
    

    generateLeaderboard(tuples: [string, number][]): void {
        const leaderboardX = 325;
        const leaderboardY = 600;
        const leaderboardSpacing = 40;

        const leaderboardTitle = this.scene.add.text(leaderboardX, leaderboardY - 40, 'Leaderboard', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        this.leaderboardEntries.push(leaderboardTitle);
        for (let i: number = 1; i <= 5; i++) {
            const jugador = getEnvVariable(`jugador${i}`, ''); // Valor predeterminado: cadena vacía
            const puntuacionStr = getEnvVariable(`puntuacion${i}`, '0'); // Valor predeterminado: '0'
            const puntuacion = parseInt(puntuacionStr);
            if (jugador && !isNaN(puntuacion)) {
                this.updateLeaderboard(jugador, puntuacion);
            }
        }

        tuples.sort((a, b) => b[1] - a[1]);

        for (let i = 0; i < 5 && i < tuples.length; i++) {
            const [name, score] = tuples[i];
            const leaderboardEntry = this.scene.add.text(leaderboardX, leaderboardY + i * leaderboardSpacing, `${name} - ${score}`, { fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);
            this.leaderboardEntries.push(leaderboardEntry);
        }
    }

    updateLeaderboard(name: string, score: number): void {
        const newTuple: [string, number] = [name, score];
        this.leaderboardTuples.push(newTuple);
        this.leaderboardTuples.sort((a, b) => b[1] - a[1]);

        if (this.leaderboardTuples.length > 5) {
            this.leaderboardTuples.pop();
        }

        this.clearLeaderboard();
        this.generateLeaderboard(this.leaderboardTuples);
    }

    clearLeaderboard(): void {
        // Remove leaderboard from the scene
        this.leaderboardEntries.forEach(entry => entry.destroy());
        this.leaderboardEntries = [];
    }

    addNameInputRect(): void {
        const inputRectX = 325;
        const inputRectY = 1000;
        const inputRectWidth = 250;
        const inputRectHeight = 40;

        const inputRect = this.scene.add.rectangle(inputRectX, inputRectY, inputRectWidth, inputRectHeight, 0xffffff);
        inputRect.setOrigin(0.5);
        inputRect.setInteractive();

        inputRect.on('pointerdown', () => {
            const playerName = prompt("Please enter your name:");
            if (playerName) {
                // Update leaderboard before adding new entry
                this.updateLeaderboard(playerName, 11000);
                // Clear leaderboard after entering the name
                this.clearLeaderboard();
                // Generate new leaderboard with updated data
                this.generateLeaderboard(this.leaderboardTuples);
            }
        });
    }

    addResetButton(): void {
        const resetButtonX = 325;
        const resetButtonY = 1050;
        const resetButtonWidth = 250;
        const resetButtonHeight = 40;

        this.resetButton = this.scene.add.rectangle(resetButtonX, resetButtonY, resetButtonWidth, resetButtonHeight, 0xffffff);
        this.resetButton.setOrigin(0.5);
        this.resetButton.setInteractive();

        const resetButtonText = this.scene.add.text(resetButtonX, resetButtonY, 'Reset', { fontSize: '20px', color: '#000000' }).setOrigin(0.5);

        this.resetButton.on('pointerdown', () => {
            // Reset the game
            this.resetGame();
        });
    }

    resetGame(): void {
        // Refresh the webpage to reset the game
        window.location.reload();
    }

    showResult(result: number[]): void {
        result.forEach((element: number, index: number) => {
            this.letterBox[index][this.currentRow].setFrame(element);
            this.letterBox[index][this.currentRow].letterToShow.setTint(0xffffff);
        });

        this.currentRow++;
        this.currentColumn = 0;

        if (result.every((element: number) => element === letterState.PERFECT)) {
            this.overlayRect.setAlpha(1);
            this.winnerText.setVisible(true);
            this.addNameInputRect();
            this.generateLeaderboard(this.leaderboardTuples);
            this.addResetButton();
        } else if (this.currentRow === 6 && result.some((element: number) => element !== letterState.PERFECT)) {
            this.overlayRect.setAlpha(1);
            this.gameOverText.setVisible(true);
            this.generateLeaderboard(this.leaderboardTuples);
            this.addResetButton();
        }
    }
}

function getEnvVariable(name: string, defaultValue: string): string {
    const value = process.env[name];
    return value !== undefined ? value : defaultValue;
}