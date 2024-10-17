import * as pc from "playcanvas";

export class UIMenu {
    private app: pc.Application;
    private background: HTMLDivElement;
    private title: HTMLHeadingElement;
    private playButton: HTMLButtonElement;
    public gameStarted = false;

    constructor(app: pc.Application) {
        this.app = app;
        this.createMenu();
    }

    private createMenu() {
        this.background = document.createElement("div");
        this.background.style.position = "absolute";
        this.background.style.top = "0";           
        this.background.style.left = "0";
        this.background.style.width = "100%";
        this.background.style.height = "100%";
        this.background.style.zIndex = "10";       
        this.background.style.backgroundImage = "url('../../assets/white Maze assets/background.jpg')";
        //this.background.style.backgroundSize = "cover";
        this.background.style.display = "flex";
        this.background.style.flexDirection = "column";
        this.background.style.alignItems = "center";
        this.background.style.justifyContent = "center";
        document.body.appendChild(this.background);

        this.title = document.createElement("h1");
        this.title.innerText = "White Maze";
        this.title.style.color = "white";
        this.title.style.fontSize = "200px";
        this.title.style.marginBottom = "20px";
        this.background.appendChild(this.title);

        this.playButton = document.createElement("button");
        this.playButton.innerText = "Play";
        this.playButton.style.padding = "40px 80px";
        this.playButton.style.fontSize = "96px";
        this.playButton.style.cursor = "pointer";
        this.playButton.addEventListener("click", () => this.startGame());
        this.background.appendChild(this.playButton);
    }

    private startGame() {
        this.gameStarted = true;
        this.background.style.display = "none";
    }
}
